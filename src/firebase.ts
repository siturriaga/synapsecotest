import { initializeApp, type FirebaseOptions } from 'firebase/app'
import {
  browserLocalPersistence,
  getAuth,
  GoogleAuthProvider,
  inMemoryPersistence,
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

let appInstance: ReturnType<typeof initializeApp> | null = null
try {
  appInstance = initializeApp(firebaseConfig)
} catch (error) {
  console.error('Failed to initialize Firebase app', error)
}

let authInstance: ReturnType<typeof getAuth> | null = null
if (appInstance && firebaseConfig.apiKey) {
  try {
    authInstance = getAuth(appInstance)
  } catch (error) {
    console.error('Firebase auth unavailable. Check your VITE_FIREBASE_* configuration.', error)
  }
} else {
  console.warn('Firebase auth disabled. Provide valid VITE_FIREBASE_* values to enable sign-in.')
}

export type FirestoreClient = ReturnType<typeof getFirestore>

let firestoreInstance: FirestoreClient | null = null
if (appInstance) {
  try {
    firestoreInstance = initializeFirestore(appInstance, {
      experimentalAutoDetectLongPolling: true
    })
  } catch (error) {
    console.warn('Falling back to default Firestore initialization', error)
    firestoreInstance = getFirestore(appInstance)
  }
}

export const app = appInstance
export const auth = authInstance
if (!firestoreInstance) {
  console.warn('Firestore unavailable. Workspace data features will not load until configuration is fixed.')
}
export const db: FirestoreClient | null = firestoreInstance

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

const AUTH_DISABLED_MESSAGE =
  'Google sign-in is unavailable because Firebase credentials are missing. Add the VITE_FIREBASE_* values in Netlify or review Settings → Diagnostics for setup help.'

export const isAuthConfigured = Boolean(auth)

export async function googleSignIn() {
  if (!auth) {
    throw new Error(AUTH_DISABLED_MESSAGE)
  }

  const authInstance = auth
  try {
    await setPersistence(authInstance, browserLocalPersistence)
  } catch (error: any) {
    const code = typeof error?.code === 'string' ? error.code : ''
    if (code === 'auth/unsupported-persistence-type') {
      console.warn('Local persistence unsupported; falling back to in-memory auth state.', error)
      try {
        await setPersistence(authInstance, inMemoryPersistence)
      } catch (fallbackError) {
        console.warn('Failed to apply in-memory persistence; continuing with default behavior.', fallbackError)
      }
    } else {
      console.warn('Failed to set preferred auth persistence; continuing with default behavior.', error)
    }
  }
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
  if (!auth) {
    return null
  }

  try {
    return await getRedirectResult(auth)
  } catch (error) {
    console.warn('Redirect sign-in failed', error)
    return null
  }
}

const logout = async () => {
  if (!auth) {
    return
  }
  await signOut(auth)
}

const onAuth = (callback: Parameters<typeof onAuthStateChanged>[1]) => {
  if (!auth) {
    callback(null)
    return () => {}
  }
  return onAuthStateChanged(auth, callback)
}

export { logout, onAuth, AUTH_DISABLED_MESSAGE }
