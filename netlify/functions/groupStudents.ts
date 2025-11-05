import type { Handler, HandlerEvent } from '@netlify/functions'
import { getAdmin, verifyBearerUid } from './_lib/firebaseAdmin'
import { callGemini } from './_lib/gemini'
import { withCors } from './_lib/cors'

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

type HeuristicMetadata = {
  source: 'heuristic'
  reason: string
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

function normalizeStudent(record: StudentRecord, index: number): NormalizedStudent {
  return {
    id: record.id || `student-${index + 1}`,
    name: record.name || `Learner ${index + 1}`,
    readiness: record.readiness ?? scoreBand(record.score),
    period: record.period ?? null,
    quarter: record.quarter ?? null,
    score: record.score ?? null
  }
}

function ensureMinimumGroups(groups: NormalizedGroup[], roster: NormalizedStudent[]): NormalizedGroup[] {
  if (groups.length >= 2 || roster.length <= 3) {
    return groups.filter((group) => group.students.length > 0)
  }

  const midpoint = Math.ceil(roster.length / 2)
  return [
    {
      id: 'cohort-1',
      name: 'Cohort 1',
      rationale: 'Heuristic grouping to balance collaboration.',
      students: roster.slice(0, midpoint)
    },
    {
      id: 'cohort-2',
      name: 'Cohort 2',
      rationale: 'Heuristic grouping to balance collaboration.',
      students: roster.slice(midpoint)
    }
  ].filter((group) => group.students.length > 0)
}

function buildHeuristicGroups(mode: string, roster: StudentRecord[]): NormalizedGroup[] {
  const normalizedRoster = roster.map(normalizeStudent)
  if (!normalizedRoster.length) return []

  if (mode === 'homogeneous') {
    const buckets: Record<string, NormalizedStudent[]> = {
      extending: [],
      developing: [],
      foundation: [],
      unknown: []
    }

    normalizedRoster.forEach((student) => {
      const readiness = student.readiness ?? 'Readiness emerging'
      if (readiness.toLowerCase().includes('extend')) {
        buckets.extending.push(student)
      } else if (readiness.toLowerCase().includes('develop')) {
        buckets.developing.push(student)
      } else if (readiness.toLowerCase().includes('foundation')) {
        buckets.foundation.push(student)
      } else {
        buckets.unknown.push(student)
      }
    })

    const groups: NormalizedGroup[] = [
      {
        id: 'extending',
        name: 'Extension cohort',
        rationale: 'Learners ready to extend mastery through enrichment tasks.',
        students: buckets.extending
      },
      {
        id: 'developing',
        name: 'Developing cohort',
        rationale: 'Learners growing proficiency with targeted practice routines.',
        students: buckets.developing
      },
      {
        id: 'foundation',
        name: 'Foundation support cohort',
        rationale: 'Learners who will benefit from scaffolded review and guided modeling.',
        students: buckets.foundation
      },
      {
        id: 'conference',
        name: 'Coaching check-ins',
        rationale: 'Learners with missing or mixed readiness data for conferencing.',
        students: buckets.unknown
      }
    ]

    return ensureMinimumGroups(groups, normalizedRoster)
  }

  const sorted = [...normalizedRoster].sort((a, b) => {
    const scoreA = typeof a.score === 'number' ? a.score : -Infinity
    const scoreB = typeof b.score === 'number' ? b.score : -Infinity
    return scoreB - scoreA
  })

  const groupCount = Math.min(4, Math.max(2, Math.ceil(sorted.length / 8)))
  const groups: NormalizedGroup[] = Array.from({ length: groupCount }, (_, index) => ({
    id: `mix-${index + 1}`,
    name: `Collaborative cohort ${index + 1}`,
    rationale: 'Mixed-readiness grouping so mentors can support emerging learners.',
    students: [] as NormalizedStudent[]
  }))

  let left = 0
  let right = sorted.length - 1
  let index = 0
  while (left <= right) {
    const high = sorted[left++]
    groups[index].students.push(high)
    if (left <= right) {
      const low = sorted[right--]
      groups[index].students.push(low)
    }
    index = (index + 1) % groups.length
  }

  return ensureMinimumGroups(groups, normalizedRoster)
}

function heuristicChips(mode: string): string[] {
  if (mode === 'homogeneous') {
    return [
      'Shift a few developing learners into extension tasks',
      'Create a reteach seminar for foundation learners',
      'Plan conferences for learners with limited data'
    ]
  }
  return [
    'Try homogeneous grouping by readiness',
    'Pair student leaders with emerging learners',
    'Design inquiry stations by skill focus'
  ]
}

async function logHeuristic(uid: string, groups: NormalizedGroup[], mode: string, reason: string) {
  try {
    const admin = getAdmin()
    const detail = groups
      .map((group) => `${group.name}: ${group.students.map((student) => student.name).join(', ')}`)
      .join('\n')
    await admin
      .firestore()
      .collection(`users/${uid}/logs`)
      .add({
        title: 'Heuristic groups generated',
        detail: `Mode: ${mode}\nReason: ${reason}\n${detail}`,
        model: 'heuristic',
        createdAt: admin.firestore.FieldValue.serverTimestamp()
      })
  } catch (err) {
    console.error('Failed to log heuristic grouping', err)
  }
}

const baseHandler: Handler = async (event: HandlerEvent) => {
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

    let normalizedGroups: NormalizedGroup[] = []
    let promptChips: string[] = []
    let metadata: HeuristicMetadata | null = null

    try {
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

      normalizedGroups = parsed.groups.map((group, index) => {
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

      promptChips = Array.isArray(parsed.promptChips)
        ? parsed.promptChips
            .filter((chip): chip is string => typeof chip === 'string' && chip.trim().length > 0)
            .map((chip) => chip.trim())
        : []
    } catch (err: any) {
      console.error('Gemini grouping failed, using heuristic fallback', err)
      normalizedGroups = buildHeuristicGroups(mode, roster)
      promptChips = heuristicChips(mode)
      metadata = { source: 'heuristic', reason: err?.message ?? 'Gemini unavailable' }
      await logHeuristic(uid, normalizedGroups, mode, metadata.reason)
    }

    if (!normalizedGroups.length) {
      throw new Error('Unable to generate instructional groups')
    }

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
        source: metadata?.source ?? 'gemini',
        createdAt: admin.firestore.FieldValue.serverTimestamp()
      })
    })
    await batch.commit()

    const metricsRef = admin.firestore().doc(`users/${uid}/dashboard_stats/metrics`)
    const metricsSnap = await metricsRef.get()
    const previousCount = metricsSnap.exists ? Number(metricsSnap.data()?.aiGroupCount ?? 0) : 0
    await metricsRef.set(
      {
        aiGroupCount: normalizedGroups.length,
        aiGroupDelta: normalizedGroups.length - previousCount,
        aiGroupMode: mode,
        aiGroupSource: metadata?.source ?? 'gemini',
        lastAiGroupSyncAt: admin.firestore.FieldValue.serverTimestamp()
      },
      { merge: true }
    )

    const responseBody: Record<string, unknown> = {
      groups: normalizedGroups,
      promptChips
    }
    if (metadata) {
      responseBody.metadata = metadata
    }

    return {
      statusCode: 200,
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(responseBody)
    }
  } catch (err: any) {
    console.error(err)
    return {
      statusCode: err.status || 500,
      body: JSON.stringify({ error: err.message ?? 'Internal error' })
    }
  }
}

export const handler = withCors(baseHandler, {
  methods: ['POST', 'OPTIONS'],
  headers: ['Accept', 'Content-Type', 'Authorization']
})
