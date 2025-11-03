import type { Handler } from '@netlify/functions'
import { getAdmin, verifyBearerUid } from './_lib/firebaseAdmin'
import { callGemini } from './_lib/gemini'

type CoachInsight = {
  summary: string
  keyInsights: string[]
  recommendedActions: string[]
  dataHighlights: string[]
  suggestedArtifacts?: string[]
}

export const handler: Handler = async (event) => {
  try {
    if (event.httpMethod !== 'POST') {
      return { statusCode: 405, body: 'Method not allowed' }
    }

    const uid = await verifyBearerUid(event.headers.authorization)
    const body = JSON.parse(event.body || '{}') as { question?: string }
    const question = (body.question ?? '').trim()

    if (!question) {
      return { statusCode: 400, body: JSON.stringify({ error: 'question is required' }) }
    }

    const admin = getAdmin()
    const firestore = admin.firestore()

    const snapshotDoc = await firestore.doc(`users/${uid}/workspace_cache/rosterSnapshot`).get()
    const snapshot = snapshotDoc.data() ?? {}
    const highlights = snapshot.highlights ?? {}
    const latestAssessment = snapshot.latestAssessment ?? null
    const groupInsights = Array.isArray(snapshot.groupInsights) ? snapshot.groupInsights : []
    const pedagogy = snapshot.pedagogy ?? null

    const metricsDoc = await firestore.doc(`users/${uid}/dashboard_stats/metrics`).get()
    const metrics = metricsDoc.data() ?? {}

    const contextLines: string[] = []
    if (metrics.totalEnrollment) {
      contextLines.push(`Total learners scored: ${metrics.totalEnrollment}.`)
    }
    if (latestAssessment?.testName) {
      contextLines.push(
        `Latest assessment ${latestAssessment.testName} averages ${latestAssessment.averageScore ?? 'n/a'} across ${
          latestAssessment.studentCount ?? 'n/a'
        } students.`
      )
    }
    if (Array.isArray(highlights.topStudents) && highlights.topStudents.length) {
      contextLines.push(
        `Top performers: ${highlights.topStudents
          .slice(0, 3)
          .map((student: any) => `${student.name ?? 'Student'} (${student.score ?? 'n/a'})`)
          .join(', ')}.`
      )
    }
    if (Array.isArray(highlights.needsSupport) && highlights.needsSupport.length) {
      contextLines.push(
        `Learners needing support: ${highlights.needsSupport
          .slice(0, 3)
          .map((student: any) => `${student.name ?? 'Student'} (${student.score ?? 'n/a'})`)
          .join(', ')}.`
      )
    }
    if (Array.isArray(groupInsights) && groupInsights.length) {
      contextLines.push(
        `Group insights: ${groupInsights
          .map(
            (group: any) =>
              `${group.label ?? 'Group'} (${group.range ?? 'n/a'}, ${group.studentCount ?? 0} learners)`
          )
          .join('; ')}.`
      )
    }
    if (pedagogy?.summary) {
      contextLines.push(`Pedagogy commitments: ${pedagogy.summary}`)
    }

    const context = contextLines.join('\n') || 'No recent roster data available yet.'

    const prompt = `"""
You are Synapse, a premium instructional coach grounded in critical pedagogy, culturally responsive teaching, and Universal Design for Learning.
A teacher asked: "${question}"

Classroom context:
${context}

Respond with empathetic, asset-based language. Provide three concise sections in JSON only:
{
  "summary": "Two-sentence overview answering the teacher",
  "keyInsights": ["Up to 3 bullet insights referencing the data"],
  "recommendedActions": ["Up to 3 concrete next instructional moves"],
  "dataHighlights": ["Metrics or roster details that support the response"],
  "suggestedArtifacts": ["Optional artifacts to generate (e.g., practice set, family update)"]
}
Keep language professional yet encouraging, and cite specific data points when available. Do not include markdown.
"""`

    const responseText = await callGemini(uid, 'Instructional coaching insight', prompt, 0.35)

    let parsed: CoachInsight
    try {
      parsed = JSON.parse(responseText) as CoachInsight
    } catch (error) {
      throw new Error(`Gemini returned invalid JSON: ${responseText}`)
    }

    await firestore.collection(`users/${uid}/coach_sessions`).add({
      question,
      response: parsed,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    })

    return {
      statusCode: 200,
      body: JSON.stringify(parsed)
    }
  } catch (error: any) {
    console.error('Coach insight failure', error)
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error?.message ?? 'Unable to generate coaching insight' })
    }
  }
}
