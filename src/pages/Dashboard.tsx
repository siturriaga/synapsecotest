import { useCallback, useEffect, useMemo, useState } from 'react'
import { collection, doc, onSnapshot, orderBy, query } from 'firebase/firestore'
import type { User } from 'firebase/auth'
import { db } from '../firebase'
import { DynamicWelcome } from '../components/core/DynamicWelcome'
import { DashboardCards, type StatCard } from '../components/core/DashboardCards'
import { PrintButton } from '../components/core/PrintButton'
import {
  MasteryDistribution,
  buildMasterySummary,
  computeTrendDelta,
  type MasteryScope
} from '../components/dashboard/MasteryDistribution'
import { useRosterData } from '../hooks/useRosterData'
import { buildStudentInsight, type StudentInsight } from '../utils/studentInsights'
import { ProgressSparkline } from '../components/dashboard/ProgressSparkline'
import { ClearButton } from '../components/core/ClearButton'
import {
  clearAllUserData,
  clearAssignments,
  clearAssessmentSummaries,
  clearAssessments,
  clearDashboardMetrics,
  clearRosterData
} from '../utils/dashboardActions'

interface DashboardProps {
  user: User | null
  loading?: boolean
}

const PERIOD_CHOICES = ['1', '2', '3', '4', '5', '6', '7', '8'] as const

const SECTION_IDS = {
  stats: 'dashboard-overview',
  mastery: 'mastery-distribution',
  explorer: 'class-student-explorer',
  assessmentHistory: 'assessment-history',
  assignments: 'assignments-radar'
} as const

type AssignmentSummary = {
  id: string
  title: string
  dueDate?: string
  status: string
}

type AssessmentSnapshot = {
  id: string
  testName: string
  period?: number | null
  quarter?: string | null
  studentCount?: number | null
  averageScore?: number | null
  maxScore?: number | null
  minScore?: number | null
  updatedAt?: Date | null
}

function formatDelta(value: number | null) {
  if (value === null || Number.isNaN(value)) return undefined
  const rounded = Number(value.toFixed(1))
  if (!Number.isFinite(rounded)) return undefined
  const prefix = rounded > 0 ? '+' : ''
  return `${prefix}${rounded.toFixed(1)} pts`
}

function formatPercentage(value: number | null | undefined) {
  if (value === null || value === undefined || Number.isNaN(value)) return 'N/A'
  const rounded = Number(value.toFixed(1))
  if (Number.isInteger(rounded)) return `${Math.round(rounded)}%`
  return `${rounded.toFixed(1)}%`
}

function average(values: number[]) {
  if (!values.length) return null
  const total = values.reduce((sum, value) => sum + value, 0)
  return total / values.length
}

