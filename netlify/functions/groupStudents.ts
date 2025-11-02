import type { Handler } from '@netlify/functions'
import { getAdmin, verifyBearerUid } from './_lib/firebaseAdmin'
import { callGemini } from './_lib/gemini'

type StudentRecord = {
  name: string
  email: string
  readiness?: string
  period?: number
  quarter?: string
}

type GeminiGroup = {
  id: string
  name: string
  rationale: string
  students: StudentRecord[]
}

function buildPrompt(mode: string, roster: StudentRecord[], refinement?: string) {
  const rosterSummary = roster
    .map((student) => `${student.name} | ${student.email} | readiness:${student.readiness ?? 'unknown'} | period:${student.period ?? 'n/a'}`)
    .join('\n')

  const instructions = `You are Synapse, an instructional planning AI. Analyze roster data and output JSON with groups.`

  return `"""
${instructions}
Mode: ${mode}
Refinement: ${refinement ?? 'n/a'}
Roster:
${rosterSummary}

Return JSON exactly matching:
{
  "groups": [
    {
      "id": "string",
      "name": "string",
      "rationale": "string",
      "students": [
        { "name": "string", "email": "string", "readiness": "string" }
      ]
    }
  ],
  "promptChips": ["optional suggested refinements"]
}
Each student should appear in exactly one group. Provide at least two groups."
"""`
}

export const handler: Handler = async (event) => {
  try {
    if (event.httpMethod !== 'POST') {
      return { statusCode: 405, body: 'Method not allowed' }
    }
    const uid = await verifyBearerUid(event.headers.authorization)
    const admin = getAdmin()
    const body = JSON.parse(event.body || '{}')
    const mode = body.mode === 'homogeneous' ? 'homogeneous' : 'heterogeneous'
    const refinement = typeof body.refinement === 'string' ? body.refinement : undefined

    const rosterSnap = await admin.firestore().collection(`users/${uid}/roster`).get()
    const roster: StudentRecord[] = []
    rosterSnap.forEach((docSnap) => {
      const data = docSnap.data() as any
      roster.push({
        name: data.name,
        email: data.email,
        readiness: data.readiness ?? data.level ?? null,
        period: data.period ?? undefined,
        quarter: data.quarter ?? undefined
      })
    })

    if (roster.length === 0) {
      return { statusCode: 400, body: JSON.stringify({ error: 'No roster records found. Upload a roster first.' }) }
    }

    const prompt = buildPrompt(mode, roster, refinement)
    const responseText = await callGemini(uid, 'Student grouping generated', prompt, 0.25)
    let parsed: { groups?: GeminiGroup[]; promptChips?: string[] }
    try {
      parsed = JSON.parse(responseText)
    } catch (err) {
      throw new Error(`Gemini returned invalid JSON: ${responseText}`)
    }

    if (!parsed.groups || !Array.isArray(parsed.groups)) {
      throw new Error('Gemini response missing groups')
    }

    const groupsCollection = admin.firestore().collection(`users/${uid}/groups`)
    const batch = admin.firestore().batch()
    parsed.groups.forEach((group) => {
      const ref = groupsCollection.doc(group.id)
      batch.set(ref, {
        name: group.name,
        rationale: group.rationale,
        students: group.students,
        mode,
        refinement: refinement ?? null,
        createdAt: admin.firestore.FieldValue.serverTimestamp()
      })
    })
    await batch.commit()

    return {
      statusCode: 200,
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ groups: parsed.groups, promptChips: parsed.promptChips ?? [] })
    }
  } catch (err: any) {
    console.error(err)
    return {
      statusCode: err.status || 500,
      body: JSON.stringify({ error: err.message ?? 'Internal error' })
    }
  }
}
