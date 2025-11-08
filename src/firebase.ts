import { initializeApp, getApps, type FirebaseApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";

type FirebaseBundle = {
  app: FirebaseApp | null;
  auth: Auth | null;
  googleProvider: GoogleAuthProvider | null;
  db: Firestore | null;
  missing: string[];
};

let _bundle: FirebaseBundle | null = null;

function collectConfig() {
  const cfg = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN, // NO "https://"
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
  };
  const missing = Object.entries(cfg).filter(([, v]) => !v).map(([k]) => k);
  return { cfg, missing };
}

/** Lazy initializer. Never throws during import; records missing vars. */
export function ensureFirebase(): FirebaseBundle {
  if (_bundle) return _bundle;

  const { cfg, missing } = collectConfig();

  if (missing.length) {
    console.error("Firebase config missing:", missing.join(", "));
    _bundle = { app: null, auth: null, googleProvider: null, db: null, missing };
    return _bundle;
  }

  const app = getApps().length ? getApps()[0] : initializeApp(cfg);
  const auth = getAuth(app);
  const googleProvider = new GoogleAuthProvider();
  const db = getFirestore(app);

  _bundle = { app, auth, googleProvider, db, missing: [] };
  return _bundle;
}

/** Convenience checker for UI. */
export function firebaseIsConfigured(): boolean {
  return ensureFirebase().missing.length === 0;
}

function buildRemoteConfigTargets(): string[] {
  const targets = new Set<string>()
  const append = (value: string | null | undefined) => {
    if (!value) {
      return
    }
    const normalized = /^https?:\/\//i.test(value)
      ? value
      : value.startsWith('/')
        ? value
        : `/${value}`
    targets.add(normalized)
  }

  append(`${API_PREFIX}${REMOTE_CONFIG_ENDPOINT}`)
  append(`${NETLIFY_PREFIX}${REMOTE_CONFIG_ENDPOINT}`)

  if (typeof window !== 'undefined' && window.location?.hostname === 'localhost') {
    append(`${LOCAL_NETLIFY_ORIGIN}${NETLIFY_PREFIX}${REMOTE_CONFIG_ENDPOINT}`)
  }

  try {
    const remoteBase = getRemoteBaseConfig()
    append(joinUrl(remoteBase.apiBase, REMOTE_CONFIG_ENDPOINT))
    append(joinUrl(remoteBase.functionBase, REMOTE_CONFIG_ENDPOINT))
  } catch (error) {
    // Ignore remote base parsing issues and fall back to defaults.
  }

  return Array.from(targets)
}

type RemoteConfigAttemptResult = {
  config?: FirebaseOptions
  error?: string
}

async function tryFetchRemoteConfig(target: string): Promise<RemoteConfigAttemptResult> {
  if (typeof fetch !== 'function') {
    return { error: 'Fetch unavailable in this environment.' }
  }

  const controller = typeof AbortController !== 'undefined' ? new AbortController() : null
  const timeoutId = controller ? setTimeout(() => controller.abort(), 5000) : null

  try {
    const response = await fetch(target, {
      method: 'GET',
      headers: { Accept: 'application/json' },
      signal: controller?.signal
    })

    if (!response.ok) {
      return { error: `${response.status} ${response.statusText}` }
    }

    const data = (await response.json()) as FirebaseOptions
    if (!isValidConfig(data)) {
      return { error: 'Incomplete response payload.' }
    }

    return { config: data }
  } catch (error: any) {
    if (error?.name === 'AbortError') {
      return { error: 'Request timed out.' }
    }
    return { error: error instanceof Error ? error.message : String(error) }
  } finally {
    if (timeoutId) {
      clearTimeout(timeoutId)
    }
  }
}

async function loadRemoteConfig(): Promise<FirebaseOptions | undefined> {
  const targets = buildRemoteConfigTargets()
  const failures: string[] = []

  for (const target of targets) {
    const result = await tryFetchRemoteConfig(target)
    if (result.config) {
      return result.config
    }
    if (result.error) {
      failures.push(`${target} (${result.error})`)
    }
  }

  if (failures.length > 0) {
    warnOnce(
      'firebase-config-remote-unavailable',
      `Unable to load Firebase config from remote endpoints. Attempts: ${failures.join('; ')}`
    )
  }

  return undefined
}

