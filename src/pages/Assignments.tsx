import { useEffect, useMemo, useState } from 'react'
import type { User } from 'firebase/auth'
import {
  Timestamp,
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  updateDoc
} from 'firebase/firestore'
import catalog from '../../data/standards/catalog.json'
import { safeFetch } from '../utils/safeFetch'
import { db } from '../firebase'
import { useRosterData } from '../hooks/useRosterData'

interface AssignmentsPageProps {
  user: User | null
}

type Standard = { code: string; name: string }

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
  assessmentType: string
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
  createdAt?: string
}

const ASSESSMENT_TYPES = [
  { value: 'multiple_choice', label: 'Multiple choice quiz' },
  { value: 'reading_plus', label: 'Reading plus text-dependent questions' },
  { value: 'matching', label: 'Matching definitions to concepts' }
]

export default function AssignmentsPage({ user }: AssignmentsPageProps) {
  const subjects = useMemo(() => catalog.subjects as Subject[], [])
  const [subjectId, setSubjectId] = useState('')
  const [gradeLevel, setGradeLevel] = useState('')
  const [standardCode, setStandardCode] = useState('')
  const [availableStandards, setAvailableStandards] = useState<Standard[]>([])
  const [assessmentType, setAssessmentType] = useState(ASSESSMENT_TYPES[0].value)
  const [questionCount, setQuestionCount] = useState(5)
  const [title, setTitle] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [includeRemediation, setIncludeRemediation] = useState(true)
  const [statusMessage, setStatusMessage] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const [assignments, setAssignments] = useState<Assignment[]>([])
  const { insights, summaries, records, groupInsights, pedagogy } = useRosterData()

  const latestSummary = useMemo(() => summaries[0] ?? null, [summaries])

  const strugglingLearners = useMemo(() => {
    const scored = records.filter((record) => typeof record.score === 'number')
    if (!scored.length) return [] as string[]
    const sorted = [...scored].sort((a, b) => {
      const scoreA = a.score ?? 0
      const scoreB = b.score ?? 0
      return scoreA - scoreB
    })
    return sorted.slice(0, 3).map((record) => `${record.displayName} (${record.score ?? 'N/A'})`)
  }, [records])

  const focusNarrative = useMemo(() => {
    const parts: string[] = []
    if (latestSummary?.testName) {
      const averageText =
        latestSummary.averageScore !== null
          ? `averaged ${latestSummary.averageScore.toFixed(1)}`
          : 'is awaiting average calculations'
      parts.push(`Latest assessment ${latestSummary.testName} ${averageText}.`)
    }
    if (insights?.highest?.name && insights.highest.score !== null) {
      parts.push(`${insights.highest.name} is excelling at ${insights.highest.score}.`)
    }
    if (strugglingLearners.length) {
      parts.push(`Learners needing support: ${strugglingLearners.join(', ')}.`)
    }
    if (pedagogy?.summary) {
      parts.push(pedagogy.summary)
    }
    const foundationGroup = groupInsights.find((group) => group.id === 'foundation')
    if (foundationGroup) {
      parts.push(
        `Design scaffolds with student voice for ${foundationGroup.studentCount} learners in the ${foundationGroup.label.toLowerCase()} group.`
      )
    }
    const extendingGroup = groupInsights.find((group) => group.id === 'extending')
    if (extendingGroup) {
      parts.push(
        `Activate ${extendingGroup.studentCount} ${extendingGroup.label.toLowerCase()} learners as peer mentors and co-designers.`
      )
    }
    if (!parts.length) {
      parts.push('Use evidence-based instructional strategies connected to recent mastery trends.')
    }
    return parts.join(' ')
  }, [insights, latestSummary, strugglingLearners, pedagogy, groupInsights])

  const masterySummaryText = useMemo(() => {
    if (!insights || !latestSummary) {
      return 'Upload mastery rosters so the AI can anchor prompts to real class data.'
    }
    const segments: string[] = []
    segments.push(
      `Latest: ${latestSummary.testName}${
        latestSummary.averageScore !== null ? ` · Avg ${latestSummary.averageScore.toFixed(1)}` : ''
      }`
    )
    if (insights.highest?.name && insights.highest.score !== null) {
      segments.push(`Top: ${insights.highest.name} ${insights.highest.score}`)
    }
    if (strugglingLearners.length) {
      segments.push(`Needs support: ${strugglingLearners.join(', ')}`)
    }
    if (groupInsights.length) {
      const summary = groupInsights
        .map((group) => `${group.label.replace(/\s+/g, ' ')} ${group.range}`)
        .join(' • ')
      segments.push(`Groups: ${summary}`)
    }
    return segments.join(' • ')
  }, [insights, latestSummary, strugglingLearners, groupInsights])

  const classContext = useMemo(
    () => ({
      pedagogy: pedagogy
        ? {
            summary: pedagogy.summary,
            bestPractices: pedagogy.bestPractices,
            reflectionPrompts: pedagogy.reflectionPrompts
          }
        : null,
      groups: groupInsights.map((group) => ({
        id: group.id,
        label: group.label,
        range: group.range,
        studentCount: group.studentCount,
        recommendedPractices: group.recommendedPractices,
        studentNames: group.students.map((student) => student.name)
      }))
    }),
    [groupInsights, pedagogy]
  )

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
    setAvailableStandards(standards)
    if (!standards.some((entry) => entry.code === standardCode)) {
      setStandardCode(standards[0]?.code ?? '')
    }
  }, [subjectId, gradeLevel, subjects, standardCode])

  useEffect(() => {
    if (!user) {
      setAssignments([])
      return
    }
    const q = collection(db, `users/${user.uid}/assignments`)
    const unsub = onSnapshot(q, (snap) => {
      const rows: Assignment[] = []
      snap.forEach((docSnap) => {
        const data = docSnap.data() as any
        rows.push({
          id: docSnap.id,
          title: data.title ?? 'AI assignment',
          status: data.status ?? 'draft',
          dueDate: data.dueDate,
          blueprint: data.blueprint,
          createdAt: data.createdAt?.toDate?.()?.toISOString?.() ?? null
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

    const subjectLabel = subjects.find((entry) => entry.id === subjectId)?.label ?? subjectId
    const standard = availableStandards.find((entry) => entry.code === standardCode)

    try {
      setLoading(true)
      setStatusMessage('Generating AI assessment…')
      const blueprint = await safeFetch<AssessmentBlueprint>('/.netlify/functions/generateAssignment', {
        method: 'POST',
        body: JSON.stringify({
          standardCode,
          standardName: standard?.name ?? standardCode,
          focus: focusNarrative,
          subject: subjectLabel,
          grade: gradeLevel,
          assessmentType,
          questionCount,
          includeRemediation,
          classContext
        })
      })

      await addDoc(collection(db, `users/${user.uid}/assignments`), {
        title,
        status: 'draft',
        dueDate: dueDate || null,
        createdAt: Timestamp.now(),
        blueprint,
        standardCode: blueprint.standardCode,
        assessmentType: blueprint.assessmentType,
        questionCount: blueprint.questionCount
      })

      setStatusMessage('Assignment generated and saved securely.')
      setTitle('')
      setDueDate('')
    } catch (error: any) {
      console.error(error)
      setStatusMessage(error?.message ?? 'Assignment generation failed.')
    } finally {
      setLoading(false)
    }
  }

  async function updateStatus(id: string, status: Assignment['status']) {
    if (!user) return
    await updateDoc(doc(db, `users/${user.uid}/assignments/${id}`), { status })
    setStatusMessage('Status updated.')
  }

  async function removeAssignment(id: string) {
    if (!user) return
    await deleteDoc(doc(db, `users/${user.uid}/assignments/${id}`))
    setStatusMessage('Assignment deleted.')
  }

  function printAssignment(assignment: Assignment) {
    if (!assignment.blueprint) {
      window.print()
      return
    }
    const win = window.open('', '_blank')
    if (!win) return
    const blueprint = assignment.blueprint
    const html = `<!doctype html>
      <html>
        <head>
          <meta charset="utf-8" />
          <title>${assignment.title}</title>
          <style>
            body { font-family: 'Inter', sans-serif; padding: 32px; color: #0f172a; }
            h1 { font-size: 24px; margin-bottom: 8px; }
            h2 { font-size: 18px; margin-top: 24px; }
            ul { margin: 0 0 16px 20px; }
            .question { border: 1px solid #cbd5f5; padding: 12px; border-radius: 12px; margin-bottom: 12px; }
          </style>
        </head>
        <body>
          <h1>${assignment.title}</h1>
          <p><strong>Standard:</strong> ${blueprint.standardCode} — ${blueprint.standardName}</p>
          <p><strong>Assessment type:</strong> ${blueprint.assessmentType.replace(/_/g, ' ')}</p>
          <p><strong>Questions:</strong> ${blueprint.questionCount}</p>
          <h2>AI overview</h2>
          <p>${blueprint.aiInsights.overview}</p>
          <h2>Class strategies</h2>
          <ul>${blueprint.aiInsights.classStrategies.map((item) => `<li>${item}</li>`).join('')}</ul>
          <h2>Next steps</h2>
          <ul>${blueprint.aiInsights.nextSteps.map((item) => `<li>${item}</li>`).join('')}</ul>
          ${blueprint.aiInsights.pedagogy
            ? `<h2>Pedagogical focus</h2>
               <p>${blueprint.aiInsights.pedagogy.summary}</p>
               <ul>${blueprint.aiInsights.pedagogy.bestPractices.map((item) => `<li>${item}</li>`).join('')}</ul>
               <h3>Reflection prompts</h3>
               <ul>${blueprint.aiInsights.pedagogy.reflectionPrompts.map((item) => `<li>${item}</li>`).join('')}</ul>`
            : ''}
          ${blueprint.levels
            .map(
              (level) => `
                <section>
                  <h2>${level.level}</h2>
                  <p>${level.description}</p>
                  ${level.questions
                    .map(
                      (question) => `
                        <div class="question">
                          <strong>Prompt:</strong> ${question.prompt}
                          ${question.options ? `<ol>${question.options.map((option) => `<li>${option}</li>`).join('')}</ol>` : ''}
                          <p><strong>Answer:</strong> ${question.answer}</p>
                          <p><em>${question.rationale}</em></p>
                        </div>
                      `
                    )
                    .join('')}
                  ${level.remediation.length ? `<h3>Remediation</h3><ul>${level.remediation.map((tip) => `<li>${tip}</li>`).join('')}</ul>` : ''}
                </section>
              `
            )
            .join('')}
        </body>
      </html>`
    win.document.write(html)
    win.document.close()
    win.focus()
    win.print()
  }

  if (!user) {
    return (
      <div className="glass-card fade-in">
        <h2 style={{ margin: 0, fontSize: 26, fontWeight: 800 }}>Authenticate to manage assignments</h2>
        <p style={{ color: 'var(--text-muted)' }}>
          Assignments and AI blueprints are saved privately to your workspace. No student data leaves your secured scope.
        </p>
      </div>
    )
  }

  return (
    <div className="fade-in" style={{ display: 'grid', gap: 24 }}>
      <section className="glass-card" style={{ display: 'grid', gap: 18 }}>
        <h2 style={{ margin: '4px 0 6px', fontSize: 28, fontWeight: 800 }}>Generate standards-aligned assessments</h2>
        {masterySummaryText && (
          <div
            className="glass-subcard"
            style={{
              borderRadius: 16,
              border: '1px solid rgba(99,102,241,0.25)',
              background: 'rgba(15,23,42,0.45)',
              padding: 16,
              color: 'var(--text-muted)',
              fontSize: 14
            }}
          >
            <strong style={{ display: 'block', marginBottom: 6, color: '#cbd5f5', letterSpacing: 0.3 }}>
              Linked mastery insight
            </strong>
            {masterySummaryText}
          </div>
        )}
        {pedagogy && (
          <div
            className="glass-subcard"
            style={{
              borderRadius: 16,
              border: '1px solid rgba(148,163,184,0.25)',
              background: 'rgba(15,23,42,0.45)',
              padding: 16,
              color: 'var(--text-muted)',
              fontSize: 14,
              display: 'grid',
              gap: 10
            }}
          >
            <strong style={{ display: 'block', color: '#cbd5f5', letterSpacing: 0.3 }}>Pedagogical commitments</strong>
            <p style={{ margin: 0 }}>{pedagogy.summary}</p>
            <ul style={{ margin: 0, paddingLeft: 18, display: 'grid', gap: 6 }}>
              {pedagogy.bestPractices.map((practice, index) => (
                <li key={index}>{practice}</li>
              ))}
            </ul>
          </div>
        )}
        {groupInsights.length > 0 && (
          <div
            className="glass-subcard"
            style={{
              borderRadius: 16,
              border: '1px solid rgba(148,163,184,0.25)',
              background: 'rgba(15,23,42,0.45)',
              padding: 16,
              color: 'var(--text-muted)',
              fontSize: 14,
              display: 'grid',
              gap: 12
            }}
          >
            <strong style={{ display: 'block', color: '#cbd5f5', letterSpacing: 0.3 }}>Suggested learning groups</strong>
            <div style={{ display: 'grid', gap: 10 }}>
              {groupInsights.map((group) => (
                <div key={group.id} style={{ display: 'grid', gap: 6 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 12 }}>
                    <span style={{ fontWeight: 600, color: '#e0e7ff' }}>{group.label}</span>
                    <span style={{ fontSize: 13 }}>
                      {group.range} • {group.studentCount} {group.studentCount === 1 ? 'learner' : 'learners'}
                    </span>
                  </div>
                  {group.students.length > 0 && (
                    <span style={{ fontSize: 13 }}>
                      Learners: {group.students.map((student) => student.name).join(', ')}
                    </span>
                  )}
                  <ul style={{ margin: 0, paddingLeft: 18, display: 'grid', gap: 4 }}>
                    {group.recommendedPractices.map((practice, index) => (
                      <li key={index}>{practice}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}
        <form onSubmit={buildAssignment} style={{ display: 'grid', gap: 16 }}>
          <div className="field">
            <label htmlFor="assignment-title">Assignment title</label>
            <input
              id="assignment-title"
              name="assignment-title"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="e.g., Expressions mastery checkpoint"
              required
            />
          </div>
          <div className="field">
            <label htmlFor="assignment-subject">Subject</label>
            <select
              id="assignment-subject"
              name="assignment-subject"
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
            <label htmlFor="assignment-grade">Grade level</label>
              <select
                id="assignment-grade"
                name="assignment-grade"
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
          <div className="field">
            <label htmlFor="assignment-standard">Standard</label>
            <select
              id="assignment-standard"
              name="assignment-standard"
              value={standardCode}
              onChange={(event) => setStandardCode(event.target.value)}
              disabled={!gradeLevel || availableStandards.length === 0}
            >
              <option value="">Select a standard</option>
              {availableStandards.map((standard) => (
                <option key={standard.code} value={standard.code}>
                  {standard.code} — {standard.name}
                </option>
              ))}
            </select>
          </div>
          <div className="field">
            <label htmlFor="assignment-type">Assessment type</label>
            <select
              id="assignment-type"
              name="assignment-type"
              value={assessmentType}
              onChange={(event) => setAssessmentType(event.target.value)}
            >
              {ASSESSMENT_TYPES.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <div className="field">
            <label htmlFor="assignment-questions">Question count</label>
            <select
              id="assignment-questions"
              name="assignment-questions"
              value={questionCount}
              onChange={(event) => setQuestionCount(Number(event.target.value))}
            >
              {[5, 10, 15].map((count) => (
                <option key={count} value={count}>
                  {count} questions
                </option>
              ))}
            </select>
          </div>
          <div className="field">
            <label htmlFor="assignment-due">Due date</label>
            <input
              id="assignment-due"
              name="assignment-due"
              type="date"
              value={dueDate}
              onChange={(event) => setDueDate(event.target.value)}
            />
          </div>
          <div className="field" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <input
              id="assignment-remediation"
              name="assignment-remediation"
              type="checkbox"
              checked={includeRemediation}
              onChange={(event) => setIncludeRemediation(event.target.checked)}
            />
            <label htmlFor="assignment-remediation" style={{ cursor: 'pointer' }}>
              Include remediation pathways
            </label>
          </div>
          <button type="submit" className="primary" disabled={loading}>
            {loading ? 'Generating…' : 'Generate and save assignment'}
          </button>
        </form>
        {statusMessage && <p style={{ marginTop: 8, color: 'var(--text-muted)' }}>{statusMessage}</p>}
      </section>

      <section className="glass-card" style={{ display: 'grid', gap: 18 }}>
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h3 style={{ margin: 0, fontSize: 24, fontWeight: 700 }}>Assignments library</h3>
            <p style={{ color: 'var(--text-muted)', marginTop: 4 }}>Print, remediate, or assign at any time.</p>
          </div>
        </header>
        {assignments.length === 0 ? (
          <div className="empty-state">Generate an assignment to populate this library.</div>
        ) : (
          <div style={{ display: 'grid', gap: 16 }}>
            {assignments.map((assignment) => (
              <article key={assignment.id} className="glass-subcard" style={{ border: '1px solid rgba(148,163,184,0.25)', borderRadius: 18, padding: 18, background: 'rgba(15,23,42,0.55)', display: 'grid', gap: 12 }}>
                <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
                  <div>
                    <h4 style={{ margin: 0, fontSize: 20 }}>{assignment.title}</h4>
                    {assignment.blueprint && (
                      <p style={{ color: 'var(--text-muted)', marginTop: 4 }}>
                        {assignment.blueprint.standardCode} · {assignment.blueprint.assessmentType.replace(/_/g, ' ')} · {assignment.blueprint.questionCount} questions
                      </p>
                    )}
                    {assignment.dueDate && (
                      <p style={{ color: 'var(--text-muted)', marginTop: 4 }}>Due {new Date(assignment.dueDate).toLocaleDateString()}</p>
                    )}
                  </div>
                  <span className="tag" style={{ textTransform: 'capitalize' }}>{assignment.status}</span>
                </header>
                {assignment.blueprint && (
                  <div style={{ display: 'grid', gap: 12 }}>
                    <div>
                      <strong>AI insights</strong>
                      <ul style={{ margin: '8px 0 0 18px' }}>
                        {assignment.blueprint.aiInsights.classStrategies.slice(0, 2).map((item, index) => (
                          <li key={index}>{item}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <strong>Remediation</strong>
                      <ul style={{ margin: '8px 0 0 18px' }}>
                        {assignment.blueprint.levels
                          .flatMap((level) => level.remediation)
                          .slice(0, 3)
                          .map((tip, index) => (
                            <li key={index}>{tip}</li>
                          ))}
                      </ul>
                    </div>
                    {assignment.blueprint.aiInsights.pedagogy && (
                      <div>
                        <strong>Pedagogical focus</strong>
                        <p style={{ margin: '8px 0 0', color: 'var(--text-muted)' }}>
                          {assignment.blueprint.aiInsights.pedagogy.summary}
                        </p>
                        <ul style={{ margin: '8px 0 0 18px' }}>
                          {assignment.blueprint.aiInsights.pedagogy.bestPractices.slice(0, 2).map((tip, index) => (
                            <li key={index}>{tip}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                  <button className="secondary" onClick={() => updateStatus(assignment.id, 'assigned')}>Mark assigned</button>
                  <button className="secondary" onClick={() => updateStatus(assignment.id, 'completed')}>Mark complete</button>
                  <button className="secondary" onClick={() => printAssignment(assignment)}>Print</button>
                  <button className="secondary" onClick={() => removeAssignment(assignment.id)}>Delete</button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
