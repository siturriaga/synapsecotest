import type { Handler, HandlerContext, HandlerEvent } from '@netlify/functions'
import { getAdmin, verifyBearerUid } from './_lib/firebaseAdmin'
import { callGemini } from './_lib/gemini'

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

type ClassContext = {
  pedagogy?: PedagogyFocus | null
  groups?: Array<{
    id: string
    label: string
    range: string
    studentCount: number
    recommendedPractices: string[]
    studentNames: string[]
  }>
}

type ClassGroup = NonNullable<ClassContext['groups']>[number]

export const handler: Handler = async (event: HandlerEvent, _context: HandlerContext) => {
  try {
    if (event.httpMethod !== 'POST') {
      return { statusCode: 405, body: 'Method not allowed' }
    }
    const uid = await verifyBearerUid(event.headers.authorization)
    const body = JSON.parse(event.body || '{}')
    const {
      standardCode,
      standardName,
      focus,
      subject,
      grade,
      assessmentType,
      questionCount,
      includeRemediation,
      classContext
    } = body as typeof body & { classContext?: ClassContext }
    if (!standardCode || !standardName || !assessmentType || !questionCount) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'standardCode, standardName, assessmentType, and questionCount are required' })
      }
    }

    const context = classContext ?? {}
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
    const groups: ClassGroup[] = Array.isArray(context.groups) ? context.groups : []
    const groupNarrative = groups.length
      ? groups
          .map(
            (group: ClassGroup) =>
              `- ${group.label} (${group.range}, ${group.studentCount} learners; names: ${group.studentNames.join(
                ', '
              ) || 'n/a'}). Recommended practices: ${group.recommendedPractices.join('; ')}`
          )
          .join('\n')
      : '- No grouped learner insights provided. Design equitable supports across readiness levels.'

    const prompt = `"""
You are Synapse, a teacher co-pilot. Design an assessment blueprint that a middle school teacher can deploy immediately.
Subject: ${subject}
Grade: ${grade}
Standard: ${standardCode} — ${standardName}
Focus: ${focus || 'Use evidence-based instructional strategies.'}
Assessment type: ${assessmentType}
Total questions requested: ${questionCount}
Remediation required: ${includeRemediation ? 'yes' : 'no'}

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
Infuse every element with inclusive, anti-deficit language and emphasize student agency, collaboration, and community relevance.
Keep responses concise and free of markdown."""`

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
    return {
      statusCode: err.status || 500,
      body: JSON.stringify({ error: err.message ?? 'Internal error' })
    }
  }
}