async function resolveFirebaseConfig(): Promise<FirebaseOptions> {
  const cachedConfig = globalObject.__FIREBASE_CONFIG__
  if (cachedConfig && isValidConfig(cachedConfig)) {
    return cachedConfig
  }

  if (typeof window !== 'undefined' && window.__FIREBASE_CONFIG__ && isValidConfig(window.__FIREBASE_CONFIG__)) {
    globalObject.__FIREBASE_CONFIG__ = window.__FIREBASE_CONFIG__
    return window.__FIREBASE_CONFIG__
  }

  const envConfig = buildEnvConfig()
  if (isValidConfig(envConfig)) {
    globalObject.__FIREBASE_CONFIG__ = envConfig
    if (typeof window !== 'undefined') {
      window.__FIREBASE_CONFIG__ = envConfig
    }
    return envConfig
  }

  warnOnce('firebase-config-incomplete', 'Firebase configuration is incomplete. Check your VITE_FIREBASE_* values.')

  if (typeof window !== 'undefined') {
    const remoteConfig = await loadRemoteConfig()
    if (remoteConfig && isValidConfig(remoteConfig)) {
      globalObject.__FIREBASE_CONFIG__ = remoteConfig
      window.__FIREBASE_CONFIG__ = remoteConfig
      return remoteConfig
    }
  }

  return envConfig
}

let configValid = false
let initializationComplete = false

export type FirestoreClient = ReturnType<typeof getFirestore>

export let app: ReturnType<typeof initializeApp> | null = null
export let auth: ReturnType<typeof getAuth> | null = null
export let db: FirestoreClient | null = null

async function initializeFirebase(): Promise<void> {
  try {
    const firebaseConfig = await resolveFirebaseConfig()
    configValid = isValidConfig(firebaseConfig)

    const hasExistingApp = getApps().length > 0
    let initializedByModule = false

    if (hasExistingApp) {
      try {
        app = getApp()
      } catch (error) {
        console.error('Failed to reuse existing Firebase app instance.', error)
        app = null
      }
    } else if (configValid) {
      try {
        app = initializeApp(firebaseConfig)
        initializedByModule = true
      } catch (error) {
        console.error('Failed to initialize Firebase app', error)
        app = null
      }
    } else {
      app = null
    }

    if (app) {
      try {
        auth = getAuth(app)
      } catch (error) {
        console.error('Firebase auth unavailable. Check your VITE_FIREBASE_* configuration.', error)
        auth = null
      }
    } else if (!configValid) {
      warnOnce('firebase-auth-disabled', 'Firebase auth disabled. Provide valid VITE_FIREBASE_* values to enable sign-in.')
      auth = null
    }

    if (app) {
      try {
        db = initializedByModule
          ? initializeFirestore(app, { experimentalAutoDetectLongPolling: true })
          : getFirestore(app)
      } catch (error) {
        console.warn('Falling back to default Firestore initialization', error)
        try {
          db = getFirestore(app)
        } catch (fallbackError) {
          console.warn('Firestore unavailable after fallback.', fallbackError)
          db = null
        }
      }
    } else {
      db = null
    }

    if (!db) {
      warnOnce(
        'firestore-unavailable',
        'Firestore unavailable. Workspace data features will not load until configuration is fixed.'
      )
    }
  } catch (error) {
    console.error('Unexpected error during Firebase initialization', error)
    app = null
    auth = null
    db = null
    configValid = false
  } finally {
    initializationComplete = true
  }
}

const firebaseReadyPromise = initializeFirebase().catch((error) => {
  console.error('Firebase initialization encountered an unhandled rejection', error)
  initializationComplete = true
})

export const firebaseReady: Promise<void> = firebaseReadyPromise.then(() => undefined)

export function isFirebaseInitialized(): boolean {
  return initializationComplete
}

export function isFirebaseAuthConfigured(): boolean {
  return initializationComplete && configValid && Boolean(auth)
}

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
  await firebaseReady

  if (!auth) {
    throw new Error('Google sign-in is not available because Firebase auth is not configured.')
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
  await firebaseReady

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
  await firebaseReady

  if (!auth) {
    return
  }
  await signOut(auth)
}

const onAuth = (callback: Parameters<typeof onAuthStateChanged>[1]) => {
  if (auth) {
    return onAuthStateChanged(auth, callback)
  }

  let unsubscribe: (() => void) | null = null
  let active = true

  firebaseReady.then(() => {
    if (!active) {
      return
    }

    if (!auth) {
      callback(null)
      return
    }

    unsubscribe = onAuthStateChanged(auth, callback)
  })

  return () => {
    active = false
    unsubscribe?.()
  }
}

export default ensureFirebase;
