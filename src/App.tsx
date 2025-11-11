import React, { useEffect, useMemo, useState } from 'react';
import { GoogleAuthProvider, User, onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth';
import AssignmentsPage from './pages/Assignments';
import { auth } from './utils/firebaseClient';
import { timeOfDay } from './utils/timeOfDay';

const provider = new GoogleAuthProvider();

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (nextUser) => {
      setUser(nextUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const greeting = useMemo(() => timeOfDay(), [user?.uid]);

  const handleSignIn = async () => {
    setError(null);
    try {
      await signInWithPopup(auth, provider);
    } catch (signInError) {
      const message = signInError instanceof Error ? signInError.message : 'Unable to sign in right now.';
      setError(message);
    }
  };

  const handleSignOut = async () => {
    setError(null);
    try {
      await signOut(auth);
    } catch (signOutError) {
      const message = signOutError instanceof Error ? signOutError.message : 'Unable to sign out right now.';
      setError(message);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 px-4 py-3">
        <div className="space-y-1">
          <h1 className="text-lg font-semibold">Synapse – Assignments</h1>
          <p className="text-sm text-slate-600">Welcome, good {greeting}.</p>
        </div>
        <div className="flex items-center gap-3">
          {user ? (
            <>
              <span className="text-sm text-slate-700">{user.displayName ?? user.email ?? 'Educator'}</span>
              <button className="rounded border px-3 py-1 text-sm" onClick={handleSignOut}>
                Sign out
              </button>
            </>
          ) : (
            <button className="rounded border px-3 py-1 text-sm" onClick={handleSignIn}>
              Sign in with Google
            </button>
          )}
        </div>
      </header>
      <main className="mx-auto max-w-5xl space-y-4 px-4 py-6">
        {loading ? (
          <p>Loading account…</p>
        ) : user ? (
          <AssignmentsPage user={user} />
        ) : (
          <div className="space-y-3">
            <p>Sign in with Google to generate and manage assignments aligned to your standards.</p>
            <button className="rounded border px-3 py-1 text-sm" onClick={handleSignIn}>
              Sign in with Google
            </button>
          </div>
        )}
        {error && <div className="rounded border border-red-200 bg-red-50 p-3 text-sm text-red-800">{error}</div>}
      </main>
    </div>
  );
};

export default App;
