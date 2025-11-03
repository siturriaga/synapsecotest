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

const DEFAULT_MODELS = [
  'gemini-1.5-flash-latest',
  'gemini-1.5-pro-latest',
  'gemini-1.5-pro',
  'gemini-1.5-pro-002',
  'gemini-1.5-pro-001',
  'gemini-1.0-pro',
  'gemini-pro'
]

const DEFAULT_API_VERSION = 'v1'

async function generateWithModel(
  model: string,
  apiKey: string,
  payload: GeminiPayload
): Promise<Response> {
  const version = process.env.GEMINI_API_VERSION?.trim() || DEFAULT_API_VERSION
  const url = `https://generativelanguage.googleapis.com/${version}/models/${model}:generateContent?key=${apiKey}`
  return await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  })
}

export async function callGemini(uid: string, title: string, prompt: string, temperature = 0.35): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not set')
  }

  const preferred = process.env.GEMINI_MODEL?.trim()
  const models = [...new Set([preferred, ...DEFAULT_MODELS].filter(Boolean))] as string[]

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

  let lastError: string | null = null

  for (const model of models) {
    const res = await generateWithModel(model, apiKey, payload)
    if (!res.ok) {
      const text = await res.text()
      lastError = `Gemini error ${res.status}: ${text}`
      if (res.status === 404 || res.status === 400) {
        // Some models are not available in all regions/api versions; try the next one.
        continue
      }
      throw new Error(lastError)
    }

    const data = await res.json()
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text
    if (!text) {
      lastError = 'Gemini returned no text'
      continue
    }
    await log(uid, title, text, model)
    return text
  }

  throw new Error(lastError || 'Unable to reach Gemini')
}

async function log(uid: string, title: string, detail: string, model: string) {
  try {
    const admin = getAdmin()
    await admin.firestore().collection(`users/${uid}/logs`).add({
      title,
      detail,
      model,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    })
  } catch (err) {
    console.error('Failed to log Gemini output', err)
  }
}
