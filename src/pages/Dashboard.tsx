import { FormEvent, useEffect, useMemo, useState } from 'react'
import { collection, doc, limit, onSnapshot, orderBy, query } from 'firebase/firestore'
import type { User } from 'firebase/auth'
import { db } from '../firebase'
import { DynamicWelcome } from '../components/core/DynamicWelcome'
import { DashboardCards, type StatCard } from '../components/core/DashboardCards'
import { useRosterData } from '../hooks/useRosterData'
import { safeFetch } from '../utils/safeFetch'
import { AssistedHint } from '../components/core/AssistedHint'

interface DashboardProps {
  user: User | null
  loading?: boolean
}

type Pulse = {
  id: string
  title: string
  detail: string
  createdAt?: Date | null
}

type AssignmentSummary = {
  id: string
  title: string
  dueDate?: string
  status: string
}

type CoachInsight = {
  summary: string
  keyInsights?: string[]
  recommendedActions?: string[]
  dataHighlights?: string[]
  suggestedArtifacts?: string[]
}

type CoachSession = {
  id: string
  question: string
  response: CoachInsight
  createdAt?: Date | null
}

type LatestAssessment = {
  testName: string
  period?: number | null
  quarter?: string | null
  studentCount?: number
  averageScore?: number | null
  maxScore?: number | null
  minScore?: number | null
}

type AssessmentSnapshot = {
  id: string
  testName: string
  period?: number | null
  quarter?: string | null
  studentCount?: number
  averageScore?: number | null
  maxScore?: number | null
  minScore?: number | null
  updatedAt?: Date | null
}

