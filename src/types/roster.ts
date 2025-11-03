export type SavedAssessment = {
  id: string
  displayName: string
  score: number | null
  period: number | null
  quarter: string | null
  testName: string | null
  createdAt: Date | null
  sheetRow?: number | null
}

export type AssessmentSnapshotRecord = {
  id: string
  testName: string
  period: number | null
  quarter: string | null
  studentCount: number | null
  averageScore: number | null
  medianScore: number | null
  maxScore: number | null
  minScore: number | null
  updatedAt: Date | null
}

export type StudentRosterRecord = {
  id: string
  displayName: string
  nameVariants: string[]
  lastScore: number | null
  lastAssessment: string | null
  period: number | null
  quarter: string | null
  lastUploadId?: string | null
  lastSheetRow?: number | null
  updatedAt: Date | null
  uploads?: number | null
}

export type RosterInsightEntry = {
  name: string
  score: number | null
  testName: string | null
  period: number | null
  quarter: string | null
  recordedAt: Date | null
}

export type RosterGroupInsight = {
  id: string
  label: string
  range: string
  studentCount: number
  students: RosterInsightEntry[]
  recommendedPractices: string[]
}

export type PedagogicalGuidance = {
  summary: string
  bestPractices: string[]
  reflectionPrompts: string[]
}
