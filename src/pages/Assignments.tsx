// src/pages/Assignments.tsx
import { useEffect, useMemo, useState } from 'react'
import type { User } from 'firebase/auth'
import {
  Timestamp,
  addDoc,
  collection,
  deleteDoc,
  doc,
  getFirestore,
  onSnapshot,
  updateDoc
} from 'firebase/firestore'
import catalog from '../../data/standards/catalog.json'
import standardDetails from '../../data/standards/details.json'

type StandardDetails = {
  clarifications?: string[]
  objectives?: string[]
}
import { safeFetch } from '../utils/safeFetch'
import { ensureFirebase } from '../firebase'
import { useRosterData } from '../hooks/useRosterData'

interface AssignmentsPageProps {
  user: User | null
}

type Standard = {
  code: string
  name: string
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

type PedagogyFocus = {
  summary: string
  bestPractices: string[]
  reflectionPrompts: string[]
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
    pedagogy?: PedagogyFocus
  }
  levels: AssessmentLevel[]
}

type Assignment = {
  id: string
  title: string
  status: 'draft' | 'assigned' | 'completed'
  dueDate?: string
  blueprint?: AssessmentBlueprint
  createdAt?: string | null
  // persist a few top-level fields for filters
  standardCode?: string | null
  assessmentType?: string | null
  questionCount?: number | null
}

const ASSESSMENT_TYPES = [
  { value: 'multiple_choice', label: 'Multiple choice quiz' },
  { value: 'reading_plus', label: 'Reading plus text-dependent questions' },
  { value: 'matching', label: 'Matching definitions to concepts' }
] as const

