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

const REQUIRED_CONFIG_KEYS: Array<keyof FirebaseOptions> = [
  'apiKey',
  'authDomain',
  'projectId',
  'messagingSenderId',
  'appId'
]

const POPUP_FALLBACK_CODES = new Set([
  'auth/popup-blocked',
  'auth/internal-error'
])

type EnvLookup = Record<string, string | undefined>

declare global {
  interface Window {
    __FIREBASE_CONFIG__?: FirebaseOptions
  }
}

function readEnvValue(key: string): string {
  const maybeImportMeta: any = typeof import.meta !== 'undefined' ? import.meta : undefined
  const fromImportMeta = maybeImportMeta?.env?.[key]
  if (typeof fromImportMeta === 'string' && fromImportMeta.trim().length > 0) {
    return fromImportMeta.trim()
  }

  if (typeof process !== 'undefined' && typeof process.env === 'object') {
    const fromProcess = (process.env as EnvLookup)[key]
    if (typeof fromProcess === 'string' && fromProcess.trim().length > 0) {
      return fromProcess.trim()
    }
  }

  return ''
}

function buildEnvConfig(): FirebaseOptions {
  const config: FirebaseOptions = {
    apiKey: readEnvValue('VITE_FIREBASE_API_KEY'),
    authDomain: readEnvValue('VITE_FIREBASE_AUTH_DOMAIN'),
    projectId: readEnvValue('VITE_FIREBASE_PROJECT_ID'),
    messagingSenderId: readEnvValue('VITE_FIREBASE_MESSAGING_SENDER_ID'),
    appId: readEnvValue('VITE_FIREBASE_APP_ID')
  }

  const storageBucket = readEnvValue('VITE_FIREBASE_STORAGE_BUCKET')
  if (storageBucket) {
    config.storageBucket = storageBucket
  }

  return config
}

function isValidConfig(config: FirebaseOptions | undefined): config is FirebaseOptions {
  if (!config) {
    return false
  }

  return REQUIRED_CONFIG_KEYS.every((key) => {
    const value = config[key]
    return typeof value === 'string' && value.length > 0
  })
}

function resolveFirebaseConfig(): FirebaseOptions {
  if (typeof window !== 'undefined' && window.__FIREBASE_CONFIG__ && isValidConfig(window.__FIREBASE_CONFIG__)) {
    return window.__FIREBASE_CONFIG__
  }

  const envConfig = buildEnvConfig()
  if (!isValidConfig(envConfig)) {
    console.warn('Firebase configuration is incomplete. Check your VITE_FIREBASE_* values.')
  }
  return envConfig
}

const firebaseConfig = resolveFirebaseConfig()

export const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)

let firestoreInstance: ReturnType<typeof getFirestore>
try {
  firestoreInstance = initializeFirestore(app, {
    experimentalAutoDetectLongPolling: true
  })
} catch (error) {
  console.warn('Falling back to default Firestore initialization', error)
  firestoreInstance = getFirestore(app)
}

export const db = firestoreInstance

const provider = new GoogleAuthProvider()
provider.setCustomParameters({ prompt: 'select_account' })

function detectPopupRestrictions() {
  if (typeof window === 'undefined') {
    return false
  }
  if (window.matchMedia('(display-mode: standalone)').matches) {
    return true
  }
  const ua = window.navigator?.userAgent ?? ''
  return /iPad|iPhone|iPod/.test(ua)
}

export async function googleSignIn() {
  const authInstance = auth
  await setPersistence(authInstance, browserLocalPersistence)
  if (detectPopupRestrictions()) {
    await signInWithRedirect(authInstance, provider)
    return
  }

  try {
    await signInWithPopup(authInstance, provider)
  } catch (error: any) {
    const code = typeof error?.code === 'string' ? error.code : ''
    if (POPUP_FALLBACK_CODES.has(code)) {
      await signInWithRedirect(authInstance, provider)
      return
    }
    throw error
  }
}

export async function resolveRedirectResult() {
  if (!detectPopupRestrictions()) {
    return null
  }
  try {
    return await getRedirectResult(auth)
  } catch (error) {
    console.warn('Redirect sign-in failed', error)
    return null
  }
}

export async function logout() {
  await signOut(auth)
}

export function onAuth(callback: Parameters<typeof onAuthStateChanged>[1]) {
  return onAuthStateChanged(auth, callback)
}
