import { useEffect, useMemo, useState } from 'react'
import type { User } from 'firebase/auth'
import catalog from '../../data/standards/catalog.json'
import standardDetails from '../../data/standards/details.json'
import { safeFetch } from '../utils/safeFetch'
import { useRosterData } from '../hooks/useRosterData'

interface StandardsPageProps {
  user: User | null
}

/* ---------- Types (defensive & flexible) ---------- */
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
  standardCode?: string
  standardName?: string
  subject?: string
  grade?: string
  assessmentType?: string
  questionCount?: number
  aiInsights?: {
    overview?: string
    classStrategies?: string[]
    nextSteps?: string[]
  }
  levels?: AssessmentLevel[]
}

/* ---------- Component ---------- */
export default function StandardsEnginePage({ user }: StandardsPageProps) {
  const subjects = useMemo(() => (catalog as any).subjects as Subject[], [])
  const [subjectId, setSubjectId] = useState<string>('')
  const [gradeLevel, setGradeLevel] = useState<string>('')
  const [availableStandards, setAvailableStandards] = useState<Standard[]>([])
  const [selected, setSelected] = useState<Standard | null>(null)
  const [quizBlueprint, setQuizBlueprint] = useState<AssessmentBlueprint | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { aiContext } = useRosterData()

  /* ---------- Grade select options ---------- */
  const gradeOptions = useMemo(() => {
    if (!subjects.length) return [] as string[]
    if (subjectId) {
      const subject = subjects.find((entry) => entry.id === subjectId)
      return Object.keys(subject?.grades ?? {}).sort((a, b) => Number(a) - Number(b))
    }
    const allGrades = new Set<string>()
    subjects.forEach((subj) => {
      Object.keys(subj.grades ?? {}).forEach((g) => allGrades.add(g))
    })
    return Array.from(allGrades).sort((a, b) => Number(a) - Number(b))
  }, [subjectId, subjects])

  /* ---------- Subject/Grade change => load standards with details ---------- */
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
    const enriched = standards.map((entry) => {
      const details = (standardDetails as Record<string, StandardDetails>)[entry.code] ?? {}
      return {
        ...entry,
        clarifications: Array.isArray(details.clarifications) ? details.clarifications : [],
        objectives: Array.isArray(details.objectives) ? details.objectives : []
      }
    })
    setAvailableStandards(enriched)
    setSelected((current) => (enriched.some((s) => s.code === current?.code) ? current : null))
    setQuizBlueprint(null)
  }, [subjectId, gradeLevel, subjects])

  /* ---------- Standard change => clear blueprint ---------- */
  useEffect(() => {
    setQuizBlueprint(null)
  }, [selected?.code])

  /* ---------- Safely flatten quiz questions (prevents undefined.flatMap) ---------- */
  const allQuizQuestions = useMemo<AssessmentQuestion[]>(() => {
    if (!quizBlueprint || !Array.isArray(quizBlueprint.levels)) return []
    const safeLevels = quizBlueprint.levels.filter(
      (lvl): lvl is AssessmentLevel =>
        !!lvl && Array.isArray(lvl.questions) && Array.isArray(lvl.remediation)
    )
    return safeLevels.flatMap((lvl) => lvl.questions ?? [])
  }, [quizBlueprint])

  /* ---------- Generate quiz via Netlify function (defensive payload) ---------- */
  async function generateQuiz() {
    if (!user || !selected || !subjectId || !gradeLevel) {
      setError('Sign in and complete the subject, grade, and standard selections first.')
      return
    }
    setLoading(true)
    setError(null)
    try {
      // Only include context if it actually has content
      const classCtx =
        aiContext?.classContext &&
        (aiContext.classContext.pedagogy || (aiContext.classContext.groups?.length ?? 0) > 0)
          ? aiContext.classContext
          : null

      const focusPayload =
        aiContext?.focusNarrative?.trim() || 'Keep the quiz tightly aligned to the chosen standard.'

      const resp = await safeFetch<AssessmentBlueprint>('/.netlify/functions/generateAssignment', {
        method: 'POST',
        body: JSON.stringify({
          standardCode: selected.code,
          standardName: selected.name,
          focus: focusPayload,
          subject: subjects.find((s) => s.id === subjectId)?.label ?? subjectId,
          grade: gradeLevel,
          assessmentType: 'multiple_choice',
          questionCount: 5,
          includeRemediation: false,
          standardClarifications: selected.clarifications ?? [],
          standardObjectives: selected.objectives ?? [],
          classContext: classCtx
        })
      })

      // Normalize shape so UI is never surprised
      const normalized: AssessmentBlueprint = {
        standardCode: resp?.standardCode ?? selected.code,
        standardName: resp?.standardName ?? selected.name,
        subject: resp?.subject ?? (subjects.find((s) => s.id === subjectId)?.label ?? subjectId),
        grade: resp?.grade ?? gradeLevel,
        assessmentType: resp?.assessmentType ?? 'multiple_choice',
        questionCount: Number.isFinite(resp?.questionCount as number) ? (resp?.questionCount as number) : 5,
        aiInsights: {
          overview: resp?.aiInsights?.overview ?? '',
          classStrategies: Array.isArray(resp?.aiInsights?.classStrategies)
            ? resp!.aiInsights!.classStrategies
            : [],
          nextSteps: Array.isArray(resp?.aiInsights?.nextSteps) ? resp!.aiInsights!.nextSteps : []
        },
        levels: Array.isArray(resp?.levels)
          ? resp!.levels
              .filter(Boolean)
              .map((lvl) => ({
                level: lvl?.level ?? 'Level',
                description: lvl?.description ?? '',
                questions: Array.isArray(lvl?.questions) ? lvl!.questions.filter(Boolean) : [],
                remediation: Array.isArray(lvl?.remediation) ? lvl!.remediation.filter(Boolean) : []
              }))
          : []
      }

      setQuizBlueprint(normalized)
    } catch (err: any) {
      console.error(err)
      setError(err?.message ?? 'Gemini lesson generation failed.')
    } finally {
      setLoading(false)
    }
  }

  /* ---------- Render ---------- */
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

        {/* Controls */}
        <div style={{ display: 'grid', gap: 12, gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
          <label style={{ display: 'grid', gap: 6 }}>
            <span className="toolbar-label">Subject</span>
            <select
              value={subjectId}
              onChange={(e) => setSubjectId(e.target.value)}
              className="toolbar-toggle"
              aria-label="Choose subject"
            >
              <option value="">— Select —</option>
              {subjects.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.label}
                </option>
              ))}
            </select>
          </label>

          <label style={{ display: 'grid', gap: 6 }}>
            <span className="toolbar-label">Grade</span>
            <select
              value={gradeLevel}
              onChange={(e) => setGradeLevel(e.target.value)}
              className="toolbar-toggle"
              aria-label="Choose grade"
              disabled={!subjectId}
            >
              <option value="">— Select —</option>
              {gradeOptions.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
          </label>

          <label style={{ display: 'grid', gap: 6 }}>
            <span className="toolbar-label">Standard</span>
            <select
              value={selected?.code ?? ''}
              onChange={(e) => {
                const next = availableStandards.find((st) => st.code === e.target.value) ?? null
                setSelected(next)
              }}
              className="toolbar-toggle"
              aria-label="Choose standard"
              disabled={!subjectId || !gradeLevel}
            >
              <option value="">— Select —</option>
              {availableStandards.map((st) => (
                <option key={st.code} value={st.code}>
                  {st.code} — {st.name}
                </option>
              ))}
            </select>
          </label>

          <button
            type="button"
            className="toolbar-toggle"
            onClick={generateQuiz}
            disabled={!selected || !subjectId || !gradeLevel || loading}
            aria-busy={loading}
            aria-disabled={!selected || !subjectId || !gradeLevel || loading}
            title="Generate a 5-question quiz for the selected standard"
          >
            {loading ? 'Generating…' : 'Generate quiz'}
          </button>
        </div>

        {/* Status */}
        {error && (
          <div role="alert" className="rail-card rail-card--empty" style={{ marginTop: 12 }}>
            <strong>Generation error</strong>
            <span>{error}</span>
          </div>
        )}
      </section>

      {/* Blueprint Preview */}
      {quizBlueprint && (
        <section className="glass-card" aria-live="polite">
          <h3 style={{ margin: '0 0 8px', fontSize: 22, fontWeight: 800 }}>
            {quizBlueprint.standardCode} · {quizBlueprint.standardName}
          </h3>
          <p style={{ margin: 0, color: 'var(--text-muted)' }}>
            {quizBlueprint.subject} • Grade {quizBlueprint.grade} • {quizBlueprint.assessmentType} •{' '}
            {quizBlueprint.questionCount} questions
          </p>

          {/* AI insights (guarded) */}
          {(quizBlueprint.aiInsights?.overview ||
            (quizBlueprint.aiInsights?.classStrategies?.length ?? 0) > 0 ||
            (quizBlueprint.aiInsights?.nextSteps?.length ?? 0) > 0) && (
            <div className="rail-card" style={{ marginTop: 16 }}>
              {quizBlueprint.aiInsights?.overview && <p style={{ margin: 0 }}>{quizBlueprint.aiInsights.overview}</p>}
              {(quizBlueprint.aiInsights?.classStrategies?.length ?? 0) > 0 && (
                <div>
                  <strong>Class strategies</strong>
                  <ul>
                    {quizBlueprint.aiInsights!.classStrategies!.map((s, i) => (
                      <li key={i}>{s}</li>
                    ))}
                  </ul>
                </div>
              )}
              {(quizBlueprint.aiInsights?.nextSteps?.length ?? 0) > 0 && (
                <div>
                  <strong>Next steps</strong>
                  <ul>
                    {quizBlueprint.aiInsights!.nextSteps!.map((s, i) => (
                      <li key={i}>{s}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Questions list */}
          <div style={{ display: 'grid', gap: 12, marginTop: 16 }}>
            {allQuizQuestions.length === 0 ? (
              <div className="rail-card rail-card--empty">
                <strong>No questions present</strong>
                <span>Try generating again or adjust your selection.</span>
              </div>
            ) : (
              allQuizQuestions.map((q, idx) => (
                <div key={q.id ?? `q-${idx}`} className="rail-card">
                  <strong>
                    Q{idx + 1}. {q.prompt}
                  </strong>
                  {Array.isArray(q.options) && q.options.length > 0 && (
                    <ol type="A" style={{ margin: 0, paddingLeft: 20 }}>
                      {q.options.map((opt, oi) => (
                        <li key={oi}>{opt}</li>
                      ))}
                    </ol>
                  )}
                  <em>Answer:</em> {q.answer}
                  {q.rationale && (
                    <span>
                      <br />
                      <em>Why:</em> {q.rationale}
                    </span>
                  )}
                </div>
              ))
            )}
          </div>
        </section>
      )}
    </div>
  )
}
