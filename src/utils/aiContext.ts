import type {
  AssessmentSnapshotRecord,
  PedagogicalGuidance,
  RosterGroupInsight,
  RosterInsights,
  SavedAssessment,
  StudentRosterRecord
} from '../types/roster'
import { buildLatestScoresByStudent, buildStudentPeriodLookup } from './rosterAnalytics'

export type AIContextGroup = {
  id: string
  label: string
  range: string
  studentCount: number
  recommendedPractices: string[]
  studentNames: string[]
}

export type AIClassContext = {
  pedagogy: PedagogicalGuidance | null
  groups: AIContextGroup[]
}

export type RosterAIContext = {
  focusNarrative: string
  masterySummary: string
  strugglingLearners: string[]
  latestAssessmentLabel: string | null
  classContext: AIClassContext
}

function normaliseLearnerName(value: string | null): string {
  return value?.trim() || 'Student'
}

function formatScoreForLearner(score: number | null | undefined): string {
  if (score === null || score === undefined || Number.isNaN(score)) {
    return 'N/A'
  }
  const rounded = Math.round(score)
  return `${rounded}%`
}

function buildStrugglingLearners(
  records: SavedAssessment[],
  students: StudentRosterRecord[]
): string[] {
  if (!records.length && !students.length) {
    return []
  }

  const studentPeriodLookup = buildStudentPeriodLookup(students)
  const latestScores = Array.from(buildLatestScoresByStudent(records, studentPeriodLookup, students).values())
  const scored = latestScores.filter((entry) => typeof entry.score === 'number' && !Number.isNaN(entry.score))
  if (!scored.length) {
    return []
  }

  return scored
    .sort((a, b) => a.score - b.score)
    .slice(0, 3)
    .map((entry) => `${normaliseLearnerName(entry.displayName)} (${formatScoreForLearner(entry.score)})`)
}

function describeLatestAssessment(assessment: AssessmentSnapshotRecord | null): string | null {
  if (!assessment) {
    return null
  }
  const label = assessment.testName?.trim()
  if (!label) {
    return null
  }
  const average =
    assessment.averageScore !== null && assessment.averageScore !== undefined
      ? `${assessment.averageScore.toFixed(1)}%`
      : null
  return average ? `${label} · Avg ${average}` : label
}

function buildFocusNarrative(
  insights: RosterInsights | null,
  latestAssessment: AssessmentSnapshotRecord | null,
  strugglingLearners: string[],
  pedagogy: PedagogicalGuidance | null,
  groupInsights: RosterGroupInsight[]
): string {
  const parts: string[] = []

  if (latestAssessment?.testName) {
    const averageText =
      latestAssessment.averageScore !== null && latestAssessment.averageScore !== undefined
        ? `averaged ${latestAssessment.averageScore.toFixed(1)}%`
        : 'is awaiting average calculations'
    parts.push(`Latest assessment ${latestAssessment.testName} ${averageText}.`)
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
}

function buildMasterySummary(
  insights: RosterInsights | null,
  latestAssessment: AssessmentSnapshotRecord | null,
  strugglingLearners: string[],
  groupInsights: RosterGroupInsight[]
): string {
  if (!insights || !latestAssessment) {
    return 'Upload mastery rosters so the AI can anchor prompts to real class data.'
  }

  const segments: string[] = []
  segments.push(
    `Latest: ${latestAssessment.testName}${
      latestAssessment.averageScore !== null ? ` · Avg ${latestAssessment.averageScore.toFixed(1)}` : ''
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
}

function buildClassContext(
  pedagogy: PedagogicalGuidance | null,
  groupInsights: RosterGroupInsight[]
): AIClassContext {
  return {
    pedagogy:
      pedagogy
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
  }
}

export function buildRosterAIContext(params: {
  insights: RosterInsights | null
  summaries: AssessmentSnapshotRecord[]
  records: SavedAssessment[]
  groupInsights: RosterGroupInsight[]
  pedagogy: PedagogicalGuidance | null
  students: StudentRosterRecord[]
}): RosterAIContext {
  const { insights, summaries, records, groupInsights, pedagogy, students } = params
  const latestAssessment = summaries[0] ?? insights?.recentAssessment ?? null
  const strugglingLearners = buildStrugglingLearners(records, students)
  const focusNarrative = buildFocusNarrative(insights, latestAssessment, strugglingLearners, pedagogy, groupInsights)
  const masterySummary = buildMasterySummary(insights, latestAssessment, strugglingLearners, groupInsights)
  const classContext = buildClassContext(pedagogy, groupInsights)

  return {
    focusNarrative,
    masterySummary,
    strugglingLearners,
    latestAssessmentLabel: describeLatestAssessment(latestAssessment),
    classContext
  }
}
