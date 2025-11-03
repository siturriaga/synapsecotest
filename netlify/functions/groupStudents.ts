import type { Handler, HandlerEvent } from '@netlify/functions'
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

type GeminiGroupStudent = NonNullable<GeminiGroup['students']>[number]

type NormalizedStudent = {
  id: string
  name: string
  readiness: string | null
  period: number | null
  quarter: string | null
  score: number | null
}

type NormalizedGroup = {
  id: string
  name: string
  rationale: string
  students: NormalizedStudent[]
}

type GroupStudentsRequest = {
  mode?: string
  refinement?: string
}

function scoreBand(score: number | null): string | null {
  if (score === null || Number.isNaN(score)) return null
  if (score >= 85) return 'Extending mastery'
  if (score >= 70) return 'Developing understanding'
  return 'Foundation support needed'
}

function resolveName(options: Array<unknown>, fallback: string): string {
  for (const option of options) {
    if (typeof option === 'string') {
      const trimmed = option.trim()
      if (trimmed) {
        return trimmed
      }
    }
  }
  return fallback
}

function parseScoreValue(value: unknown): number | null {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value
  }
  if (typeof value === 'string') {
    const parsed = Number.parseFloat(value)
    return Number.isFinite(parsed) ? parsed : null
  }
  return null
}

function parseInteger(value: unknown): number | null {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return Math.trunc(value)
  }
  if (typeof value === 'string') {
    const parsed = Number.parseInt(value, 10)
    return Number.isFinite(parsed) ? parsed : null
  }
  return null
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

export const handler: Handler = async (event: HandlerEvent) => {
  try {
    if (event.httpMethod !== 'POST') {
      return { statusCode: 405, body: 'Method not allowed' }
    }
    const uid = await verifyBearerUid(event.headers.authorization)
    const admin = getAdmin()
    const body = (event.body ? JSON.parse(event.body) : {}) as GroupStudentsRequest
    const mode = body.mode === 'homogeneous' ? 'homogeneous' : 'heterogeneous'
    const refinement = typeof body.refinement === 'string' ? body.refinement : undefined

    const roster: StudentRecord[] = []

    const studentsSnap = await admin.firestore().collection(`users/${uid}/students`).get()
    studentsSnap.forEach((docSnap) => {
      const data = docSnap.data() as Record<string, unknown>
      const score = parseScoreValue(data.lastScore)
      roster.push({
        id: docSnap.id,
        name: resolveName([data.displayName, data.name], 'Unknown learner'),
        score,
        readiness:
          typeof data.readiness === 'string' && data.readiness.trim()
            ? data.readiness.trim()
            : scoreBand(score),
        period: parseInteger(data.period),
        quarter:
          typeof data.quarter === 'string' && data.quarter.trim() ? data.quarter.trim() : null
      })
    })

    if (roster.length === 0) {
      const legacySnap = await admin.firestore().collection(`users/${uid}/roster`).get()
      legacySnap.forEach((docSnap) => {
        const data = docSnap.data() as Record<string, unknown>
        const score = parseScoreValue(data.score)
        roster.push({
          id: docSnap.id,
          name: resolveName([data.displayName, data.name, data.fullName], 'Unknown learner'),
          score,
          readiness:
            typeof data.readiness === 'string' && data.readiness.trim()
              ? data.readiness.trim()
              : scoreBand(score),
          period: parseInteger(data.period),
          quarter:
            typeof data.quarter === 'string' && data.quarter.trim() ? data.quarter.trim() : null
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

    const normalizedGroups: NormalizedGroup[] = parsed.groups.map((group, index) => {
      const rawStudents = Array.isArray(group.students) ? group.students : []
      const normalizedStudents: NormalizedStudent[] = rawStudents
        .map((student, studentIndex) => {
          if (!student || typeof student !== 'object') {
            return null
          }
          const raw = student as GeminiGroupStudent
          const rawId = typeof raw.id === 'string' ? raw.id.trim() : ''
          const rawName = typeof raw.name === 'string' ? raw.name.trim() : ''
          const lookupById = rawId ? rosterById.get(rawId) : undefined
          const lookupByName = rawName ? rosterByName.get(rawName.toLowerCase()) : undefined
          const lookup = lookupById ?? lookupByName
          const score = parseScoreValue(raw.score) ?? lookup?.score ?? null
          const period = parseInteger(raw.period) ?? lookup?.period ?? null
          const quarter =
            typeof raw.quarter === 'string' && raw.quarter.trim()
              ? raw.quarter.trim()
              : lookup?.quarter ?? null
          const readiness =
            typeof raw.readiness === 'string' && raw.readiness.trim()
              ? raw.readiness.trim()
              : lookup?.readiness ?? scoreBand(score)
          return {
            id: rawId || lookup?.id || `group-${index + 1}-student-${studentIndex + 1}`,
            name: rawName || lookup?.name || `Learner ${index + 1}-${studentIndex + 1}`,
            readiness,
            period,
            quarter,
            score
          }
        })
        .filter((student): student is NormalizedStudent => Boolean(student))

      return {
        id: typeof group.id === 'string' && group.id.trim() ? group.id.trim() : `group-${index + 1}`,
        name: typeof group.name === 'string' && group.name.trim() ? group.name.trim() : `Group ${index + 1}`,
        rationale:
          typeof group.rationale === 'string' && group.rationale.trim()
            ? group.rationale.trim()
            : 'Instructional focus generated by Gemini.',
        students: normalizedStudents
      }
    })

    const promptChips = Array.isArray(parsed.promptChips)
      ? parsed.promptChips
          .filter((chip): chip is string => typeof chip === 'string' && chip.trim().length > 0)
          .map((chip) => chip.trim())
      : []

    const groupsCollection = admin.firestore().collection(`users/${uid}/groups`)
    const batch = admin.firestore().batch()
    normalizedGroups.forEach((group) => {
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
      body: JSON.stringify({ groups: normalizedGroups, promptChips })
    }
  } catch (err: any) {
    console.error(err)
    return {
      statusCode: err.status || 500,
      body: JSON.stringify({ error: err.message ?? 'Internal error' })
    }
  }
}
