import type { Handler } from '@netlify/functions'
import { getAdmin, verifyBearerUid } from './_lib/firebaseAdmin'
import { callGemini } from './_lib/gemini'

type LessonTier = {
  tier: string
  objective: string
  activities: string[]
  checks: string[]
  materials: string[]
  rationale: string
}

type LessonPlan = {
  standardCode: string
  summary: string
  tiers: LessonTier[]
}

export const handler: Handler = async (event) => {
  try {
    if (event.httpMethod !== 'POST') {
      return { statusCode: 405, body: 'Method not allowed' }
    }
    const uid = await verifyBearerUid(event.headers.authorization)
    const body = JSON.parse(event.body || '{}')
    const { standardCode, standardName, focus, subject, grade } = body
    if (!standardCode || !standardName) {
      return { statusCode: 400, body: JSON.stringify({ error: 'standardCode and standardName are required' }) }
    }

    const prompt = `"""
You are Synapse, a teacher co-pilot. Generate a differentiated lesson plan using Google Gemini.
Subject: ${subject}
Grade: ${grade}
Standard: ${standardCode} — ${standardName}
Focus: ${focus || 'Use evidence-based instructional strategies.'}

Return strict JSON matching:
{
  "standardCode": "${standardCode}",
  "summary": "string overview",
  "tiers": [
    {
      "tier": "Emerging" | "On-level" | "Accelerated",
      "objective": "string",
      "activities": ["string"],
      "checks": ["string"],
      "materials": ["string"],
      "rationale": "string"
    }
  ]
}
Ensure exactly three tiers named Emerging, On-level, Accelerated in that order.
Include rationale referencing learner readiness and the provided focus."
"""`

    const responseText = await callGemini(uid, 'Lesson generated', prompt, 0.45)
    let parsed: LessonPlan
    try {
      parsed = JSON.parse(responseText) as LessonPlan
    } catch (err) {
      throw new Error(`Gemini returned invalid JSON: ${responseText}`)
    }

    if (!parsed?.tiers || parsed.tiers.length === 0) {
      throw new Error('Gemini response missing tiers')
    }

    const admin = getAdmin()
    await admin.firestore().collection(`users/${uid}/assignments`).add({
      title: `${standardCode} lesson`,
      standardCode,
      plan: parsed,
      status: 'draft',
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    })

    return {
      statusCode: 200,
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(parsed)
    }
  } catch (err: any) {
    console.error(err)
    return {
      statusCode: err.status || 500,
      body: JSON.stringify({ error: err.message ?? 'Internal error' })
    }
  }
}
