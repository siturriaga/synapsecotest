import { useEffect, useMemo, useState } from 'react'
import type { User } from 'firebase/auth'
import catalog from '../../data/standards/catalog.json'
import { safeFetch } from '../utils/safeFetch'

interface StandardsPageProps {
  user: User | null
}

type Standard = {
  code: string
  name: string
}

type Subject = {
  id: string
  label: string
  grades: Record<string, { standards: Standard[] }>
}

type AssessmentQuestion = {
  id: string
  prompt: string
  options?: string[]
  answer: string
  rationale: string
}

type AssessmentLevel = {
  level: string
  description: string
  questions: AssessmentQuestion[]
  remediation: string[]
}

type AssessmentBlueprint = {
  standardCode: string
  standardName: string
  subject: string
  grade: string
  assessmentType: string
  questionCount: number
  aiInsights: {
    overview: string
    classStrategies: string[]
    nextSteps: string[]
  }
  levels: AssessmentLevel[]
}

export default function StandardsEnginePage({ user }: StandardsPageProps) {
  const subjects = useMemo(() => catalog.subjects as Subject[], [])
  const [subjectId, setSubjectId] = useState<string>('')
  const [gradeLevel, setGradeLevel] = useState<string>('')
  const [availableStandards, setAvailableStandards] = useState<Standard[]>([])
  const [selected, setSelected] = useState<Standard | null>(null)
  const [focus, setFocus] = useState('target vocabulary development and conceptual understanding')
  const [blueprint, setBlueprint] = useState<AssessmentBlueprint | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!subjectId || !gradeLevel) {
      setAvailableStandards([])
      setSelected(null)
      return
    }
    const subject = subjects.find((entry) => entry.id === subjectId)
    const standards = subject?.grades?.[gradeLevel]?.standards ?? []
    setAvailableStandards(standards)
    setSelected((current) => (standards.some((standard) => standard.code === current?.code) ? current : null))
  }, [subjectId, gradeLevel, subjects])

  async function generateLesson() {
    if (!user || !selected || !subjectId || !gradeLevel) {
      setError('Sign in and complete the subject, grade, and standard selections first.')
      return
    }
    setLoading(true)
    setError(null)
    try {
      const response = await safeFetch<AssessmentBlueprint>(
        '/.netlify/functions/generateAssignment',
        {
          method: 'POST',
          body: JSON.stringify({
            standardCode: selected.code,
            standardName: selected.name,
            focus,
            subject: subjects.find((entry) => entry.id === subjectId)?.label ?? subjectId,
            grade: gradeLevel,
            assessmentType: 'reading_plus',
            questionCount: 5,
            includeRemediation: true
          })
        }
      )
      setBlueprint(response)
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
        <h2 style={{ margin: '12px 0 6px', fontSize: 28, fontWeight: 800 }}>Browse standards by subject and grade</h2>
        <p style={{ color: 'var(--text-muted)' }}>
          Select a subject and grade level to reveal the appropriate standards, then launch AI-generated assignments from the same workflow used on the assignments page.
        </p>
        <div style={{ display: 'grid', gap: 16, marginTop: 18 }}>
          <div className="field">
            <label htmlFor="standards-subject">Subject</label>
            <select
              id="standards-subject"
              name="standards-subject"
              value={subjectId}
              onChange={(event) => setSubjectId(event.target.value)}
            >
              <option value="">Select a subject</option>
              {subjects.map((subject) => (
                <option key={subject.id} value={subject.id}>
                  {subject.label}
                </option>
              ))}
            </select>
          </div>
          <div className="field">
            <label htmlFor="standards-grade">Grade level</label>
            <select
              id="standards-grade"
              name="standards-grade"
              value={gradeLevel}
              onChange={(event) => setGradeLevel(event.target.value)}
              disabled={!subjectId}
            >
              <option value="">Select grade 6, 7, or 8</option>
              {['6', '7', '8'].map((grade) => (
                <option key={grade} value={grade}>
                  Grade {grade}
                </option>
              ))}
            </select>
          </div>
        </div>
        {availableStandards.length > 0 ? (
          <div style={{ display: 'grid', gap: 14, marginTop: 18 }}>
            {availableStandards.map((standard) => (
              <button
                key={standard.code}
                className="secondary"
                style={{
                  justifyContent: 'flex-start',
                  textAlign: 'left',
                  padding: '14px 18px',
                  background:
                    blueprint?.standardCode === standard.code || selected?.code === standard.code
                      ? 'rgba(99,102,241,0.18)'
                      : 'rgba(15,23,42,0.65)'
                }}
                onClick={() => setSelected(standard)}
              >
                <span style={{ fontWeight: 700 }}>{standard.code}</span>
                <span style={{ display: 'block', marginTop: 6, fontSize: 14, color: 'var(--text-muted)' }}>{standard.name}</span>
              </button>
            ))}
          </div>
        ) : (
          <div className="empty-state" style={{ marginTop: 18 }}>
            Choose a subject and grade to load standards.
          </div>
        )}
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
          {loading ? 'Generating blueprint…' : 'Generate AI blueprint'}
        </button>
        {error && <div style={{ color: '#fecaca' }}>{error}</div>}
        {blueprint && (
          <div style={{ display: 'grid', gap: 18 }}>
            <div>
              <div className="badge">AI overview</div>
              <h4 style={{ margin: '10px 0 0', fontSize: 20 }}>{blueprint.standardCode} · {blueprint.assessmentType.replace(/_/g, ' ')}</h4>
              <p style={{ color: 'var(--text-muted)' }}>{blueprint.aiInsights.overview}</p>
            </div>
            <div className="glass-subcard" style={{ border: '1px solid rgba(148,163,184,0.25)', borderRadius: 18, padding: 18, background: 'rgba(15,23,42,0.55)' }}>
              <strong>Class strategies</strong>
              <ul style={{ margin: '8px 0 0 18px' }}>
                {blueprint.aiInsights.classStrategies.map((strategy, index) => (
                  <li key={index}>{strategy}</li>
                ))}
              </ul>
              <strong style={{ display: 'block', marginTop: 12 }}>Next steps</strong>
              <ul style={{ margin: '8px 0 0 18px' }}>
                {blueprint.aiInsights.nextSteps.map((step, index) => (
                  <li key={index}>{step}</li>
                ))}
              </ul>
            </div>
            {blueprint.levels.map((level) => (
              <article key={level.level} style={{ border: '1px solid rgba(148,163,184,0.2)', borderRadius: 18, padding: 18, background: 'rgba(15,23,42,0.6)' }}>
                <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <h5 style={{ margin: 0, fontSize: 18 }}>{level.level}</h5>
                    <p style={{ color: 'var(--text-muted)', marginTop: 4 }}>{level.description}</p>
                  </div>
                  <span className="tag">Differentiated</span>
                </header>
                <div style={{ marginTop: 12, display: 'grid', gap: 12 }}>
                  {level.questions.map((question) => (
                    <div key={question.id} style={{ border: '1px solid rgba(99,102,241,0.25)', borderRadius: 12, padding: 12 }}>
                      <strong>Prompt:</strong>
                      <p style={{ margin: '8px 0', color: 'var(--text-muted)' }}>{question.prompt}</p>
                      {question.options && (
                        <ol style={{ margin: '0 0 0 18px' }}>
                          {question.options.map((option, index) => (
                            <li key={index}>{option}</li>
                          ))}
                        </ol>
                      )}
                      <div style={{ marginTop: 8 }}>
                        <strong>Answer:</strong> {question.answer}
                      </div>
                      <div style={{ marginTop: 4, color: 'var(--text-muted)' }}>Why: {question.rationale}</div>
                    </div>
                  ))}
                </div>
                {level.remediation.length > 0 && (
                  <div style={{ marginTop: 12 }}>
                    <strong>Remediation ideas</strong>
                    <ul style={{ margin: '8px 0 0 18px' }}>
                      {level.remediation.map((tip, index) => (
                        <li key={index}>{tip}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
