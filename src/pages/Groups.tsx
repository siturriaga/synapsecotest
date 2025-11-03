import { useMemo, useState } from 'react'
import type { User } from 'firebase/auth'
import { safeFetch } from '../utils/safeFetch'
import { useRosterData } from '../hooks/useRosterData'
import { AssistedHint } from '../components/core/AssistedHint'

type Student = {
  id: string
  name: string
  period?: number | null
  quarter?: string | null
  readiness?: string | null
  score?: number | null
}

type Group = {
  id: string
  name: string
  rationale: string
  students: Student[]
}

function describeReadiness(score: number | null): string | null {
  if (score === null || Number.isNaN(score)) return null
  if (score >= 85) return `Extending mastery (${Math.round(score)}%)`
  if (score >= 70) return `Developing understanding (${Math.round(score)}%)`
  return `Foundation support needed (${Math.round(score)}%)`
}

export default function StudentGroupsPage({ user }: { user: User | null }) {
  const { students, records, loading: rosterLoading } = useRosterData()
  const roster = useMemo<Student[]>(() => {
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

    const deduped = new Map<string, Student>()
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
  const [loading, setLoading] = useState(false)
  const [groups, setGroups] = useState<Group[]>([])
  const [mode, setMode] = useState<'heterogeneous' | 'homogeneous'>('heterogeneous')
  const [error, setError] = useState<string | null>(null)
  const [suggestedChips, setSuggestedChips] = useState<string[]>([])

  const metadata = useMemo(() => {
    if (roster.length === 0) return rosterLoading ? 'Loading roster…' : 'No roster loaded'
    const periods = new Set(roster.map((s) => s.period).filter(Boolean))
    const quarters = new Set(roster.map((s) => s.quarter).filter(Boolean))
    return `${roster.length} students • Periods ${Array.from(periods).join(', ') || 'n/a'} • Quarters ${Array.from(quarters).join(', ') || 'n/a'}`
  }, [roster, rosterLoading])

  async function handleGenerate() {
    if (!user) {
      setError('Sign in to access Gemini grouping.')
      return
    }
    if (roster.length === 0) {
      setError('Upload a roster first to unlock grouping suggestions.')
      return
    }
    setLoading(true)
    setError(null)
    try {
      const response = await safeFetch<{ groups: Group[]; promptChips?: string[] }>(
        '/.netlify/functions/groupStudents',
        {
          method: 'POST',
          body: JSON.stringify({ mode })
        }
      )
      setGroups(response.groups)
      if (response.promptChips && response.promptChips.length) {
        setSuggestedChips(response.promptChips)
      }
    } catch (err: any) {
      console.error(err)
      setError(err?.message ?? 'Gemini grouping failed. Check logs for details.')
    } finally {
      setLoading(false)
    }
  }

  async function handleChip(chip: string) {
    if (roster.length === 0) {
      setError('Upload a roster first to unlock grouping suggestions.')
      return
    }
    setLoading(true)
    setError(null)
    try {
      const response = await safeFetch<{ groups: Group[] }>(
        '/.netlify/functions/groupStudents',
        {
          method: 'POST',
          body: JSON.stringify({ mode, refinement: chip })
        }
      )
      setGroups(response.groups)
    } catch (err: any) {
      console.error(err)
      setError(err?.message ?? 'Unable to refine groups.')
    } finally {
      setLoading(false)
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
            <div className="badge">AI grouping</div>
            <h2 style={{ margin: '12px 0 0', fontSize: 28, fontWeight: 800 }}>Student groups orchestrated by Gemini</h2>
            <p style={{ color: 'var(--text-muted)', marginTop: 8 }}>{metadata}</p>
            <AssistedHint
              id="groups-upload-roster"
              message="Upload a mastery roster so Synapse can analyze readiness and unlock Gemini grouping."
              show={roster.length === 0 && !rosterLoading}
            />
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
          disabled={loading || roster.length === 0 || rosterLoading}
        >
          {loading ? 'Generating groups…' : 'Generate instructional groups'}
        </button>
        <AssistedHint
          id="groups-generate"
          message="Choose heterogeneous or homogeneous to shape the grouping logic, then tap Generate for AI recommendations."
          show={!loading && roster.length > 0 && groups.length === 0}
        />
        {error && <div style={{ color: '#fecaca' }}>{error}</div>}
      </section>

      <section className="glass-card" style={{ display: 'grid', gap: 18 }}>
        <h3 style={{ margin: 0, fontSize: 22, fontWeight: 700 }}>Recommended groups</h3>
        {groups.length === 0 ? (
          <div className="empty-state">
            {roster.length === 0
              ? rosterLoading
                ? 'Loading roster…'
                : 'Upload a roster first to unlock grouping suggestions.'
              : 'Run Gemini grouping to populate cohorts.'}
          </div>
        ) : (
          <div style={{ display: 'grid', gap: 18 }}>
            {groups.map((group) => (
              <div key={group.id} style={{ border: '1px solid rgba(148,163,184,0.2)', borderRadius: 18, padding: 18, background: 'rgba(15, 23, 42, 0.55)' }}>
                <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <h4 style={{ margin: '0 0 6px', fontSize: 20 }}>{group.name}</h4>
                    <p style={{ color: 'var(--text-muted)', margin: 0 }}>{group.rationale}</p>
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
