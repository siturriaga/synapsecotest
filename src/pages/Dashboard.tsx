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

export default function DashboardPage({ user, loading }: DashboardProps) {
  const [stats, setStats] = useState<StatCard[]>([])
  const [pulses, setPulses] = useState<Pulse[]>([])
  const [assignments, setAssignments] = useState<AssignmentSummary[]>([])

  useEffect(() => {
    if (!user) {
      setStats([])
      setPulses([])
      setAssignments([])
      return
    }

    const statsRef = doc(db, `users/${user.uid}/dashboard_stats/metrics`)
    const unsubStats = onSnapshot(statsRef, (snap) => {
      const data = snap.data() || {}
      const cards: StatCard[] = [
        { id: 'enrollment', label: 'Total Enrollment', value: data.totalEnrollment ?? 0 },
        { id: 'groups', label: 'Active Groups', value: data.groupCount ?? 0, delta: data.groupDelta ?? undefined },
        { id: 'on-track', label: 'On Track', value: data.onTrack ?? 0, delta: data.onTrackDelta ?? undefined },
        { id: 'at-risk', label: 'Needs Support', value: data.atRisk ?? 0, delta: data.atRiskDelta ?? undefined }
      ]
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

    return () => {
      unsubStats()
      unsubPulses()
      unsubAssignments()
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