export default function AssignmentsPage({ user }: AssignmentsPageProps) {
  const subjects = useMemo(() => catalog.subjects as Subject[], [])
  const [subjectId, setSubjectId] = useState('')
  const [gradeLevel, setGradeLevel] = useState('')
  const [standardCode, setStandardCode] = useState('')
  const [availableStandards, setAvailableStandards] = useState<Standard[]>([])
  const [assessmentType, setAssessmentType] = useState<(typeof ASSESSMENT_TYPES)[number]['value']>('multiple_choice')
  const [questionCount, setQuestionCount] = useState(5)
  const [title, setTitle] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [includeRemediation, setIncludeRemediation] = useState(true)
  const [statusMessage, setStatusMessage] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const [assignments, setAssignments] = useState<Assignment[]>([])
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
      setStandardCode('')
      return
    }
    const subject = subjects.find((entry) => entry.id === subjectId)
    if (!subject?.grades?.[gradeLevel]) {
      setAvailableStandards([])
      setStandardCode('')
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
    if (!standards.some((entry) => entry.code === standardCode)) {
      setStandardCode(standards[0]?.code ?? '')
    }
  }, [subjectId, gradeLevel, subjects, standardCode])

  useEffect(() => {
    if (!user) {
      setAssignments([])
      return
    }
    const { app } = ensureFirebase()
    if (!app) {
      setStatusMessage('Workspace storage is offline. Assignments will load when Firestore is configured.')
      setAssignments([])
      return
    }
    const database = getFirestore(app)
    const q = collection(database, `users/${user.uid}/assignments`)
    const unsub = onSnapshot(q, (snap) => {
      const rows: Assignment[] = []
      snap.forEach((docSnap) => {
        const data = docSnap.data() as any
        rows.push({
          id: docSnap.id,
          title: data.title ?? 'AI assignment',
          status: (data.status as Assignment['status']) ?? 'draft',
          dueDate: data.dueDate ?? undefined,
          blueprint: data.blueprint ?? undefined,
          createdAt: data.createdAt?.toDate?.()?.toISOString?.() ?? null,
          standardCode: data.standardCode ?? null,
          assessmentType: data.assessmentType ?? null,
          questionCount: data.questionCount ?? null
        })
      })
      setAssignments(rows)
    })
    return () => unsub()
  }, [user])

  async function buildAssignment(event: React.FormEvent) {
    event.preventDefault()
    if (!user) return
    if (!subjectId || !gradeLevel || !standardCode) {
      setStatusMessage('Complete the subject, grade, and standard selections.')
      return
    }
    if (!title.trim()) {
      setStatusMessage('Provide a title so the assignment is easy to find later.')
      return
    }

    const { app, auth } = ensureFirebase()
    if (!app || !auth?.currentUser) {
      setStatusMessage('Workspace storage or auth is offline. Try again once Firebase is configured.')
      return
    }
    const database = getFirestore(app)
    const token = await auth.currentUser.getIdToken()

    const subjectLabel = subjects.find((entry) => entry.id === subjectId)?.label ?? subjectId
    const standard = availableStandards.find((entry) => entry.code === standardCode)
    const standardClarifications = standard?.clarifications ?? []
    const standardObjectives = standard?.objectives ?? []

    try {
      setLoading(true)
      setStatusMessage('Generating AI assessment…')

      const aiClassContext =
        aiContext.classContext?.pedagogy || (aiContext.classContext?.groups?.length ?? 0) > 0
          ? aiContext.classContext
          : null

      const blueprint = await safeFetch<AssessmentBlueprint>('/.netlify/functions/generateAssignment', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          standardCode,
          standardName: standard?.name ?? standardCode,
          focus: aiContext?.focusNarrative ?? '',
          subject: subjectLabel,
          grade: gradeLevel,
          assessmentType,
          questionCount,
          includeRemediation,
          standardClarifications,
          standardObjectives,
          classContext: aiClassContext
        })
      })

      // Defensive guards so Firestore never gets undefined fields
      const cleanBlueprint: AssessmentBlueprint = {
        standardCode: String(blueprint?.standardCode || standardCode),
        standardName: String(blueprint?.standardName || (standard?.name ?? standardCode)),
        subject: String(blueprint?.subject || subjectLabel),
        grade: String(blueprint?.grade || gradeLevel),
        assessmentType: (blueprint?.assessmentType as any) || assessmentType,
        questionCount: Number(blueprint?.questionCount || questionCount),
        aiInsights: {
          overview: String(blueprint?.aiInsights?.overview || ''),
          classStrategies: Array.isArray(blueprint?.aiInsights?.classStrategies)
            ? blueprint!.aiInsights!.classStrategies
            : [],
          nextSteps: Array.isArray(blueprint?.aiInsights?.nextSteps) ? blueprint!.aiInsights!.nextSteps : [],
          ...(blueprint?.aiInsights?.pedagogy ? { pedagogy: blueprint.aiInsights.pedagogy } : {})
        },
        levels: Array.isArray(blueprint?.levels) ? blueprint.levels : []
      }

      await addDoc(collection(database, `users/${user.uid}/assignments`), {
        title: title.trim(),
        status: 'draft',
        dueDate: dueDate || null,
        createdAt: Timestamp.now(),
        blueprint: cleanBlueprint,
        standardCode: cleanBlueprint.standardCode,
        assessmentType: cleanBlueprint.assessmentType,
        questionCount: cleanBlueprint.questionCount
      })

      setStatusMessage('Assignment generated and saved securely.')
      setTitle('')
      setDueDate('')
    } catch (error: any) {
      console.error(error)
      if (error?.status === 401 || error?.status === 403) {
        setStatusMessage('Your session expired. Refresh and sign in again to generate assignments.')
      } else {
        setStatusMessage(error?.message ?? 'Assignment generation failed.')
      }
    } finally {
      setLoading(false)
    }
  }

  async function updateStatus(id: string, status: Assignment['status']) {
    if (!user) return
    const { app } = ensureFirebase()
    if (!app) {
      setStatusMessage('Workspace storage is offline. Status changes are paused.')
      return
    }
    const database = getFirestore(app)
    await updateDoc(doc(database, `users/${user.uid}/assignments/${id}`), { status })
    setStatusMessage('Status updated.')
  }

  async function removeAssignment(id: string) {
    if (!user) return
    const { app } = ensureFirebase()
    if (!app) {
      setStatusMessage('Workspace storage is offline. Deletions are paused.')
      return
    }
    const database = getFirestore(app)
    await deleteDoc(doc(database, `users/${user.uid}/assignments/${id}`))
    setStatusMessage('Assignment removed.')
  }

  return (
    <div className="fade-in" style={{ display: 'grid', gap: 24 }}>
      {/* form + list UI omitted for brevity in this fix-only file; keep your existing JSX */}
      {/* Hook up buildAssignment to your form onSubmit */}
      <form onSubmit={buildAssignment}>
        {/* ...your existing controls... */}
        <button disabled={loading} type="submit" className="button button--primary">
          {loading ? 'Generating…' : 'Generate assignment'}
        </button>
        <div aria-live="polite" style={{ marginTop: 8 }}>{statusMessage}</div>
      </form>

      {/* Render assignments (unchanged) */}
      {/* ...your existing assignments grid/list... */}
    </div>
  )
}
