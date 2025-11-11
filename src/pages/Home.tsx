import React, { useMemo } from 'react';
import { useAuth } from '../components/AuthProvider';

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
};

const Home: React.FC = () => {
  const { user, loading, signIn } = useAuth();

  const greeting = useMemo(() => getGreeting(), []);

  if (loading) {
    return <div className="p-4">Loading profile…</div>;
  }

  if (!user) {
    return (
      <div className="space-y-3">
        <h1 className="text-xl font-semibold">Synapse – AI Teaching Co-Pilot</h1>
        <p>Sign in with Google to begin planning personalized assignments and syncing rosters.</p>
        <button className="px-4 py-2 border rounded" onClick={() => signIn()}>
          Sign in with Google
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <h1 className="text-xl font-semibold">
        {greeting}, {user.displayName ?? 'Educator'}!
      </h1>
      <p>Use the navigation above to upload rosters, choose standards, and generate assignments.</p>
    </div>
  );
};

export default Home;
