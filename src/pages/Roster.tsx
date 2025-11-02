import { useState } from 'react'
import type { User } from 'firebase/auth'
import { auth } from '../firebase'
import { safeFetch } from '../utils/safeFetch'

interface RosterPageProps {
  user: User | null
}

type PreviewRow = {
  row: number
  status: 'ok' | 'needs_review'
  data: { name: string | null; email: string | null; period: number | null; quarter: string | null }
  issues?: string[]
}

type PreviewResponse = {
  rows: PreviewRow[]
  stats: { total: number; ok: number; needs_review: number }
}

type CommitResponse = {
  written: number
  skipped: number
  collection: string
}

export default function RosterUploadPage({ user }: RosterPageProps) {
  const [file, setFile] = useState<File | null>(null)
  const [period, setPeriod] = useState('1')
  const [quarter, setQuarter] = useState('Q1')
  const [preview, setPreview] = useState<PreviewResponse | null>(null)
  const [uploadId, setUploadId] = useState<string | null>(null)
  const [status, setStatus] = useState<string>('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function uploadFile(mode: 'preview' | 'commit') {
    if (!user || !file) {
      setError('Select a file and ensure you are signed in.')
      return
    }

    try {
      setLoading(true)
      setError(null)
      setStatus(mode === 'preview' ? 'Uploading for preview…' : 'Applying roster to Firestore…')

      let id = uploadId
      if (!id || mode === 'preview') {
        const token = await auth.currentUser?.getIdToken()
        const form = new FormData()
        form.append('file', file)
        const res = await fetch(`/.netlify/functions/uploadRoster?period=${encodeURIComponent(period)}&quarter=${encodeURIComponent(quarter)}`, {
          method: 'POST',
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
          body: form
        })
        if (!res.ok) {
          throw new Error(await res.text())
        }
        const data = await res.json()
        id = data.uploadId
        setUploadId(id)
      }

      const response = await safeFetch<PreviewResponse | CommitResponse>(
        '/.netlify/functions/processRoster',
        {
          method: 'POST',
          body: JSON.stringify({ uploadId: id, mode })
        }
      )

      if (mode === 'preview') {
        setPreview(response as PreviewResponse)
        setStatus('Preview ready — resolve any issues before committing.')
      } else {
        const commit = response as CommitResponse
        setStatus(`Synced ${commit.written} students. Skipped ${commit.skipped}.`)
        setPreview(null)
        setUploadId(null)
      }
    } catch (err: any) {
      console.error(err)
      setError(err?.message ?? 'Upload failed.')
    } finally {
      setLoading(false)
    }
  }

  if (!user) {
    return (
      <div className="glass-card fade-in">
        <h2 style={{ margin: 0, fontSize: 26, fontWeight: 800 }}>Authenticate to upload rosters</h2>
        <p style={{ color: 'var(--text-muted)' }}>
          This workflow stores students in Firestore under your secure workspace scope. Please sign in to continue.
        </p>
      </div>
    )
  }

  return (
    <div className="fade-in" style={{ display: 'grid', gap: 24 }}>
      <section className="glass-card">
        <div className="badge">Roster ingestion</div>
        <h2 style={{ margin: '12px 0 6px', fontSize: 28, fontWeight: 800 }}>Upload CSV, XLSX, PDF, or DOCX rosters</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: 20 }}>
          Synapse validates email, period, and quarter fields before persisting to Firestore. Preview first to resolve flagged rows.
        </p>
        <form
          onSubmit={(event) => {
            event.preventDefault()
            uploadFile('preview')
          }}
        >
          <div className="field">
            <label htmlFor="roster-file">Choose roster file</label>
            <input
              id="roster-file"
              name="roster-file"
              type="file"
              accept=".csv,.xlsx,.xls,.pdf,.docx"
              onChange={(event) => setFile(event.target.files?.[0] ?? null)}
              required
            />
          </div>
          <div style={{ display: 'grid', gap: 14, gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))' }}>
            <div className="field">
              <label htmlFor="roster-period">Class period</label>
              <input
                id="roster-period"
                name="roster-period"
                type="number"
                min={1}
                max={8}
                value={period}
                onChange={(event) => setPeriod(event.target.value)}
                required
              />
            </div>
            <div className="field">
              <label htmlFor="roster-quarter">Quarter</label>
              <select
                id="roster-quarter"
                name="roster-quarter"
                value={quarter}
                onChange={(event) => setQuarter(event.target.value)}
                required
              >
                <option value="Q1">Q1</option>
                <option value="Q2">Q2</option>
                <option value="Q3">Q3</option>
                <option value="Q4">Q4</option>
              </select>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 12, marginTop: 18 }}>
            <button type="submit" className="primary" disabled={!file || loading}>
              {loading ? 'Processing…' : 'Preview roster'}
            </button>
            <button
              type="button"
              className="secondary"
              onClick={() => uploadFile('commit')}
              disabled={!uploadId || loading}
            >
              Commit to Firestore
            </button>
          </div>
        </form>
        {status && <p style={{ marginTop: 14, color: 'var(--text-muted)' }}>{status}</p>}
        {error && <p style={{ marginTop: 14, color: '#fecaca' }}>{error}</p>}
      </section>

      {preview && (
        <section className="glass-card">
          <h3 style={{ margin: 0, fontSize: 22, fontWeight: 700 }}>Preview results</h3>
          <p style={{ color: 'var(--text-muted)' }}>
            {preview.stats.ok} rows ready • {preview.stats.needs_review} need attention.
          </p>
          <table className="table" style={{ marginTop: 16 }}>
            <thead>
              <tr>
                <th>Row</th>
                <th>Name</th>
                <th>Email</th>
                <th>Period</th>
                <th>Quarter</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {preview.rows.map((row) => (
                <tr key={row.row}>
                  <td>{row.row}</td>
                  <td>{row.data.name || '—'}</td>
                  <td>{row.data.email || '—'}</td>
                  <td>{row.data.period ?? '—'}</td>
                  <td>{row.data.quarter ?? '—'}</td>
                  <td>
                    {row.status === 'ok' ? (
                      <span className="status-success">Validated</span>
                    ) : (
                      <span className="status-warning">Check: {row.issues?.join(', ')}</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}
    </div>
  )
}
