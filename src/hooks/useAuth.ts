import { useEffect, useState } from "react";
import { signInWithPopup, signOut, onAuthStateChanged, User } from "firebase/auth";
import { getFirebase } from "../firebase";

export function useAuth() {
  const [{ user, ready, error }, set] = useState<{user:User|null;ready:boolean;error:string|null}>({ user:null, ready:false, error:null });

  useEffect(() => {
    const { auth } = getFirebase();
    if (!auth) { set(s => ({...s, ready:true})); return; }
    const unsub = onAuthStateChanged(auth, u => set({ user:u, ready:true, error:null }), e => set({ user:null, ready:true, error:String(e) }));
    return () => unsub();
  }, []);

  async function signIn() {
    const { auth, provider } = getFirebase();
    if (!auth || !provider) throw new Error("Auth unavailable");
    await signInWithPopup(auth, provider);
  }
  async function signOutUser() {
    const { auth } = getFirebase();
    if (!auth) return;
    await signOut(auth);
  }
  return { user, ready, error, signIn, signOut: signOutUser };
}