export default function DashboardPage({ user, loading }: DashboardProps) {
  const [rawStats, setRawStats] = useState<StatCard[]>([])
  const [assignments, setAssignments] = useState<AssignmentSummary[]>([])
  const [assessmentSummaries, setAssessmentSummaries] = useState<AssessmentSnapshot[]>([])
  const [selectedPeriod, setSelectedPeriod] = useState<string>('all')
  const [selectedHistoryPeriod, setSelectedHistoryPeriod] = useState<string>('all')
  const [selectedTest, setSelectedTest] = useState<string>('combined')
  const [selectedExplorerTest, setSelectedExplorerTest] = useState<string>('combined')
  const [selectedStudentId, setSelectedStudentId] = useState<string>('')

  const {
    records: rosterRecords,
    summaries: rosterSummaries,
    students: rosterStudents,
    insights: rosterInsights,
    groupInsights,
    pedagogy
  } = useRosterData()

  const baseSummaries = useMemo(
    () => (assessmentSummaries.length ? assessmentSummaries : rosterSummaries),
    [assessmentSummaries, rosterSummaries]
  )

  useEffect(() => {
    if (!selectedStudentId && rosterStudents.length) {
      setSelectedStudentId(rosterStudents[0].id)
    }
  }, [rosterStudents, selectedStudentId])

  useEffect(() => {
    if (selectedStudentId && rosterStudents.every((student) => student.id !== selectedStudentId)) {
      setSelectedStudentId(rosterStudents[0]?.id ?? '')
    }
  }, [rosterStudents, selectedStudentId])

  const classStudents = useMemo(() => {
    if (selectedPeriod === 'all') return rosterStudents
    return rosterStudents.filter((student) => String(student.period ?? '') === selectedPeriod)
  }, [rosterStudents, selectedPeriod])

  useEffect(() => {
    const available = classStudents.length ? classStudents : rosterStudents
    if (!available.length) {
      setSelectedStudentId('')
      return
    }
    if (selectedStudentId && available.every((student) => student.id !== selectedStudentId)) {
      setSelectedStudentId(available[0]?.id ?? '')
    }
  }, [classStudents, rosterStudents, selectedStudentId])

  const activePeriods = useMemo(() => {
    const set = new Set<string>()
    rosterRecords.forEach((record) => {
      if (record.period !== null && record.period !== undefined) {
        set.add(String(record.period))
      }
    })
    rosterStudents.forEach((student) => {
      if (student.period !== null && student.period !== undefined) {
        set.add(String(student.period))
      }
    })
    return set
  }, [rosterRecords, rosterStudents])

  const periodOptions = useMemo(() => {
    const combined = Array.from(new Set<string>([...PERIOD_CHOICES, ...Array.from(activePeriods)]))
    combined.sort((a, b) => Number(a) - Number(b))
    return combined.map((value) => ({ value, hasData: activePeriods.has(value) }))
  }, [activePeriods])

  useEffect(() => {
    if (selectedPeriod === 'all') return
    if (!periodOptions.some((option) => option.value === selectedPeriod)) {
      setSelectedPeriod(periodOptions[0]?.value ?? 'all')
    }
  }, [periodOptions, selectedPeriod])

  useEffect(() => {
    if (selectedHistoryPeriod === 'all') return
    if (!periodOptions.some((option) => option.value === selectedHistoryPeriod)) {
      setSelectedHistoryPeriod('all')
    }
  }, [periodOptions, selectedHistoryPeriod])

  const testOptions = useMemo(() => {
    const set = new Set<string>()
    baseSummaries.forEach((summary) => {
      if (summary.testName) set.add(summary.testName)
    })
    rosterRecords.forEach((record) => {
      if (record.testName) set.add(record.testName)
    })
    return ['combined', ...Array.from(set).sort((a, b) => a.localeCompare(b))]
  }, [baseSummaries, rosterRecords])

  useEffect(() => {
    if (!testOptions.includes(selectedTest)) {
      setSelectedTest('combined')
    }
  }, [selectedTest, testOptions])

  useEffect(() => {
    if (!testOptions.includes(selectedExplorerTest)) {
      setSelectedExplorerTest('combined')
    }
  }, [selectedExplorerTest, testOptions])

  const filteredRecords = useMemo(() => {
    if (selectedTest === 'combined') return rosterRecords
    return rosterRecords.filter((record) => record.testName === selectedTest)
  }, [rosterRecords, selectedTest])

  const filteredSummaries = useMemo(() => {
    if (selectedTest === 'combined') return baseSummaries
    return baseSummaries.filter((summary) => summary.testName === selectedTest)
  }, [baseSummaries, selectedTest])

  const sortedSummaries = useMemo(() => {
    return [...filteredSummaries].sort((a, b) => {
      const timeA = a.updatedAt ? a.updatedAt.getTime() : 0
      const timeB = b.updatedAt ? b.updatedAt.getTime() : 0
      return timeB - timeA
    })
  }, [filteredSummaries])

  const latestSummary = sortedSummaries[0] ?? null
  const previousSummary = sortedSummaries[1] ?? null

  const studentPeriodLookup = useMemo(() => {
    const map = new Map<string, string | null>()
    rosterStudents.forEach((student) => {
      const period = student.period != null ? String(student.period) : null
      if (student.id) map.set(student.id, period)
      if (student.displayName) map.set(student.displayName, period)
    })
    return map
  }, [rosterStudents])

  const latestScoresByStudent = useMemo(() => {
    const map = new Map<string, { score: number; period: string | null; testName: string | null }>()
    const sortedRecords = [...filteredRecords].sort((a, b) => {
      const timeA = a.createdAt ? a.createdAt.getTime() : 0
      const timeB = b.createdAt ? b.createdAt.getTime() : 0
      return timeB - timeA
    })
    sortedRecords.forEach((record) => {
      if (typeof record.score !== 'number') return
      const identifier = record.studentId ?? record.displayName ?? record.id
      if (!identifier) return
      if (map.has(identifier)) return
      let period: string | null = null
      if (record.period !== null && record.period !== undefined) {
        period = String(record.period)
      } else {
        period = studentPeriodLookup.get(record.studentId ?? record.displayName ?? '') ?? null
      }
      map.set(identifier, {
        score: record.score,
        period,
        testName: record.testName ?? null
      })
    })
    return map
  }, [filteredRecords, studentPeriodLookup])

  const allScores = useMemo(() => Array.from(latestScoresByStudent.values()).map((entry) => entry.score), [latestScoresByStudent])

  const classScores = useMemo(() => {
    if (selectedPeriod === 'all') return allScores
    return Array.from(latestScoresByStudent.values())
      .filter((entry) => entry.period === selectedPeriod)
      .map((entry) => entry.score)
  }, [allScores, latestScoresByStudent, selectedPeriod])

  const allMastery = useMemo(() => buildMasterySummary(allScores), [allScores])
  const classMastery = useMemo(() => buildMasterySummary(classScores), [classScores])

  const filteredClassRecords = useMemo(() => {
    if (selectedPeriod === 'all') return filteredRecords
    return filteredRecords.filter((record) => String(record.period ?? '') === selectedPeriod)
  }, [filteredRecords, selectedPeriod])

  const classMetrics = useMemo(() => {
    const assessments = Array.from(
      new Set(filteredClassRecords.map((record) => record.testName).filter((value): value is string => Boolean(value)))
    )
    if (!filteredClassRecords.length) {
      return {
        average: null,
        topRecord: null,
        bottomRecord: null,
        total: 0,
        assessments
      }
    }
    const scoredRecords = filteredClassRecords.filter((record) => typeof record.score === 'number') as Array<
      typeof filteredClassRecords[number] & { score: number }
    >
    if (!scoredRecords.length) {
      return {
        average: null,
        topRecord: null,
        bottomRecord: null,
        total: filteredClassRecords.length,
        assessments
      }
    }
    const scores = scoredRecords.map((record) => record.score)
    const avg = average(scores)
    const topRecord = scoredRecords.reduce<typeof scoredRecords[number] | null>((best, current) => {
      if (!best) return current
      return current.score > (best.score ?? -Infinity) ? current : best
    }, null)
    const bottomRecord = scoredRecords.reduce<typeof scoredRecords[number] | null>((lowest, current) => {
      if (!lowest) return current
      return current.score < (lowest.score ?? Infinity) ? current : lowest
    }, null)
    return {
      average: avg,
      topRecord,
      bottomRecord,
      total: filteredClassRecords.length,
      assessments
    }
  }, [filteredClassRecords])

  const selectedStudent = useMemo(() => {
    if (!rosterStudents.length) return null
    return rosterStudents.find((entry) => entry.id === selectedStudentId) ?? rosterStudents[0]
  }, [rosterStudents, selectedStudentId])

  const studentHistory = useMemo(() => {
    if (!selectedStudent) return []
    const matches = rosterRecords.filter(
      (record) =>
        record.studentId === selectedStudent.id ||
        (!record.studentId && record.displayName === selectedStudent.displayName)
    )
    if (selectedExplorerTest === 'combined') return matches
    return matches.filter((record) => record.testName === selectedExplorerTest)
  }, [rosterRecords, selectedStudent, selectedExplorerTest])

  const studentMetrics = useMemo(() => {
    if (!selectedStudent) return null
    const scored = studentHistory.filter((record) => typeof record.score === 'number') as Array<
      typeof studentHistory[number] & { score: number }
    >
    const avg = scored.length ? average(scored.map((item) => item.score)) : null
    const latest = studentHistory[0] ?? null
    const recent = studentHistory.slice(0, 3)
    return { average: avg, latest, recent }
  }, [studentHistory, selectedStudent])

  const studentScores = useMemo(() => {
    if (!selectedStudent) return []
    if (studentHistory.length) {
      return studentHistory.map((entry) => (typeof entry.score === 'number' ? entry.score : null))
    }
    return [selectedStudent.lastScore ?? null]
  }, [selectedStudent, studentHistory])

  const studentMastery = useMemo(() => buildMasterySummary(studentScores), [studentScores])
  const studentTrendDelta = useMemo(() => computeTrendDelta(studentHistory), [studentHistory])

  const studentInsight = useMemo<StudentInsight | null>(() => {
    if (!selectedStudent) return null
    return buildStudentInsight({
      student: selectedStudent,
      history: studentHistory,
      classAverage: classMetrics?.average ?? rosterInsights?.averageScore ?? null,
      trendDelta: studentTrendDelta,
      groupInsights,
      pedagogy: pedagogy ?? null
    })
  }, [
    selectedStudent,
    studentHistory,
    classMetrics?.average,
    rosterInsights?.averageScore,
    studentTrendDelta,
    groupInsights,
    pedagogy
  ])

  const studentTrendSeries = useMemo(
    () =>
      [...studentHistory]
        .reverse()
        .map((record, index) => ({
          label: record.testName ?? `Entry ${index + 1}`,
          value: typeof record.score === 'number' ? record.score : null
        })),
    [studentHistory]
  )

  const masteryScopes = useMemo<MasteryScope[]>(() => {
    const scopes: MasteryScope[] = []
    if (allMastery) {
      const label = selectedTest === 'combined' ? 'All classes · all tests' : `${selectedTest}`
      scopes.push({
        id: 'all',
        title: label,
        subtitle: `Latest data across ${allMastery.totalLearners} learners`,
        summary: allMastery
      })
    }
    if (classMastery) {
      const isAll = selectedPeriod === 'all'
      scopes.push({
        id: 'class',
        title: isAll ? 'Class overview' : `Period ${selectedPeriod}`,
        subtitle: isAll
          ? 'Combined view of every active class'
          : `Focused on learners rostered in period ${selectedPeriod}`,
        summary: classMastery
      })
    }
    if (selectedStudent && studentMastery) {
      scopes.push({
        id: 'student',
        title: selectedStudent.displayName,
        subtitle: 'Individual trajectory',
        summary: studentMastery,
        latestScore: typeof selectedStudent.lastScore === 'number' ? selectedStudent.lastScore : undefined,
        latestAssessment: selectedStudent.lastAssessment ?? undefined,
        trendDelta: studentTrendDelta ?? undefined
      })
    }
    return scopes
  }, [allMastery, classMastery, selectedPeriod, selectedStudent, selectedTest, studentMastery, studentTrendDelta])

  const trendDelta = useMemo(() => {
    if (!latestSummary || !previousSummary) return null
    if (latestSummary.averageScore == null || previousSummary.averageScore == null) return null
    return latestSummary.averageScore - previousSummary.averageScore
  }, [latestSummary, previousSummary])

  const learnerCount = useMemo(() => {
    if (latestSummary?.studentCount != null) return latestSummary.studentCount
    return allScores.length
  }, [allScores.length, latestSummary?.studentCount])

  const highestScore = useMemo(() => {
    if (latestSummary?.maxScore != null) return latestSummary.maxScore
    if (!allScores.length) return null
    return Math.max(...allScores)
  }, [allScores, latestSummary])

  const lowestScore = useMemo(() => {
    if (latestSummary?.minScore != null) return latestSummary.minScore
    if (!allScores.length) return null
    return Math.min(...allScores)
  }, [allScores, latestSummary])

  const averageScore = useMemo(() => {
    if (latestSummary?.averageScore != null) return latestSummary.averageScore
    return average(allScores)
  }, [allScores, latestSummary])

  const statCards = useMemo<StatCard[]>(() => {
    const cards: StatCard[] = []
    cards.push({
      id: 'average-score',
      label: selectedTest === 'combined' ? 'Latest average (all tests)' : `${selectedTest} average`,
      value: averageScore ?? 0,
      displayValue: formatPercentage(averageScore),
      delta: formatDelta(trendDelta)
    })
    cards.push({
      id: 'learner-count',
      label: 'Learners represented',
      value: learnerCount ?? 0,
      displayValue: learnerCount ? learnerCount.toLocaleString() : 'N/A',
      delta:
        latestSummary?.studentCount != null && previousSummary?.studentCount != null
          ? formatDelta(latestSummary.studentCount - previousSummary.studentCount)
          : undefined
    })
    cards.push({
      id: 'highest-score',
      label: 'Peak score',
      value: highestScore ?? 0,
      displayValue: formatPercentage(highestScore)
    })
    cards.push({
      id: 'lowest-score',
      label: 'Floor score',
      value: lowestScore ?? 0,
      displayValue: formatPercentage(lowestScore)
    })
    rawStats
      .filter((card) => !['average-score', 'learner-count', 'highest-score', 'lowest-score'].includes(card.id))
      .forEach((card) => cards.push(card))
    return cards
  }, [averageScore, highestScore, learnerCount, lowestScore, previousSummary?.studentCount, rawStats, selectedTest, trendDelta, latestSummary?.studentCount])

  const assessmentHistoryRows = useMemo(() => {
    if (selectedHistoryPeriod === 'all') return baseSummaries
    return baseSummaries.filter((snapshot) => String(snapshot.period ?? '') === selectedHistoryPeriod)
  }, [baseSummaries, selectedHistoryPeriod])

  const historySeriesAll = useMemo(
    () =>
      [...baseSummaries]
        .filter((snapshot) => snapshot.averageScore != null)
        .sort((a, b) => {
          const timeA = a.updatedAt ? a.updatedAt.getTime() : 0
          const timeB = b.updatedAt ? b.updatedAt.getTime() : 0
          return timeA - timeB
        })
        .map((snapshot, index) => ({
          label: snapshot.testName || `Assessment ${index + 1}`,
          value: snapshot.averageScore ?? null
        })),
    [baseSummaries]
  )

  const historySeriesPeriod = useMemo(
    () =>
      [...assessmentHistoryRows]
        .filter((snapshot) => snapshot.averageScore != null)
        .sort((a, b) => {
          const timeA = a.updatedAt ? a.updatedAt.getTime() : 0
          const timeB = b.updatedAt ? b.updatedAt.getTime() : 0
          return timeA - timeB
        })
        .map((snapshot, index) => ({
          label: snapshot.testName || `Assessment ${index + 1}`,
          value: snapshot.averageScore ?? null
        })),
    [assessmentHistoryRows]
  )

  const allClassesAverageAcrossTests = useMemo(() => {
    const values = historySeriesAll.map((entry) => entry.value).filter((value): value is number => value != null)
    return average(values)
  }, [historySeriesAll])

  useEffect(() => {
    if (!user) {
      setRawStats([])
      setAssignments([])
      setAssessmentSummaries([])
      return
    }

    const statsRef = doc(db, `users/${user.uid}/dashboard_stats/metrics`)
    const unsubStats = onSnapshot(statsRef, (snap) => {
      const data = snap.data() || {}
      const cards: StatCard[] = []
      if (typeof data.totalEnrollment === 'number') {
        cards.push({ id: 'enrollment', label: 'Learners scored', value: data.totalEnrollment })
      }
      if (typeof data.aiGroupCount === 'number' || typeof data.rosterGroupCount === 'number' || typeof data.groupCount === 'number') {
        const totalGroups =
          typeof data.aiGroupCount === 'number'
            ? data.aiGroupCount
            : typeof data.rosterGroupCount === 'number'
            ? data.rosterGroupCount
            : data.groupCount
        cards.push({
          id: 'groups',
          label: 'Active groups',
          value: totalGroups ?? 0,
          delta: formatDelta(
            typeof data.aiGroupDelta === 'number'
              ? data.aiGroupDelta
              : typeof data.rosterGroupDelta === 'number'
              ? data.rosterGroupDelta
              : typeof data.groupDelta === 'number'
              ? data.groupDelta
              : null
          )
        })
      }
      if (typeof data.onTrack === 'number') {
        cards.push({
          id: 'on-track',
          label: 'On track',
          value: data.onTrack ?? 0,
          delta: formatDelta(typeof data.onTrackDelta === 'number' ? data.onTrackDelta : null)
        })
      }
      if (typeof data.atRisk === 'number') {
        cards.push({
          id: 'at-risk',
          label: 'Needs support',
          value: data.atRisk ?? 0,
          delta: formatDelta(typeof data.atRiskDelta === 'number' ? data.atRiskDelta : null)
        })
      }
      setRawStats(cards)
    })

    const assignmentQuery = query(collection(db, `users/${user.uid}/assignments`), orderBy('dueDate', 'asc'))
    const unsubAssignments = onSnapshot(assignmentQuery, (snap) => {
      const rows: AssignmentSummary[] = []
      snap.forEach((docSnap) => {
        const data = docSnap.data() as any
        rows.push({
          id: docSnap.id,
          title: data.title ?? 'N/A',
          dueDate: data.dueDate,
          status: data.status ?? 'draft'
        })
      })
      setAssignments(rows.slice(0, 6))
    })

    const summaryQuery = query(collection(db, `users/${user.uid}/assessments_summary`), orderBy('updatedAt', 'desc'))
    const unsubSummary = onSnapshot(summaryQuery, (snap) => {
      const rows: AssessmentSnapshot[] = []
      snap.forEach((docSnap) => {
        const data = docSnap.data() as any
        rows.push({
          id: docSnap.id,
          testName: data.testName ?? 'N/A',
          period: data.period,
          quarter: data.quarter,
          studentCount: data.studentCount,
          averageScore: data.averageScore,
          maxScore: data.maxScore,
          minScore: data.minScore,
          updatedAt: data.updatedAt?.toDate?.() ?? null
        })
      })
      setAssessmentSummaries(rows)
    })

    return () => {
      unsubStats()
      unsubAssignments()
      unsubSummary()
    }
  }, [user])

  const handleClearStats = useCallback(async () => {
    if (!user) return
    await clearDashboardMetrics(user.uid)
  }, [user])

  const handleClearMastery = useCallback(async () => {
    if (!user) return
    await Promise.all([clearAssessments(user.uid), clearAssessmentSummaries(user.uid)])
  }, [user])

  const handleClearExplorer = useCallback(async () => {
    if (!user) return
    await clearRosterData(user.uid)
  }, [user])

  const handleClearHistory = useCallback(async () => {
    if (!user) return
    await clearAssessmentSummaries(user.uid)
  }, [user])

  const handleClearAssignments = useCallback(async () => {
    if (!user) return
    await clearAssignments(user.uid)
  }, [user])

  const handleMasterClear = useCallback(async () => {
    if (!user) return
    await clearAllUserData(user.uid)
  }, [user])

  if (loading) {
    return <div className="glass-card">Loading your workspace…</div>
  }

  if (!user) {
    return (
      <div className="glass-card fade-in">
        <h2 style={{ fontSize: 28, margin: '0 0 12px', fontWeight: 800 }}>Authenticate to launch Synapse</h2>
        <p style={{ color: 'var(--text-muted)', maxWidth: 520 }}>
          Sign in with your Google Workspace educator account to unlock roster uploads, Gemini-powered grouping, and live mastery analytics.
        </p>
      </div>
    )
  }

  const testLabel = (value: string) => (value === 'combined' ? 'All tests · combined' : value)
  const availableStudents = classStudents.length ? classStudents : rosterStudents

  return (
    <div className="fade-in" style={{ display: 'grid', gap: 28 }}>
      <DynamicWelcome />
      <section style={{ display: 'grid', gap: 28 }}>
        <div className="glass-card" style={{ display: 'grid', gap: 18, padding: 24 }}>
          <header style={{ display: 'grid', gap: 6 }}>
            <h2 style={{ margin: 0, fontSize: 24, fontWeight: 700 }}>Dial in the view you need</h2>
            <p style={{ margin: 0, color: 'var(--text-muted)', maxWidth: 600 }}>
              Choose an assessment, class period, and learner spotlight once — every section below responds in sync so you can focus on coaching instead of chasing filters.
            </p>
          </header>
          <div
            style={{
              display: 'grid',
              gap: 16,
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))'
            }}
          >
            <div className="glass-subcard" style={{ borderRadius: 16, padding: 16, border: '1px solid rgba(148,163,184,0.25)', background: 'rgba(15,23,42,0.55)', display: 'grid', gap: 8 }}>
              <label htmlFor="dashboard-test-filter" style={{ fontWeight: 600, fontSize: 13 }}>Assessment lens</label>
              <select
                id="dashboard-test-filter"
                value={selectedTest}
                onChange={(event) => setSelectedTest(event.target.value)}
                className="table-input"
              >
                {testOptions.map((option) => (
                  <option key={option} value={option}>
                    {testLabel(option)}
                  </option>
                ))}
              </select>
            </div>
            <div className="glass-subcard" style={{ borderRadius: 16, padding: 16, border: '1px solid rgba(148,163,184,0.25)', background: 'rgba(15,23,42,0.55)', display: 'grid', gap: 8 }}>
              <label htmlFor="dashboard-period-filter" style={{ fontWeight: 600, fontSize: 13 }}>Class period</label>
              <select
                id="dashboard-period-filter"
                value={selectedPeriod}
                onChange={(event) => setSelectedPeriod(event.target.value)}
                className="table-input"
              >
                <option value="all">All classes</option>
                {periodOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {`Period ${option.value}${option.hasData ? '' : ' · no data yet'}`}
                  </option>
                ))}
              </select>
            </div>
            <div className="glass-subcard" style={{ borderRadius: 16, padding: 16, border: '1px solid rgba(148,163,184,0.25)', background: 'rgba(15,23,42,0.55)', display: 'grid', gap: 8 }}>
              <label htmlFor="dashboard-explorer-test" style={{ fontWeight: 600, fontSize: 13 }}>Learner evidence</label>
              <select
                id="dashboard-explorer-test"
                value={selectedExplorerTest}
                onChange={(event) => setSelectedExplorerTest(event.target.value)}
                className="table-input"
              >
                {testOptions.map((option) => (
                  <option key={option} value={option}>
                    {testLabel(option)}
                  </option>
                ))}
              </select>
            </div>
            <div className="glass-subcard" style={{ borderRadius: 16, padding: 16, border: '1px solid rgba(99,102,241,0.32)', background: 'linear-gradient(135deg, rgba(99,102,241,0.24), rgba(14,165,233,0.14))', display: 'grid', gap: 8 }}>
              <label htmlFor="dashboard-student-select" style={{ fontWeight: 600, fontSize: 13 }}>Spotlight learner</label>
              <select
                id="dashboard-student-select"
                value={selectedStudentId}
                onChange={(event) => setSelectedStudentId(event.target.value)}
                className="table-input"
              >
                {availableStudents.map((student) => (
                  <option key={student.id} value={student.id}>
                    {student.displayName}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <section id={SECTION_IDS.stats} className="glass-card" style={{ display: 'grid', gap: 24 }}>
          <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
            <div style={{ maxWidth: 520, display: 'grid', gap: 6 }}>
              <h2 style={{ margin: 0, fontSize: 26, fontWeight: 800 }}>Performance snapshot</h2>
              <p style={{ margin: 0, color: 'var(--text-muted)' }}>
                Key averages, highs, and lows update instantly as you toggle filters. Use the clear button to reset metrics or print the full panel for PLC notes.
              </p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
              <ClearButton label="Clear metrics" onClear={handleClearStats} />
              <PrintButton targetId={SECTION_IDS.stats} label="Print overview" />
            </div>
          </header>
          <div
            style={{
              display: 'grid',
              gap: 20,
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))'
            }}
          >
            <div className="glass-subcard" style={{ padding: 18, borderRadius: 18, border: '1px solid rgba(148,163,184,0.35)', background: 'rgba(15,23,42,0.6)' }}>
              <DashboardCards cards={statCards} />
            </div>
            <MasteryDistribution
              scopes={masteryScopes}
              sectionId={SECTION_IDS.mastery}
              variant="embedded"
              headerExtras={
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                  <span className="tag" style={{ background: 'rgba(148,163,184,0.15)', border: '1px solid rgba(148,163,184,0.35)' }}>
                    {testLabel(selectedTest)}
                  </span>
                  <ClearButton label="Clear mastery" onClear={handleClearMastery} />
                </div>
              }
              printLabel="Print mastery cards"
            />
          </div>
        </section>

        <section id={SECTION_IDS.explorer} className="glass-card" style={{ display: 'grid', gap: 24 }}>
          <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
            <div style={{ maxWidth: 560, display: 'grid', gap: 6 }}>
              <h2 style={{ margin: 0, fontSize: 26, fontWeight: 800 }}>Classroom coaching studio</h2>
              <p style={{ margin: 0, color: 'var(--text-muted)' }}>
                Zoom into the filtered class to see standout scores, growth trends, and a friendly AI coaching note for your spotlight learner.
              </p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
              <ClearButton label="Clear explorer" onClear={handleClearExplorer} />
              <PrintButton targetId={SECTION_IDS.explorer} label="Print coaching studio" />
            </div>
          </header>
          <div
            style={{
              display: 'grid',
              gap: 20,
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))'
            }}
          >
            <div className="glass-subcard" style={{ padding: 22, borderRadius: 20, border: '1px solid rgba(148,163,184,0.32)', background: 'rgba(15,23,42,0.62)', display: 'grid', gap: 14 }}>
              <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
                <strong style={{ fontSize: 18 }}>Class pulse</strong>
                <span className="tag" style={{ background: 'rgba(148,163,184,0.2)', border: '1px solid rgba(148,163,184,0.32)' }}>
                  {selectedPeriod === 'all' ? 'All classes' : `Period ${selectedPeriod}`}
                </span>
              </header>
              <div style={{ display: 'flex', gap: 18, flexWrap: 'wrap' }}>
                <div>
                  <div style={{ fontSize: 30, fontWeight: 700 }}>{formatPercentage(classMetrics.average)}</div>
                  <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>Average proficiency</div>
                </div>
                <div>
                  <div style={{ fontSize: 22, fontWeight: 600 }}>{classMetrics.total}</div>
                  <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>Assessments scored</div>
                </div>
              </div>
              <div style={{ display: 'grid', gap: 8, color: 'var(--text-muted)', fontSize: 13 }}>
                <span>
                  Bright spot:{' '}
                  {classMetrics.topRecord
                    ? `${classMetrics.topRecord.displayName} · ${formatPercentage(classMetrics.topRecord.score ?? null)}`
                    : 'N/A'}
                </span>
                <span>
                  Next support:{' '}
                  {classMetrics.bottomRecord
                    ? `${classMetrics.bottomRecord.displayName} · ${formatPercentage(classMetrics.bottomRecord.score ?? null)}`
                    : 'N/A'}
                </span>
              </div>
              <div className="glass-subcard" style={{ padding: 14, borderRadius: 16, border: '1px solid rgba(148,163,184,0.28)', background: 'rgba(15,23,42,0.5)', display: 'grid', gap: 8 }}>
                <strong style={{ fontSize: 13, color: 'var(--text-muted)' }}>Growth across tests</strong>
                <ProgressSparkline data={historySeriesPeriod} stroke="rgba(129,140,248,0.9)" fill="rgba(129,140,248,0.22)" />
              </div>
            </div>

            {selectedStudent && studentMetrics && (
              <div className="glass-subcard" style={{ padding: 22, borderRadius: 20, border: '1px solid rgba(99,102,241,0.32)', background: 'linear-gradient(135deg, rgba(99,102,241,0.28), rgba(14,165,233,0.16))', display: 'grid', gap: 16 }}>
                <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                  <div>
                    <strong style={{ fontSize: 18 }}>{selectedStudent.displayName}</strong>
                    <p style={{ margin: '4px 0 0', color: 'var(--text-muted)', fontSize: 13 }}>Focused on {testLabel(selectedExplorerTest)}</p>
                  </div>
                  {studentTrendDelta != null && (
                    <span className="tag" style={{ background: 'rgba(15,23,42,0.45)', border: '1px solid rgba(255,255,255,0.2)' }}>
                      {formatDelta(studentTrendDelta) ?? '—'} trend
                    </span>
                  )}
                </header>
                <div style={{ display: 'flex', gap: 18, flexWrap: 'wrap' }}>
                  <div>
                    <div style={{ fontSize: 28, fontWeight: 700 }}>{formatPercentage(studentMetrics.average)}</div>
                    <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>Average score</div>
                  </div>
                  {studentMetrics.latest && (
                    <div>
                      <div style={{ fontSize: 22, fontWeight: 600 }}>{formatPercentage(studentMetrics.latest.score ?? null)}</div>
                      <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>{studentMetrics.latest.testName ?? 'Most recent evidence'}</div>
                    </div>
                  )}
                </div>
                <ProgressSparkline data={studentTrendSeries} stroke="rgba(244,114,182,0.9)" fill="rgba(244,114,182,0.22)" />
                {studentMetrics.recent.length > 0 && (
                  <div style={{ display: 'grid', gap: 6 }}>
                    <strong style={{ fontSize: 13 }}>Recent checkpoints</strong>
                    <ul style={{ margin: '0 0 0 16px', padding: 0, display: 'grid', gap: 4, color: 'var(--text-muted)' }}>
                      {studentMetrics.recent.map((entry, index) => (
                        <li key={index}>
                          {entry.testName ?? 'Assessment'} · {formatPercentage(entry.score ?? null)}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {studentInsight && (
                  <div className="glass-subcard" style={{ padding: 16, borderRadius: 16, border: '1px solid rgba(255,255,255,0.18)', background: 'rgba(15,23,42,0.55)', display: 'grid', gap: 10 }}>
                    <strong style={{ fontSize: 15 }}>Friendly coaching tip</strong>
                    <p style={{ margin: 0, color: 'rgba(226,232,240,0.92)', lineHeight: 1.6 }}>{studentInsight.headline}</p>
                    {studentInsight.highlights.length > 0 && (
                      <div style={{ display: 'grid', gap: 6 }}>
                        <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>What we just noticed</span>
                        <ul style={{ margin: '0 0 0 16px', padding: 0, display: 'grid', gap: 4, color: 'var(--text-muted)', listStyle: 'disc' }}>
                          {studentInsight.highlights.map((highlight, index) => (
                            <li key={index}>{highlight}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {studentInsight.recommendations.length > 0 && (
                      <div style={{ display: 'grid', gap: 6 }}>
                        <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Coach next</span>
                        <ul style={{ margin: '0 0 0 16px', padding: 0, display: 'grid', gap: 4, color: 'var(--text-muted)', listStyle: 'disc' }}>
                          {studentInsight.recommendations.map((recommendation, index) => (
                            <li key={index}>{recommendation}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </section>

        <section id={SECTION_IDS.assessmentHistory} className="glass-card" style={{ display: 'grid', gap: 24 }}>
          <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
            <div style={{ maxWidth: 520, display: 'grid', gap: 6 }}>
              <h2 style={{ margin: 0, fontSize: 26, fontWeight: 800 }}>Assessment timeline</h2>
              <p style={{ margin: 0, color: 'var(--text-muted)' }}>
                Review how each test landed across classes. Filter by period to zoom in, or keep the combined lens to monitor full grade-level momentum.
              </p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
              <label htmlFor="assessment-period-filter" style={{ fontSize: 13, color: 'var(--text-muted)' }}>
                Period focus
              </label>
              <select
                id="assessment-period-filter"
                value={selectedHistoryPeriod}
                onChange={(event) => setSelectedHistoryPeriod(event.target.value)}
                className="table-input"
                style={{ minWidth: 160 }}
              >
                <option value="all">All classes</option>
                {periodOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {`Period ${option.value}`}
                  </option>
                ))}
              </select>
              <ClearButton label="Clear history" onClear={handleClearHistory} />
              <PrintButton targetId={SECTION_IDS.assessmentHistory} label="Print timeline" />
            </div>
          </header>
          <div
            style={{
              display: 'grid',
              gap: 20,
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))'
            }}
          >
            <div className="glass-subcard" style={{ padding: 18, borderRadius: 18, border: '1px solid rgba(148,163,184,0.3)', background: 'rgba(15,23,42,0.55)', display: 'grid', gap: 6 }}>
              <span style={{ fontSize: 12, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
                All classes average across tests
              </span>
              <strong style={{ fontSize: 30 }}>{formatPercentage(allClassesAverageAcrossTests)}</strong>
            </div>
            <div className="glass-subcard" style={{ padding: 18, borderRadius: 18, border: '1px solid rgba(148,163,184,0.3)', background: 'rgba(15,23,42,0.55)' }}>
              <strong style={{ fontSize: 14, color: 'var(--text-muted)' }}>Combined trend</strong>
              <ProgressSparkline data={historySeriesAll} stroke="rgba(45,212,191,0.9)" fill="rgba(45,212,191,0.22)" />
            </div>
            <div className="glass-subcard" style={{ padding: 18, borderRadius: 18, border: '1px solid rgba(148,163,184,0.3)', background: 'rgba(15,23,42,0.55)' }}>
              <strong style={{ fontSize: 14, color: 'var(--text-muted)' }}>
                {selectedHistoryPeriod === 'all' ? 'Period comparison' : `Period ${selectedHistoryPeriod} trend`}
              </strong>
              <ProgressSparkline data={historySeriesPeriod} stroke="rgba(129,140,248,0.9)" fill="rgba(129,140,248,0.25)" />
            </div>
          </div>
          <div className="glass-subcard" style={{ padding: 0, borderRadius: 18, border: '1px solid rgba(148,163,184,0.25)', overflow: 'hidden' }}>
            <table className="table" style={{ margin: 0 }}>
              <thead>
                <tr>
                  <th>Assessment</th>
                  <th>Period</th>
                  <th>Avg</th>
                  <th>High</th>
                  <th>Low</th>
                  <th>Updated</th>
                </tr>
              </thead>
              <tbody>
                {assessmentHistoryRows.map((snapshot) => (
                  <tr key={snapshot.id}>
                    <td>{snapshot.testName}</td>
                    <td>{snapshot.period ?? 'All'}</td>
                    <td>{formatPercentage(snapshot.averageScore ?? null)}</td>
                    <td>{formatPercentage(snapshot.maxScore ?? null)}</td>
                    <td>{formatPercentage(snapshot.minScore ?? null)}</td>
                    <td>{snapshot.updatedAt ? snapshot.updatedAt.toLocaleString() : 'N/A'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section id={SECTION_IDS.assignments} className="glass-card" style={{ display: 'grid', gap: 24 }}>
          <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
            <div style={{ maxWidth: 520, display: 'grid', gap: 6 }}>
              <h2 style={{ margin: 0, fontSize: 26, fontWeight: 800 }}>Assignment planner</h2>
              <p style={{ margin: 0, color: 'var(--text-muted)' }}>
                Capture reteach plans, celebrations, and extensions tied to your latest mastery data. Print a snapshot before class or PLC time.
              </p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
              <ClearButton label="Clear assignments" onClear={handleClearAssignments} />
              <PrintButton targetId={SECTION_IDS.assignments} label="Print assignment planner" />
            </div>
          </header>
          {assignments.length === 0 ? (
            <div className="empty-state" style={{ marginTop: 4 }}>
              Create differentiated assignments from any standard to monitor mastery progress here.
            </div>
          ) : (
            <div className="glass-subcard" style={{ padding: 0, borderRadius: 18, border: '1px solid rgba(148,163,184,0.25)', overflow: 'hidden' }}>
              <table className="table" style={{ margin: 0 }}>
                <thead>
                  <tr>
                    <th>Assignment</th>
                    <th>Due date</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {assignments.map((assignment) => (
                    <tr key={assignment.id}>
                      <td>{assignment.title}</td>
                      <td>{assignment.dueDate ? new Date(assignment.dueDate).toLocaleDateString() : 'No due date'}</td>
                      <td style={{ textTransform: 'capitalize' }}>{assignment.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </section>
      <div style={{ display: 'grid', justifyItems: 'center', gap: 12 }}>
        <ClearButton label="Master clear workspace" onClear={handleMasterClear} tone="danger" />
        <p style={{ fontSize: 12, color: 'var(--text-muted)', textAlign: 'center', maxWidth: 360 }}>
          Master clear removes dashboard metrics, assessments, students, assignments, and cached insights for this account. Use with care.
        </p>
      </div>
    </div>
  )
}
