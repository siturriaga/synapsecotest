
import { useRef, useState } from 'react'
import { auth } from '../firebase'

export default function Roster({ user }:{ user:any }) {
  const fileRef = useRef<HTMLInputElement|null>(null)
  const [uploadId, setUploadId] = useState<string>('')
  const [preview, setPreview] = useState<any>(null)
  const [report, setReport] = useState<any>(null)
  const [period, setPeriod] = useState<number>(1)
  const [quarter, setQuarter] = useState<'Q1'|'Q2'|'Q3'|'Q4'>('Q1')

  async function uploadFile() {
    if (!user) return alert('Sign in first')
    const f = fileRef.current?.files?.[0]
    if (!f) return alert('Choose a file')
    const token = await auth.currentUser?.getIdToken()
    const form = new FormData()
    form.append('file', f)
    const res = await fetch(`/api/uploadRoster?period=${period}&quarter=${quarter}`, {
      method:'POST',
      headers: { 'Authorization': 'Bearer '+token },
      body: form
    })
    const data = await res.json()
    if (!res.ok) return alert(data.error || 'Upload failed')
    setUploadId(data.uploadId)
  }

  async function doPreview() {
    if (!uploadId) return alert('Upload first')
    const token = await auth.currentUser?.getIdToken()
    const res = await fetch('/api/processRoster', {
      method:'POST',
      headers: {
        'Authorization':'Bearer '+token,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ uploadId, mode:'preview' })
    })
    const data = await res.json()
    if (!res.ok) return alert(data.error || 'Preview failed')
    setPreview(data)
  }

  async function commit() {
    const token = await auth.currentUser?.getIdToken()
    const res = await fetch('/api/processRoster', {
      method:'POST',
      headers: {
        'Authorization':'Bearer '+token,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ uploadId, mode:'commit' })
    })
    const data = await res.json()
    if (!res.ok) return alert(data.error || 'Commit failed')
    setReport(data)
  }

  return (
    <div>
      <h2 style={{ fontSize:28, fontWeight:900, marginBottom:16 }}>Roster Import</h2>
      {!user && <p>Please sign in to manage roster.</p>}
      {user && (
        <div style={{ display:'grid', gap:16 }}>
          <div style={{ display:'flex', gap:12, alignItems:'center' }}>
            <input ref={fileRef} type="file" accept=".csv,.xlsx,.xls,.pdf,.docx" />
            <select value={period} onChange={e=>setPeriod(Number(e.target.value))}>
              {[1,2,3,4,5,6,7,8].map(p=><option key={p} value={p}>Period {p}</option>)}
            </select>
            <select value={quarter} onChange={e=>setQuarter(e.target.value as any)}>
              {['Q1','Q2','Q3','Q4'].map(q=><option key={q} value={q}>{q}</option>)}
            </select>
            <button onClick={uploadFile}>Upload</button>
            <button onClick={doPreview} disabled={!uploadId}>Preview</button>
            <button onClick={commit} disabled={!uploadId}>Commit</button>
          </div>
          {preview && (
            <div style={{ padding:12, border:'1px solid #334155', borderRadius:12 }}>
              <div><b>Total:</b> {preview.stats.total} • <b>OK:</b> {preview.stats.ok} • <b>Needs review:</b> {preview.stats.needs_review}</div>
              <details style={{ marginTop:8 }}>
                <summary>See first 20 rows</summary>
                <pre style={{ whiteSpace:'pre-wrap' }}>{JSON.stringify(preview.rows.slice(0,20), null, 2)}</pre>
              </details>
            </div>
          )}
          {report && (
            <div style={{ padding:12, border:'1px solid #334155', borderRadius:12 }}>
              <div><b>Written:</b> {report.written} • <b>Skipped:</b> {report.skipped}</div>
              <div><b>Collection:</b> {report.collection}</div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
