import { useCallback, useMemo, useState } from 'react'
import type { User } from 'firebase/auth'
import { auth, db } from '../firebase'
import { safeFetch } from '../utils/safeFetch'
import { useRosterData } from '../hooks/useRosterData'
import type { SavedRosterUpload } from '../types/roster'

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

type RowOverride = {
  displayName?: string
  period?: string
  quarter?: string
  score?: string
  testName?: string
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
  const [preview, setPreview] = useState<PreviewResponse | null>(null)
  const [uploadId, setUploadId] = useState<string | null>(null)
  const [status, setStatus] = useState<string>('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [overrides, setOverrides] = useState<Record<number, RowOverride>>({})
  const [overrideDirty, setOverrideDirty] = useState(false)
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

  const summary = useMemo(() => preview?.assessmentSummary, [preview])
  const previewDetails = useMemo(() => {
    if (!preview) {
      return {
        testName: testName.trim() || null,
        period: period ? Number(period) : null,
        quarter: quarter || null
      }
    }
    const test = preview.rows.find((row) => row.data.testName)
    const periodRow = preview.rows.find((row) => row.data.period !== null)
    const quarterRow = preview.rows.find((row) => row.data.quarter)
    return {
      testName: (test?.data.testName || testName || '').trim() || null,
      period: periodRow?.data.period ?? (period ? Number(period) : null),
      quarter: quarterRow?.data.quarter ?? (quarter || null)
    }
  }, [preview, testName, period, quarter])

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

  const buildManualOverrides = useCallback(() => {
    const payload: Record<number, any> = {}
    Object.entries(overrides).forEach(([key, fields]) => {
      const rowNumber = Number(key)
      if (!Number.isFinite(rowNumber)) return
      const entry: Record<string, any> = {}
      if (Object.prototype.hasOwnProperty.call(fields, 'displayName')) {
        const value = fields.displayName?.trim() ?? ''
        entry.displayName = value ? value : null
      }
      if (Object.prototype.hasOwnProperty.call(fields, 'period')) {
        const trimmed = fields.period?.trim() ?? ''
        if (!trimmed) {
          entry.period = null
        } else {
          const numeric = Number(trimmed)
          entry.period = Number.isFinite(numeric) ? numeric : null
        }
      }
      if (Object.prototype.hasOwnProperty.call(fields, 'quarter')) {
        const trimmed = fields.quarter?.trim() ?? ''
        entry.quarter = trimmed ? trimmed.toUpperCase() : null
      }
      if (Object.prototype.hasOwnProperty.call(fields, 'score')) {
        const trimmed = fields.score?.trim() ?? ''
        if (!trimmed) {
          entry.score = null
        } else {
          const numeric = Number(trimmed)
          entry.score = Number.isFinite(numeric) ? numeric : null
        }
      }
      if (Object.prototype.hasOwnProperty.call(fields, 'testName')) {
        const value = fields.testName?.trim() ?? ''
        entry.testName = value ? value : null
      }
      if (Object.keys(entry).length > 0) {
        payload[rowNumber] = entry
      }
    })
    return payload
  }, [overrides])

  const updateOverride = useCallback((rowNumber: number, field: keyof RowOverride, value: string) => {
    setOverrides((prev) => {
      const nextRow = { ...(prev[rowNumber] ?? {}), [field]: value }
      const next = { ...prev, [rowNumber]: nextRow }
      const hasValues = Object.values(next).some((entry) => entry && Object.keys(entry).length > 0)
      setOverrideDirty(hasValues)
      return next
    })
  }, [])

  const handleCommit = useCallback(async () => {
    if (loading) return

    if (!file) {
      setError('Select a file and ensure you are signed in.')
      return
    }

    const previewResult = await uploadFile('preview')
    if (!previewResult || !('rows' in previewResult)) {
      return
    }

    if (previewResult.stats.needs_review > 0) {
      const proceed = window.confirm(
        'Some rows still need review. Continue saving and mark unresolved fields as N/A?'
      )
      if (!proceed) {
        return
      }
    }

    let chosenIntent: 'update' | 'new' | undefined
    if (!testName.trim()) {
      const wantsUpdate = window.confirm(
        'No assessment name detected. Is this an update to an existing data set?\nSelect OK for Update or Cancel for New.'
      )
      chosenIntent = wantsUpdate ? 'update' : 'new'
    }

    await uploadFile('commit', chosenIntent)
  }, [file, loading, testName, uploadFile])

  const resetOverride = useCallback((rowNumber: number) => {
    setOverrides((prev) => {
      if (!prev[rowNumber]) return prev
      const next = { ...prev }
      delete next[rowNumber]
      const hasValues = Object.values(next).some((entry) => entry && Object.keys(entry).length > 0)
      setOverrideDirty(hasValues)
      return next
    })
  }, [])

  async function uploadFile(
    mode: 'preview' | 'commit',
    intent?: 'update' | 'new'
  ): Promise<PreviewResponse | CommitResponse | null> {
    if (!user || !file) {
      setError('Select a file and ensure you are signed in.')
      return null
    }

    try {
      setLoading(true)
      setError(null)
      setStatus(mode === 'preview' ? 'Uploading for preview…' : 'Applying roster to Firestore…')

      let id = uploadId
      if (!id) {
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
          body: JSON.stringify({
            uploadId: id,
            mode,
            manualOverrides: buildManualOverrides(),
            intent
          })
        }
      )

      if (mode === 'preview') {
        setPreview(response as PreviewResponse)
        setStatus('Preview ready — resolve any issues before committing.')
        setOverrideDirty(false)
        return response as PreviewResponse
      } else {
        const commit = response as CommitResponse
        const averageText = commit.assessmentSummary.average !== null ? ` Class average ${commit.assessmentSummary.average.toFixed(1)}.` : ''
        setStatus(`Synced ${commit.written} learners. Skipped ${commit.skipped}.${averageText}`)
        setPreview(null)
        setUploadId(null)
        setFile(null)
        setTestName('')
        setOverrides({})
        setOverrideDirty(false)
        try {
          await triggerSync()
        } catch (syncErr) {
          console.error('Unable to force roster snapshot sync', syncErr)
        }
        return commit
      }
    } catch (err: any) {
      console.error(err)
      setError(err?.message ?? 'Upload failed.')
      return null
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
        <h2 style={{ margin: '12px 0 6px', fontSize: 28, fontWeight: 800 }}>Upload mastery results and refine them in place</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: 20 }}>
          Drop in your export, edit names, periods, scores, or test titles directly in the table, then preview before saving.
        </p>
        <form
          onSubmit={(event) => {
            event.preventDefault()
            void uploadFile('preview')
          }}
        >
          <div className="field">
            <label htmlFor="roster-file">Choose roster file</label>
            <input
              id="roster-file"
              name="roster-file"
              type="file"
              accept=".csv,.xlsx,.xls,.pdf,.docx"
              onChange={(event) => {
                const nextFile = event.target.files?.[0] ?? null
                setFile(nextFile)
                setUploadId(null)
                setPreview(null)
                setOverrides({})
                setOverrideDirty(false)
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
              {loading ? 'Processing…' : 'Upload & analyse'}
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

      {preview && (
        <section className="glass-card" style={{ display: 'grid', gap: 18 }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 18, justifyContent: 'space-between', alignItems: 'flex-end' }}>
            <div>
              <h3 style={{ margin: 0, fontSize: 22, fontWeight: 700 }}>Preview results</h3>
              <p style={{ color: 'var(--text-muted)' }}>
                {preview.stats.ok} learners ready • {preview.stats.needs_review} need attention.
              </p>
            </div>
            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'stretch' }}>
              <div className="glass-subcard" style={{ padding: 16, borderRadius: 16, border: '1px solid rgba(99,102,241,0.25)', background: 'rgba(15,23,42,0.55)', minWidth: 220 }}>
                <strong>Test details</strong>
                <div style={{ marginTop: 8, display: 'grid', gap: 4, fontSize: 14 }}>
                  <span>Assessment: {previewDetails.testName ?? '—'}</span>
                  <span>Period: {previewDetails.period ?? '—'} · Quarter: {previewDetails.quarter ?? '—'}</span>
                </div>
              </div>
              {summary && (
                <div className="glass-subcard" style={{ padding: 16, borderRadius: 16, border: '1px solid rgba(99,102,241,0.25)', background: 'rgba(15,23,42,0.55)', minWidth: 220 }}>
                  <strong>Assessment snapshot</strong>
                  <div style={{ marginTop: 8, display: 'grid', gap: 4, fontSize: 14 }}>
                    <span>Average: {summary.average !== null ? summary.average.toFixed(1) : '—'}</span>
                    <span>Median: {summary.median !== null ? summary.median.toFixed(1) : '—'}</span>
                    <span>High: {summary.max !== null ? summary.max.toFixed(1) : '—'} · Low: {summary.min !== null ? summary.min.toFixed(1) : '—'}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
            <button
              type="button"
              className="secondary"
              onClick={() => {
                void uploadFile('preview')
              }}
              disabled={loading}
            >
              {loading ? 'Re-analysing…' : 'Refresh analysis'}
            </button>
            <button
              type="button"
              className="primary"
              onClick={() => {
                void handleCommit()
              }}
              disabled={loading}
            >
              {loading ? 'Saving…' : 'Save to workspace'}
            </button>
          </div>
          <table className="table">
            <thead>
              <tr>
                <th>Row</th>
                <th>Student</th>
                <th>Period</th>
                <th>Quarter</th>
                <th>Score</th>
                <th>Assessment</th>
                <th>Status</th>
                <th>Manual</th>
              </tr>
            </thead>
            <tbody>
              {preview.rows.map((row) => {
                const rowOverride = overrides[row.row] ?? {}
                const hasOverride = !!rowOverride && Object.keys(rowOverride).length > 0
                const studentValue = rowOverride.displayName ?? row.data.displayName ?? ''
                const periodValue = rowOverride.period ?? (row.data.period !== null ? String(row.data.period) : '')
                const quarterValue = rowOverride.quarter ?? (row.data.quarter ?? '')
                const scoreValue = rowOverride.score ?? (row.data.score !== null ? String(row.data.score) : '')
                const testValue = rowOverride.testName ?? row.data.testName ?? testName ?? ''
                return (
                  <tr key={row.row}>
                    <td>{row.row}</td>
                    <td>
                      <input
                        className="table-input"
                        value={studentValue}
                        onChange={(event) => updateOverride(row.row, 'displayName', event.target.value)}
                        placeholder="Student name"
                      />
                    </td>
                    <td>
                      <input
                        className="table-input"
                        type="number"
                        min={1}
                        max={8}
                        value={periodValue}
                        onChange={(event) => updateOverride(row.row, 'period', event.target.value)}
                        placeholder="—"
                      />
                    </td>
                    <td>
                      <select
                        className="table-input"
                        value={quarterValue}
                        onChange={(event) => updateOverride(row.row, 'quarter', event.target.value)}
                      >
                        <option value="">—</option>
                        <option value="Q1">Q1</option>
                        <option value="Q2">Q2</option>
                        <option value="Q3">Q3</option>
                        <option value="Q4">Q4</option>
                      </select>
                    </td>
                    <td>
                      <input
                        className="table-input"
                        type="number"
                        step="0.1"
                        value={scoreValue}
                        onChange={(event) => updateOverride(row.row, 'score', event.target.value)}
                        placeholder="—"
                      />
                    </td>
                    <td>
                      <input
                        className="table-input"
                        value={testValue}
                        onChange={(event) => updateOverride(row.row, 'testName', event.target.value)}
                        placeholder="Assessment name"
                      />
                    </td>
                    <td>
                      {row.status === 'ok' ? (
                        <span className="status-success">Validated</span>
                      ) : (
                        <span className="status-warning">Check: {row.issues?.join(', ')}</span>
                      )}
                    </td>
                    <td>
                      {hasOverride ? (
                        <button
                          type="button"
                          className="link-button"
                          onClick={() => resetOverride(row.row)}
                        >
                          Reset
                        </button>
                      ) : (
                        <span style={{ color: 'var(--text-muted)', fontSize: 13 }}>—</span>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
          {overrideDirty && (
            <div
              style={{
                marginTop: 12,
                padding: '12px 16px',
                borderRadius: 12,
                border: '1px solid rgba(251,191,36,0.45)',
                background: 'rgba(251,191,36,0.12)',
                color: '#facc15',
                fontSize: 13
              }}
            >
              Manual edits pending — run Preview again to validate before committing.
            </div>
          )}
        </section>
      )}

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
            Every roster you preview or commit is stored securely. Download a prior CSV, reuse it for corrections, or confirm
            what was shared with Gemini planning.
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
