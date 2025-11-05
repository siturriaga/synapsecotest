import test from 'node:test'
import assert from 'node:assert/strict'
import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)
const { loadTsModule } = require('../scripts/lib/load-ts-module.cjs')
const { buildGroupInsights, formatScore, UNIVERSAL_PRACTICES } = loadTsModule('src/utils/groupInsights.ts')

const sampleRecords = [
  { id: '1', displayName: 'Alex', score: 42, period: 1, quarter: 'Q1', testName: 'Benchmark', createdAt: new Date('2024-09-01') },
  { id: '2', displayName: 'Bailey', score: 55, period: 1, quarter: 'Q1', testName: 'Benchmark', createdAt: new Date('2024-09-01') },
  { id: '3', displayName: 'Casey', score: 68, period: 1, quarter: 'Q1', testName: 'Benchmark', createdAt: new Date('2024-09-01') },
  { id: '4', displayName: 'Dev', score: 81, period: 1, quarter: 'Q1', testName: 'Benchmark', createdAt: new Date('2024-09-01') },
  { id: '5', displayName: 'Emery', score: 94, period: 1, quarter: 'Q1', testName: 'Benchmark', createdAt: new Date('2024-09-01') }
]

const recentAssessment = {
  id: 'snap-1',
  testName: 'Benchmark',
  period: 1,
  quarter: 'Q1',
  studentCount: 25,
  averageScore: 71.2,
  medianScore: 70,
  maxScore: 98,
  minScore: 32,
  updatedAt: new Date('2024-09-03')
}

test('buildGroupInsights slices records into instructional groups', () => {
  const { groups, pedagogy } = buildGroupInsights(sampleRecords, recentAssessment)
  assert.equal(groups.length, 3)
  const foundation = groups.find((group) => group.id === 'foundation')
  const developing = groups.find((group) => group.id === 'developing')
  const extending = groups.find((group) => group.id === 'extending')

  assert.ok(foundation)
  assert.ok(developing)
  assert.ok(extending)
  assert.equal(foundation.studentCount + developing.studentCount + extending.studentCount, sampleRecords.length)
  assert.ok(foundation.students.some((student) => student.name === 'Alex'))
  assert.ok(extending.students.some((student) => student.name === 'Emery'))
  assert.match(foundation.range, /\d+–\d+/)

  assert.ok(pedagogy)
  assert.notEqual(pedagogy.summary, UNIVERSAL_PRACTICES.summary)
  assert.ok(pedagogy.summary.includes('Class average'))
})

test('buildGroupInsights returns empty scaffolds when no scores exist', () => {
  const { groups, pedagogy } = buildGroupInsights([], null)
  assert.equal(groups.length, 0)
  assert.equal(pedagogy, null)
})

test('formatScore normalises decimal precision', () => {
  assert.equal(formatScore(72.49), '72.5')
  assert.equal(formatScore(88), '88')
  assert.equal(formatScore(null), 'N/A')
})
