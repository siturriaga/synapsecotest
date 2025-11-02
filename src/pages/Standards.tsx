import { useMemo, useState } from 'react'
import type { User } from 'firebase/auth'
import data from '../../data/standards/standards.json'
import { safeFetch } from '../utils/safeFetch'

interface StandardsPageProps {
  user: User | null
}

type Standard = {
  code: string
  name: string
}

type GeminiLesson = {
  tier: string
  objective: string
  activities: string[]
  checks: string[]
  materials: string[]
  rationale: string
}

type GeminiResponse = {
  standardCode: string
  summary: string
  tiers: GeminiLesson[]
}

export default function StandardsEnginePage({ user }: StandardsPageProps) {
  const [selected, setSelected] = useState<Standard | null>(data.standards[0] as Standard)
  const [focus, setFocus] = useState('problem solving with rational numbers')
  const [lesson, setLesson] = useState<GeminiResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const standards = useMemo(() => data.standards as Standard[], [])

  async function generateLesson() {
    if (!user || !selected) {
      setError('Sign in and select a standard first.')
      return
    }
    setLoading(true)
    setError(null)
    try {
      const response = await safeFetch<GeminiResponse>(
        '/.netlify/functions/generateAssignment',
        {
          method: 'POST',
          body: JSON.stringify({
            standardCode: selected.code,
            standardName: selected.name,
            focus,
            subject: data.subject,
            grade: data.grade
          })
        }
      )
      setLesson(response)
    } catch (err: any) {
      console.error(err)
      setError(err?.message ?? 'Gemini lesson generation failed.')
    } finally {
      setLoading(false)
    }
  }

  if (!user) {
    return (
      <div className="glass-card fade-in">
        <h2 style={{ margin: 0, fontSize: 26, fontWeight: 800 }}>Authenticate to generate lessons</h2>
        <p style={{ color: 'var(--text-muted)' }}>
          Your selections are processed securely via Netlify Functions with Gemini.
        </p>
      </div>
    )
  }

  return (
    <div className="fade-in" style={{ display: 'grid', gap: 24 }}>
      <section className="glass-card">
        <div className="badge">Standards library</div>
        <h2 style={{ margin: '12px 0 6px', fontSize: 28, fontWeight: 800 }}>Grade {data.grade} {data.subject} standards</h2>
        <p style={{ color: 'var(--text-muted)' }}>Version {data.version}. Select a standard below to generate a differentiated lesson.</p>
        <div style={{ display: 'grid', gap: 14, marginTop: 18 }}>
          {standards.map((standard) => (
            <button
              key={standard.code}
              className="secondary"
              style={{ justifyContent: 'flex-start', textAlign: 'left', padding: '14px 18px', background: lesson?.standardCode === standard.code ? 'rgba(99,102,241,0.18)' : 'rgba(15,23,42,0.65)' }}
              onClick={() => setSelected(standard)}
            >
              <span style={{ fontWeight: 700 }}>{standard.code}</span>
              <span style={{ display: 'block', marginTop: 6, fontSize: 14, color: 'var(--text-muted)' }}>{standard.name}</span>
            </button>
          ))}
        </div>
      </section>

      <section className="glass-card" style={{ display: 'grid', gap: 18 }}>
        <h3 style={{ margin: 0, fontSize: 24, fontWeight: 700 }}>Differentiated lesson brief</h3>
        <div className="field">
          <label htmlFor="standard-focus">Instructional focus</label>
          <input
            id="standard-focus"
            name="standard-focus"
            value={focus}
            onChange={(event) => setFocus(event.target.value)}
            placeholder="e.g., connect to career pathways"
          />
        </div>
        <button className="primary" onClick={generateLesson} disabled={loading}>
          {loading ? 'Generating lesson…' : 'Generate Gemini lesson plan'}
        </button>
        {error && <div style={{ color: '#fecaca' }}>{error}</div>}
        {lesson && (
          <div style={{ display: 'grid', gap: 18 }}>
            <div>
              <div className="badge">Overview</div>
              <h4 style={{ margin: '10px 0 0', fontSize: 20 }}>{lesson.standardCode}</h4>
              <p style={{ color: 'var(--text-muted)' }}>{lesson.summary}</p>
            </div>
            {lesson.tiers.map((tier) => (
              <article key={tier.tier} style={{ border: '1px solid rgba(148,163,184,0.2)', borderRadius: 18, padding: 18, background: 'rgba(15,23,42,0.6)' }}>
                <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <h5 style={{ margin: 0, fontSize: 18 }}>{tier.tier}</h5>
                    <p style={{ color: 'var(--text-muted)', marginTop: 4 }}>{tier.objective}</p>
                  </div>
                  <span className="tag">Differentiated</span>
                </header>
                <div style={{ marginTop: 12 }}>
                  <strong>Learning pathway</strong>
                  <ul style={{ margin: '8px 0 0 18px' }}>
                    {tier.activities.map((activity, index) => (
                      <li key={index}>{activity}</li>
                    ))}
                  </ul>
                </div>
                <div style={{ marginTop: 12 }}>
                  <strong>Checks for understanding</strong>
                  <ul style={{ margin: '8px 0 0 18px' }}>
                    {tier.checks.map((check, index) => (
                      <li key={index}>{check}</li>
                    ))}
                  </ul>
                </div>
                <div style={{ marginTop: 12 }}>
                  <strong>Materials</strong>
                  <ul style={{ margin: '8px 0 0 18px' }}>
                    {tier.materials.map((material, index) => (
                      <li key={index}>{material}</li>
                    ))}
                  </ul>
                </div>
                <p style={{ color: 'var(--text-muted)', marginTop: 12 }}>{tier.rationale}</p>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
