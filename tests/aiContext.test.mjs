import test from 'node:test'
import assert from 'node:assert/strict'
import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)
const { loadTsModule } = require('../scripts/lib/load-ts-module.cjs')
const { buildRosterAIContext } = loadTsModule('src/utils/aiContext.ts')
const { buildGroupInsights } = loadTsModule('src/utils/groupInsights.ts')

const records = [
  { id: 'r1', displayName: 'Alex', score: 45, period: 1, quarter: 'Q1', testName: 'Unit A', createdAt: new Date('2024-09-01') },
  { id: 'r2', displayName: 'Bailey', score: 58, period: 1, quarter: 'Q1', testName: 'Unit A', createdAt: new Date('2024-09-02') },
  { id: 'r3', displayName: 'Casey', score: 72, period: 1, quarter: 'Q1', testName: 'Unit A', createdAt: new Date('2024-09-03') },
  { id: 'r4', displayName: 'Dev', score: 88, period: 1, quarter: 'Q1', testName: 'Unit A', createdAt: new Date('2024-09-04') }
]

const summaries = [
  {
    id: 'sum-1',
    testName: 'Unit A',
    period: 1,
    quarter: 'Q1',
    studentCount: 24,
    averageScore: 65.5,
    medianScore: 64,
    maxScore: 96,
    minScore: 38,
    updatedAt: new Date('2024-09-05')
  }
]

const students = [
  {
    id: 'stu-1',
    displayName: 'Alex',
    nameVariants: ['Alex A.'],
    lastScore: 45,
    lastAssessment: 'Unit A',
    period: 1,
    quarter: 'Q1',
    updatedAt: new Date('2024-09-04')
  },
  {
    id: 'stu-2',
    displayName: 'Bailey',
    nameVariants: [],
    lastScore: 58,
    lastAssessment: 'Unit A',
    period: 1,
    quarter: 'Q1',
    updatedAt: new Date('2024-09-04')
  },
  {
    id: 'stu-3',
    displayName: 'Casey',
    nameVariants: ['Casey'],
    lastScore: 72,
    lastAssessment: 'Unit A',
    period: 1,
    quarter: 'Q1',
    updatedAt: new Date('2024-09-04')
  },
  {
    id: 'stu-4',
    displayName: 'Dev',
    nameVariants: [],
    lastScore: 88,
    lastAssessment: 'Unit A',
    period: 1,
    quarter: 'Q1',
    updatedAt: new Date('2024-09-04')
  }
]

const pedagogy = {
  summary: 'Focus on cooperative problem solving with rich tasks.',
  bestPractices: ['Use math talks', 'Offer manipulatives'],
  reflectionPrompts: ['How are students sharing reasoning?']
}

test('buildRosterAIContext surfaces consistent narratives', () => {
  const { groups } = buildGroupInsights(records, summaries[0])
  const aiContext = buildRosterAIContext({
    insights: {
      totalStudents: 24,
      averageScore: 65.5,
      highest: { name: 'Dev', score: 88, testName: 'Unit A', period: 1, quarter: 'Q1', recordedAt: new Date('2024-09-04') },
      lowest: { name: 'Alex', score: 45, testName: 'Unit A', period: 1, quarter: 'Q1', recordedAt: new Date('2024-09-01') },
      recentAssessment: summaries[0]
    },
    summaries,
    records,
    groupInsights: groups,
    pedagogy,
    students
  })

  assert.equal(aiContext.latestAssessmentLabel, 'Unit A · Avg 65.5%')
  assert.ok(aiContext.focusNarrative.includes('Latest assessment Unit A'))
  assert.ok(aiContext.focusNarrative.includes('Design scaffolds'))
  assert.ok(aiContext.masterySummary.includes('Needs support'))
  assert.ok(aiContext.strugglingLearners.some((entry) => entry.startsWith('Alex')))
  assert.equal(aiContext.classContext.groups.length, groups.length)
  assert.deepEqual(aiContext.classContext.pedagogy.summary, pedagogy.summary)
})

test('buildRosterAIContext falls back gracefully with sparse data', () => {
  const aiContext = buildRosterAIContext({
    insights: null,
    summaries: [],
    records: [],
    groupInsights: [],
    pedagogy: null,
    students: []
  })

  assert.equal(aiContext.latestAssessmentLabel, null)
  assert.equal(aiContext.masterySummary.includes('Upload mastery rosters'), true)
  assert.equal(aiContext.strugglingLearners.length, 0)
  assert.deepEqual(aiContext.classContext.groups, [])
})
