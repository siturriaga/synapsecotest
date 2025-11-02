import { getAdmin } from './firebaseAdmin'

type GeminiPayload = {
  contents: Array<{
    role: 'user'
    parts: Array<{ text: string }>
  }>
  safetySettings?: any
  generationConfig?: {
    temperature?: number
    topP?: number
    topK?: number
    maxOutputTokens?: number
    responseMimeType?: string
  }
}

export async function callGemini(uid: string, title: string, prompt: string, temperature = 0.35): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not set')
  }
  const payload: GeminiPayload = {
    contents: [
      {
        role: 'user',
        parts: [{ text: prompt }]
      }
    ],
    generationConfig: {
      temperature,
      responseMimeType: 'application/json'
    }
  }

  const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro-latest:generateContent?key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Gemini error ${res.status}: ${text}`)
  }
  const data = await res.json()
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text
  if (!text) {
    throw new Error('Gemini returned no text')
  }
  await log(uid, title, text)
  return text
}

async function log(uid: string, title: string, detail: string) {
  try {
    const admin = getAdmin()
    await admin.firestore().collection(`users/${uid}/logs`).add({
      title,
      detail,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    })
  } catch (err) {
    console.error('Failed to log Gemini output', err)
  }
}
