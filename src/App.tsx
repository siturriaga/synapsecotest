
import { useEffect, useState } from 'react'
import { Route, Switch, Link, useLocation } from 'wouter'
import { onAuth, googleSignIn, logout } from './firebase'
import Dashboard from './pages/Dashboard'
import Roster from './pages/Roster'
import Assignments from './pages/Assignments'
import Standards from './pages/Standards'
import Settings from './pages/Settings'

export default function App() {
  const [user, setUser] = useState<any>(null)
  const [ , navigate] = useLocation()

  useEffect(() => {
    return onAuth((u)=> setUser(u))
  }, [])

  const active = (path:string) => location.pathname === path ? { fontWeight: 700, textDecoration: 'underline' } : {}

  return (
    <div style={{ display:'grid', gridTemplateColumns: '260px 1fr', minHeight:'100vh', background:'#0d0a17', color:'#dbeafe' }}>
      <aside style={{ padding:'20px', borderRight:'1px solid #1f2937' }}>
        <div style={{ fontSize:24, fontWeight:900, marginBottom:24, background:'linear-gradient(90deg,#06b6d4,#a855f7)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>SYNAPSE</div>
        <nav style={{ display:'grid', gap:8 }}>
          <Link href="/" ><a style={active('/')}>📊 Dashboard</a></Link>
          <Link href="/roster"><a style={active('/roster')}>🧑‍🏫 Roster</a></Link>
          <Link href="/assignments"><a style={active('/assignments')}>✍️ Assignments</a></Link>
          <Link href="/standards"><a style={active('/standards')}>📋 Standards</a></Link>
          <Link href="/settings"><a style={active('/settings')}>⚙ Settings</a></Link>
        </nav>
        <div style={{ marginTop:'auto' }}>
          <div style={{ marginTop:24, fontSize:12, color:'#94a3b8', wordBreak:'break-all' }}>
            {user ? <>Signed in: {user.email}</> : <>Not signed in</>}
          </div>
          <div style={{ display:'grid', gap:8, marginTop:12 }}>
            {!user ? <button onClick={()=>googleSignIn()} style={{ padding:'8px 12px', background:'#7c3aed', color:'white', borderRadius:8 }}>Sign in with Google</button>
                   : <button onClick={()=>logout()} style={{ padding:'8px 12px', background:'#ef4444', color:'white', borderRadius:8 }}>Log out</button>}
          </div>
        </div>
      </aside>
      <main style={{ padding:'24px' }}>
        <Switch>
          <Route path="/" component={()=><Dashboard user={user} />} />
          <Route path="/roster" component={()=><Roster user={user} />} />
          <Route path="/assignments" component={()=><Assignments user={user} />} />
          <Route path="/standards" component={()=><Standards user={user} />} />
          <Route path="/settings" component={()=><Settings user={user} />} />
          <Route>404</Route>
        </Switch>
      </main>
    </div>
  )
}
