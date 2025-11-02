import { useMemo, useState } from 'react'
import type { User } from 'firebase/auth'
import { auth } from '../firebase'
import { safeFetch } from '../utils/safeFetch'

interface RosterPageProps {
  user: User | null
}

type PreviewRow = {
  row: number
  status: 'ok' | 'needs_review'
  data: {
    displayName: string | null
    nameVariants: string[]
    period: number | null
    quarter: string | null
    score: number | null
    testName: string | null
  }
  issues?: string[]
}

type AssessmentSummary = {
  count: number
  average: number | null
  median: number | null
  min: number | null
  max: number | null
}

type PreviewResponse = {
  rows: PreviewRow[]
  stats: { total: number; ok: number; needs_review: number }
  assessmentSummary: AssessmentSummary
}

type CommitResponse = {
  written: number
  skipped: number
  collection: string
  assessmentSummary: AssessmentSummary
}

export default function RosterUploadPage({ user }: RosterPageProps) {
  const [file, setFile] = useState<File | null>(null)
  const [period, setPeriod] = useState('1')
  const [quarter, setQuarter] = useState('Q1')
  const [testName, setTestName] = useState('')
  const [preview, setPreview] = useState<PreviewResponse | null>(null)
  const [uploadId, setUploadId] = useState<string | null>(null)
  const [status, setStatus] = useState<string>('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const summary = useMemo(() => preview?.assessmentSummary, [preview])

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
        const res = await fetch(`/.netlify/functions/uploadRoster?period=${encodeURIComponent(period)}&quarter=${encodeURIComponent(quarter)}&testName=${encodeURIComponent(testName)}`, {
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
        const averageText = commit.assessmentSummary.average !== null ? ` Class average ${commit.assessmentSummary.average.toFixed(1)}.` : ''
        setStatus(`Synced ${commit.written} learners. Skipped ${commit.skipped}.${averageText}`)
        setPreview(null)
        setUploadId(null)
        setFile(null)
        setTestName('')
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
        <h2 style={{ margin: '12px 0 6px', fontSize: 28, fontWeight: 800 }}>Upload CSV, XLSX, PDF, or DOCX mastery exports</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: 20 }}>
          Synapse validates student names, periods, quarters, test names, and scores before persisting to Firestore. Preview first to resolve flagged rows. No student data leaves your encrypted workspace.
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
          <div className="field">
            <label htmlFor="roster-test">Name of the test or benchmark</label>
            <input
              id="roster-test"
              name="roster-test"
              value={testName}
              onChange={(event) => setTestName(event.target.value)}
              placeholder="e.g., Q2 Expressions Mastery Check"
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
            <button type="submit" className="primary" disabled={!file || loading || !testName.trim()}>
              {loading ? 'Processing…' : 'Preview mastery data'}
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
        <section className="glass-card" style={{ display: 'grid', gap: 18 }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 18, justifyContent: 'space-between', alignItems: 'flex-end' }}>
            <div>
              <h3 style={{ margin: 0, fontSize: 22, fontWeight: 700 }}>Preview results</h3>
              <p style={{ color: 'var(--text-muted)' }}>
                {preview.stats.ok} learners ready • {preview.stats.needs_review} need attention.
              </p>
            </div>
            {summary && (
              <div className="glass-subcard" style={{ padding: 16, borderRadius: 16, border: '1px solid rgba(99,102,241,0.25)', background: 'rgba(15,23,42,0.55)' }}>
                <strong>Assessment snapshot</strong>
                <div style={{ marginTop: 8, display: 'grid', gap: 4, fontSize: 14 }}>
                  <span>Average: {summary.average !== null ? summary.average.toFixed(1) : '—'}</span>
                  <span>Median: {summary.median !== null ? summary.median.toFixed(1) : '—'}</span>
                  <span>High: {summary.max !== null ? summary.max.toFixed(1) : '—'} · Low: {summary.min !== null ? summary.min.toFixed(1) : '—'}</span>
                </div>
              </div>
            )}
          </div>
          <table className="table">
            <thead>
              <tr>
                <th>Row</th>
                <th>Student name</th>
                <th>Alternate names</th>
                <th>Period</th>
                <th>Quarter</th>
                <th>Score</th>
                <th>Assessment</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {preview.rows.map((row) => (
                <tr key={row.row}>
                  <td>{row.row}</td>
                  <td>{row.data.displayName || '—'}</td>
                  <td>{row.data.nameVariants.length > 1 ? row.data.nameVariants.slice(1).join(', ') : '—'}</td>
                  <td>{row.data.period ?? '—'}</td>
                  <td>{row.data.quarter ?? '—'}</td>
                  <td>{row.data.score !== null ? row.data.score : '—'}</td>
                  <td>{row.data.testName || testName || '—'}</td>
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
