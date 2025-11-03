import type { Handler } from '@netlify/functions'
import { getAdmin, verifyBearerUid } from './_lib/firebaseAdmin'
import { callGemini } from './_lib/gemini'

type StudentRecord = {
  id: string
  name: string
  score: number | null
  readiness?: string | null
  period?: number | null
  quarter?: string | null
}

type GeminiGroup = {
  id?: string
  name?: string
  rationale?: string
  students?: Array<{
    id?: string
    name?: string
    readiness?: string | null
    period?: number | null
    quarter?: string | null
    score?: number | null
  }>
}

function scoreBand(score: number | null): string | null {
  if (score === null || Number.isNaN(score)) return null
  if (score >= 85) return 'Extending mastery'
  if (score >= 70) return 'Developing understanding'
  return 'Foundation support needed'
}

function buildPrompt(mode: string, roster: StudentRecord[], refinement?: string) {
  const rosterSummary = roster
    .map((student) =>
      [
        `id:${student.id}`,
        `name:${student.name}`,
        `score:${student.score ?? 'n/a'}`,
        `readiness:${student.readiness ?? 'unknown'}`,
        `period:${student.period ?? 'n/a'}`,
        `quarter:${student.quarter ?? 'n/a'}`
      ].join(' | ')
    )
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
        {
          "id": "string",
          "name": "string",
          "readiness": "string",
          "period": 1,
          "quarter": "Q1",
          "score": 82.5
        }
      ]
    }
  ],
  "promptChips": ["optional suggested refinements"]
}
Use null for period, quarter, or score when the roster data does not provide them.
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

    const roster: StudentRecord[] = []

    const studentsSnap = await admin.firestore().collection(`users/${uid}/students`).get()
    studentsSnap.forEach((docSnap) => {
      const data = docSnap.data() as any
      roster.push({
        id: docSnap.id,
        name: data.displayName ?? data.name ?? 'Unknown learner',
        score: typeof data.lastScore === 'number' ? data.lastScore : null,
        readiness:
          data.readiness ?? (typeof data.lastScore === 'number' ? scoreBand(data.lastScore) : null),
        period: typeof data.period === 'number' ? data.period : null,
        quarter: typeof data.quarter === 'string' ? data.quarter : null
      })
    })

    if (roster.length === 0) {
      const legacySnap = await admin.firestore().collection(`users/${uid}/roster`).get()
      legacySnap.forEach((docSnap) => {
        const data = docSnap.data() as any
        roster.push({
          id: docSnap.id,
          name: data.displayName ?? data.name ?? data.fullName ?? 'Unknown learner',
          score: typeof data.score === 'number' ? data.score : null,
          readiness:
            data.readiness ?? (typeof data.score === 'number' ? scoreBand(data.score) : null),
          period:
            typeof data.period === 'number'
              ? data.period
              : typeof data.period === 'string'
              ? Number.parseInt(data.period, 10)
              : null,
          quarter: typeof data.quarter === 'string' ? data.quarter : null
        })
      })
    }

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

    const rosterById = new Map(roster.map((student) => [student.id, student]))
    const rosterByName = new Map(
      roster
        .filter((student) => Boolean(student.name))
        .map((student) => [student.name.toLowerCase(), student])
    )

    const normalizedGroups = parsed.groups.map((group, index) => {
      const rawStudents = Array.isArray(group.students) ? group.students : []
      const normalizedStudents = rawStudents
        .map((student) => {
          const lookup =
            (student.id && rosterById.get(student.id)) ||
            (student.name && rosterByName.get(student.name.toLowerCase()))
          const fallbackScore =
            typeof lookup?.score === 'number' ? lookup.score : null
          const numericScore =
            typeof student.score === 'number'
              ? student.score
              : typeof student.score === 'string'
              ? Number.parseFloat(student.score)
              : null
          const resolvedScore =
            typeof numericScore === 'number' && Number.isFinite(numericScore)
              ? numericScore
              : fallbackScore
          const name = student.name?.trim() || lookup?.name || 'Unknown learner'
          const id =
            student.id?.trim() || lookup?.id || `student-${Math.random().toString(36).slice(2, 10)}`
          const parsedPeriod =
            typeof student.period === 'number'
              ? student.period
              : typeof student.period === 'string' && student.period.trim()
              ? Number.parseInt(student.period, 10)
              : null
          return {
            id,
            name,
            readiness:
              student.readiness?.trim() ||
              (lookup?.readiness ?? scoreBand(resolvedScore)),
            period:
              typeof parsedPeriod === 'number' && Number.isFinite(parsedPeriod)
                ? parsedPeriod
                : typeof lookup?.period === 'number'
                ? lookup.period
                : null,
            quarter:
              typeof student.quarter === 'string' && student.quarter.trim()
                ? student.quarter.trim()
                : lookup?.quarter ?? null,
            score: resolvedScore
          }
        })
        .filter((student) => Boolean(student.name))

      return {
        id: group.id || `group-${index + 1}`,
        name: group.name || `Group ${index + 1}`,
        rationale:
          group.rationale?.trim() || 'Instructional focus generated by Gemini.',
        students: normalizedStudents
      }
    })

    parsed.groups = normalizedGroups

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
