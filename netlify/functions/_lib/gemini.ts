import { getAdmin } from './firebaseAdmin'

type GeminiGenerationConfig = {
  temperature?: number
  topP?: number
  topK?: number
  maxOutputTokens?: number
  response_mime_type?: string
}

type GeminiPayload = {
  contents: Array<{
    role: 'user'
    parts: Array<{ text: string }>
  }>
  safety_settings?: any
  generation_config?: GeminiGenerationConfig
}

type GeminiRequest = GeminiPayload & { model: string }

const DEFAULT_MODELS = [
  'gemini-1.5-flash-latest',
  'gemini-1.5-pro-latest',
  'gemini-1.5-pro',
  'gemini-1.5-pro-002',
  'gemini-1.5-pro-001',
  'gemini-1.0-pro',
  'gemini-pro'
]

const DEFAULT_API_VERSION = 'v1beta'

type GeminiError = Error & { status?: number; detail?: string; originalStatus?: number }

function buildModelIdentifier(model: string): string {
  return model.startsWith('models/') ? model : `models/${model}`
}

function extractErrorDetail(raw: string | null): string {
  if (!raw) {
    return ''
  }
  const trimmed = raw.trim()
  if (!trimmed) {
    return ''
  }
  try {
    const parsed = JSON.parse(trimmed)
    if (parsed && typeof parsed === 'object') {
      const message = (parsed as any)?.error?.message || (parsed as any)?.message
      if (typeof message === 'string' && message.trim()) {
        return message.trim()
      }
    }
  } catch (err) {
    // Ignore JSON parse failures and fall back to the raw string
  }
  return trimmed
}

function createGeminiError(status: number, raw: string | null, model?: string): GeminiError {
  const detail = extractErrorDetail(raw)
  const originalStatus = status
  const normalizedStatus = status >= 400 && status < 600 ? status : 500
  const messageBase = detail || `Gemini request failed`
  const message = `Gemini error ${originalStatus}: ${messageBase}`
  const error = new Error(message) as GeminiError
  error.status = normalizedStatus
  error.detail = messageBase
  error.originalStatus = originalStatus
  if (model) {
    ;(error as any).model = model
  }
  return error
}

async function generateWithModel(model: string, apiKey: string, payload: GeminiPayload): Promise<Response> {
  const version = process.env.GEMINI_API_VERSION?.trim() || DEFAULT_API_VERSION
  const url = `https://generativelanguage.googleapis.com/${version}/responses:generate?key=${apiKey}`
  const request: GeminiRequest = {
    ...payload,
    model: buildModelIdentifier(model)
  }
  return await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request)
  })
}

function readCandidateText(candidate: any): string | null {
  const parts = candidate?.content?.parts
  if (!Array.isArray(parts) || parts.length === 0) {
    return null
  }
  const combined = parts
    .map((part) => (typeof part?.text === 'string' ? part.text : ''))
    .join('')
    .trim()
  return combined.length > 0 ? combined : null
}

export async function callGemini(uid: string, title: string, prompt: string, temperature = 0.35): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    throw createGeminiError(401, 'Gemini API key is not configured')
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
    generation_config: {
      temperature,
      response_mime_type: 'application/json'
    }
  }

  let lastModelError: GeminiError | null = null

  for (const model of models) {
    let res: Response
    try {
      res = await generateWithModel(model, apiKey, payload)
    } catch (networkErr: any) {
      const error = createGeminiError(503, networkErr?.message ?? 'Unable to reach Gemini', model)
      error.detail = networkErr?.message ?? 'Unable to reach Gemini'
      throw error
    }

    if (!res.ok) {
      const raw = await res.text()
      const error = createGeminiError(res.status, raw, model)

      // Some models are not available across regions/versions; try the next candidate.
      if (res.status === 404 || (res.status === 400 && (error.detail || '').toLowerCase().includes('model'))) {
        lastModelError = error
        continue
      }

      throw error
    }

    const data = await res.json()
    const candidates = data?.candidates || data?.result?.candidates
    if (Array.isArray(candidates)) {
      for (const candidate of candidates) {
        const text = readCandidateText(candidate)
        if (text) {
          await log(uid, title, text, model)
          return text
        }
      }
    }

    lastModelError = createGeminiError(502, 'Gemini returned no text', model)
  }

  if (lastModelError) {
    throw lastModelError
  }

  throw createGeminiError(503, 'Unable to reach Gemini')
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
