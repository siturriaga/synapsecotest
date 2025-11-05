import type { Handler } from '@netlify/functions'

const REQUIRED_KEYS = {
  apiKey: 'VITE_FIREBASE_API_KEY',
  authDomain: 'VITE_FIREBASE_AUTH_DOMAIN',
  projectId: 'VITE_FIREBASE_PROJECT_ID',
  messagingSenderId: 'VITE_FIREBASE_MESSAGING_SENDER_ID',
  appId: 'VITE_FIREBASE_APP_ID'
} as const

const OPTIONAL_KEYS = {
  storageBucket: 'VITE_FIREBASE_STORAGE_BUCKET'
} as const

function readEnv(key: string): string | undefined {
  const value = process.env[key]
  if (typeof value === 'string' && value.trim().length > 0) {
    return value
  }
  return undefined
}

export const handler: Handler = async () => {
  const config: Record<string, string> = {}
  const missing: string[] = []

  for (const [prop, envKey] of Object.entries(REQUIRED_KEYS)) {
    const value = readEnv(envKey)
    if (!value) {
      missing.push(envKey)
      continue
    }
    config[prop] = value
  }

  for (const [prop, envKey] of Object.entries(OPTIONAL_KEYS)) {
    const value = readEnv(envKey)
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
