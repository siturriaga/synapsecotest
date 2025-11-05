import { safeFetch } from '../utils/safeFetch'

export type AiPedagogyFocus = {
  summary: string
  bestPractices: string[]
  reflectionPrompts: string[]
}

export type AiAssessmentQuestion = {
  id: string
  prompt: string
  options?: string[]
  answer: string
  rationale: string
}

export type AiAssessmentLevel = {
  level: string
  description: string
  questions: AiAssessmentQuestion[]
  remediation: string[]
}

export type AiAssessmentBlueprint = {
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
    pedagogy?: AiPedagogyFocus
  }
  levels: AiAssessmentLevel[]
}

export type AiGroupInsight = {
  id: string
  label: string
  range?: string
  studentCount?: number
  recommendedPractices?: string[]
  studentNames?: string[]
}

export type AiClassContext = {
  pedagogy: AiPedagogyFocus | null
  groups: AiGroupInsight[]
  masterySummary?: string | null
  spotlightLearners?: string[]
  narrative?: string | null
}

export type GenerateAssignmentPayload = {
  standardCode: string
  standardName: string
  focus: string
  subject: string
  grade: string
  assessmentType: string
  questionCount: number
  includeRemediation: boolean
  standardClarifications: string[]
  standardObjectives: string[]
  classContext?: AiClassContext | null
}

export async function generateAssignmentBlueprint(
  payload: GenerateAssignmentPayload
): Promise<AiAssessmentBlueprint> {
  return await safeFetch<AiAssessmentBlueprint>('/.netlify/functions/generateAssignment', {
    method: 'POST',
    body: JSON.stringify(payload)
  })
}

export type GroupGenerationMode = 'heterogeneous' | 'homogeneous'

export type AiGroupStudent = {
  id?: string | null
  name?: string | null
  readiness?: string | null
  period?: number | null
  quarter?: string | null
  score?: number | string | null
}

export type AiApiGroup = {
  id?: string | null
  name?: string | null
  rationale?: string | null
  students?: AiGroupStudent[]
}

export type AiGroupResponse = {
  groups: AiApiGroup[]
  promptChips?: string[]
  metadata?: { source?: 'heuristic'; reason?: string }
}

export type GenerateGroupsPayload = {
  mode: GroupGenerationMode
  refinement?: string
}

export async function generateStudentGroups(payload: GenerateGroupsPayload): Promise<AiGroupResponse> {
  return await safeFetch<AiGroupResponse>('/.netlify/functions/groupStudents', {
    method: 'POST',
    body: JSON.stringify(payload)
  })
}
