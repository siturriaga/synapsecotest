export type SavedAssessment = {
  id: string
  displayName: string
  score: number | null
  period: number | null
  quarter: string | null
  testName: string | null
  createdAt: Date | null
  sheetRow?: number | null
  studentId?: string | null
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
  periodHistory?: number[]
  quarterHistory?: string[]
}

export type RosterInsightEntry = {
  name: string
  score: number | null
  testName: string | null
  period: number | null
  quarter: string | null
  recordedAt: Date | null
}

export type RosterInsights = {
  totalStudents: number
  averageScore: number | null
  highest: RosterInsightEntry | null
  lowest: RosterInsightEntry | null
  recentAssessment: AssessmentSnapshotRecord | null
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

export type SavedRosterUpload = {
  id: string
  filename: string
  period: number | null
  quarter: string | null
  testName: string | null
  createdAt: Date | null
  size: number | null
  storage:
    | { kind: 'inline'; data: string }
    | { kind: 'bucket'; objectPath: string }
  storageWarning?: string | null
  inlineData?: string | null
}
