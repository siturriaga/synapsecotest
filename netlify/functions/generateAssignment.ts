import type { Handler, HandlerEvent } from '@netlify/functions'
import { getAdmin, verifyBearerUid } from './_lib/firebaseAdmin'
import { callGemini } from './_lib/gemini'
import { withCors } from './_lib/cors'

type AssessmentQuestion = {
  id: string
  prompt: string
  options?: string[]
  answer: string
  rationale: string
}

type AssessmentLevel = {
  level: string
  description: string
  questions: AssessmentQuestion[]
  remediation: string[]
}

type AssessmentBlueprint = {
  standardCode: string
  standardName: string
  subject: string
  grade: string
  assessmentType: string
  questionCount: number
  aiInsights: {
    overview: string
    classStrategies: string[]
    nextSteps: string[]
    pedagogy?: PedagogyFocus
  }
  levels: AssessmentLevel[]
}

type PedagogyFocus = {
  summary: string
  bestPractices: string[]
  reflectionPrompts: string[]
}

type ClassGroup = {
  id: string
  label: string
  range: string
  studentCount: number
  recommendedPractices: string[]
  studentNames: string[]
}

type ClassContext = {
  pedagogy?: PedagogyFocus | null
  groups?: ClassGroup[]
}

type GenerateAssignmentRequest = {
  standardCode?: string
  standardName?: string
  standardClarifications?: unknown
  standardObjectives?: unknown
  focus?: string
  subject?: string
  grade?: string
  assessmentType?: string
  questionCount?: number
  includeRemediation?: boolean
  classContext?: ClassContext | null
}

type NormalizedClassGroup = {
  id: string
  label: string
  range: string
  studentCount: number
  recommendedPractices: string[]
  studentNames: string[]
}

type NormalizedAssignmentError = {
  statusCode: number
  error: string
  detail?: string
}

function describeError(detail: string | undefined, statusCode: number): string {
  if (!detail) {
    return statusCode >= 500
      ? 'AI assignment generation is temporarily unavailable. Try again shortly.'
      : 'Assignment generation failed. Please try again.'
  }

  const normalized = detail.toLowerCase()

  if (normalized.includes('gemini error 429')) {
    return 'Gemini is receiving too many requests right now. Try again in a moment.'
  }

  if (normalized.includes('gemini error 4') && normalized.includes('safety')) {
    return 'Gemini flagged this request. Adjust the prompt and remove sensitive details before retrying.'
  }

  if (
    normalized.includes('invalid api key') ||
    normalized.includes('api key is not set') ||
    normalized.includes('api key is not configured')
  ) {
    return 'Gemini is not configured for this workspace. Contact your administrator.'
  }

  if (normalized.includes('unable to reach gemini')) {
    return 'Gemini could not be reached. Check your connection and try again.'
  }

  if (normalized.includes('gemini returned no text')) {
    return 'Gemini responded without content. Retry the request.'
  }

  return detail
}

function normalizeAssignmentError(error: unknown): NormalizedAssignmentError {
  let statusCode = 500
  let detail: string | undefined

  if (error && typeof error === 'object') {
    const maybeStatus = (error as any).status ?? (error as any).statusCode
    if (typeof maybeStatus === 'number' && Number.isFinite(maybeStatus) && maybeStatus >= 400) {
      statusCode = maybeStatus
    }

    const message = (error as any).message
    if (typeof message === 'string' && message.trim()) {
      detail = message.trim()
    }
  } else if (typeof error === 'string' && error.trim()) {
    detail = error.trim()
  }

  const friendly = describeError(detail, statusCode)

  return {
    statusCode,
    error: friendly,
    detail
  }
}

function normalizeStringArray(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value
      .map((item) => (typeof item === 'string' ? item.trim() : ''))
      .filter((item): item is string => Boolean(item))
  }
  if (typeof value === 'string') {
    return value
      .split(/[;,]/)
      .map((item) => item.trim())
      .filter((item) => item.length > 0)
  }
  return []
}

