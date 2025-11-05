import type { Handler } from '@netlify/functions'
import type { FieldValue } from 'firebase-admin/firestore'
import { getAdmin, verifyBearerUid } from './_lib/firebaseAdmin'
import { withCors } from './_lib/cors'

function parsePeriod(value: unknown): number | null {
  if (value === null || value === undefined) return null
  const numeric = Number(String(value).match(/\d+/)?.[0] ?? NaN)
  if (!Number.isFinite(numeric)) return null
  if (numeric < 1 || numeric > 8) return null
  return Math.floor(numeric)
}

function normaliseScore(raw: unknown): number | null {
  if (typeof raw === 'number' && Number.isFinite(raw)) return raw
  if (raw === null || raw === undefined) return null
  const cleaned = String(raw).replace(/[^0-9.\-]+/g, '').trim()
  if (!cleaned) return null
  const parsed = Number.parseFloat(cleaned)
  return Number.isFinite(parsed) ? parsed : null
}

function summariseScores(records: Array<{ score: unknown }>) {
  const scores = records
    .map((record) => normaliseScore(record.score))
    .filter((value): value is number => value !== null)
    .sort((a, b) => a - b)

  if (!scores.length) {
    return { count: 0, average: null, median: null, min: null, max: null }
  }

  const total = scores.reduce((sum, value) => sum + value, 0)
  const average = total / scores.length
  const median =
    scores.length % 2 === 1
      ? scores[Math.floor(scores.length / 2)]
      : (scores[scores.length / 2 - 1] + scores[scores.length / 2]) / 2

  return {
    count: scores.length,
    average,
    median,
    min: scores[0],
    max: scores[scores.length - 1]
  }
}

function buildTestKey(testName: string) {
  const base = testName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
  return base || `assessment-${Date.now()}`
}

async function recomputeSummary(
  uid: string,
  testName: string,
  admin: ReturnType<typeof getAdmin>,
  now: FieldValue
) {
  const assessmentsRef = admin.firestore().collection(`users/${uid}/assessments`)
  const snapshot = await assessmentsRef.where('testName', '==', testName).get()
  if (snapshot.empty) {
    return
  }

  const rows = snapshot.docs.map((doc) => doc.data() as any)
  const summary = summariseScores(rows)
  const period = rows.find((row) => typeof row.period === 'number')?.period ?? null
  const quarter = rows.find((row) => typeof row.quarter === 'string' && row.quarter.trim())?.quarter ?? null

  const summaryRef = admin.firestore().doc(`users/${uid}/assessments_summary/${buildTestKey(testName)}`)
  await summaryRef.set(
    {
      testName,
      period,
      quarter,
      studentCount: summary.count,
      averageScore: summary.average,
      medianScore: summary.median,
      minScore: summary.min,
      maxScore: summary.max,
      updatedAt: now,
      createdAt: now
    },
    { merge: true }
  )

  const metricsRef = admin.firestore().doc(`users/${uid}/dashboard_stats/metrics`)
  const metricsSnap = await metricsRef.get()
  if (metricsSnap.exists && metricsSnap.data()?.latestAssessment?.testName === testName) {
    await metricsRef.set(
      {
        latestAssessment: {
          testName,
          period,
          quarter,
          studentCount: summary.count,
          averageScore: summary.average,
          maxScore: summary.max,
          minScore: summary.min,
          updatedAt: now
        }
      },
      { merge: true }
    )
  }
}

const baseHandler: Handler = async (event) => {
  try {
    if (event.httpMethod !== 'POST') {
      return { statusCode: 405, body: 'Method not allowed' }
    }

    const uid = await verifyBearerUid(event.headers.authorization)
    if (!uid) {
      return { statusCode: 401, body: JSON.stringify({ error: 'Unauthorized' }) }
    }

    const body = event.body ? JSON.parse(event.body) : {}
    const ids: unknown = body.studentIds
    if (!Array.isArray(ids) || !ids.length) {
      return { statusCode: 400, body: JSON.stringify({ error: 'studentIds array is required' }) }
    }

    const trimmed = ids
      .map((value) => (typeof value === 'string' ? value.trim() : ''))
      .filter((value) => value.length > 0)
    const uniqueIds = Array.from(new Set(trimmed))
    if (!uniqueIds.length) {
      return { statusCode: 400, body: JSON.stringify({ error: 'No valid student identifiers provided' }) }
    }
    if (uniqueIds.length > 100) {
      return { statusCode: 400, body: JSON.stringify({ error: 'Select 100 or fewer students per update' }) }
    }

    const periodValue = parsePeriod(body.period)
    if (periodValue === null) {
      return { statusCode: 400, body: JSON.stringify({ error: 'Provide a period number between 1 and 8' }) }
    }

    const admin = getAdmin()
    const now = admin.firestore.FieldValue.serverTimestamp()
    const batch = admin.firestore().batch()

    uniqueIds.forEach((studentId) => {
      const studentRef = admin.firestore().doc(`users/${uid}/students/${studentId}`)
      batch.set(
        studentRef,
        {
          period: periodValue,
          updatedAt: now,
          periodHistory: admin.firestore.FieldValue.arrayUnion(periodValue)
        },
        { merge: true }
      )
    })

    const assessmentsRef = admin.firestore().collection(`users/${uid}/assessments`)
    const testsToUpdate = new Set<string>()

    for (let index = 0; index < uniqueIds.length; index += 10) {
      const slice = uniqueIds.slice(index, index + 10)
      const snapshot = await assessmentsRef.where('studentId', 'in', slice).get()
      snapshot.forEach((doc) => {
        const data = doc.data() as any
        if (typeof data.testName === 'string' && data.testName.trim()) {
          testsToUpdate.add(data.testName.trim())
        }
        batch.set(
          doc.ref,
          {
            period: periodValue,
            updatedAt: now
          },
          { merge: true }
        )
      })
    }

    await batch.commit()

    await Promise.all(Array.from(testsToUpdate).map((test) => recomputeSummary(uid, test, admin, now)))

    return {
      statusCode: 200,
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ updated: uniqueIds.length, period: periodValue })
    }
  } catch (err: any) {
    console.error('bulkUpdatePeriods error', err)
    return {
      statusCode: err?.statusCode || err?.status || 500,
      body: JSON.stringify({ error: err?.message || 'Internal error' })
    }
  }
}

export const handler = withCors(baseHandler, {
  methods: ['POST', 'OPTIONS'],
  headers: ['Accept', 'Content-Type', 'Authorization']
})
