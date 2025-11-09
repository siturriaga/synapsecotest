// src/pages/Standards.tsx
import { useEffect, useMemo, useState } from 'react'
import type { User } from 'firebase/auth'
import catalog from '../../data/standards/catalog.json'
import standardDetails from '../../data/standards/details.json'
import { safeFetch } from '../utils/safeFetch'
import { useRosterData } from '../hooks/useRosterData'
import { ensureFirebase } from '../firebase'

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
  assessmentType: 'multiple_choice' | 'reading_plus' | 'matching'
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
    if (!subjects.length) return [] as string[]
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
    const enriched = standards.map((entry) => {
      const detailsForStandard = (standardDetails as Record<string, StandardDetails>)[entry.code] ?? {}
      return {
        ...entry,
        clarifications: Array.isArray(detailsForStandard.clarifications) ? detailsForStandard.clarifications : [],
        objectives: Array.isArray(detailsForStandard.objectives) ? detailsForStandard.objectives : []
      }
    })
    setAvailableStandards(enriched)
    setSelected((current) =>
      enriched.some((standard) => standard.code === current?.code) ? current : null
    )
    setQuizBlueprint(null)
  }, [subjectId, gradeLevel, subjects])

  useEffect(() => {
    setQuizBlueprint(null)
  }, [selected?.code])

  const allQuizQuestions = useMemo<AssessmentQuestion[]>(() => {
    const levels = quizBlueprint?.levels
    if (!Array.isArray(levels)) return []
    // Prevent "reading 'flatMap' of undefined" by guarding every step
    const merged: AssessmentQuestion[] = []
    for (const lvl of levels) {
      if (!lvl || !Array.isArray(lvl.questions)) continue
      for (const q of lvl.questions) {
        if (!q || typeof q.prompt !== 'string') continue
        merged.push(q)
      }
    }
    return merged
  }, [quizBlueprint])

  async function generateQuiz() {
    if (!user || !selected || !subjectId || !gradeLevel) {
      setError('Sign in and complete the subject, grade, and standard selections first.')
      return
    }
    setLoading(true)
    setError(null)
    try {
      const { auth } = ensureFirebase()
      const token = await auth?.currentUser?.getIdToken()

      const aiClassContext =
        aiContext.classContext?.pedagogy || (aiContext.classContext?.groups?.length ?? 0) > 0
          ? aiContext.classContext
          : null

      const response = await safeFetch<AssessmentBlueprint>('/.netlify/functions/generateAssignment', {
        method: 'POST',
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        body: JSON.stringify({
          standardCode: selected.code,
          standardName: selected.name,
          focus: aiContext?.focusNarrative ?? 'Keep the quiz tightly aligned to the selected standard.',
          subject: subjects.find((entry) => entry.id === subjectId)?.label ?? subjectId,
          grade: gradeLevel,
          assessmentType: 'multiple_choice',
          questionCount: 5,
          includeRemediation: false,
          standardClarifications: selected.clarifications ?? [],
          standardObjectives: selected.objectives ?? [],
          classContext: aiClassContext
        })
      })

      // Defensive: ensure reasonable shape before storing
      const safeLevels = Array.isArray(response?.levels) ? response.levels : []
      setQuizBlueprint({
        standardCode: String(response?.standardCode || selected.code),
        standardName: String(response?.standardName || selected.name),
        subject: String(response?.subject || (subjects.find((s) => s.id === subjectId)?.label ?? subjectId)),
        grade: String(response?.grade || gradeLevel),
        assessmentType: (response?.assessmentType as any) || 'multiple_choice',
        questionCount: Number(response?.questionCount || 5),
        aiInsights: {
          overview: String(response?.aiInsights?.overview || ''),
          classStrategies: Array.isArray(response?.aiInsights?.classStrategies)
            ? response.aiInsights!.classStrategies
            : [],
          nextSteps: Array.isArray(response?.aiInsights?.nextSteps) ? response.aiInsights!.nextSteps : []
        },
        levels: safeLevels
      })
    } catch (err: any) {
      console.error(err)
      setError(err?.message ?? 'Gemini lesson generation failed.')
      setQuizBlueprint(null)
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
      {/* Keep your existing UI; just wire generateQuiz to the button */}
      <div style={{ display: 'grid', gap: 12 }}>
        <button onClick={generateQuiz} disabled={loading} className="button button--primary">
          {loading ? 'Generating…' : 'Generate 5-Q quiz'}
        </button>
        {error ? <div style={{ color: 'salmon' }}>{error}</div> : null}
        {quizBlueprint && allQuizQuestions.length === 0 ? (
          <div style={{ color: 'var(--text-muted)' }}>No questions present — try again or adjust your selection.</div>
        ) : null}
      </div>

      {/* Render your blueprint/questions view here as you had before */}
    </div>
  )
}
