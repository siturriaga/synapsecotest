import { useEffect, useMemo, useState } from 'react'
import type { User } from 'firebase/auth'
import { safeFetch } from '../utils/safeFetch'
import { useRosterData } from '../hooks/useRosterData'
import {
  useWorkspaceGroups,
  type WorkspaceGroup,
  type WorkspaceGroupStudent
} from '../hooks/useWorkspaceGroups'

type RosterStudent = {
  id: string
  name: string
  period?: number | null
  quarter?: string | null
  readiness?: string | null
  score?: number | null
}

type ApiGroupStudent = {
  id?: string | null
  name?: string | null
  readiness?: string | null
  period?: number | null
  quarter?: string | null
  score?: number | null | string
}

type ApiGroup = {
  id?: string | null
  name?: string | null
  rationale?: string | null
  students?: ApiGroupStudent[]
}

type GroupResponse = {
  groups: ApiGroup[]
  promptChips?: string[]
  metadata?: { source?: 'heuristic'; reason?: string }
}

function describeReadiness(score: number | null): string | null {
  if (score === null || Number.isNaN(score)) return null
  if (score >= 85) return `Extending mastery (${Math.round(score)}%)`
  if (score >= 70) return `Developing understanding (${Math.round(score)}%)`
  return `Foundation support needed (${Math.round(score)}%)`
}

function normalizeApiGroup(
  group: ApiGroup,
  index: number,
  mode: 'heterogeneous' | 'homogeneous',
  source: 'gemini' | 'heuristic',
  refinement: string | null
): WorkspaceGroup {
  const fallbackId = typeof group.id === 'string' && group.id.trim() ? group.id.trim() : `group-${index + 1}`
  const rawStudents = Array.isArray(group.students) ? group.students : []
  const students: WorkspaceGroupStudent[] = rawStudents
    .map((student, studentIndex) => {
      if (!student || typeof student !== 'object') {
        return null
      }
      const id =
        typeof student.id === 'string' && student.id.trim()
          ? student.id.trim()
          : `${fallbackId}-student-${studentIndex + 1}`
      const name =
        typeof student.name === 'string' && student.name.trim()
          ? student.name.trim()
          : `Learner ${studentIndex + 1}`
      const readiness = typeof student.readiness === 'string' ? student.readiness : null
      let period: number | null = null
      if (typeof student.period === 'number') {
        period = student.period
      } else if (typeof student.period === 'string') {
        const parsed = Number.parseInt(student.period, 10)
        period = Number.isFinite(parsed) ? parsed : null
      }
      const quarter = typeof student.quarter === 'string' ? student.quarter : null
      let score: number | null = null
      if (typeof student.score === 'number') {
        score = Number.isFinite(student.score) ? student.score : null
      } else if (typeof student.score === 'string') {
        const parsed = Number.parseFloat(student.score)
        score = Number.isFinite(parsed) ? parsed : null
      }
      return { id, name, readiness, period, quarter, score }
    })
    .filter((student): student is WorkspaceGroupStudent => Boolean(student))

  return {
    id: fallbackId,
    name: typeof group.name === 'string' && group.name.trim() ? group.name.trim() : `Group ${index + 1}`,
    rationale:
      typeof group.rationale === 'string' && group.rationale.trim()
        ? group.rationale.trim()
        : 'Instructional focus generated for this cohort.',
    students,
    mode,
    refinement,
    source,
    createdAt: new Date()
  }
}

