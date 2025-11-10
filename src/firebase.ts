import { initializeApp, getApps, type FirebaseApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";
import { getStorage, type FirebaseStorage } from "firebase/storage";

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;
let storage: FirebaseStorage | null = null;

export function getFirebase() {
  if (!app) {
    const apiKey = import.meta.env.VITE_FIREBASE_API_KEY;
    const authDomain = import.meta.env.VITE_FIREBASE_AUTH_DOMAIN;
    const projectId = import.meta.env.VITE_FIREBASE_PROJECT_ID;
    const appId = import.meta.env.VITE_FIREBASE_APP_ID;
    const storageBucket = import.meta.env.VITE_FIREBASE_STORAGE_BUCKET;

    if (!apiKey || !authDomain || !projectId || !appId) {
      return { app:null, auth:null, db:null, storage:null, provider:null };
    }
    app = initializeApp({ apiKey, authDomain, projectId, appId, storageBucket });
    auth = getAuth(app);
    db = getFirestore(app);
    storage = getStorage(app);
  }
  const provider = new GoogleAuthProvider();
  return { app, auth, db, storage, provider };
}