export default function DashboardPage({ user, loading }: DashboardProps) {
  const [stats, setStats] = useState<StatCard[]>([])
  const [pulses, setPulses] = useState<Pulse[]>([])
  const [assignments, setAssignments] = useState<AssignmentSummary[]>([])
  const [latestAssessment, setLatestAssessment] = useState<LatestAssessment | null>(null)
  const [assessmentSummaries, setAssessmentSummaries] = useState<AssessmentSnapshot[]>([])
  const [coachQuestion, setCoachQuestion] = useState('')
  const [coachLoading, setCoachLoading] = useState(false)
  const [coachError, setCoachError] = useState<string | null>(null)
  const [coachStatus, setCoachStatus] = useState<string>('')
  const [coachHistory, setCoachHistory] = useState<CoachSession[]>([])
  const {
    records: rosterRecords,
    summaries: rosterSummaries,
    students: rosterStudents,
    insights: rosterInsights,
    groupInsights,
    pedagogy
  } = useRosterData()
  const [selectedPeriod, setSelectedPeriod] = useState<string>('all')
  const [selectedStudentId, setSelectedStudentId] = useState<string>('')

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

  const periodOptions = useMemo(() => {
    const set = new Set<string>()
    rosterRecords.forEach((record) => {
      if (record.period !== null && record.period !== undefined) {
        set.add(String(record.period))
      }
    })
    return Array.from(set).sort((a, b) => Number(a) - Number(b))
  }, [rosterRecords])

  useEffect(() => {
    if (selectedPeriod !== 'all' && !periodOptions.includes(selectedPeriod)) {
      setSelectedPeriod(periodOptions[0] ?? 'all')
    }
  }, [periodOptions, selectedPeriod])

  const combinedSummaries = assessmentSummaries.length ? assessmentSummaries : rosterSummaries

  const derivedLatestAssessment = useMemo(() => {
    if (latestAssessment) return latestAssessment
    const first = combinedSummaries[0]
    if (!first) return null
    return {
      testName: first.testName,
      period: first.period,
      quarter: first.quarter,
      studentCount: first.studentCount ?? undefined,
      averageScore: first.averageScore,
      maxScore: first.maxScore,
      minScore: first.minScore
    } as LatestAssessment
  }, [latestAssessment, combinedSummaries])

  const filteredClassRecords = useMemo(() => {
    if (selectedPeriod === 'all') return rosterRecords
    return rosterRecords.filter((record) => String(record.period ?? '') === selectedPeriod)
  }, [rosterRecords, selectedPeriod])

  const classMetrics = useMemo(() => {
    if (!filteredClassRecords.length) return null
    const scoredRecords = filteredClassRecords.filter((record) => typeof record.score === 'number') as Array<
      typeof filteredClassRecords[number] & { score: number }
    >
    const assessments = Array.from(
      new Set(filteredClassRecords.map((record) => record.testName).filter((value): value is string => Boolean(value)))
    )
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
    const average = scores.length ? scores.reduce((total, value) => total + value, 0) / scores.length : null
    const topRecord = scoredRecords.reduce<typeof scoredRecords[number] | null>((best, current) => {
      if (!best) return current
      return current.score > (best.score ?? -Infinity) ? current : best
    }, null)
    const bottomRecord = scoredRecords.reduce<typeof scoredRecords[number] | null>((lowest, current) => {
      if (!lowest) return current
      return current.score < (lowest.score ?? Infinity) ? current : lowest
    }, null)
    return {
      average,
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
    return rosterRecords.filter(
      (record) =>
        record.studentId === selectedStudent.id ||
        (!record.studentId && record.displayName === selectedStudent.displayName)
    )
  }, [rosterRecords, selectedStudent])

  const studentMetrics = useMemo(() => {
    if (!selectedStudent) return null
    const scored = studentHistory.filter((record) => typeof record.score === 'number') as Array<
      typeof studentHistory[number] & { score: number }
    >
    const average = scored.length ? scored.reduce((total, item) => total + item.score, 0) / scored.length : null
    const latest = studentHistory[0] ?? null
    const recent = studentHistory.slice(0, 3)
    return { average, latest, recent }
  }, [studentHistory, selectedStudent])

  useEffect(() => {
    if (!user) {
      setStats([])
      setPulses([])
      setAssignments([])
      setAssessmentSummaries([])
      setLatestAssessment(null)
      setCoachHistory([])
      setCoachStatus('')
      setCoachError(null)
      setCoachQuestion('')
      return
    }

    const statsRef = doc(db, `users/${user.uid}/dashboard_stats/metrics`)
    const unsubStats = onSnapshot(statsRef, (snap) => {
      const data = snap.data() || {}
      const cards: StatCard[] = []
      if (typeof data.totalEnrollment === 'number') {
        cards.push({ id: 'enrollment', label: 'Learners scored', value: data.totalEnrollment })
      }
      if (data.latestAssessment) {
        const summary = data.latestAssessment as LatestAssessment
        setLatestAssessment(summary)
        const average = summary.averageScore ?? null
        cards.push({
          id: 'latest-average',
          label: 'Latest class average',
          value: average ?? 0,
          displayValue: average !== null ? average.toFixed(1) : '—'
        })
        if (typeof summary.studentCount === 'number') {
          cards.push({ id: 'latest-count', label: 'Students assessed', value: summary.studentCount })
        }
      } else {
        setLatestAssessment(null)
      }
      if (typeof data.groupCount === 'number') {
        cards.push({ id: 'groups', label: 'Active Groups', value: data.groupCount ?? 0, delta: data.groupDelta ?? undefined })
      }
      if (typeof data.onTrack === 'number') {
        cards.push({ id: 'on-track', label: 'On Track', value: data.onTrack ?? 0, delta: data.onTrackDelta ?? undefined })
      }
      if (typeof data.atRisk === 'number') {
        cards.push({ id: 'at-risk', label: 'Needs Support', value: data.atRisk ?? 0, delta: data.atRiskDelta ?? undefined })
      }
      if (cards.length === 0) {
        cards.push({ id: 'placeholder', label: 'Data incoming', value: 0, displayValue: '—' })
      }
      setStats(cards)
    })

    const pulseQuery = query(collection(db, `users/${user.uid}/logs`), orderBy('createdAt', 'desc'))
    const unsubPulses = onSnapshot(pulseQuery, (snap) => {
      const rows: Pulse[] = []
      snap.forEach((docSnap) => {
        const data = docSnap.data() as any
        rows.push({
          id: docSnap.id,
          title: data.title ?? 'Insight',
          detail: data.detail ?? data.message ?? 'Gemini generated an insight.',
          createdAt: data.createdAt?.toDate?.() ?? null
        })
      })
      setPulses(rows.slice(0, 5))
    })

    const assignmentQuery = query(collection(db, `users/${user.uid}/assignments`), orderBy('dueDate', 'asc'))
    const unsubAssignments = onSnapshot(assignmentQuery, (snap) => {
      const rows: AssignmentSummary[] = []
      snap.forEach((docSnap) => {
        const data = docSnap.data() as any
        rows.push({
          id: docSnap.id,
          title: data.title ?? 'Untitled assignment',
          dueDate: data.dueDate,
          status: data.status ?? 'draft'
        })
      })
      setAssignments(rows.slice(0, 4))
    })

    const summaryQuery = query(collection(db, `users/${user.uid}/assessments_summary`), orderBy('updatedAt', 'desc'))
    const unsubSummary = onSnapshot(summaryQuery, (snap) => {
      const rows: AssessmentSnapshot[] = []
      snap.forEach((docSnap) => {
        const data = docSnap.data() as any
        rows.push({
          id: docSnap.id,
          testName: data.testName ?? 'Assessment',
          period: data.period,
          quarter: data.quarter,
          studentCount: data.studentCount,
          averageScore: data.averageScore,
          maxScore: data.maxScore,
          minScore: data.minScore,
          updatedAt: data.updatedAt?.toDate?.() ?? null
        })
      })
      setAssessmentSummaries(rows.slice(0, 3))
    })

    const coachQuery = query(
      collection(db, `users/${user.uid}/coach_sessions`),
      orderBy('createdAt', 'desc'),
      limit(5)
    )

    const unsubCoach = onSnapshot(coachQuery, (snap) => {
      const rows: CoachSession[] = []
      snap.forEach((docSnap) => {
        const data = docSnap.data() as any
        if (!data?.response) return
        rows.push({
          id: docSnap.id,
          question: data.question ?? '',
          response: {
            summary: data.response.summary ?? '',
            keyInsights: Array.isArray(data.response.keyInsights) ? data.response.keyInsights : [],
            recommendedActions: Array.isArray(data.response.recommendedActions)
              ? data.response.recommendedActions
              : [],
            dataHighlights: Array.isArray(data.response.dataHighlights) ? data.response.dataHighlights : [],
            suggestedArtifacts: Array.isArray(data.response.suggestedArtifacts)
              ? data.response.suggestedArtifacts
              : []
          },
          createdAt: data.createdAt?.toDate?.() ?? null
        })
      })
      setCoachHistory(rows)
    })

    return () => {
      unsubStats()
      unsubPulses()
      unsubAssignments()
      unsubSummary()
      unsubCoach()
    }
  }, [user])

  async function handleCoachSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const trimmed = coachQuestion.trim()
    if (!trimmed) {
      setCoachError('Ask a question to receive tailored guidance.')
      return
    }
    try {
      setCoachLoading(true)
      setCoachError(null)
      setCoachStatus('')
      await safeFetch<CoachInsight>('/.netlify/functions/coachInsights', {
        method: 'POST',
        body: JSON.stringify({ question: trimmed })
      })
      setCoachStatus('New coaching insight saved to your workspace.')
      setCoachQuestion('')
    } catch (error: any) {
      setCoachError(error?.message ?? 'Unable to reach the instructional coach.')
    } finally {
      setCoachLoading(false)
    }
  }

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

  return (
    <div className="fade-in">
      <DynamicWelcome />
      <section style={{ display: 'grid', gap: 28 }}>
        <DashboardCards cards={stats} />

        <section className="glass-card" style={{ display: 'grid', gap: 18 }}>
          <div className="badge">Instructional coach</div>
          <div>
            <h2 style={{ margin: '12px 0 6px', fontSize: 26, fontWeight: 800 }}>Ask Synapse for guidance</h2>
            <p style={{ color: 'var(--text-muted)', maxWidth: 520 }}>
              Submit a quick question and Synapse will analyze your latest mastery data to suggest next steps grounded in
              culturally responsive pedagogy.
            </p>
          </div>
          <form onSubmit={handleCoachSubmit} style={{ display: 'grid', gap: 12 }}>
            <label htmlFor="coach-question" style={{ fontWeight: 600 }}>
              What do you want help with?
            </label>
            <textarea
              id="coach-question"
              name="coach-question"
              value={coachQuestion}
              onChange={(event) => setCoachQuestion(event.target.value)}
              rows={3}
              placeholder="e.g., Which learners should I target for reteach on linear equations?"
              style={{
                borderRadius: 14,
                border: '1px solid rgba(148,163,184,0.28)',
                background: 'rgba(15, 23, 42, 0.6)',
                color: 'var(--text)',
                padding: '12px 14px',
                fontSize: 15,
                resize: 'vertical'
              }}
            />
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <button type="submit" className="primary" disabled={coachLoading}>
                {coachLoading ? 'Summoning insight…' : 'Ask Synapse'}
              </button>
              <AssistedHint
                id="coach-hint"
                message="Share a coaching question — Synapse will respond with data-connected strategies and save them here."
                show={!coachLoading && coachHistory.length === 0}
              />
            </div>
          </form>
          {coachStatus && <p style={{ margin: 0, color: 'var(--text-muted)' }}>{coachStatus}</p>}
          {coachError && <p style={{ margin: 0, color: '#fecaca' }}>{coachError}</p>}
          {coachHistory.length > 0 && (
            <div style={{ display: 'grid', gap: 12 }}>
              {coachHistory.map((entry) => (
                <article
                  key={entry.id}
                  className="glass-subcard"
                  style={{
                    borderRadius: 16,
                    border: '1px solid rgba(148,163,184,0.25)',
                    background: 'rgba(15,23,42,0.5)',
                    padding: 16,
                    display: 'grid',
                    gap: 8
                  }}
                >
                  <header style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'baseline' }}>
                    <div style={{ fontWeight: 600, color: '#e0e7ff' }}>{entry.question}</div>
                    <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                      {entry.createdAt ? entry.createdAt.toLocaleString() : '—'}
                    </span>
                  </header>
                  <p style={{ margin: 0, color: 'var(--text-muted)' }}>{entry.response.summary}</p>
                  {entry.response.keyInsights && entry.response.keyInsights.length > 0 && (
                    <div>
                      <strong style={{ fontSize: 13, textTransform: 'uppercase', letterSpacing: 0.08 }}>Key insights</strong>
                      <ul style={{ margin: '6px 0 0 18px' }}>
                        {entry.response.keyInsights.map((insight, index) => (
                          <li key={index}>{insight}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {entry.response.recommendedActions && entry.response.recommendedActions.length > 0 && (
                    <div>
                      <strong style={{ fontSize: 13, textTransform: 'uppercase', letterSpacing: 0.08 }}>Recommended actions</strong>
                      <ul style={{ margin: '6px 0 0 18px' }}>
                        {entry.response.recommendedActions.map((action, index) => (
                          <li key={index}>{action}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {entry.response.dataHighlights && entry.response.dataHighlights.length > 0 && (
                    <div>
                      <strong style={{ fontSize: 13, textTransform: 'uppercase', letterSpacing: 0.08 }}>Data highlights</strong>
                      <ul style={{ margin: '6px 0 0 18px' }}>
                        {entry.response.dataHighlights.map((highlight, index) => (
                          <li key={index}>{highlight}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {entry.response.suggestedArtifacts && entry.response.suggestedArtifacts.length > 0 && (
                    <div>
                      <strong style={{ fontSize: 13, textTransform: 'uppercase', letterSpacing: 0.08 }}>Suggested artifacts</strong>
                      <ul style={{ margin: '6px 0 0 18px' }}>
                        {entry.response.suggestedArtifacts.map((artifact, index) => (
                          <li key={index}>{artifact}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </article>
              ))}
            </div>
          )}
        </section>

        <section className="glass-card" style={{ display: 'grid', gap: 18 }}>
          <div className="badge">Class & student explorer</div>
          <div style={{ display: 'grid', gap: 18, gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
            <div
              className="glass-subcard"
              style={{
                padding: 18,
                borderRadius: 18,
                border: '1px solid rgba(148,163,184,0.25)',
                background: 'rgba(15,23,42,0.55)',
                display: 'grid',
                gap: 12
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
                <strong>Class view</strong>
                <select
                  value={selectedPeriod}
                  onChange={(event) => setSelectedPeriod(event.target.value)}
                  className="table-input"
                  style={{ maxWidth: 160 }}
                >
                  <option value="all">All periods</option>
                  {periodOptions.map((option) => (
                    <option key={option} value={option}>
                      Period {option}
                    </option>
                  ))}
                </select>
              </div>
              {classMetrics ? (
                <div style={{ display: 'grid', gap: 10, fontSize: 14 }}>
                  <div>
                    <span style={{ color: 'var(--text-muted)', fontSize: 13 }}>Students</span>
                    <div style={{ fontSize: 24, fontWeight: 700 }}>{classMetrics.total}</div>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-muted)', fontSize: 13 }}>Average</span>
                    <div style={{ fontSize: 22, fontWeight: 700 }}>
                      {classMetrics.average !== null ? classMetrics.average.toFixed(1) : '—'}
                    </div>
                  </div>
                  {classMetrics.topRecord && (
                    <div>
                      <span style={{ color: 'var(--text-muted)', fontSize: 13 }}>Top performer</span>
                      <div style={{ marginTop: 4 }}>
                        {classMetrics.topRecord.displayName} · {classMetrics.topRecord.score ?? '—'}
                      </div>
                    </div>
                  )}
                  {classMetrics.bottomRecord && (
                    <div>
                      <span style={{ color: 'var(--text-muted)', fontSize: 13 }}>Needs support</span>
                      <div style={{ marginTop: 4 }}>
                        {classMetrics.bottomRecord.displayName} · {classMetrics.bottomRecord.score ?? '—'}
                      </div>
                    </div>
                  )}
                  {classMetrics.assessments.length > 0 && (
                    <div>
                      <span style={{ color: 'var(--text-muted)', fontSize: 13 }}>Assessments</span>
                      <div style={{ marginTop: 4 }}>{classMetrics.assessments.join(', ')}</div>
                    </div>
                  )}
                  {groupInsights.length > 0 && (
                    <div>
                      <span style={{ color: 'var(--text-muted)', fontSize: 13 }}>Groups</span>
                      <ul
                        style={{
                          margin: '6px 0 0 16px',
                          padding: 0,
                          display: 'grid',
                          gap: 4,
                          color: 'var(--text-muted)',
                          listStyle: 'disc'
                        }}
                      >
                        {groupInsights.slice(0, 3).map((group) => (
                          <li key={group.id}>
                            {group.label}: {group.range}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {pedagogy?.summary && (
                    <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: 13 }}>{pedagogy.summary}</p>
                  )}
                </div>
              ) : (
                <p style={{ color: 'var(--text-muted)', fontSize: 14, margin: '4px 0 0' }}>
                  Upload roster data to populate class metrics.
                </p>
              )}
            </div>

            <div
              className="glass-subcard"
              style={{
                padding: 18,
                borderRadius: 18,
                border: '1px solid rgba(148,163,184,0.25)',
                background: 'rgba(15,23,42,0.55)',
                display: 'grid',
                gap: 12
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
                <strong>Student focus</strong>
                <select
                  value={selectedStudentId}
                  onChange={(event) => setSelectedStudentId(event.target.value)}
                  className="table-input"
                  style={{ maxWidth: 200 }}
                >
                  {rosterStudents.map((student) => (
                    <option key={student.id} value={student.id}>
                      {student.displayName}
                    </option>
                  ))}
                </select>
              </div>
              {selectedStudent ? (
                <div style={{ display: 'grid', gap: 10, fontSize: 14 }}>
                  <div>
                    <span style={{ color: 'var(--text-muted)', fontSize: 13 }}>Latest score</span>
                    <div style={{ marginTop: 4 }}>
                      {selectedStudent.lastScore !== null && selectedStudent.lastScore !== undefined
                        ? selectedStudent.lastScore
                        : '—'}
                      {selectedStudent.lastAssessment && ` · ${selectedStudent.lastAssessment}`}
                    </div>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-muted)', fontSize: 13 }}>Average</span>
                    <div style={{ marginTop: 4 }}>
                      {studentMetrics?.average !== null && studentMetrics?.average !== undefined
                        ? studentMetrics.average.toFixed(1)
                        : '—'}
                    </div>
                  </div>
                  {selectedStudent.periodHistory && selectedStudent.periodHistory.length > 0 && (
                    <div>
                      <span style={{ color: 'var(--text-muted)', fontSize: 13 }}>Period history</span>
                      <div style={{ marginTop: 4 }}>
                        {Array.from(
                          new Set(
                            selectedStudent.periodHistory.filter(
                              (value): value is number => value !== null && value !== undefined
                            )
                          )
                        ).join(', ')}
                      </div>
                    </div>
                  )}
                  {studentMetrics?.recent.length ? (
                    <div>
                      <span style={{ color: 'var(--text-muted)', fontSize: 13 }}>Recent mastery</span>
                      <ul
                        style={{
                          margin: '6px 0 0 16px',
                          padding: 0,
                          display: 'grid',
                          gap: 4,
                          color: 'var(--text-muted)',
                          listStyle: 'disc'
                        }}
                      >
                        {studentMetrics.recent.map((entry) => (
                          <li key={entry.id}>
                            {entry.testName ?? 'Assessment'} · {entry.score ?? '—'}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : null}
                </div>
              ) : (
                <p style={{ color: 'var(--text-muted)', fontSize: 14, margin: '4px 0 0' }}>
                  Upload roster data to view individual trends.
                </p>
              )}
            </div>
          </div>
        </section>

        {derivedLatestAssessment && (
          <section className="glass-card">
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div className="badge">Latest mastery upload</div>
                <h3 style={{ margin: '12px 0 0', fontSize: 24, fontWeight: 700 }}>{derivedLatestAssessment.testName}</h3>
              </div>
              {derivedLatestAssessment.period && derivedLatestAssessment.quarter && (
                <span className="tag">Period {derivedLatestAssessment.period} · {derivedLatestAssessment.quarter}</span>
              )}
            </header>
            <div style={{ display: 'grid', gap: 12, marginTop: 18 }}>
              <div style={{ display: 'flex', gap: 18, flexWrap: 'wrap' }}>
                <div className="glass-subcard" style={{ padding: 16, borderRadius: 16, border: '1px solid rgba(148,163,184,0.25)', background: 'rgba(15,23,42,0.55)' }}>
                  <strong>Average</strong>
                  <div style={{ fontSize: 26, fontWeight: 700, marginTop: 6 }}>
                    {derivedLatestAssessment.averageScore !== null && derivedLatestAssessment.averageScore !== undefined
                      ? derivedLatestAssessment.averageScore.toFixed(1)
                      : '—'}
                  </div>
                </div>
                <div className="glass-subcard" style={{ padding: 16, borderRadius: 16, border: '1px solid rgba(148,163,184,0.25)', background: 'rgba(15,23,42,0.55)' }}>
                  <strong>Range</strong>
                  <div style={{ marginTop: 6 }}>
                    High {derivedLatestAssessment.maxScore ?? '—'} · Low {derivedLatestAssessment.minScore ?? '—'}
                  </div>
                </div>
                <div className="glass-subcard" style={{ padding: 16, borderRadius: 16, border: '1px solid rgba(148,163,184,0.25)', background: 'rgba(15,23,42,0.55)' }}>
                  <strong>Learners</strong>
                  <div style={{ fontSize: 26, fontWeight: 700, marginTop: 6 }}>{derivedLatestAssessment.studentCount ?? '—'}</div>
                </div>
              </div>
            </div>
          </section>
        )}

        {combinedSummaries.length > 0 && (
          <section className="glass-card">
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div className="badge">Assessment history</div>
                <h3 style={{ margin: '12px 0 0', fontSize: 24, fontWeight: 700 }}>Recent uploads</h3>
              </div>
              <a href="/assignments" style={{ color: 'var(--accent)', fontWeight: 600 }}>Design follow-ups →</a>
            </header>
            <table className="table" style={{ marginTop: 18 }}>
              <thead>
                <tr>
                  <th>Assessment</th>
                  <th>Period</th>
                  <th>Quarter</th>
                  <th>Avg</th>
                  <th>High</th>
                  <th>Low</th>
                  <th>Updated</th>
                </tr>
              </thead>
              <tbody>
                {combinedSummaries.map((snapshot) => (
                  <tr key={snapshot.id}>
                    <td>{snapshot.testName}</td>
                    <td>{snapshot.period ?? '—'}</td>
                    <td>{snapshot.quarter ?? '—'}</td>
                    <td>{snapshot.averageScore !== null && snapshot.averageScore !== undefined ? snapshot.averageScore.toFixed(1) : '—'}</td>
                    <td>{snapshot.maxScore ?? '—'}</td>
                    <td>{snapshot.minScore ?? '—'}</td>
                    <td>{snapshot.updatedAt ? snapshot.updatedAt.toLocaleString() : '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        )}

        <section className="glass-card">
          <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div className="badge">Live oversight</div>
              <h3 style={{ margin: '12px 0 0', fontSize: 24, fontWeight: 700 }}>Pulse updates</h3>
            </div>
            <a href="/groups" style={{ color: 'var(--accent)', fontWeight: 600 }}>Review groups →</a>
          </header>
          {pulses.length === 0 ? (
            <div className="empty-state" style={{ marginTop: 18 }}>
              No Gemini actions logged yet. Generate student groups or lessons to see reflective insights here.
            </div>
          ) : (
            <ul style={{ listStyle: 'none', padding: 0, marginTop: 22, display: 'grid', gap: 16 }}>
              {pulses.map((pulse) => (
                <li key={pulse.id} style={{ border: '1px solid rgba(148,163,184,0.2)', borderRadius: 14, padding: 16 }}>
                  <div style={{ fontWeight: 600 }}>{pulse.title}</div>
                  <div style={{ color: 'var(--text-muted)', marginTop: 4 }}>{pulse.detail}</div>
                  {pulse.createdAt && (
                    <div style={{ fontSize: 12, marginTop: 10, color: 'rgba(148,163,184,0.7)' }}>
                      {pulse.createdAt.toLocaleString()}
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="glass-card">
          <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div className="badge">Upcoming</div>
              <h3 style={{ margin: '12px 0 0', fontSize: 24, fontWeight: 700 }}>Assignments radar</h3>
            </div>
            <a href="/assignments" style={{ color: 'var(--accent)', fontWeight: 600 }}>Manage assignments →</a>
          </header>
          {assignments.length === 0 ? (
            <div className="empty-state" style={{ marginTop: 18 }}>
              Create differentiated assignments from any standard to monitor mastery progress here.
            </div>
          ) : (
            <table className="table" style={{ marginTop: 18 }}>
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
      </section>
    </div>
  )
}
