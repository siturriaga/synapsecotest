import { useEffect, useMemo, useState } from "react";
import { onAuthStateChanged, signInWithPopup, signOut } from "firebase/auth";
import { ensureFirebase } from "../firebase";

export function useAuth() {
  const [{ user, loading, available }, set] = useState({
    user: null as import("firebase/auth").User | null,
    loading: true,
    available: true,
  });

  useEffect(() => {
    const fb = ensureFirebase();
    if (!fb.auth) {
      // Not configured; still allow app to render with banner
      set(s => ({ ...s, loading: false, available: false }));
      return;
    }
    try {
      const unsub = onAuthStateChanged(fb.auth, (u) => {
        set({ user: u, loading: false, available: true });
      });
      return () => unsub();
    } catch (e) {
      console.error("Auth unavailable:", e);
      set({ user: null, loading: false, available: false });
    }
  }, []);

  const signIn = useMemo(() => async () => {
    const fb = ensureFirebase();
    if (!fb.auth || !fb.googleProvider) throw new Error("Firebase auth unavailable.");
    await signInWithPopup(fb.auth, fb.googleProvider);
  }, []);

  const logout = useMemo(() => async () => {
    const fb = ensureFirebase();
    if (!fb.auth) return;
    await signOut(fb.auth);
  }, []);

  return { user, loading, available, signIn, logout };
}
