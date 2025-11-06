import { useEffect, useMemo, useState } from 'react'
import type { User } from 'firebase/auth'
import catalog from '../../data/standards/catalog.json'
import standardDetails from '../../data/standards/details.json'
import { safeFetch } from '../utils/safeFetch'
import { useRosterData } from '../hooks/useRosterData'

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
  const [quizBlueprint, setQuizBlueprint] = useState<AssessmentBlueprint | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { aiContext } = useRosterData()

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
    setQuizBlueprint(null)
  }, [subjectId, gradeLevel, subjects])

  useEffect(() => {
    setQuizBlueprint(null)
  }, [selected?.code])

  const allQuizQuestions = useMemo(() => {
    if (!quizBlueprint) return [] as AssessmentQuestion[]
    return quizBlueprint.levels.flatMap((level) => level.questions)
  }, [quizBlueprint])

  async function generateQuiz() {
    if (!user || !selected || !subjectId || !gradeLevel) {
      setError('Sign in and complete the subject, grade, and standard selections first.')
      return
    }
    setLoading(true)
    setError(null)
    try {
      const aiClassContext =
        aiContext.classContext.pedagogy || aiContext.classContext.groups.length
          ? aiContext.classContext
          : null
      const focusPayload = aiContext.focusNarrative?.trim()
        ? aiContext.focusNarrative.trim()
        : 'Keep the quiz aligned to the selected standard.'
      const response = await safeFetch<AssessmentBlueprint>(
        '/.netlify/functions/generateAssignment',
        {
          method: 'POST',
          body: JSON.stringify({
            standardCode: selected.code,
            standardName: selected.name,
            focus: focusPayload,
            subject: subjects.find((entry) => entry.id === subjectId)?.label ?? subjectId,
            grade: gradeLevel,
            assessmentType: 'multiple_choice',
            questionCount: 5,
            includeRemediation: false,
            standardClarifications: selected.clarifications ?? [],
            standardObjectives: selected.objectives ?? [],
            classContext: aiClassContext
          })
        }
      )
      setQuizBlueprint(response)
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

      {selected && (
        <section className="glass-card" style={{ display: 'grid', gap: 18 }}>
          <h3 style={{ margin: 0, fontSize: 24, fontWeight: 700 }}>AI quiz builder</h3>
          <p style={{ margin: 0, color: 'var(--text-muted)' }}>
            Generate a five-question quiz aligned to {selected.code}. Gemini reviews the standard’s objectives behind the scenes
            to keep every item on target.
          </p>
          <button className="primary" onClick={generateQuiz} disabled={loading}>
            {loading ? 'Generating quiz…' : 'Generate quiz'}
          </button>
          {error && <div style={{ color: '#fecaca' }}>{error}</div>}
          {quizBlueprint && (
            <div style={{ display: 'grid', gap: 16 }}>
              <div>
                <h4 style={{ margin: '6px 0 0', fontSize: 20 }}>
                  {quizBlueprint.standardCode} · {quizBlueprint.assessmentType.replace(/_/g, ' ')}
                </h4>
                <p style={{ color: 'var(--text-muted)' }}>{quizBlueprint.aiInsights.overview}</p>
              </div>
              <ol style={{ margin: '0 0 0 18px', display: 'grid', gap: 12 }}>
                {allQuizQuestions.map((question, index) => (
                  <li
                    key={`${question.id}-${index}`}
                    style={{
                      border: '1px solid rgba(99,102,241,0.3)',
                      borderRadius: 12,
                      padding: 14,
                      background: 'rgba(15,23,42,0.55)',
                      listStylePosition: 'outside'
                    }}
                  >
                    <strong style={{ display: 'block' }}>Prompt</strong>
                    <p style={{ margin: '8px 0', color: 'var(--text-muted)' }}>{question.prompt}</p>
                    {question.options && (
                      <ol style={{ margin: '0 0 0 18px' }}>
                        {question.options.map((option, choiceIndex) => (
                          <li key={choiceIndex}>{option}</li>
                        ))}
                      </ol>
                    )}
                    <div style={{ marginTop: 8 }}>
                      <strong>Answer:</strong> {question.answer}
                    </div>
                    <div style={{ marginTop: 4, color: 'var(--text-muted)' }}>Why: {question.rationale}</div>
                  </li>
                ))}
              </ol>
            </div>
          )}
        </section>
      )}
    </div>
  )
}
