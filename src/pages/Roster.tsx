import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { User } from 'firebase/auth'
import { auth } from '../firebase'
import { safeFetch } from '../utils/safeFetch'
import { useRosterData } from '../hooks/useRosterData'
import type { SavedRosterUpload } from '../types/roster'

interface RosterPageProps {
  user: User | null
}

type AssessmentSummary = {
  count: number
  average: number | null
  median: number | null
  min: number | null
  max: number | null
}

type CommitResponse = {
  written: number
  skipped: number
  collection: string
  assessmentSummary: AssessmentSummary
}

function formatSize(bytes: number | null) {
  if (bytes === null || bytes === undefined) return '—'
  if (bytes < 1024) return `${bytes} B`
  const kb = bytes / 1024
  if (kb < 1024) return `${kb.toFixed(kb < 10 ? 1 : 0)} KB`
  const mb = kb / 1024
  return `${mb.toFixed(mb < 10 ? 1 : 0)} MB`
}

function base64ToBlob(base64: string, contentType: string) {
  const byteCharacters = atob(base64)
  const byteNumbers = new Array(byteCharacters.length)
  for (let i = 0; i < byteCharacters.length; i += 1) {
    byteNumbers[i] = byteCharacters.charCodeAt(i)
  }
  const byteArray = new Uint8Array(byteNumbers)
  return new Blob([byteArray], { type: contentType })
}

