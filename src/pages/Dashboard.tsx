
import { useEffect, useState } from 'react'
import { db } from '../firebase'
import { doc, onSnapshot, setDoc } from 'firebase/firestore'

export default function Dashboard({ user }: { user:any }) {
  const [stats, setStats] = useState<any>(null)

  useEffect(()=>{
    if (!user) return
    const statsRef = doc(db, `users/${user.uid}/dashboard_stats/metrics`)
    const unsub = onSnapshot(statsRef, async (snap)=>{
      if (!snap.exists()) {
        await setDoc(statsRef, { totalEnrollment: 0, groupCount: 0, atRisk: 0, advancing: 0, onTrack: 0 }, { merge: true })
        return
      }
      setStats(snap.data())
    })
    return () => unsub()
  },[user])

  return (
    <div>
      <h2 style={{ fontSize:28, fontWeight:900, marginBottom:10 }}>👋 Welcome back{user ? `, ${user.displayName||''}` : ''}</h2>
      <p style={{ color:'#94a3b8', marginBottom:20 }}>Status: US/Eastern • Google Sign-In only</p>
      {!user && <p>Please sign in to load dashboard.</p>}
      {user && (
        <div style={{ display:'grid', gap:16, gridTemplateColumns:'repeat(4, minmax(0,1fr))' }}>
          <Card title="Total Enrollment" value={stats?.totalEnrollment ?? 0} />
          <Card title="Active Groups" value={stats?.groupCount ?? 0} />
          <Card title="At-Risk" value={stats?.atRisk ?? 0} />
          <Card title="On-Track" value={stats?.onTrack ?? 0} />
        </div>
      )}
    </div>
  )
}

function Card({ title, value }:{title:string, value:number}){
  return (
    <div style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:16, padding:16 }}>
      <div style={{ color:'#a78bfa', fontWeight:700, marginBottom:8 }}>{title}</div>
      <div style={{ fontSize:40, fontWeight:900 }}>{value}</div>
    </div>
  )
}
