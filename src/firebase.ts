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

/** Get Firestore instance or null (for legacy imports). */
export function getDb(): Firestore | null {
  return ensureFirebase().db;
}

/** Legacy named export so existing code `import { db } from "../firebase"` keeps working. */
export const db = getDb();

/** Export auth/provider for existing hooks that already guard nulls. */
export const auth = ensureFirebase().auth;
export const googleProvider = ensureFirebase().googleProvider;

export default ensureFirebase;
