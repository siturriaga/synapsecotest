import { ChangeEvent, FormEvent, useMemo, useState } from 'react'
import type { User } from 'firebase/auth'
import catalog from '../../data/standards/catalog.json'
import standardDetails from '../../data/standards/details.json'
import { ensureFirebase } from '../firebase'
import { useRosterData } from '../hooks/useRosterData'
import { safeFetch } from '../utils/safeFetch'

type StandardsPageProps = {
  user: User | null
}

type ClarificationEntry = {
  clarifications?: string[]
  objectives?: string[]
  description?: string
}

type NormalizedStandard = {
  code: string
  name: string
  summary?: string
  description?: string
  clarifications: string[]
  objectives: string[]
}

type StandardsMap = Record<string, Record<string, NormalizedStandard[]>>

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
    pedagogy?: {
      summary: string
      bestPractices: string[]
      reflectionPrompts: string[]
    }
  }
  levels: AssessmentLevel[]
}

type ParsedDataRow = {
  studentId: string
  studentName: string
  score: number
  errors: string[]
}

type AnalysisResult = {
  average: number
  highest: ParsedDataRow | null
  lowest: ParsedDataRow | null
  masteryCount: number
  developingCount: number
  strugglingCount: number
  commonErrors: string[]
  total: number
}

const FORMAT_TO_ASSESSMENT: Record<string, AssessmentBlueprint['assessmentType']> = {
  MCQ: 'multiple_choice',
  ConceptMap: 'matching',
  TDQs: 'reading_plus',
  Mixed: 'multiple_choice'
}

const LEVEL_FOCUS: Record<string, string> = {
  'On-Level': 'Align to the standard at grade-level rigor.',
  Developing: 'Reduce linguistic load and provide scaffolded cues for emerging mastery.',
  Advanced: 'Extend thinking with DOK 3/4 prompts and analytical rigor.',
  ELL: 'Use visuals, cognates, and simplified text to support English language learners.'
}

const QUESTION_COUNTS = [5, 10, 15]

function ordinalGradeLabel(rawGrade: string): string {
  const numeric = Number(rawGrade)
  if (!Number.isFinite(numeric)) return rawGrade
  const suffix = (() => {
    const mod100 = numeric % 100
    if (mod100 >= 11 && mod100 <= 13) return 'th'
    switch (numeric % 10) {
      case 1:
        return 'st'
      case 2:
        return 'nd'
      case 3:
        return 'rd'
      default:
        return 'th'
    }
  })()
  return `${numeric}${suffix} Grade`
}

function normalizeClarifications(entry: ClarificationEntry | undefined): {
  clarifications: string[]
  objectives: string[]
  summary?: string
  description?: string
} {
  if (!entry || typeof entry !== 'object') {
    return { clarifications: [], objectives: [] }
  }
  const clarifications = Array.isArray(entry.clarifications)
    ? entry.clarifications.map((item) => String(item)).filter(Boolean)
    : []
  const objectives = Array.isArray(entry.objectives)
    ? entry.objectives.map((item) => String(item)).filter(Boolean)
    : []
  return {
    clarifications,
    objectives,
    summary: typeof entry.description === 'string' ? entry.description : undefined,
    description: typeof entry.description === 'string' ? entry.description : undefined
  }
}

function buildBaseStandards(): StandardsMap {
  const details = standardDetails as Record<string, ClarificationEntry>
  const subjects = (catalog as { subjects: any[] }).subjects ?? []
  const result: StandardsMap = {}

  for (const subject of subjects) {
    if (!subject || typeof subject !== 'object') continue
    const subjectLabel = String(subject.label || subject.id || 'Subject')
    const grades = subject.grades ?? {}
    const normalizedGrades: Record<string, NormalizedStandard[]> = {}

    for (const [gradeKey, gradeValue] of Object.entries(grades)) {
      const standards = Array.isArray((gradeValue as any)?.standards)
        ? ((gradeValue as any).standards as any[])
        : []

      const normalizedStandards: NormalizedStandard[] = standards
        .map((standard) => {
          if (!standard || typeof standard !== 'object') return null
          const code = String(standard.code || '').trim()
          const name = String(standard.name || standard.title || '').trim()
          if (!code || !name) return null
          const meta = normalizeClarifications(details[code])
          return {
            code,
            name,
            summary: meta.summary,
            description: meta.description,
            clarifications: meta.clarifications,
            objectives: meta.objectives
          }
        })
        .filter((value): value is NormalizedStandard => Boolean(value))

      if (normalizedStandards.length) {
        normalizedGrades[String(gradeKey)] = normalizedStandards
      }
    }

    if (Object.keys(normalizedGrades).length) {
      result[subjectLabel] = normalizedGrades
    }
  }

  return result
}

