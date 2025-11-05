
import { initializeApp, type FirebaseOptions } from 'firebase/app'
import {
  browserLocalPersistence,
  getAuth,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signInWithRedirect,
  signOut,
  getRedirectResult,
  setPersistence
} from 'firebase/auth'
import { getFirestore, initializeFirestore } from 'firebase/firestore'
import {
  API_PREFIX,
  joinUrl,
  LOCAL_NETLIFY_ORIGIN,
  NETLIFY_PREFIX,
  REMOTE_API_BASE,
  REMOTE_BASE_INCLUDES_FUNCTION_PREFIX,
  REMOTE_FUNCTION_BASE
} from './utils/netlifyTargets'

type EnvSource = Record<string, string | undefined>

let envSource: EnvSource = {}

const maybeImportMeta: any = typeof import.meta !== 'undefined' ? import.meta : undefined
if (maybeImportMeta?.env?.DEV) {
  envSource = maybeImportMeta.env as EnvSource
} else if (typeof process !== 'undefined') {
  envSource = process.env as EnvSource
}

function readEnv(key: keyof EnvSource): string {
  const value = envSource?.[key]
  return typeof value === 'string' ? value : ''
}

declare global {
  interface Window {
    __FIREBASE_CONFIG__?: FirebaseOptions
  }
}

function buildEnvConfig(): FirebaseOptions {
  const config: FirebaseOptions = {
    apiKey: readEnv('VITE_FIREBASE_API_KEY'),
    authDomain: readEnv('VITE_FIREBASE_AUTH_DOMAIN'),
    projectId: readEnv('VITE_FIREBASE_PROJECT_ID'),
    messagingSenderId: readEnv('VITE_FIREBASE_MESSAGING_SENDER_ID'),
    appId: readEnv('VITE_FIREBASE_APP_ID')
  }

  const storageBucket = readEnv('VITE_FIREBASE_STORAGE_BUCKET')
  if (storageBucket) {
    config.storageBucket = storageBucket
  }

  return config
}

const FIREBASE_FUNCTION_SEGMENTS = ['firebaseConfig', 'firebase-config'] as const

function isBrowserEnvironment() {
  return typeof window !== 'undefined'
}

function buildRuntimeTargets(): string[] {
  if (!isBrowserEnvironment()) {
    return []
  }

  const targets: string[] = []
  const append = (value: string) => {
    if (!targets.includes(value)) {
      targets.push(value)
    }
  }

  for (const segment of FIREBASE_FUNCTION_SEGMENTS) {
    append(`${NETLIFY_PREFIX}${segment}`)
    append(`${API_PREFIX}${segment}`)

    if (window.location.hostname === 'localhost') {
      append(`${LOCAL_NETLIFY_ORIGIN}${NETLIFY_PREFIX}${segment}`)
    }

    const functionPath = segment

    if (REMOTE_BASE_INCLUDES_FUNCTION_PREFIX) {
      append(joinUrl(REMOTE_FUNCTION_BASE, functionPath))
    } else {
      append(joinUrl(REMOTE_FUNCTION_BASE, `${NETLIFY_PREFIX}${functionPath}`))
    }

    if (REMOTE_API_BASE) {
      append(joinUrl(REMOTE_API_BASE, functionPath))
    }
  }

  return targets
}

const REQUIRED_CONFIG_KEYS: Array<keyof FirebaseOptions> = [
  'apiKey',
  'authDomain',
  'projectId',
  'messagingSenderId',
  'appId'
]

function isValidConfig(config: any): config is FirebaseOptions {
  if (!config || typeof config !== 'object') {
    return false
  }
  return REQUIRED_CONFIG_KEYS.every((key) => {
    const value = (config as FirebaseOptions)[key]
    return typeof value === 'string' && value.length > 0
  })
}