export default function StudentGroupsPage({ user }: { user: User | null }) {
  const { students, records, loading: rosterLoading } = useRosterData()
  const roster = useMemo<RosterStudent[]>(() => {
    if (students.length) {
      return students.map((student) => {
        const score = typeof student.lastScore === 'number' ? student.lastScore : null
        return {
          id: student.id,
          name: student.displayName,
          period: student.period ?? null,
          quarter: student.quarter ?? null,
          score,
          readiness: describeReadiness(score)
        }
      })
    }

    if (!records.length) return []

    const deduped = new Map<string, RosterStudent>()
    records.forEach((record) => {
      const id = record.studentId ?? record.displayName.toLowerCase()
      const score = typeof record.score === 'number' ? record.score : null
      const readiness = describeReadiness(score)
      const existing = deduped.get(id)
      if (!existing || (score !== null && (existing.score ?? -Infinity) < score)) {
        deduped.set(id, {
          id,
          name: record.displayName,
          period: record.period ?? null,
          quarter: record.quarter ?? null,
          score,
          readiness
        })
      }
    })

    return Array.from(deduped.values())
  }, [records, students])
  const { groups: savedGroups, loading: savedGroupsLoading, insights, latestRun } = useWorkspaceGroups(user)
  const [optimisticGroups, setOptimisticGroups] = useState<WorkspaceGroup[]>([])
  const [requestLoading, setRequestLoading] = useState(false)
  const [mode, setMode] = useState<'heterogeneous' | 'homogeneous'>('heterogeneous')
  const [error, setError] = useState<string | null>(null)
  const [suggestedChips, setSuggestedChips] = useState<string[]>([])
  const [info, setInfo] = useState<string>('')

  useEffect(() => {
    if (!user) {
      setOptimisticGroups([])
      setInfo('')
      setError(null)
    }
  }, [user])

  useEffect(() => {
    if (!requestLoading && optimisticGroups.length > 0 && savedGroups.length > 0) {
      setOptimisticGroups([])
    }
  }, [requestLoading, optimisticGroups.length, savedGroups.length])

  const metadata = useMemo(() => {
    if (roster.length === 0) return rosterLoading ? 'Loading roster…' : 'No roster loaded'
    const periods = new Set(roster.map((s) => s.period).filter(Boolean))
    const quarters = new Set(roster.map((s) => s.quarter).filter(Boolean))
    let summary = `${roster.length} students • Periods ${Array.from(periods).join(', ') || 'n/a'} • Quarters ${Array.from(
      quarters
    ).join(', ') || 'n/a'}`
    if (latestRun?.createdAt) {
      summary += ` • Last generated ${latestRun.createdAt.toLocaleString()}`
    }
    if (latestRun?.mode) {
      summary += ` • Mode ${latestRun.mode}`
    }
    if (latestRun?.source === 'heuristic') {
      summary += ' • Heuristic fallback'
    }
    return summary
  }, [roster, rosterLoading, latestRun])

  const groupsLoading = requestLoading || savedGroupsLoading
  const displayGroups = optimisticGroups.length > 0 ? optimisticGroups : savedGroups

  async function handleGenerate() {
    if (!user) {
      setError('Sign in to access Gemini grouping.')
      return
    }
    if (roster.length === 0) {
      setError('Upload a roster first to unlock grouping suggestions.')
      return
    }
    setRequestLoading(true)
    setError(null)
    setInfo('')
    setOptimisticGroups([])
    try {
      const response = await safeFetch<GroupResponse>(
        '/.netlify/functions/groupStudents',
        {
          method: 'POST',
          body: JSON.stringify({ mode })
        }
      )
      const responseGroups = Array.isArray(response.groups) ? response.groups : []
      const source = response.metadata?.source === 'heuristic' ? 'heuristic' : 'gemini'
      const normalized = responseGroups.map((group, index) =>
        normalizeApiGroup(group, index, mode, source, null)
      )
      setOptimisticGroups(normalized)
      if (Array.isArray(response.promptChips) && response.promptChips.length) {
        setSuggestedChips(response.promptChips)
      }
      setError(null)
      setInfo(
        source === 'heuristic'
          ? response.metadata?.reason
            ? `Gemini unavailable: ${response.metadata.reason}. Generated heuristic cohorts.`
            : 'Gemini unavailable. Generated heuristic cohorts.'
          : 'Gemini generated fresh cohorts.'
      )
    } catch (err: any) {
      console.error(err)
      setOptimisticGroups([])
      setInfo('')
      setError(err?.message ?? 'Gemini grouping failed. Check logs for details.')
    } finally {
      setRequestLoading(false)
    }
  }

  async function handleChip(chip: string) {
    if (roster.length === 0) {
      setError('Upload a roster first to unlock grouping suggestions.')
      return
    }
    setRequestLoading(true)
    setError(null)
    setInfo('')
    try {
      const response = await safeFetch<GroupResponse>(
        '/.netlify/functions/groupStudents',
        {
          method: 'POST',
          body: JSON.stringify({ mode, refinement: chip })
        }
      )
      const responseGroups = Array.isArray(response.groups) ? response.groups : []
      const source = response.metadata?.source === 'heuristic' ? 'heuristic' : 'gemini'
      const normalized = responseGroups.map((group, index) =>
        normalizeApiGroup(group, index, mode, source, chip)
      )
      setOptimisticGroups(normalized)
      if (Array.isArray(response.promptChips) && response.promptChips.length) {
        setSuggestedChips(response.promptChips)
      }
      setInfo(
        source === 'heuristic'
          ? response.metadata?.reason
            ? `Gemini unavailable: ${response.metadata.reason}. Used heuristic refinement.`
            : 'Gemini unavailable. Used heuristic refinement.'
          : `Refined cohorts with “${chip}”.`
      )
    } catch (err: any) {
      console.error(err)
      setOptimisticGroups([])
      setInfo('')
      setError(err?.message ?? 'Unable to refine groups.')
    } finally {
      setRequestLoading(false)
    }
  }

  if (!user) {
    return (
      <div className="glass-card fade-in">
        <h2 style={{ margin: 0, fontSize: 26, fontWeight: 800 }}>Sign in required</h2>
        <p style={{ color: 'var(--text-muted)' }}>
          Authenticate to let Gemini analyze your roster data and recommend instructional groupings.
        </p>
      </div>
    )
  }

  return (
    <div className="fade-in" style={{ display: 'grid', gap: 24 }}>
      <section className="glass-card" style={{ display: 'grid', gap: 18 }}>
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
          <div>
            <h2 style={{ margin: '4px 0 0', fontSize: 28, fontWeight: 800 }}>Student groups orchestrated by Gemini</h2>
            <p style={{ color: 'var(--text-muted)', marginTop: 8 }}>{metadata}</p>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button
              className="secondary"
              onClick={() => setMode('heterogeneous')}
              style={{ opacity: mode === 'heterogeneous' ? 1 : 0.6 }}
            >
              Heterogeneous
            </button>
            <button
              className="secondary"
              onClick={() => setMode('homogeneous')}
              style={{ opacity: mode === 'homogeneous' ? 1 : 0.6 }}
            >
              Homogeneous
            </button>
          </div>
        </header>
        <div className="chip-row">
          {suggestedChips.map((chip) => (
            <div key={chip} className="chip" onClick={() => handleChip(chip)}>
              {chip}
            </div>
          ))}
        </div>
        <button
          className="primary"
          onClick={handleGenerate}
          disabled={requestLoading || roster.length === 0 || rosterLoading}
        >
          {requestLoading ? 'Generating groups…' : 'Generate instructional groups'}
        </button>
        {info && <div style={{ color: '#bbf7d0' }}>{info}</div>}
        {error && <div style={{ color: '#fecaca' }}>{error}</div>}
      </section>

      <section className="glass-card" style={{ display: 'grid', gap: 18 }}>
        <h3 style={{ margin: 0, fontSize: 22, fontWeight: 700 }}>Recommended groups</h3>
        {insights && displayGroups.length > 0 && (
          <div
            className="glass-subcard"
            style={{
              borderRadius: 14,
              padding: 12,
              background: 'rgba(15, 23, 42, 0.45)',
              border: '1px solid rgba(148,163,184,0.2)',
              display: 'flex',
              flexWrap: 'wrap',
              gap: 16,
              fontSize: 13,
              color: 'var(--text-muted)'
            }}
          >
            <span>
              <strong style={{ color: 'var(--text-primary)' }}>{insights.totalGroups}</strong> cohorts
            </span>
            <span>
              <strong style={{ color: 'var(--text-primary)' }}>{insights.totalStudents}</strong> learners covered
            </span>
            {insights.coveragePercent !== null && (
              <span>{insights.coveragePercent}% readiness coverage</span>
            )}
            <span>
              Extending {insights.readinessBreakdown.extending} • Developing {insights.readinessBreakdown.developing} • Foundation{' '}
              {insights.readinessBreakdown.foundation} • Mixed {insights.readinessBreakdown.unknown}
            </span>
          </div>
        )}
        {groupsLoading ? (
          <div className="empty-state">Loading Gemini cohorts…</div>
        ) : displayGroups.length === 0 ? (
          <div className="empty-state">
            {roster.length === 0
              ? rosterLoading
                ? 'Loading roster…'
                : 'Upload a roster first to unlock grouping suggestions.'
              : 'Run Gemini grouping to populate cohorts.'}
          </div>
        ) : (
          <div style={{ display: 'grid', gap: 18 }}>
            {displayGroups.map((group) => (
              <div key={group.id} style={{ border: '1px solid rgba(148,163,184,0.2)', borderRadius: 18, padding: 18, background: 'rgba(15, 23, 42, 0.55)' }}>
                <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <h4 style={{ margin: '0 0 6px', fontSize: 20 }}>{group.name}</h4>
                    <p style={{ color: 'var(--text-muted)', margin: 0 }}>{group.rationale}</p>
                    {group.source === 'heuristic' && (
                      <span style={{ color: '#fde68a', fontSize: 12 }}>Heuristic fallback</span>
                    )}
                  </div>
                  <span className="tag">{group.students.length} learners</span>
                </header>
                <ul style={{ marginTop: 16, listStyle: 'none', padding: 0, display: 'grid', gap: 8 }}>
                  {group.students.map((student) => (
                    <li
                      key={student.id ?? student.name}
                      style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                    >
                      <span>{student.name}</span>
                      <span style={{ color: 'var(--text-muted)', fontSize: 13 }}>
                        {student.readiness || 'readiness n/a'}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
