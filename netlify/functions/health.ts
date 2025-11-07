import type { Handler } from '@netlify/functions'
import { getAdmin } from './_lib/firebaseAdmin'

type SubsystemStatus = {
  configured: boolean
  error?: string
}

type HealthPayload = {
  ok: boolean
  timestamp: string
  firebaseAdmin: SubsystemStatus
  gemini: SubsystemStatus
  notes: string[]
}

function summarizeFirebase(): SubsystemStatus {
  try {
    getAdmin()
    return { configured: true }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Firebase Admin is not configured.'
    return { configured: false, error: message }
  }
}

function summarizeGemini(): SubsystemStatus {
  const key = process.env.GEMINI_API_KEY
  if (typeof key === 'string' && key.trim()) {
    return { configured: true }
  }
  return { configured: false, error: 'GEMINI_API_KEY is missing.' }
}

export const handler: Handler = async () => {
  const firebaseAdmin = summarizeFirebase()
  const gemini = summarizeGemini()
  const ok = firebaseAdmin.configured && gemini.configured

  const notes: string[] = []
  if (!firebaseAdmin.configured && firebaseAdmin.error) {
    notes.push('Add FIREBASE_* credentials to this Netlify environment so user data can load.')
  }
  if (!gemini.configured) {
    notes.push('Set GEMINI_API_KEY to enable Gemini-backed assignment generation.')
  }

  const payload: HealthPayload = {
    ok,
    timestamp: new Date().toISOString(),
    firebaseAdmin,
    gemini,
    notes
  }

  return {
    statusCode: ok ? 200 : 503,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store'
    },
    body: JSON.stringify(payload)
  }
}