function parseUploadedStandards(data: unknown): StandardsMap {
  const normalized: StandardsMap = {}

  if (!data || typeof data !== 'object') return normalized

  for (const [subjectName, payload] of Object.entries(data as Record<string, unknown>)) {
    const subject = subjectName.trim()
    if (!subject) continue
    const subjectGrades: Record<string, NormalizedStandard[]> = {}

    if (Array.isArray(payload)) {
      const entries = payload
        .map((item) => normalizeUploadedStandard(item))
        .filter((value): value is NormalizedStandard => Boolean(value))
      if (entries.length) {
        subjectGrades.General = entries
      }
    } else if (payload && typeof payload === 'object') {
      for (const [gradeKey, gradePayload] of Object.entries(payload as Record<string, unknown>)) {
        const entries = Array.isArray(gradePayload)
          ? (gradePayload as unknown[])
              .map((item) => normalizeUploadedStandard(item))
              .filter((value): value is NormalizedStandard => Boolean(value))
          : []
        if (entries.length) {
          subjectGrades[String(gradeKey)] = entries
        }
      }
    }

    if (Object.keys(subjectGrades).length) {
      normalized[subject] = subjectGrades
    }
  }

  return normalized
}

function normalizeUploadedStandard(entry: unknown): NormalizedStandard | null {
  if (!entry || typeof entry !== 'object') return null
  const code = String((entry as any).code || '').trim()
  const nameCandidate =
    (entry as any).name ?? (entry as any).title ?? (entry as any).desc ?? (entry as any).description
  const name = typeof nameCandidate === 'string' ? nameCandidate.trim() : ''
  if (!code || !name) return null
  const clarificationsRaw = (entry as any).clarifications
  const objectivesRaw = (entry as any).objectives
  const clarifications = Array.isArray(clarificationsRaw)
    ? clarificationsRaw.map((item) => String(item)).filter(Boolean)
    : []
  const objectives = Array.isArray(objectivesRaw)
    ? objectivesRaw.map((item) => String(item)).filter(Boolean)
    : []
  const fullTextCandidate =
    (entry as any).full_text ?? (entry as any).fullText ?? (entry as any).summary ?? (entry as any).description

  return {
    code,
    name,
    summary: typeof fullTextCandidate === 'string' ? fullTextCandidate : undefined,
    description: typeof fullTextCandidate === 'string' ? fullTextCandidate : undefined,
    clarifications,
    objectives
  }
}

function mergeStandards(base: StandardsMap, patch: StandardsMap): StandardsMap {
  const next: StandardsMap = {}

  for (const [subject, grades] of Object.entries(base)) {
    next[subject] = {}
    for (const [gradeKey, standards] of Object.entries(grades)) {
      next[subject][gradeKey] = standards.map((standard) => ({ ...standard }))
    }
  }

  for (const [subject, grades] of Object.entries(patch)) {
    if (!next[subject]) {
      next[subject] = {}
    }
    for (const [gradeKey, incomingStandards] of Object.entries(grades)) {
      const existing = next[subject][gradeKey] ?? []
      const merged = new Map<string, NormalizedStandard>()
      for (const entry of existing) {
        merged.set(entry.code, entry)
      }
      for (const entry of incomingStandards) {
        merged.set(entry.code, { ...entry })
      }
      next[subject][gradeKey] = Array.from(merged.values()).sort((a, b) => a.code.localeCompare(b.code))
    }
  }

  return next
}

function deriveStandardFocus(level: string): string {
  return LEVEL_FOCUS[level] ?? LEVEL_FOCUS['On-Level']
}

function summarizeErrors(errors: string[]): string[] {
  const counts = new Map<string, number>()
  errors.forEach((error) => {
    const key = error.trim()
    if (!key) return
    counts.set(key, (counts.get(key) ?? 0) + 1)
  })
  return Array.from(counts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([label, count]) => `${label} (${count})`)
}

