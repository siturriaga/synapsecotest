
import { useState } from 'react'
import sample from '../standards/grade7-math.json'

export default function Standards(){
  const [q, setQ] = useState('')
  const items = (sample.standards || []).filter((s:any)=> (s.code+' '+s.name).toLowerCase().includes(q.toLowerCase()))
  return (
    <div>
      <h2 style={{ fontSize:28, fontWeight:900, marginBottom:10 }}>Standards</h2>
      <input placeholder="Search..." value={q} onChange={e=>setQ(e.target.value)} />
      <ul>
        {items.map((s:any)=> <li key={s.code} style={{ margin:'8px 0' }}><b>{s.code}</b> — {s.name}</li>)}
      </ul>
    </div>
  )
}
