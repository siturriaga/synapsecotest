import { useEffect, useState } from 'react'
import { collection, doc, onSnapshot, orderBy, query } from 'firebase/firestore'
import type { User } from 'firebase/auth'
import { db } from '../firebase'
import { DynamicWelcome } from '../components/core/DynamicWelcome'
import { DashboardCards, type StatCard } from '../components/core/DashboardCards'

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

  useEffect(() => {
    if (!user) {
      setStats([])
      setPulses([])
      setAssignments([])
      setAssessmentSummaries([])
      setLatestAssessment(null)
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

    return () => {
      unsubStats()
      unsubPulses()
      unsubAssignments()
      unsubSummary()
    }
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

  return (
    <div className="fade-in">
      <DynamicWelcome />
      <section style={{ display: 'grid', gap: 28 }}>
        <DashboardCards cards={stats} />

        {latestAssessment && (
          <section className="glass-card">
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div className="badge">Latest mastery upload</div>
                <h3 style={{ margin: '12px 0 0', fontSize: 24, fontWeight: 700 }}>{latestAssessment.testName}</h3>
              </div>
              {latestAssessment.period && latestAssessment.quarter && (
                <span className="tag">Period {latestAssessment.period} · {latestAssessment.quarter}</span>
              )}
            </header>
            <div style={{ display: 'grid', gap: 12, marginTop: 18 }}>
              <div style={{ display: 'flex', gap: 18, flexWrap: 'wrap' }}>
                <div className="glass-subcard" style={{ padding: 16, borderRadius: 16, border: '1px solid rgba(148,163,184,0.25)', background: 'rgba(15,23,42,0.55)' }}>
                  <strong>Average</strong>
                  <div style={{ fontSize: 26, fontWeight: 700, marginTop: 6 }}>
                    {latestAssessment.averageScore !== null && latestAssessment.averageScore !== undefined
                      ? latestAssessment.averageScore.toFixed(1)
                      : '—'}
                  </div>
                </div>
                <div className="glass-subcard" style={{ padding: 16, borderRadius: 16, border: '1px solid rgba(148,163,184,0.25)', background: 'rgba(15,23,42,0.55)' }}>
                  <strong>Range</strong>
                  <div style={{ marginTop: 6 }}>
                    High {latestAssessment.maxScore ?? '—'} · Low {latestAssessment.minScore ?? '—'}
                  </div>
                </div>
                <div className="glass-subcard" style={{ padding: 16, borderRadius: 16, border: '1px solid rgba(148,163,184,0.25)', background: 'rgba(15,23,42,0.55)' }}>
                  <strong>Learners</strong>
                  <div style={{ fontSize: 26, fontWeight: 700, marginTop: 6 }}>{latestAssessment.studentCount ?? '—'}</div>
                </div>
              </div>
            </div>
          </section>
        )}

        {assessmentSummaries.length > 0 && (
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
                {assessmentSummaries.map((snapshot) => (
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
