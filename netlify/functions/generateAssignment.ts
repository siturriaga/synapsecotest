import type { Handler } from '@netlify/functions'
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
  }
  levels: AssessmentLevel[]
}

export const handler: Handler = async (event) => {
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
      includeRemediation
    } = body
    if (!standardCode || !standardName || !assessmentType || !questionCount) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'standardCode, standardName, assessmentType, and questionCount are required' })
      }
    }

    const prompt = `"""
You are Synapse, a teacher co-pilot. Design an assessment blueprint that a middle school teacher can deploy immediately.
Subject: ${subject}
Grade: ${grade}
Standard: ${standardCode} — ${standardName}
Focus: ${focus || 'Use evidence-based instructional strategies.'}
Assessment type: ${assessmentType}
Total questions requested: ${questionCount}
Remediation required: ${includeRemediation ? 'yes' : 'no'}

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
    "nextSteps": ["3 actionable next steps"]
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
