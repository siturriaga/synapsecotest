import React from 'react';
import { Link, Route, Routes } from 'react-router-dom';
import { useAuth } from './components/AuthProvider';
import { RequireAuth } from './components/RequireAuth';
import Home from './pages/Home';
import RosterUpload from './pages/RosterUpload';
import Standards from './pages/Standards';
import Assignments from './pages/Assignments';

const App: React.FC = () => {
  const { user, loading, signIn, signOutUser } = useAuth();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="flex items-center justify-between px-4 py-3 border-b border-slate-200">
        <nav className="flex gap-3 text-sm font-medium">
          <Link to="/">Home</Link>
          <Link to="/roster">Roster</Link>
          <Link to="/standards">Standards</Link>
          <Link to="/assignments">Assignments</Link>
        </nav>
        <div>
          {loading ? (
            <span>Loading…</span>
          ) : user ? (
            <button className="px-3 py-1 border rounded" onClick={() => signOutUser()}>
              Sign out
            </button>
          ) : (
            <button className="px-3 py-1 border rounded" onClick={() => signIn()}>
              Sign in with Google
            </button>
          )}
        </div>
      </header>
      <main className="p-4 space-y-6">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/roster"
            element={
              <RequireAuth>
                <RosterUpload />
              </RequireAuth>
            }
          />
          <Route
            path="/standards"
            element={
              <RequireAuth>
                <Standards />
              </RequireAuth>
            }
          />
          <Route
            path="/assignments"
            element={
              <RequireAuth>
                <Assignments />
              </RequireAuth>
            }
          />
        </Routes>
      </main>
    </div>
  );
};

export default App;
