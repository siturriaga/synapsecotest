import { useAuth } from "../hooks/useAuth";
export default function Settings(){
  const { user, ready, signIn, signOut } = useAuth();
  return <div className="container"><div className="card">
    <h2>Settings</h2>
    {!ready ? <p>Loading…</p> : user
      ? <p>Signed in as <b>{user.displayName||user.email}</b> <button onClick={signOut}>Sign out</button></p>
      : <p><button onClick={signIn}>Sign in with Google</button></p>}
  </div></div>;
}
