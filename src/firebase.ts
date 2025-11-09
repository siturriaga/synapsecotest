import { initializeApp, getApps, type FirebaseApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, type Auth } from "firebase/auth";

type FirebaseBundle = {
  app: FirebaseApp | null;
  auth: Auth | null;
  googleProvider: GoogleAuthProvider | null;
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
  const missing = Object.entries(cfg).filter(([,v]) => !v).map(([k]) => k);
  return { cfg, missing };
}

/** Lazy initializer. Never throws during import. */
export function ensureFirebase(): FirebaseBundle {
  if (_bundle) return _bundle;

  const { cfg, missing } = collectConfig();

  if (missing.length) {
    console.error("Firebase config missing:", missing.join(", "));
    _bundle = { app: null, auth: null, googleProvider: null, missing };
    return _bundle;
  }

  const app = getApps().length ? getApps()[0] : initializeApp(cfg);
  const auth = getAuth(app);
  const googleProvider = new GoogleAuthProvider();
  _bundle = { app, auth, googleProvider, missing: [] };
  return _bundle;
}

/** Convenience checker for UI. */
export function firebaseIsConfigured(): boolean {
  return ensureFirebase().missing.length === 0;
}