export default function StandardsEnginePage({ user }: StandardsPageProps) {
  const baseStandards = useMemo(() => buildBaseStandards(), [])
  const [standardsData, setStandardsData] = useState<StandardsMap>(baseStandards)
  const [subjectId, setSubjectId] = useState('')
  const [gradeLevel, setGradeLevel] = useState('')
  const [standardCode, setStandardCode] = useState('')
  const [format, setFormat] = useState('MCQ')
  const [level, setLevel] = useState('On-Level')
  const [questionCount, setQuestionCount] = useState<number>(QUESTION_COUNTS[0])
  const [quizBlueprint, setQuizBlueprint] = useState<AssessmentBlueprint | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [fileStatus, setFileStatus] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'content' | 'data'>('content')
  const [rawDataInput, setRawDataInput] = useState('')
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null)
  const [analysisError, setAnalysisError] = useState<string | null>(null)
  const { aiContext } = useRosterData()

  const subjects = useMemo(() => Object.keys(standardsData).sort(), [standardsData])

  const gradeOptions = useMemo(() => {
    if (!subjectId) return [] as string[]
    return Object.keys(standardsData[subjectId] ?? {}).sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
  }, [standardsData, subjectId])

  const standardOptions = useMemo(() => {
    if (!subjectId || !gradeLevel) return []
    return standardsData[subjectId]?.[gradeLevel] ?? []
  }, [gradeLevel, standardsData, subjectId])

  const selectedStandard = useMemo(() => {
    if (!subjectId || !gradeLevel || !standardCode) return null
    return standardOptions.find((entry) => entry.code === standardCode) ?? null
  }, [gradeLevel, standardCode, standardOptions, subjectId])

  const canGenerate = Boolean(user && selectedStandard && !loading)

  const totalQuestions = useMemo(() => {
    if (!quizBlueprint?.levels) return 0
    return quizBlueprint.levels.reduce((sum, levelEntry) => sum + (levelEntry.questions?.length ?? 0), 0)
  }, [quizBlueprint])

  const handleSubjectChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value
    setSubjectId(value)
    setGradeLevel('')
    setStandardCode('')
    setQuizBlueprint(null)
    setAnalysisResult(null)
  }

  const handleGradeChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value
    setGradeLevel(value)
    setStandardCode('')
    setQuizBlueprint(null)
    setAnalysisResult(null)
  }

  const handleStandardChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value
    setStandardCode(value)
    setQuizBlueprint(null)
  }

  const handleFormatChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setFormat(event.target.value)
  }

  const handleLevelChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setLevel(event.target.value)
  }

  const handleCountChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const parsed = Number(event.target.value)
    setQuestionCount(Number.isFinite(parsed) ? parsed : QUESTION_COUNTS[0])
  }

  const handleFileUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) {
      setFileStatus(null)
      return
    }

    try {
      const text = await file.text()
      const parsed = JSON.parse(text)
      const normalized = parseUploadedStandards(parsed)
      if (Object.keys(normalized).length === 0) {
        throw new Error('No recognizable standards found in the uploaded file.')
      }
      setStandardsData((current) => mergeStandards(current, normalized))
      setFileStatus(`Loaded ${file.name} successfully.`)
    } catch (uploadError: any) {
      console.error(uploadError)
      setFileStatus(`Upload failed: ${uploadError?.message ?? 'Invalid file.'}`)
    }
  }

  const handleGenerate = async () => {
    if (!user) {
      setError('Sign in to generate assignments.')
      return
    }
    if (!subjectId || !gradeLevel || !selectedStandard) {
      setError('Select a subject, grade, and standard before generating content.')
      return
    }

    setLoading(true)
    setError(null)
    setQuizBlueprint(null)

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
          standardCode: selectedStandard.code,
          standardName: selectedStandard.name,
          focus: deriveStandardFocus(level),
          subject: subjectId,
          grade: gradeLevel,
          assessmentType: FORMAT_TO_ASSESSMENT[format] ?? 'multiple_choice',
          questionCount,
          includeRemediation: true,
          standardClarifications: selectedStandard.clarifications,
          standardObjectives: selectedStandard.objectives,
          classContext: aiClassContext
        })
      })

      setQuizBlueprint(response)
    } catch (generationError: any) {
      console.error(generationError)
      setError(generationError?.message ?? 'Gemini lesson generation failed.')
    } finally {
      setLoading(false)
    }
  }

  const handleDataAnalyze = (event: FormEvent) => {
    event.preventDefault()
    if (!selectedStandard) {
      setAnalysisResult(null)
      setAnalysisError('Select a standard before analyzing data.')
      return
    }
    if (!rawDataInput.trim()) {
      setAnalysisResult(null)
      setAnalysisError('Paste CSV or spreadsheet data to analyze.')
      return
    }

    const rows: ParsedDataRow[] = []
    const allErrors: string[] = []

    for (const line of rawDataInput.split(/\r?\n/)) {
      if (!line.trim()) continue
      const parts = line.split(',').map((part) => part.trim())
      if (parts.length < 3) continue
      const score = Number(parts[2])
      if (!Number.isFinite(score)) continue
      const studentId = parts[0] ?? ''
      const studentName = parts[1] ?? ''
      const errorString = parts.slice(3).join(',')
      const parsedErrors = errorString
        .split(/[;|]/)
        .map((item) => item.trim())
        .filter(Boolean)
      parsedErrors.forEach((error) => allErrors.push(error))
      rows.push({ studentId, studentName, score, errors: parsedErrors })
    }

    if (!rows.length) {
      setAnalysisResult(null)
      setAnalysisError('No valid rows detected. Ensure the third column contains numeric scores.')
      return
    }

    const total = rows.length
    const sum = rows.reduce((acc, row) => acc + row.score, 0)
    const highest = rows.reduce((acc, row) => (!acc || row.score > acc.score ? row : acc), rows[0])
    const lowest = rows.reduce((acc, row) => (!acc || row.score < acc.score ? row : acc), rows[0])
    const masteryCount = rows.filter((row) => row.score >= 80).length
    const developingCount = rows.filter((row) => row.score >= 60 && row.score < 80).length
    const strugglingCount = rows.filter((row) => row.score < 60).length

    setAnalysisResult({
      average: sum / total,
      highest,
      lowest,
      masteryCount,
      developingCount,
      strugglingCount,
      commonErrors: summarizeErrors(allErrors),
      total
    })
    setAnalysisError(null)
  }

  const renderInsightList = (title: string, items: string[]) => {
    if (!items.length) return null
    return (
      <div className="standards-output__insight">
        <h4>{title}</h4>
        <ul>
          {items.map((entry) => (
            <li key={entry}>{entry}</li>
          ))}
        </ul>
      </div>
    )
  }

  return (
    <div className="standards-screen fade-in">
      <header className="standards-screen__header">
        <div>
          <h1>FL Standards Differentiation Tool</h1>
          <p>Generate leveled assignments, analyze class performance, and align to Florida standards.</p>
        </div>
        {!user ? (
          <div className="standards-screen__banner">
            Sign in to unlock Gemini-powered content generation. Selection tools remain available for planning.
          </div>
        ) : null}
      </header>

      <div className="standards-tabs">
        <button
          type="button"
          className={`standards-tabs__button${activeTab === 'content' ? ' standards-tabs__button--active' : ''}`}
          onClick={() => setActiveTab('content')}
        >
          Content Generator
        </button>
        <button
          type="button"
          className={`standards-tabs__button${activeTab === 'data' ? ' standards-tabs__button--active' : ''}`}
          onClick={() => setActiveTab('data')}
        >
          Data Analyzer
        </button>
      </div>

      {activeTab === 'content' ? (
        <section className="standards-card">
          <h2>Assignment Creation Parameters</h2>
          <div className="standards-grid">
            <label className="standards-field">
              <span>1. Standards File (JSON Upload)</span>
              <input type="file" accept="application/json" onChange={handleFileUpload} />
              {fileStatus ? <p className="standards-field__status">{fileStatus}</p> : null}
            </label>

            <label className="standards-field">
              <span>2. Select Subject</span>
              <select value={subjectId} onChange={handleSubjectChange}>
                <option value="" disabled>
                  Choose a subject
                </option>
                {subjects.map((subject) => (
                  <option key={subject} value={subject}>
                    {subject}
                  </option>
                ))}
              </select>
            </label>

            <label className="standards-field">
              <span>3. Select Grade Level</span>
              <select value={gradeLevel} onChange={handleGradeChange} disabled={!gradeOptions.length}>
                <option value="" disabled>
                  {subjectId ? 'Choose a grade' : 'Select subject first'}
                </option>
                {gradeOptions.map((grade) => (
                  <option key={grade} value={grade}>
                    {grade === 'General' ? 'General' : ordinalGradeLabel(grade)}
                  </option>
                ))}
              </select>
            </label>

            <label className="standards-field">
              <span>4. Select Standard Code</span>
              <select value={standardCode} onChange={handleStandardChange} disabled={!standardOptions.length}>
                <option value="" disabled>
                  {gradeLevel ? 'Choose a standard' : 'Select grade first'}
                </option>
                {standardOptions.map((standard) => (
                  <option key={standard.code} value={standard.code}>
                    {standard.code} — {standard.name}
                  </option>
                ))}
              </select>
            </label>

            <label className="standards-field">
              <span>5. Select Format</span>
              <select value={format} onChange={handleFormatChange}>
                <option value="MCQ">Multiple Choice Quiz (MCQ)</option>
                <option value="ConceptMap">Concept to Definition Map</option>
                <option value="TDQs">Short Text with TDQs (FAST Style)</option>
                <option value="Mixed">Mixed MCQ &amp; Extended Response</option>
              </select>
            </label>

            <label className="standards-field">
              <span>6. Select Differentiation Level</span>
              <select value={level} onChange={handleLevelChange}>
                <option value="On-Level">On-Level</option>
                <option value="Developing">Developing (DOK 1/2)</option>
                <option value="Advanced">Advanced (DOK 3/4)</option>
                <option value="ELL">ELL (Minimal Text/Visual Aids)</option>
              </select>
            </label>

            <label className="standards-field">
              <span>7. Item Count</span>
              <select value={questionCount} onChange={handleCountChange}>
                {QUESTION_COUNTS.map((count) => (
                  <option key={count} value={count}>
                    {count} Questions/Concepts
                  </option>
                ))}
              </select>
            </label>
          </div>

          {selectedStandard ? (
            <article className="standards-standard-preview">
              <header>
                <h3>{selectedStandard.code}</h3>
                <p>{selectedStandard.name}</p>
              </header>
              {selectedStandard.summary ? <p className="standards-standard-preview__summary">{selectedStandard.summary}</p> : null}
              {selectedStandard.clarifications.length ? (
                <div>
                  <h4>Clarifications</h4>
                  <ul>
                    {selectedStandard.clarifications.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              ) : null}
              {selectedStandard.objectives.length ? (
                <div>
                  <h4>Objectives</h4>
                  <ul>
                    {selectedStandard.objectives.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </article>
          ) : (
            <div className="standards-standard-placeholder">
              Upload a standards file or use the built-in catalog to select a target standard.
            </div>
          )}

          <button
            type="button"
            className="standards-generate-button"
            onClick={handleGenerate}
            disabled={!canGenerate}
          >
            {loading ? 'Generating content…' : user ? 'Generate Assignment' : 'Sign in to generate'}
          </button>
          {error ? <div className="standards-error">{error}</div> : null}
        </section>
      ) : (
        <section className="standards-card">
          <h2>Pedagogical Data Analyzer</h2>
          <p className="standards-card__description">
            Paste formative assessment results to surface trends aligned to your selected standard. Scores are
            interpreted out of 100.
          </p>
          <form className="standards-data-form" onSubmit={handleDataAnalyze}>
            <label className="standards-field">
              <span>Raw Performance Data</span>
              <textarea
                value={rawDataInput}
                onChange={(event) => setRawDataInput(event.target.value)}
                placeholder="Student ID, Student Name, Score, Errors/Variations"
                rows={8}
              />
            </label>
            <button type="submit" className="standards-generate-button" disabled={!selectedStandard || !rawDataInput.trim()}>
              Analyze Data &amp; Generate Report
            </button>
          </form>
          {analysisError ? <div className="standards-error">{analysisError}</div> : null}

          {analysisResult ? (
            <div className="standards-analysis">
              <h3>Analysis Results</h3>
              <div className="standards-analysis__metrics">
                <div>
                  <span className="label">Average Score</span>
                  <strong>{analysisResult.average.toFixed(1)}</strong>
                </div>
                <div>
                  <span className="label">Mastery (≥80)</span>
                  <strong>
                    {analysisResult.masteryCount} / {analysisResult.total}
                  </strong>
                </div>
                <div>
                  <span className="label">Developing (60-79)</span>
                  <strong>{analysisResult.developingCount}</strong>
                </div>
                <div>
                  <span className="label">Struggling (&lt;60)</span>
                  <strong>{analysisResult.strugglingCount}</strong>
                </div>
                <div>
                  <span className="label">Highest Performer</span>
                  <strong>
                    {analysisResult.highest?.studentName || analysisResult.highest?.studentId} ({
                      analysisResult.highest?.score ?? '—'
                    })
                  </strong>
                </div>
                <div>
                  <span className="label">Lowest Performer</span>
                  <strong>
                    {analysisResult.lowest?.studentName || analysisResult.lowest?.studentId} ({
                      analysisResult.lowest?.score ?? '—'
                    })
                  </strong>
                </div>
              </div>

              {analysisResult.commonErrors.length ? (
                <div className="standards-analysis__insights">
                  <h4>Frequent Error Patterns</h4>
                  <ul>
                    {analysisResult.commonErrors.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>
          ) : null}
        </section>
      )}

      {(quizBlueprint || loading || error) && (
        <section className="standards-output">
          <header>
            <h2>Assignment Output</h2>
            {quizBlueprint ? (
              <p>
                {quizBlueprint.standardCode} • {quizBlueprint.standardName} ({quizBlueprint.questionCount} requested · {totalQuestions}
                {' '}generated)
              </p>
            ) : null}
          </header>

          {loading ? (
            <div className="standards-output__loading">
              <div className="spinner" aria-hidden="true" />
              <p>Generating content… please wait.</p>
            </div>
          ) : null}

          {error && !loading ? <div className="standards-error">{error}</div> : null}

          {quizBlueprint && !loading ? (
            <div className="standards-output__content">
              {quizBlueprint.aiInsights.overview ? (
                <div className="standards-output__overview">
                  <h3>AI Instructional Overview</h3>
                  <p>{quizBlueprint.aiInsights.overview}</p>
                </div>
              ) : null}

              <div className="standards-output__insights-group">
                {renderInsightList('Classroom Strategies', quizBlueprint.aiInsights.classStrategies)}
                {renderInsightList('Suggested Next Steps', quizBlueprint.aiInsights.nextSteps)}
                {quizBlueprint.aiInsights.pedagogy ? (
                  <div className="standards-output__insight">
                    <h4>Pedagogical Focus</h4>
                    {quizBlueprint.aiInsights.pedagogy.summary ? <p>{quizBlueprint.aiInsights.pedagogy.summary}</p> : null}
                    {quizBlueprint.aiInsights.pedagogy.bestPractices?.length ? (
                      <>
                        <h5>Best Practices</h5>
                        <ul>
                          {quizBlueprint.aiInsights.pedagogy.bestPractices.map((item) => (
                            <li key={item}>{item}</li>
                          ))}
                        </ul>
                      </>
                    ) : null}
                    {quizBlueprint.aiInsights.pedagogy.reflectionPrompts?.length ? (
                      <>
                        <h5>Reflection Prompts</h5>
                        <ul>
                          {quizBlueprint.aiInsights.pedagogy.reflectionPrompts.map((item) => (
                            <li key={item}>{item}</li>
                          ))}
                        </ul>
                      </>
                    ) : null}
                  </div>
                ) : null}
              </div>

              <div className="standards-output__levels">
                {quizBlueprint.levels.map((levelEntry) => (
                  <article key={levelEntry.level} className="standards-output__level">
                    <header>
                      <h3>{levelEntry.level}</h3>
                      <p>{levelEntry.description}</p>
                    </header>
                    {levelEntry.questions.length ? (
                      <ol>
                        {levelEntry.questions.map((question) => (
                          <li key={question.id}>
                            <h4>{question.prompt}</h4>
                            {Array.isArray(question.options) && question.options.length ? (
                              <ul className="standards-output__options">
                                {question.options.map((option, index) => (
                                  <li key={`${question.id}-option-${index}`}>{option}</li>
                                ))}
                              </ul>
                            ) : null}
                            <p className="standards-output__answer">
                              <strong>Answer:</strong> {question.answer}
                            </p>
                            <p className="standards-output__rationale">
                              <strong>Rationale:</strong> {question.rationale}
                            </p>
                          </li>
                        ))}
                      </ol>
                    ) : (
                      <p>No questions returned for this level.</p>
                    )}
                    {levelEntry.remediation.length ? (
                      <div className="standards-output__remediation">
                        <h5>Remediation Ideas</h5>
                        <ul>
                          {levelEntry.remediation.map((item) => (
                            <li key={item}>{item}</li>
                          ))}
                        </ul>
                      </div>
                    ) : null}
                  </article>
                ))}
              </div>
            </div>
          ) : null}
        </section>
      )}
    </div>
  )
}

