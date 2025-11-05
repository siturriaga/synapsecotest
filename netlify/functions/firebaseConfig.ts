import type { Handler } from '@netlify/functions'
import { withCors } from './_lib/cors'

const REQUIRED_KEYS: Record<string, readonly string[]> = {
  apiKey: ['FIREBASE_WEB_API_KEY', 'VITE_FIREBASE_API_KEY'],
  authDomain: ['FIREBASE_WEB_AUTH_DOMAIN', 'VITE_FIREBASE_AUTH_DOMAIN'],
  projectId: ['FIREBASE_WEB_PROJECT_ID', 'VITE_FIREBASE_PROJECT_ID'],
  messagingSenderId: ['FIREBASE_WEB_MESSAGING_SENDER_ID', 'VITE_FIREBASE_MESSAGING_SENDER_ID'],
  appId: ['FIREBASE_WEB_APP_ID', 'VITE_FIREBASE_APP_ID']
}

const OPTIONAL_KEYS: Record<string, readonly string[]> = {
  storageBucket: ['FIREBASE_WEB_STORAGE_BUCKET', 'VITE_FIREBASE_STORAGE_BUCKET']
}

function readEnv(keys: readonly string[]): string | undefined {
  for (const key of keys) {
    const value = process.env[key]
    if (typeof value === 'string' && value.trim().length > 0) {
      return value
    }
  }
  return undefined
}

const baseHandler: Handler = async () => {
  const config: Record<string, string> = {}
  const missing: string[] = []

  for (const [prop, envKeys] of Object.entries(REQUIRED_KEYS)) {
    const value = readEnv(envKeys)
    if (!value) {
      missing.push(envKeys[0])
      continue
    }
    config[prop] = value
  }

  for (const [prop, envKeys] of Object.entries(OPTIONAL_KEYS)) {
    const value = readEnv(envKeys)
    if (value) {
      config[prop] = value
    }
  }

  if (missing.length > 0) {
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ error: 'Missing Firebase config', missing })
    }
  }

  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=60'
    },
    body: JSON.stringify(config)
  }
}

export const handler = withCors(baseHandler, { methods: ['GET', 'OPTIONS'] })
