
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

const firebaseConfig: FirebaseOptions = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
}

if (import.meta.env.VITE_FIREBASE_STORAGE_BUCKET) {
  firebaseConfig.storageBucket = import.meta.env.VITE_FIREBASE_STORAGE_BUCKET
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

async function ensurePersistence() {
  try {
    await setPersistence(auth, browserLocalPersistence)
  } catch (err) {
    console.warn('Unable to persist auth session', err)
  }
}

export async function googleSignIn() {
  await ensurePersistence()
  try {
    await signInWithPopup(auth, provider)
  } catch (err: any) {
    if (err?.code && popupFallbackCodes.has(err.code)) {
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
