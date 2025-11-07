import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link } from 'wouter'
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
import { buildLatestScoresByStudent, buildStudentPeriodLookup } from '../utils/rosterAnalytics'
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
  const [selectedTest, setSelectedTest] = useState<string>('combined')
  const [selectedExplorerTest, setSelectedExplorerTest] = useState<string>('combined')
  const [selectedStudentId, setSelectedStudentId] = useState<string>('')
  const [workspaceMode, setWorkspaceMode] = useState<'full' | 'focus'>('full')
  const [theme, setTheme] = useState<'pulse' | 'calm' | 'contrast'>('pulse')

  useEffect(() => {
    if (typeof document === 'undefined') return
    const { body } = document
    const previousTheme = body.dataset.theme
    const previousTexture = body.dataset.texture
    body.dataset.theme = theme
    body.dataset.texture = theme === 'pulse' ? 'orbs' : theme === 'calm' ? 'aurora' : 'grid'
    return () => {
      body.dataset.theme = previousTheme
      if (previousTexture) {
        body.dataset.texture = previousTexture
      } else {
        delete body.dataset.texture
      }
    }
  }, [theme])

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

  const studentPeriodLookup = useMemo(() => buildStudentPeriodLookup(rosterStudents), [rosterStudents])

  const latestScoresByStudent = useMemo(
    () => buildLatestScoresByStudent(filteredRecords, studentPeriodLookup, rosterStudents),
    [filteredRecords, rosterStudents, studentPeriodLookup]
  )

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
    if (classMastery && (selectedPeriod !== 'all' || !allMastery)) {
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

  const summariesForView = useMemo(() => {
    if (selectedPeriod === 'all') return sortedSummaries
    return sortedSummaries.filter((snapshot) => String(snapshot.period ?? '') === selectedPeriod)
  }, [selectedPeriod, sortedSummaries])

  const timelineSeries = useMemo(
    () =>
      [...summariesForView]
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
    [summariesForView]
  )

  const latestSnapshotRows = useMemo(() => summariesForView.slice(0, 4), [summariesForView])

  const timelineAverage = useMemo(() => {
    const values = timelineSeries.map((entry) => entry.value).filter((value): value is number => value != null)
    return average(values)
  }, [timelineSeries])

  const latestSnapshotUpdatedAt = useMemo(() => summariesForView[0]?.updatedAt ?? null, [summariesForView])

  const upcomingAssignment = useMemo(() => {
    const dated = assignments.filter((assignment) => assignment.dueDate)
    if (!dated.length) return null
    return dated.reduce<AssignmentSummary | null>((soonest, current) => {
      if (!soonest) return current
      const soonestDate = new Date(soonest.dueDate ?? '').getTime()
      const currentDate = new Date(current.dueDate ?? '').getTime()
      if (!Number.isFinite(soonestDate) || currentDate < soonestDate) return current
      return soonest
    }, null)
  }, [assignments])

  const spotlightHighlights = useMemo(() => {
    const highlights: Array<{ id: string; title: string; description: string; icon: string; tone: 'positive' | 'neutral' | 'alert' }> = []
    if (trendDelta != null) {
      highlights.push({
        id: 'trend-delta',
        title: trendDelta >= 0 ? 'Class momentum rising' : 'Class momentum dipping',
        description: `${formatDelta(trendDelta) ?? '0'} week over week in average score`,
        icon: trendDelta >= 0 ? '📈' : '🛠️',
        tone: trendDelta >= 0 ? 'positive' : 'alert'
      })
    }
    if (classMetrics?.topRecord) {
      highlights.push({
        id: 'top-record',
        title: classMetrics.topRecord.displayName ?? 'Standout learner',
        description: `${formatPercentage(classMetrics.topRecord.score ?? null)} on ${classMetrics.topRecord.testName ?? 'latest checkpoint'}`,
        icon: '🌟',
        tone: 'neutral'
      })
    }
    if (upcomingAssignment) {
      highlights.push({
        id: 'assignment',
        title: 'Next assignment ready',
        description: `${upcomingAssignment.title} · due ${new Date(upcomingAssignment.dueDate ?? '').toLocaleDateString()}`,
        icon: '🗓️',
        tone: 'neutral'
      })
    } else if (studentInsight) {
      highlights.push({
        id: 'ai-spotlight',
        title: 'AI spotlight',
        description: studentInsight.headline,
        icon: '💡',
        tone: 'neutral'
      })
    }
    return highlights.slice(0, 3)
  }, [classMetrics?.topRecord, studentInsight, trendDelta, upcomingAssignment])

  const focusRailCards = useMemo(
    () => {
      const cards: Array<{ id: string; title: string; body: string; footer?: string; accent: string; icon: string }> = []
      if (studentInsight) {
        cards.push({
          id: 'insight',
          title: 'Friendly coaching tip',
          body: studentInsight.headline,
          footer: studentInsight.recommendations[0] ?? undefined,
          accent: 'var(--focus-rail-insight)',
          icon: '🤖'
        })
      }
      if (classMetrics?.average != null) {
        cards.push({
          id: 'class-average',
          title: 'Class average',
          body: `${formatPercentage(classMetrics.average)} across ${classMetrics.total ?? 0} checkpoints`,
          footer:
            classMetrics.bottomRecord && classMetrics.bottomRecord.displayName
              ? `Watch ${classMetrics.bottomRecord.displayName}`
              : undefined,
          accent: 'var(--focus-rail-class)',
          icon: '🎯'
        })
      }
      if (upcomingAssignment) {
        cards.push({
          id: 'assignment-focus',
          title: 'Upcoming assignment',
          body: upcomingAssignment.title,
          footer: upcomingAssignment.dueDate
            ? `Due ${new Date(upcomingAssignment.dueDate).toLocaleDateString()}`
            : undefined,
          accent: 'var(--focus-rail-assignment)',
          icon: '📝'
        })
      }
      return cards
    },
    [classMetrics?.average, classMetrics?.bottomRecord, classMetrics?.total, studentInsight, upcomingAssignment]
  )

  useEffect(() => {
    if (!user) {
      setRawStats([])
      setAssignments([])
      setAssessmentSummaries([])
      return
    }

    const database = db
    if (!database) {
      console.warn('Firestore unavailable. Dashboard data will not load until configuration is restored.')
      setRawStats([])
      setAssignments([])
      setAssessmentSummaries([])
      return
    }

    const statsRef = doc(database, `users/${user.uid}/dashboard_stats/metrics`)
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

    const assignmentQuery = query(collection(database, `users/${user.uid}/assignments`), orderBy('dueDate', 'asc'))
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

    const summaryQuery = query(collection(database, `users/${user.uid}/assessments_summary`), orderBy('updatedAt', 'desc'))
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
  }, [user, db])

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
    <div className="fade-in dashboard-shell" data-mode={workspaceMode}>
      <div className="dashboard-shell__grid">
        <div className="dashboard-shell__aside">
          <DynamicWelcome />
        </div>
        <main className="dashboard-shell__main">
          <div className="dashboard-toolbar">
            <div className="dashboard-toolbar__group">
              <button
                type="button"
                className="toolbar-toggle"
                onClick={() => setWorkspaceMode((mode) => (mode === 'full' ? 'focus' : 'full'))}
              >
                <span className="toolbar-toggle__icon" aria-hidden>
                  {workspaceMode === 'full' ? '🗂️' : '🧠'}
                </span>
                {workspaceMode === 'full' ? 'Focus workspace' : 'Return to full view'}
              </button>
              <span className="toolbar-hint">Slide secondary panels into the rail for heads-down planning.</span>
            </div>
            <div className="dashboard-toolbar__group" role="group" aria-label="Theme switcher">
              <span className="toolbar-label">Experience</span>
              {(
                [
                  { id: 'pulse', label: 'Pulse', icon: '✨' },
                  { id: 'calm', label: 'Calm', icon: '🌙' },
                  { id: 'contrast', label: 'Contrast', icon: '⚡' }
                ] as const
              ).map((option) => (
                <button
                  key={option.id}
                  type="button"
                  className={`toolbar-chip${theme === option.id ? ' is-active' : ''}`}
                  onClick={() => setTheme(option.id)}
                >
                  <span aria-hidden>{option.icon}</span>
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {spotlightHighlights.length > 0 && (
            <div className="spotlight-strip" aria-live="polite">
              {spotlightHighlights.map((highlight) => (
                <article key={highlight.id} className={`spotlight-card spotlight-card--${highlight.tone}`}>
                  <span className="spotlight-card__icon" aria-hidden>
                    {highlight.icon}
                  </span>
                  <div className="spotlight-card__body">
                    <strong>{highlight.title}</strong>
                    <span>{highlight.description}</span>
                  </div>
                </article>
              ))}
            </div>
          )}

          <section id={SECTION_IDS.stats} style={{ display: 'grid', gap: 16 }}>
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
              <div>
                <h3 style={{ margin: '4px 0 6px', fontSize: 24, fontWeight: 700 }}>Daily pulse</h3>
                <p style={{ margin: 0, color: 'var(--text-muted)', maxWidth: 460 }}>
                  Toggle between assessments to focus your planning. Combined mode blends every scored learner into a unified snapshot.
                </p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                <label htmlFor="dashboard-test-filter" style={{ fontSize: 13, color: 'var(--text-muted)' }}>
                  Showing
                </label>
                <select
                  id="dashboard-test-filter"
                  value={selectedTest}
                  onChange={(event) => setSelectedTest(event.target.value)}
                  className="table-input"
                  style={{ minWidth: 180 }}
                >
                  {testOptions.map((option) => (
                    <option key={option} value={option}>
                      {testLabel(option)}
                    </option>
                  ))}
                </select>
                <ClearButton label="Clear metrics" onClear={handleClearStats} />
                <PrintButton targetId={SECTION_IDS.stats} label="Print key metrics" />
              </div>
            </header>
            <DashboardCards cards={statCards} />
          </section>

          <MasteryDistribution
            scopes={masteryScopes}
            sectionId={SECTION_IDS.mastery}
            headerExtras={
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                <span className="tag" style={{ background: 'rgba(148,163,184,0.15)', border: '1px solid rgba(148,163,184,0.35)' }}>
                  {testLabel(selectedTest)}
                </span>
                <ClearButton label="Clear mastery" onClear={handleClearMastery} />
              </div>
            }
          />

          <section
            id={SECTION_IDS.explorer}
            className="glass-card"
            style={{ display: 'grid', gap: 28 }}
            data-collapsible="true"
          >
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
              <div>
                <h3 style={{ margin: '4px 0 6px', fontSize: 24, fontWeight: 700 }}>Dial in the view you need</h3>
                <p style={{ margin: 0, color: 'var(--text-muted)', maxWidth: 560 }}>
                  Fine-tune classes, assessments, and spotlights to keep the right data at your fingertips without clutter.
                </p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                <ClearButton label="Clear explorer" onClear={handleClearExplorer} />
                <PrintButton targetId={SECTION_IDS.explorer} label="Print class and student explorer" />
              </div>
            </header>
            <div style={{ display: 'grid', gap: 20 }}>
              <div style={{ display: 'grid', gap: 18, gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))' }}>
                <div
                  className="glass-subcard"
                  style={{ padding: 20, borderRadius: 18, border: '1px solid rgba(148,163,184,0.35)', background: 'rgba(15,23,42,0.6)', display: 'grid', gap: 12 }}
                >
                  <div style={{ display: 'grid', gap: 4 }}>
                    <label htmlFor="dashboard-period-filter" style={{ fontWeight: 600 }}>
                      Class focus
                    </label>
                    <span style={{ color: 'var(--text-muted)', fontSize: 12 }}>
                      Switch between a single period or every class — organized comparisons stay ready for printouts.
                    </span>
                  </div>
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
                <div
                  className="glass-subcard"
                  style={{ padding: 20, borderRadius: 18, border: '1px solid rgba(148,163,184,0.35)', background: 'rgba(15,23,42,0.6)', display: 'grid', gap: 12 }}
                >
                  <div style={{ display: 'grid', gap: 4 }}>
                    <label htmlFor="dashboard-explorer-test" style={{ fontWeight: 600 }}>
                      Assessment focus
                    </label>
                    <span style={{ color: 'var(--text-muted)', fontSize: 12 }}>
                      Compare a specific checkpoint or keep combined mode to view every score in one streamlined lens.
                    </span>
                  </div>
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
                <div
                  className="glass-subcard"
                  style={{
                    padding: 20,
                    borderRadius: 18,
                    border: '1px solid rgba(99,102,241,0.35)',
                    background: 'linear-gradient(135deg, rgba(99,102,241,0.25), rgba(14,165,233,0.18))',
                    display: 'grid',
                    gap: 12
                  }}
                >
                  <div style={{ display: 'grid', gap: 4 }}>
                    <label htmlFor="dashboard-student-select" style={{ fontWeight: 600 }}>
                      Spotlight learner
                    </label>
                    <span style={{ color: 'var(--text-muted)', fontSize: 12 }}>
                      Choose any student for a clean trajectory view plus Gemini-powered coaching guidance.
                    </span>
                  </div>
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
              <div style={{ display: 'grid', gap: 18, gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
                <div
                  className="glass-subcard"
                  style={{ padding: 22, borderRadius: 18, border: '1px solid rgba(148,163,184,0.35)', background: 'rgba(15,23,42,0.62)', display: 'grid', gap: 16 }}
                >
                  <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
                    <div style={{ display: 'grid', gap: 4 }}>
                      <strong style={{ fontSize: 18 }}>Performance snapshot</strong>
                      <span style={{ color: 'var(--text-muted)', fontSize: 13 }}>
                        A concise rollup of mastery, momentum, and the freshest checkpoints for this view.
                      </span>
                    </div>
                    <span
                      className="tag"
                      style={{ background: 'rgba(148,163,184,0.18)', border: '1px solid rgba(148,163,184,0.35)', color: 'rgba(226,232,240,0.9)' }}
                    >
                      {selectedPeriod === 'all' ? 'All classes' : `Period ${selectedPeriod}`}
                    </span>
                  </header>
                  <div style={{ display: 'grid', gap: 12, gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))' }}>
                    <div>
                      <div style={{ fontSize: 28, fontWeight: 700 }}>{formatPercentage(classMetrics.average)}</div>
                      <div style={{ fontSize: 12, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
                        Class average
                      </div>
                    </div>
                    <div>
                      <div style={{ fontSize: 22, fontWeight: 700 }}>{formatPercentage(timelineAverage)}</div>
                      <div style={{ fontSize: 12, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
                        Trendline avg
                      </div>
                    </div>
                    <div>
                      <div style={{ fontSize: 22, fontWeight: 700 }}>{summariesForView.length}</div>
                      <div style={{ fontSize: 12, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
                        Checkpoints
                      </div>
                    </div>
                  </div>
                  <div style={{ display: 'grid', gap: 12 }}>
                    <ProgressSparkline data={timelineSeries} stroke="rgba(129,140,248,0.9)" fill="rgba(129,140,248,0.28)" />
                    <div style={{ display: 'grid', gap: 4, fontSize: 13, color: 'var(--text-muted)' }}>
                      <span>
                        <strong style={{ color: 'rgba(226,232,240,0.9)' }}>Top performer:</strong>{' '}
                        {classMetrics.topRecord
                          ? `${classMetrics.topRecord.displayName} · ${formatPercentage(classMetrics.topRecord.score ?? null)}`
                          : 'N/A'}
                      </span>
                      <span>
                        <strong style={{ color: 'rgba(226,232,240,0.9)' }}>Focus area:</strong>{' '}
                        {classMetrics.bottomRecord
                          ? `${classMetrics.bottomRecord.displayName} · ${formatPercentage(classMetrics.bottomRecord.score ?? null)}`
                          : 'N/A'}
                      </span>
                      {latestSnapshotUpdatedAt && (
                        <span>Last updated {latestSnapshotUpdatedAt.toLocaleDateString()}</span>
                      )}
                    </div>
                  </div>
                  {latestSnapshotRows.length > 0 && (
                    <div style={{ display: 'grid', gap: 6 }}>
                      <strong style={{ fontSize: 13 }}>Latest checkpoints</strong>
                      <ul
                        style={{
                          margin: 0,
                          padding: 0,
                          display: 'grid',
                          gap: 6,
                          listStyle: 'none',
                          color: 'var(--text-muted)'
                        }}
                      >
                        {latestSnapshotRows.map((snapshot) => (
                          <li key={snapshot.id} style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
                            <span style={{ fontWeight: 600, color: 'rgba(226,232,240,0.9)' }}>{snapshot.testName ?? 'Assessment'}</span>
                            <span style={{ display: 'flex', gap: 10, alignItems: 'baseline' }}>
                              <span>{formatPercentage(snapshot.averageScore ?? null)}</span>
                              <span style={{ fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                                {snapshot.updatedAt ? snapshot.updatedAt.toLocaleDateString() : 'N/A'}
                              </span>
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
                {selectedStudent && studentMetrics && (
                  <div
                    className="glass-subcard"
                    style={{ padding: 22, borderRadius: 18, border: '1px solid rgba(148,163,184,0.35)', background: 'rgba(15,23,42,0.62)', display: 'grid', gap: 14 }}
                  >
                    <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
                      <div style={{ display: 'grid', gap: 4 }}>
                        <span style={{ fontSize: 12, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
                          Individual trajectory
                        </span>
                        <strong style={{ fontSize: 20 }}>{selectedStudent.displayName}</strong>
                      </div>
                      <span className="tag" style={{ background: 'rgba(99,102,241,0.18)', border: '1px solid rgba(99,102,241,0.35)' }}>
                        {testLabel(selectedExplorerTest)}
                      </span>
                    </header>
                    <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                      <div>
                        <div style={{ fontSize: 26, fontWeight: 700 }}>{formatPercentage(studentMetrics.average)}</div>
                        <div style={{ fontSize: 12, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Average</div>
                      </div>
                      {studentMetrics.latest && (
                        <div>
                          <div style={{ fontSize: 20, fontWeight: 600 }}>{formatPercentage(studentMetrics.latest.score ?? null)}</div>
                          <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{studentMetrics.latest.testName ?? 'Latest checkpoint'}</div>
                        </div>
                      )}
                      {studentTrendDelta != null && (
                        <div>
                          <div style={{ fontSize: 18, fontWeight: 600 }}>{formatDelta(studentTrendDelta) ?? '—'}</div>
                          <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Trend</div>
                        </div>
                      )}
                    </div>
                    <ProgressSparkline data={studentTrendSeries} stroke="rgba(129,140,248,0.9)" fill="rgba(129,140,248,0.28)" />
                    {studentMetrics.recent.length > 0 && (
                      <div>
                        <strong style={{ fontSize: 13 }}>Recent checkpoints</strong>
                        <ul style={{ margin: '6px 0 0 16px', padding: 0, display: 'grid', gap: 4, color: 'var(--text-muted)' }}>
                          {studentMetrics.recent.map((entry, index) => (
                            <li key={index}>
                              {entry.testName ?? 'Assessment'} · {formatPercentage(entry.score ?? null)}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
                {studentInsight && (
                  <div
                    className="glass-subcard"
                    style={{
                      padding: 22,
                      borderRadius: 18,
                      border: '1px solid rgba(99,102,241,0.35)',
                      background: 'linear-gradient(135deg, rgba(99,102,241,0.32), rgba(14,165,233,0.18))',
                      display: 'grid',
                      gap: 14
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
                      <strong>Friendly coaching tip</strong>
                      <span className="tag" style={{ background: 'rgba(15,23,42,0.45)', border: '1px solid rgba(255,255,255,0.2)' }}>
                        Gemini brief
                      </span>
                    </div>
                    <p style={{ margin: 0, color: 'rgba(226,232,240,0.92)', lineHeight: 1.6 }}>{studentInsight.headline}</p>
                    {studentInsight.highlights.length > 0 && (
                      <div style={{ display: 'grid', gap: 6 }}>
                        <strong style={{ fontSize: 13 }}>Highlights</strong>
                        <ul
                          style={{
                            margin: 0,
                            padding: 0,
                            display: 'grid',
                            gap: 6,
                            listStyle: 'none',
                            color: 'var(--text-muted)'
                          }}
                        >
                          {studentInsight.highlights.map((highlight, index) => (
                            <li key={index} style={{ display: 'flex', gap: 8 }}>
                              <span style={{ color: 'rgba(94,234,212,0.9)' }}>•</span>
                              <span>{highlight}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {studentInsight.recommendations.length > 0 && (
                      <div style={{ display: 'grid', gap: 6 }}>
                        <strong style={{ fontSize: 13 }}>Next moves</strong>
                        <ul
                          style={{
                            margin: 0,
                            padding: 0,
                            display: 'grid',
                            gap: 6,
                            listStyle: 'none',
                            color: 'var(--text-muted)'
                          }}
                        >
                          {studentInsight.recommendations.map((recommendation, index) => (
                            <li key={index} style={{ display: 'flex', gap: 8 }}>
                              <span style={{ color: 'rgba(129,140,248,0.9)' }}>•</span>
                              <span>{recommendation}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </section>


          <section
            id={SECTION_IDS.assignments}
            className="glass-card"
            style={{ display: 'grid', gap: 20 }}
            data-collapsible="true"
          >
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
              <div>
                <h3 style={{ margin: '4px 0 6px', fontSize: 24, fontWeight: 700 }}>Assignments</h3>
                <p style={{ margin: 0, color: 'var(--text-muted)', maxWidth: 480 }}>
                  Stage reteaches, enrichment, and celebrations in one organized list ready for quick sharing or printing.
                </p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                <Link href="/assignments" className="primary" style={{ textDecoration: 'none' }}>
                  Launch assignments workspace
                </Link>
                <ClearButton label="Clear assignments" onClear={handleClearAssignments} />
                <PrintButton targetId={SECTION_IDS.assignments} label="Print assignments" />
              </div>
            </header>
            {assignments.length === 0 ? (
              <div className="empty-state" style={{ marginTop: 18 }}>
                Create differentiated assignments from any standard to monitor mastery progress here.
              </div>
            ) : (
              <table className="table" style={{ marginTop: 8 }}>
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
            )}
          </section>
        </main>
        <aside className="dashboard-shell__rail" data-visible={workspaceMode === 'focus' ? 'true' : undefined} aria-live="polite">
          {focusRailCards.map((card) => (
            <div key={card.id} className="rail-card" style={{ background: card.accent }}>
              <span className="rail-card__icon" aria-hidden>
                {card.icon}
              </span>
              <div className="rail-card__body">
                <strong>{card.title}</strong>
                <span>{card.body}</span>
                {card.footer && <em>{card.footer}</em>}
              </div>
            </div>
          ))}
          {focusRailCards.length === 0 && (
            <div className="rail-card rail-card--empty">
              <span className="rail-card__icon" aria-hidden>
                💤
              </span>
              <div className="rail-card__body">
                <strong>All caught up</strong>
                <span>Secondary panels minimized — nothing queued right now.</span>
              </div>
            </div>
          )}
        </aside>
      </div>
      <div style={{ display: 'grid', justifyItems: 'center', gap: 12 }}>
        <ClearButton label="Master clear workspace" onClear={handleMasterClear} tone="danger" />
        <p style={{ fontSize: 12, color: 'var(--text-muted)', textAlign: 'center', maxWidth: 360 }}>
          Master clear removes dashboard metrics, assessments, students, assignments, and cached insights for this account. Use with care.
        </p>
      </div>
    </div>
  )
}