export default function RosterUploadPage({ user }: RosterPageProps) {
  const [file, setFile] = useState<File | null>(null)
  const [period, setPeriod] = useState('')
  const [quarter, setQuarter] = useState('')
  const [testName, setTestName] = useState('')
  const [status, setStatus] = useState<string>('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const autoIntentRef = useRef<'update' | 'new' | undefined>()
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const {
    loading: rosterLoading,
    records,
    summaries,
    insights,
    groupInsights,
    pedagogy,
    uploads,
    syncStatus,
    syncError,
    lastSyncedAt,
    triggerSync
  } = useRosterData()

  const autoSaveStatus = useMemo(() => {
    if (syncStatus === 'saving') return 'Saving workspace snapshot…'
    if (syncStatus === 'error') return syncError ?? 'Auto-save error'
    if (lastSyncedAt) {
      const deltaSeconds = Math.floor((Date.now() - lastSyncedAt.getTime()) / 1000)
      if (deltaSeconds < 60) return `Snapshot saved ${deltaSeconds}s ago`
      const deltaMinutes = Math.floor(deltaSeconds / 60)
      if (deltaMinutes < 60) return `Snapshot saved ${deltaMinutes}m ago`
      const deltaHours = Math.floor(deltaMinutes / 60)
      return `Snapshot saved ${deltaHours}h ago`
    }
    return 'Waiting for first snapshot…'
  }, [syncStatus, syncError, lastSyncedAt])

  useEffect(() => {
    autoIntentRef.current = undefined
  }, [file])

  const handleDownload = useCallback((upload: SavedRosterUpload) => {
    try {
      const base64 = upload.storage.kind === 'inline' ? upload.storage.data : upload.inlineData
      if (!base64) {
        setStatus(`Download unavailable for ${upload.filename}`)
        return
      }
      const blob = base64ToBlob(base64, 'text/csv')
      const url = URL.createObjectURL(blob)
      const anchor = document.createElement('a')
      anchor.href = url
      anchor.download = upload.filename || `roster-${upload.id}.csv`
      document.body.appendChild(anchor)
      anchor.click()
      anchor.remove()
      URL.revokeObjectURL(url)
      setStatus(`Downloaded ${upload.filename}`)
    } catch (err) {
      console.error(err)
      setError('Unable to download the roster file right now.')
    }
  }, [])

  const commitRoster = useCallback(
    async (intent?: 'update' | 'new'): Promise<CommitResponse | null> => {
      if (!user || !file) {
        setError('Select a file and ensure you are signed in.')
        return null
      }

      try {
        setLoading(true)
        setError(null)
        setStatus('Publishing roster to your secure workspace…')

        const token = await auth.currentUser?.getIdToken()
        const form = new FormData()
        form.append('file', file)
        const uploadResponse = await fetch(
          `/.netlify/functions/uploadRoster?period=${encodeURIComponent(period)}&quarter=${encodeURIComponent(quarter)}&testName=${encodeURIComponent(testName)}`,
          {
            method: 'POST',
            headers: token ? { Authorization: `Bearer ${token}` } : undefined,
            body: form
          }
        )
        if (!uploadResponse.ok) {
          throw new Error(await uploadResponse.text())
        }
        const { uploadId } = await uploadResponse.json()

        const commit = await safeFetch<CommitResponse>(
          '/.netlify/functions/processRoster',
          {
            method: 'POST',
            body: JSON.stringify({
              uploadId,
              mode: 'commit',
              manualOverrides: {},
              intent
            })
          }
        )

        const averageText =
          commit.assessmentSummary.average !== null
            ? ` Class average ${commit.assessmentSummary.average.toFixed(1)}.`
            : ''
        setStatus('Roster committed — refreshing workspace snapshot…')

        let syncSucceeded = true
        try {
          syncSucceeded = await triggerSync()
        } catch (syncErr) {
          console.error('Unable to force roster snapshot sync', syncErr)
          syncSucceeded = false
        }

        if (syncSucceeded) {
          setStatus(`Auto-sync complete: ${commit.written} learners updated. Skipped ${commit.skipped}.${averageText}`)
          setFile(null)
          if (fileInputRef.current) {
            fileInputRef.current.value = ''
          }
        } else {
          setStatus(
            `Roster committed, but the workspace snapshot did not refresh automatically. Use “Sync now” to retry.${averageText}`
          )
          setError('Roster saved, but the workspace snapshot did not refresh. Use “Sync now” to retry.')
        }

        return commit
      } catch (err: any) {
        console.error(err)
        setError(err?.message ?? 'Upload failed.')
        return null
      } finally {
        setLoading(false)
      }
    },
    [user, file, period, quarter, testName, triggerSync]
  )

  const handleSubmit = useCallback(() => {
    if (!file || loading) {
      return
    }

    let intent = autoIntentRef.current
    if (!testName.trim() && !intent) {
      const wantsUpdate = window.confirm(
        'No assessment name detected. Is this upload updating an existing dataset?\nSelect OK for Update or Cancel for New.'
      )
      intent = wantsUpdate ? 'update' : 'new'
      autoIntentRef.current = intent
    }

    void commitRoster(intent)
  }, [file, loading, testName, commitRoster])

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
        <h2 style={{ margin: '12px 0 6px', fontSize: 28, fontWeight: 800 }}>Upload mastery results and sync to your dashboard</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: 20 }}>
          Drop in your export, add optional context, and we will publish it directly to your dashboard and teaching tools—no
          preview step required.
        </p>
        <form
          onSubmit={(event) => {
            event.preventDefault()
            handleSubmit()
          }}
        >
          <div className="field">
            <label htmlFor="roster-file">Choose roster file</label>
            <input
              ref={fileInputRef}
              id="roster-file"
              name="roster-file"
              type="file"
              accept=".csv,.xlsx,.xls,.pdf,.docx"
              onChange={(event) => {
                const nextFile = event.target.files?.[0] ?? null
                setFile(nextFile)
                setStatus('')
                setError(null)
              }}
              required
            />
          </div>
          <div className="field">
            <label htmlFor="roster-test">
              Name of the test or benchmark <span style={{ color: 'var(--text-muted)', fontWeight: 500 }}>(optional)</span>
            </label>
            <input
              id="roster-test"
              name="roster-test"
              value={testName}
              onChange={(event) => setTestName(event.target.value)}
              placeholder="e.g., Q2 Expressions Mastery Check"
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
                placeholder="Optional"
              />
            </div>
            <div className="field">
              <label htmlFor="roster-quarter">Quarter</label>
              <select
                id="roster-quarter"
                name="roster-quarter"
                value={quarter}
                onChange={(event) => setQuarter(event.target.value)}
              >
                <option value="">—</option>
                <option value="Q1">Q1</option>
                <option value="Q2">Q2</option>
                <option value="Q3">Q3</option>
                <option value="Q4">Q4</option>
              </select>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 12, marginTop: 18 }}>
            <button type="submit" className="primary" disabled={!file || loading}>
              {loading ? 'Publishing…' : 'Publish to dashboard'}
            </button>
          </div>
        </form>
        {status && <p style={{ marginTop: 14, color: 'var(--text-muted)' }}>{status}</p>}
        {error && <p style={{ marginTop: 14, color: '#fecaca' }}>{error}</p>}
        <div
          style={{
            marginTop: 20,
            padding: '12px 16px',
            borderRadius: 12,
            background: 'rgba(15,23,42,0.45)',
            border: '1px solid rgba(148,163,184,0.25)',
            display: 'flex',
            gap: 12,
            alignItems: 'center',
            flexWrap: 'wrap'
          }}
        >
          <strong style={{ fontSize: 14, letterSpacing: 0.4 }}>Workspace auto-save</strong>
          <span
            style={{
              color: syncStatus === 'error' ? '#fecaca' : 'var(--text-muted)',
              fontSize: 14
            }}
          >
            {autoSaveStatus}
          </span>
          <button
            type="button"
            className="secondary"
            style={{ marginLeft: 'auto', padding: '6px 14px' }}
            onClick={() => {
              void triggerSync()
            }}
            disabled={syncStatus === 'saving'}
          >
            {syncStatus === 'saving' ? 'Saving…' : 'Sync now'}
          </button>
        </div>
      </section>

      <section className="glass-card" style={{ display: 'grid', gap: 18 }}>
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div className="badge">Class statistics</div>
            <h3 style={{ margin: '12px 0 0', fontSize: 22, fontWeight: 700 }}>Saved assessment summaries</h3>
          </div>
          <button type="button" className="secondary" onClick={() => window.print()} style={{ padding: '8px 16px' }}>
            Print
          </button>
        </header>
        {insights && (
          <div
            className="glass-subcard"
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 18,
              padding: 16,
              borderRadius: 16,
              border: '1px solid rgba(99,102,241,0.25)',
              background: 'rgba(15,23,42,0.45)'
            }}
          >
            <div style={{ minWidth: 180 }}>
              <strong>Total learners</strong>
              <div style={{ fontSize: 24, fontWeight: 700 }}>{insights.totalStudents || '—'}</div>
            </div>
            <div style={{ minWidth: 180 }}>
              <strong>Class average</strong>
              <div style={{ fontSize: 24, fontWeight: 700 }}>
                {insights.averageScore !== null ? insights.averageScore.toFixed(1) : '—'}
              </div>
            </div>
            {insights.highest && (
              <div style={{ minWidth: 220 }}>
                <strong>Top performer</strong>
                <div style={{ fontSize: 15, marginTop: 6 }}>
                  {insights.highest.name} · {insights.highest.score ?? '—'}
                  <div style={{ color: 'var(--text-muted)', fontSize: 13 }}>
                    {insights.highest.testName ?? 'Assessment'}
                  </div>
                </div>
              </div>
            )}
            {insights.lowest && (
              <div style={{ minWidth: 220 }}>
                <strong>Needs support</strong>
                <div style={{ fontSize: 15, marginTop: 6 }}>
                  {insights.lowest.name} · {insights.lowest.score ?? '—'}
                  <div style={{ color: 'var(--text-muted)', fontSize: 13 }}>
                    {insights.lowest.testName ?? 'Assessment'}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
        {(groupInsights.length > 0 || pedagogy) && (
          <div
            className="glass-subcard"
            style={{
              display: 'grid',
              gap: 18,
              padding: 18,
              borderRadius: 16,
              border: '1px solid rgba(148,163,184,0.25)',
              background: 'rgba(15,23,42,0.45)'
            }}
          >
            {pedagogy && (
              <div>
                <strong style={{ display: 'block', marginBottom: 8 }}>Pedagogical commitments</strong>
                <p style={{ margin: '0 0 10px', color: 'var(--text-muted)' }}>{pedagogy.summary}</p>
                <ul style={{ margin: 0, paddingLeft: 18, color: 'var(--text-muted)', fontSize: 14, display: 'grid', gap: 6 }}>
                  {pedagogy.bestPractices.map((practice, index) => (
                    <li key={index}>{practice}</li>
                  ))}
                </ul>
                <details style={{ marginTop: 12 }}>
                  <summary style={{ cursor: 'pointer', color: '#cbd5f5' }}>Reflection prompts</summary>
                  <ul style={{ margin: '10px 0 0 18px', color: 'var(--text-muted)', fontSize: 14, display: 'grid', gap: 6 }}>
                    {pedagogy.reflectionPrompts.map((prompt, index) => (
                      <li key={index}>{prompt}</li>
                    ))}
                  </ul>
                </details>
              </div>
            )}
            {groupInsights.length > 0 && (
              <div style={{ display: 'grid', gap: 14 }}>
                <strong>Suggested learning groups</strong>
                <div style={{ display: 'grid', gap: 12 }}>
                  {groupInsights.map((group) => (
                    <div
                      key={group.id}
                      style={{
                        border: '1px solid rgba(99,102,241,0.25)',
                        borderRadius: 14,
                        padding: 14,
                        background: 'rgba(15,23,42,0.55)',
                        display: 'grid',
                        gap: 8
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 12 }}>
                        <span style={{ fontWeight: 600 }}>{group.label}</span>
                        <span style={{ color: 'var(--text-muted)', fontSize: 13 }}>
                          {group.range} • {group.studentCount} {group.studentCount === 1 ? 'learner' : 'learners'}
                        </span>
                      </div>
                      {group.students.length > 0 && (
                        <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: 14 }}>
                          Learners: {group.students.map((student) => student.name).join(', ')}
                        </p>
                      )}
                      <ul style={{ margin: 0, paddingLeft: 18, display: 'grid', gap: 4, color: 'var(--text-muted)', fontSize: 14 }}>
                        {group.recommendedPractices.map((practice, index) => (
                          <li key={index}>{practice}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
        {rosterLoading ? (
          <div style={{ color: 'var(--text-muted)' }}>Loading saved summaries…</div>
        ) : summaries.length === 0 ? (
          <div style={{ color: 'var(--text-muted)' }}>
            Upload mastery files to generate class-level averages and ranges. Summaries feed the dashboard and AI planning tools.
          </div>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Assessment</th>
                <th>Period</th>
                <th>Quarter</th>
                <th>Average</th>
                <th>High</th>
                <th>Low</th>
                <th>Learners</th>
                <th>Updated</th>
              </tr>
            </thead>
            <tbody>
              {summaries.map((record) => (
                <tr key={record.id}>
                  <td>{record.testName}</td>
                  <td>{record.period ?? '—'}</td>
                  <td>{record.quarter ?? '—'}</td>
                  <td>{record.averageScore !== null ? record.averageScore.toFixed(1) : '—'}</td>
                  <td>{record.maxScore ?? '—'}</td>
                  <td>{record.minScore ?? '—'}</td>
                  <td>{record.studentCount ?? '—'}</td>
                  <td>{record.updatedAt ? record.updatedAt.toLocaleString() : '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      </section>

      <section className="glass-card" style={{ display: 'grid', gap: 18 }}>
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div className="badge">Upload history</div>
            <h3 style={{ margin: '12px 0 0', fontSize: 22, fontWeight: 700 }}>Roster upload library</h3>
          </div>
          <span style={{ color: 'var(--text-muted)', fontSize: 13 }}>
            {uploads.length ? `${uploads.length} recent files` : 'Waiting on your first upload'}
          </span>
        </header>
        {uploads.length === 0 ? (
          <div style={{ color: 'var(--text-muted)' }}>
            Every roster you publish is stored securely. Download a prior CSV, reuse it for corrections, or confirm what was
            shared with Gemini planning.
          </div>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>File</th>
                <th>Assessment</th>
                <th>Period</th>
                <th>Quarter</th>
                <th>Uploaded</th>
                <th>Size</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {uploads.map((upload) => (
                <tr key={upload.id}>
                  <td>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span style={{ fontWeight: 600 }}>{upload.filename}</span>
                      {upload.storageWarning && (
                        <span style={{ color: '#fbbf24', fontSize: 12 }}>{upload.storageWarning}</span>
                      )}
                    </div>
                  </td>
                  <td>{upload.testName ?? '—'}</td>
                  <td>{upload.period ?? '—'}</td>
                  <td>{upload.quarter ?? '—'}</td>
                  <td>{upload.createdAt ? upload.createdAt.toLocaleString() : '—'}</td>
                  <td>{formatSize(upload.size)}</td>
                  <td>
                    <button
                      type="button"
                      className="secondary"
                      onClick={() => handleDownload(upload)}
                      style={{ padding: '6px 14px', fontSize: 13 }}
                    >
                      Download
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      <section className="glass-card" style={{ display: 'grid', gap: 18 }}>
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div className="badge">Individual records</div>
            <h3 style={{ margin: '12px 0 0', fontSize: 22, fontWeight: 700 }}>Latest mastery uploads</h3>
          </div>
          <button type="button" className="secondary" onClick={() => window.print()} style={{ padding: '8px 16px' }}>
            Print
          </button>
        </header>
        {records.length === 0 ? (
          <div style={{ color: 'var(--text-muted)' }}>
            Once you commit a roster, the secure roster library shows each learner’s score, period, and test name here for quick reference and AI planning.
          </div>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Student</th>
                <th>Score</th>
                <th>Assessment</th>
                <th>Period</th>
                <th>Quarter</th>
                <th>Source row</th>
                <th>Uploaded</th>
              </tr>
            </thead>
            <tbody>
              {records.map((record) => (
                <tr key={record.id}>
                  <td>{record.displayName}</td>
                  <td>{record.score !== null ? record.score : '—'}</td>
                  <td>{record.testName ?? '—'}</td>
                  <td>{record.period ?? '—'}</td>
                  <td>{record.quarter ?? '—'}</td>
                  <td>{record.sheetRow ?? '—'}</td>
                  <td>{record.createdAt ? record.createdAt.toLocaleString() : '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  )
}
