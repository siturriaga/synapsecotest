import { useEffect, useMemo, useState } from 'react'
import type { User } from 'firebase/auth'
import catalog from '../../data/standards/catalog.json'
import standardDetails from '../../data/standards/details.json'
import { safeFetch } from '../utils/safeFetch'

interface StandardsPageProps {
  user: User | null
}

type Standard = {
  code: string
  name: string
  clarifications?: string[]
  objectives?: string[]
}

type StandardDetails = {
  clarifications?: string[]
  objectives?: string[]
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

  const gradeOptions = useMemo(() => {
    if (!subjects.length) {
      return [] as string[]
    }
    if (subjectId) {
      const subject = subjects.find((entry) => entry.id === subjectId)
      return Object.keys(subject?.grades ?? {}).sort((a, b) => Number(a) - Number(b))
    }
    const allGrades = new Set<string>()
    subjects.forEach((subject) => {
      Object.keys(subject.grades ?? {}).forEach((grade) => allGrades.add(grade))
    })
    return Array.from(allGrades).sort((a, b) => Number(a) - Number(b))
  }, [subjectId, subjects])

  useEffect(() => {
    if (!subjectId || !gradeLevel) {
      setAvailableStandards([])
      setSelected(null)
      return
    }
    const subject = subjects.find((entry) => entry.id === subjectId)
    if (!subject?.grades?.[gradeLevel]) {
      setAvailableStandards([])
      setSelected(null)
      setGradeLevel('')
      return
    }
    const standards = subject.grades[gradeLevel]?.standards ?? []
    const enrichedStandards = standards.map((entry) => {
      const detailsForStandard = (standardDetails as Record<string, StandardDetails>)[entry.code] ?? {}
      return {
        ...entry,
        clarifications: Array.isArray(detailsForStandard.clarifications)
          ? detailsForStandard.clarifications
          : [],
        objectives: Array.isArray(detailsForStandard.objectives) ? detailsForStandard.objectives : []
      }
    })
    setAvailableStandards(enrichedStandards)
    setSelected((current) =>
      enrichedStandards.some((standard) => standard.code === current?.code) ? current : null
    )
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
            includeRemediation: true,
            standardClarifications: selected.clarifications ?? [],
            standardObjectives: selected.objectives ?? []
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
        <h2 style={{ margin: '4px 0 6px', fontSize: 28, fontWeight: 800 }}>Browse standards by subject and grade</h2>
        <p style={{ color: 'var(--text-muted)' }}>Pick a subject, choose the grade, then select the standard you want to target.</p>
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
              disabled={!subjectId || gradeOptions.length === 0}
            >
              <option value="">{subjectId ? 'Select a grade level' : 'Select a subject first'}</option>
              {gradeOptions.map((grade) => (
                <option key={grade} value={grade}>
                  Grade {grade}
                </option>
              ))}
            </select>
          </div>
        </div>
        {availableStandards.length > 0 ? (
          <div style={{ display: 'grid', gap: 12, marginTop: 18 }}>
            <div className="field">
              <label htmlFor="standards-code">Standard</label>
              <select
                id="standards-code"
                name="standards-code"
                value={selected?.code ?? ''}
                onChange={(event) => {
                  const next = availableStandards.find((entry) => entry.code === event.target.value) ?? null
                  setSelected(next)
                }}
              >
                <option value="">Select a standard</option>
                {availableStandards.map((standard) => (
                  <option key={standard.code} value={standard.code}>
                    {standard.code} — {standard.name}
                  </option>
                ))}
              </select>
            </div>
            {selected && (
              <div
                className="glass-subcard"
                style={{ border: '1px solid rgba(148,163,184,0.25)', borderRadius: 18, padding: 18, background: 'rgba(15,23,42,0.55)' }}
              >
                <strong>{selected.code}</strong>
                <p style={{ margin: '8px 0 0', color: 'var(--text-muted)' }}>{selected.name}</p>
              </div>
            )}
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
              <h4 style={{ margin: '6px 0 0', fontSize: 20 }}>{blueprint.standardCode} · {blueprint.assessmentType.replace(/_/g, ' ')}</h4>
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