function normalizeClassGroups(groups: unknown): NormalizedClassGroup[] {
  if (!Array.isArray(groups)) return []
  return groups
    .map((group, index) => {
      if (!group || typeof group !== 'object') return null
      const raw = group as Partial<ClassGroup>
      const label = typeof raw.label === 'string' && raw.label.trim() ? raw.label.trim() : `Group ${index + 1}`
      const recommendedPractices = normalizeStringArray(raw.recommendedPractices)
      const studentNames = normalizeStringArray(raw.studentNames)
      return {
        id: typeof raw.id === 'string' && raw.id.trim() ? raw.id.trim() : `group-${index + 1}`,
        label,
        range: typeof raw.range === 'string' && raw.range.trim() ? raw.range.trim() : 'N/A',
        studentCount:
          typeof raw.studentCount === 'number' && Number.isFinite(raw.studentCount) && raw.studentCount >= 0
            ? Math.floor(raw.studentCount)
            : studentNames.length,
        recommendedPractices,
        studentNames
      }
    })
    .filter((group): group is NormalizedClassGroup => Boolean(group))
}

const baseHandler: Handler = async (event: HandlerEvent) => {
  try {
    if (event.httpMethod !== 'POST') {
      return { statusCode: 405, body: 'Method not allowed' }
    }
    const uid = await verifyBearerUid(event.headers.authorization)
    const body = (event.body ? JSON.parse(event.body) : {}) as GenerateAssignmentRequest
    const {
      standardCode,
      standardName,
      standardClarifications,
      standardObjectives,
      focus,
      subject,
      grade,
      assessmentType,
      questionCount,
      includeRemediation,
      classContext
    } = body
    if (!standardCode || !standardName || !assessmentType || !questionCount) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'standardCode, standardName, assessmentType, and questionCount are required' })
      }
    }

    const context: ClassContext = classContext ?? {}
    const clarifications = normalizeStringArray(standardClarifications).slice(0, 5)
    const objectives = normalizeStringArray(standardObjectives).slice(0, 5)
    const normalizedGroups = normalizeClassGroups(context.groups)
    const pedagogySummary = context.pedagogy?.summary
      ? context.pedagogy.summary
      : 'Center critical pedagogy, culturally responsive teaching, and Universal Design for Learning (UDL).'
    const pedagogyPractices = (context.pedagogy?.bestPractices?.length
      ? context.pedagogy.bestPractices
      : [
          'Honor learner voice and lived experiences when framing problems.',
          'Provide multiple means of engagement, representation, and expression following UDL guidelines.',
          'Leverage collaborative, restorative routines that build collective efficacy.'
        ])
      .join('; ')
    const pedagogyReflections = (context.pedagogy?.reflectionPrompts?.length
      ? context.pedagogy.reflectionPrompts
      : [
          'How will learners critically connect this standard to their community?',
          'Which student voices will lead and which need invitation in the next lesson?'
        ])
      .join('; ')
    const groupNarrative = normalizedGroups.length
      ? normalizedGroups
          .map(
            (group) =>
              `- ${group.label} (${group.range}, ${group.studentCount} learners; names: ${group.studentNames.join(', ') || 'n/a'}). Recommended practices: ${group.recommendedPractices.join('; ')}`
          )
          .join('\n')
      : '- No grouped learner insights provided. Design equitable supports across readiness levels.'
    const clarificationNarrative = clarifications.length
      ? clarifications.map((item) => `- ${item}`).join('\n')
      : '- Use the official standard description to determine precise success criteria.'
    const objectiveNarrative = objectives.length
      ? objectives.map((item) => `- ${item}`).join('\n')
      : '- Draft measurable objectives that restate the standard in student-friendly language.'

    const prompt = `"""
You are Synapse, a teacher co-pilot. Design an assessment blueprint that a middle school teacher can deploy immediately.
Subject: ${subject}
Grade: ${grade}
Standard: ${standardCode} — ${standardName}
Focus: ${focus || 'Use evidence-based instructional strategies.'}
Assessment type: ${assessmentType}
Total questions requested: ${questionCount}
Remediation required: ${includeRemediation ? 'yes' : 'no'}

Standard clarifications:
${clarificationNarrative}

Learning objectives:
${objectiveNarrative}

Pedagogical commitments:
- Summary: ${pedagogySummary}
- Practices: ${pedagogyPractices}
- Reflection prompts: ${pedagogyReflections}

Learner group insights:
${groupNarrative}

Return strict JSON matching exactly:
{
  "standardCode": "${standardCode}",
  "standardName": "${standardName}",
  "subject": "${subject}",
  "grade": "${grade}",
  "assessmentType": "${assessmentType}",
  "questionCount": ${questionCount},
  "aiInsights": {
    "overview": "one paragraph connecting data to instruction",
    "classStrategies": ["3 concrete strategies"],
    "nextSteps": ["3 actionable next steps"],
    "pedagogy": {
      "summary": "connect to critical pedagogy, culturally responsive teaching, and UDL",
      "bestPractices": ["3 commitments that reflect the provided practices"],
      "reflectionPrompts": ["2 reflective questions for teachers"]
    }
  },
  "levels": [
    {
      "level": "Emerging",
      "description": "how this level scaffolds the skill",
      "questions": [
        {
          "id": "unique id",
          "prompt": "student-facing prompt",
          "options": ["A", "B", "C", "D"]?,
          "answer": "correct answer",
          "rationale": "teacher-facing explanation"
        }
      ],
      "remediation": ["targeted remediation moves"]
    },
    {
      "level": "On-level",
      "description": "what mastery looks like",
      "questions": [...],
      "remediation": [...]
    },
    {
      "level": "Accelerated",
      "description": "extension ideas",
      "questions": [...],
      "remediation": [...]
    }
  ]
}
Ensure questions are evenly distributed across levels and match the ${assessmentType} format.
For matching, return options as an array of definitions and use the answer to pair terms.
For reading_plus, include short evidence-based prompts.
Explicitly align every question, rationale, remediation step, and AI insight to the provided clarifications and objectives.
Infuse every element with inclusive, anti-deficit language and emphasize student agency, collaboration, and community relevance.
Keep responses concise and free of markdown."""`;

    const responseText = await callGemini(uid, 'Assessment generated', prompt, 0.5)
    let parsed: AssessmentBlueprint
    try {
      parsed = JSON.parse(responseText) as AssessmentBlueprint
    } catch (err) {
      throw new Error(`Gemini returned invalid JSON: ${responseText}`)
    }

    if (!parsed?.levels || parsed.levels.length !== 3) {
      throw new Error('Gemini response missing differentiated levels')
    }

    const fallbackPedagogy: PedagogyFocus = {
      summary: pedagogySummary,
      bestPractices: pedagogyPractices.split(';').map((item: string) => item.trim()).filter(Boolean),
      reflectionPrompts: pedagogyReflections.split(';').map((item: string) => item.trim()).filter(Boolean)
    }

    const existingPedagogy = parsed.aiInsights?.pedagogy
    const combine = (incoming: string[] | undefined, fallback: string[]) => {
      const merged = [...fallback]
      if (incoming && incoming.length) {
        incoming.forEach((item: string) => {
          const trimmed = item.trim()
          if (trimmed && !merged.includes(trimmed)) {
            merged.push(trimmed)
          }
        })
      }
      return merged
    }

    parsed.aiInsights = {
      overview: parsed.aiInsights?.overview ?? '',
      classStrategies: parsed.aiInsights?.classStrategies ?? [],
      nextSteps: parsed.aiInsights?.nextSteps ?? [],
      pedagogy: {
        summary: existingPedagogy?.summary?.trim() || fallbackPedagogy.summary,
        bestPractices: combine(existingPedagogy?.bestPractices, fallbackPedagogy.bestPractices),
        reflectionPrompts: combine(existingPedagogy?.reflectionPrompts, fallbackPedagogy.reflectionPrompts)
      }
    }

    const admin = getAdmin()
    await admin.firestore().collection(`users/${uid}/logs`).add({
      title: 'Assessment generated',
      detail: `${parsed.standardCode} · ${parsed.assessmentType} · ${parsed.questionCount} questions`,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    })

    return {
      statusCode: 200,
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(parsed)
    }
  } catch (err: any) {
    console.error(err)
    const normalized = normalizeAssignmentError(err)
    return {
      statusCode: normalized.statusCode,
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        error: normalized.error,
        ...(normalized.detail ? { detail: normalized.detail } : {})
      })
    }
  }
}

export const handler = withCors(baseHandler, {
  methods: ['POST', 'OPTIONS'],
  headers: ['Accept', 'Content-Type', 'Authorization']
})
