
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
import { getFirestore } from 'firebase/firestore'

type EnvSource = Record<string, string | undefined>

const envSource: EnvSource =
  (typeof import.meta !== 'undefined' && (import.meta as any)?.env ? ((import.meta as any).env as EnvSource) : undefined) ??
  (typeof process !== 'undefined' ? (process.env as EnvSource) : {})

function readEnv(key: keyof EnvSource): string {
  const value = envSource?.[key]
  if (typeof value === 'string') {
    return value
  }
  return ''
}

const firebaseConfig: FirebaseOptions = {
  apiKey: readEnv('VITE_FIREBASE_API_KEY'),
  authDomain: readEnv('VITE_FIREBASE_AUTH_DOMAIN'),
  projectId: readEnv('VITE_FIREBASE_PROJECT_ID'),
  messagingSenderId: readEnv('VITE_FIREBASE_MESSAGING_SENDER_ID'),
  appId: readEnv('VITE_FIREBASE_APP_ID')
}

const storageBucket = readEnv('VITE_FIREBASE_STORAGE_BUCKET')
if (storageBucket) {
  firebaseConfig.storageBucket = storageBucket
}

export const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const db = getFirestore(app)

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