function loadBrowserConfig(): FirebaseOptions | null {
  if (typeof window === 'undefined') {
    return null
  }

  if (window.__FIREBASE_CONFIG__) {
    return window.__FIREBASE_CONFIG__
  }

  const targets = buildRuntimeTargets()

  for (const target of targets) {
    try {
      const request = new XMLHttpRequest()
      request.open('GET', target, false)
      request.send()

      if (request.status < 200 || request.status >= 300) {
        console.warn('Firebase config request failed', target, request.status)
        continue
      }

      try {
        const parsed = JSON.parse(request.responseText)
        if (isValidConfig(parsed)) {
          window.__FIREBASE_CONFIG__ = parsed
          return parsed
        }

        const missing = REQUIRED_CONFIG_KEYS.filter((key) => {
          const value = (parsed as FirebaseOptions)[key]
          return typeof value !== 'string' || value.length === 0
        })

        console.warn('Firebase config response missing fields', target, missing)
      } catch (error) {
        console.warn('Unable to parse Firebase config from runtime', target, error)
      }
    } catch (error) {
      console.warn('Unable to load Firebase config from runtime', target, error)
    }
  }

  return null
}

const firebaseConfig = loadBrowserConfig() ?? buildEnvConfig()

export const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)

let firestoreInstance: ReturnType<typeof getFirestore>
try {
  firestoreInstance = initializeFirestore(app, {
    experimentalAutoDetectLongPolling: true
  })
} catch (err) {
  console.warn('Falling back to default Firestore initialization', err)
  firestoreInstance = getFirestore(app)
}

export const db = firestoreInstance

const provider = new GoogleAuthProvider()
provider.setCustomParameters({ prompt: 'select_account' })

const popupFallbackCodes = new Set([
  'auth/popup-blocked',
  'auth/internal-error'
])

function detectPopupRestrictions() {
  if (typeof window === 'undefined') {
    return false
  }
  try {
    if (window.crossOriginIsolated) {
      return true
    }
    if (typeof document !== 'undefined') {
      const coopMeta = document.querySelector('meta[http-equiv="Cross-Origin-Opener-Policy"]')
      const policy = coopMeta?.getAttribute('content')?.toLowerCase().trim()
      if (policy && policy !== 'same-origin-allow-popups') {
        return true
      }
    }
  } catch (err) {
    console.warn('Unable to determine popup restrictions', err)
  }
  return false
}

let preferRedirect = detectPopupRestrictions()

function shouldUseRedirect() {
  if (preferRedirect) {
    return true
  }
  if (detectPopupRestrictions()) {
    preferRedirect = true
    return true
  }
  return false
}

function isPopupBlockedError(err: any, message: string | undefined) {
  if (err?.code && popupFallbackCodes.has(err.code)) {
    return true
  }
  if (!message) {
    return false
  }
  return message.includes('Cross-Origin-Opener-Policy') || message.includes('window.close') || message.includes('window.closed')
}

async function ensurePersistence() {
  try {
    await setPersistence(auth, browserLocalPersistence)
  } catch (err) {
    console.warn('Unable to persist auth session', err)
  }
}

export async function googleSignIn() {
  await ensurePersistence()
  if (shouldUseRedirect()) {
    await signInWithRedirect(auth, provider)
    return
  }
  try {
    await signInWithPopup(auth, provider)
  } catch (err: any) {
    const message: string | undefined = typeof err?.message === 'string' ? err.message : undefined
    if (shouldUseRedirect() || isPopupBlockedError(err, message)) {
      preferRedirect = true
      await signInWithRedirect(auth, provider)
      return
    }
    throw err
  }
}

export async function logout() {
  return await signOut(auth)
}

export function onAuth(cb: (user: import('firebase/auth').User | null) => void) {
  return onAuthStateChanged(auth, cb)
}

export async function resolveRedirectResult() {
  try {
    return await getRedirectResult(auth)
  } catch (err: any) {
    if (err?.code === 'auth/no-auth-event') {
      return null
    }
    throw err
  }
}
