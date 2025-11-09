// src/hooks/useAuth.ts
import { useEffect, useMemo, useState, useCallback } from "react";
import {
  getAuth,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signInWithRedirect,
  browserLocalPersistence,
  setPersistence,
  signOut,
  User,
} from "firebase/auth";
import { initializeApp, getApps } from "firebase/app";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET, // optional
};

function ensureFirebase() {
  if (!getApps().length) initializeApp(firebaseConfig);
  const auth = getAuth();
  const googleProvider = new GoogleAuthProvider();
  return { auth, googleProvider };
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const { auth } = ensureFirebase();
    setPersistence(auth, browserLocalPersistence).catch(() => {});
    return onAuthStateChanged(auth, (u) => {
      setUser(u);
      setReady(true);
    });
  }, []);

  const signIn = useMemo(
    () => async () => {
      const { auth, googleProvider } = ensureFirebase();
      try {
        await signInWithPopup(auth, googleProvider);
      } catch (err: any) {
        const code = String(err?.code || "");
        const needRedirect =
          code.includes("auth/popup-blocked") ||
          code.includes("auth/operation-not-supported-in-this-environment") ||
          code.includes("auth/popup-closed-by-user") ||
          code.includes("auth/cancelled-popup-request");
        if (needRedirect) {
          await signInWithRedirect(auth, googleProvider);
          return;
        }
        throw err;
      }
    },
    []
  );

  const getIdToken = useCallback(async () => {
    if (!user) return null;
    try {
      return await user.getIdToken(false);
    } catch {
      return null;
    }
  }, [user]);

  const signOutAll = useMemo(
    () => async () => {
      const { auth } = ensureFirebase();
      await signOut(auth);
    },
    []
  );

  return { user, ready, signIn, signOut: signOutAll, getIdToken };
}
