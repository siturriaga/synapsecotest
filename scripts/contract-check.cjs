#!/usr/bin/env node

const assert = require('node:assert/strict')
const { loadTsModule } = require('./lib/load-ts-module.cjs')

function makeDate(value) {
  return new Date(value)
}

function buildAssessment(overrides) {
  return {
    id: overrides.id,
    displayName: overrides.displayName ?? '',
    score: overrides.score ?? null,
    period: overrides.period ?? null,
    quarter: overrides.quarter ?? null,
    testName: overrides.testName ?? null,
    createdAt: overrides.createdAt ?? null,
    sheetRow: overrides.sheetRow ?? null,
    studentId: overrides.studentId ?? null
  }
}

function buildStudent(overrides) {
  return {
    id: overrides.id,
    displayName: overrides.displayName,
    nameVariants: overrides.nameVariants ?? [],
    lastScore: overrides.lastScore ?? null,
    lastAssessment: overrides.lastAssessment ?? null,
    period: overrides.period ?? null,
    quarter: overrides.quarter ?? null,
    lastUploadId: overrides.lastUploadId ?? null,
    lastSheetRow: overrides.lastSheetRow ?? null,
    updatedAt: overrides.updatedAt ?? null,
    uploads: overrides.uploads,
    periodHistory: overrides.periodHistory,
    quarterHistory: overrides.quarterHistory
  }
}

function runStudentLookupContract() {
  const { buildStudentPeriodLookup } = loadTsModule('src/utils/rosterAnalytics.ts')
  const students = [
    buildStudent({ id: 'stu-1', displayName: 'Jordan Lee', nameVariants: ['Jordan L.'], period: 1 }),
    buildStudent({ id: 'stu-2', displayName: 'Jordan Lee', nameVariants: ['J. Lee'], period: 2 })
  ]
  const lookup = buildStudentPeriodLookup(students)
  assert.equal(lookup.get('stu-1'), '1')
  assert.equal(lookup.get('stu-2'), '2')
  assert.equal(lookup.get('Jordan L.'), '1')
  assert.equal(lookup.get('J. Lee'), '2')
}

function runLatestScoreContracts() {
  const { buildLatestScoresByStudent, buildStudentPeriodLookup } = loadTsModule('src/utils/rosterAnalytics.ts')

  const students = [
    buildStudent({ id: 'stu-1', displayName: 'Jordan Lee', nameVariants: ['Jordan L.'], period: 1 }),
    buildStudent({ id: 'stu-2', displayName: 'Jordan Lee', nameVariants: ['J. Lee'], period: 2 }),
    buildStudent({ id: 'stu-3', displayName: 'Alex Kim', nameVariants: ['Alexandra Kim'], period: 3 })
  ]
  const lookup = buildStudentPeriodLookup(students)

  const records = [
    buildAssessment({
      id: 'rec-older',
      studentId: 'stu-1',
      displayName: 'Jordan Lee',
      score: 70,
      createdAt: makeDate('2023-10-01T00:00:00Z'),
      testName: 'Benchmark 1'
    }),
    buildAssessment({
      id: 'rec-latest-stu1',
      studentId: 'stu-1',
      displayName: 'Jordan Lee',
      score: 88,
      createdAt: makeDate('2024-01-05T00:00:00Z'),
      testName: 'Benchmark 2'
    }),
    buildAssessment({
      id: 'rec-stu2',
      studentId: 'stu-2',
      displayName: 'Jordan Lee',
      score: 92,
      createdAt: makeDate('2024-01-06T00:00:00Z'),
      testName: 'Benchmark 2'
    }),
    buildAssessment({
      id: 'rec-jordan-alias-only',
      studentId: null,
      displayName: 'Jordan Lee',
      score: 80,
      createdAt: makeDate('2024-01-04T00:00:00Z'),
      testName: 'Benchmark alias'
    }),
    buildAssessment({
      id: 'rec-stu3-with-id',
      studentId: 'stu-3',
      displayName: 'Alex Kim',
      score: 95,
      createdAt: makeDate('2024-01-07T00:00:00Z'),
      testName: 'Benchmark 2'
    }),
    buildAssessment({
      id: 'rec-stu3-name-only',
      studentId: null,
      displayName: 'Alexandra Kim',
      score: 96,
      createdAt: makeDate('2024-01-08T00:00:00Z'),
      testName: 'Benchmark 3'
    })
  ]

  const latestMap = buildLatestScoresByStudent(records, lookup, students)

  assert.equal(latestMap.get('stu-1')?.score, 88, 'should keep newest score for student with stable ID')
  assert.equal(latestMap.get('stu-1')?.period, '1')
  assert.equal(latestMap.get('stu-2')?.score, 92, 'should retain separate entry when display names collide')
  assert.equal(latestMap.get('stu-2')?.period, '2')
  const stu3 = latestMap.get('stu-3')
  assert.ok(stu3, 'should promote alias-only records once ID is known')
  assert.equal(stu3?.score, 96)

  const fallbackEntry = latestMap.get('rec-jordan-alias-only')
  assert.ok(fallbackEntry, 'ambiguous alias without ID should remain accessible')
  assert.equal(fallbackEntry?.studentId, null)
  assert.equal(fallbackEntry?.displayName, 'Jordan Lee')
}

function main() {
  try {
    runStudentLookupContract()
    runLatestScoreContracts()
    console.log('Contract check passed')
  } catch (error) {
    console.error('Contract check failed')
    console.error(error)
    process.exitCode = 1
  }
}

main()
