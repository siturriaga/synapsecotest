import { useEffect, useMemo, useState } from 'react'
import type { User } from 'firebase/auth'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { db } from '../firebase'
import { useRosterData } from '../hooks/useRosterData'
import { useAssistedMode } from '../hooks/useAssistedMode'

interface SettingsPageProps {
  user: User | null
}

type Preferences = {
  timezone: string
  darkMode: 'system' | 'light' | 'dark'
  dyslexiaFont: boolean
  notifications: boolean
}

const defaultPreferences: Preferences = {
  timezone: 'America/New_York',
  darkMode: 'system',
  dyslexiaFont: false,
  notifications: true
}

export default function SettingsPage({ user }: SettingsPageProps) {
  const [preferences, setPreferences] = useState<Preferences>(defaultPreferences)
  const [status, setStatus] = useState<string>('')
  const [error, setError] = useState<string | null>(null)
  const [restoreStatus, setRestoreStatus] = useState<string>('')
  const [restoreError, setRestoreError] = useState<string>('')
  const [restoringId, setRestoringId] = useState<string | null>(null)
  const { snapshots, restoreSnapshot } = useRosterData()
  const { enabled: assistedModeEnabled, resetHints } = useAssistedMode()

  useEffect(() => {
    async function loadPreferences() {
      if (!user) {
        setPreferences(defaultPreferences)
        return
      }
      const ref = doc(db, `users/${user.uid}/preferences/app`)
      const snap = await getDoc(ref)
      if (snap.exists()) {
        const data = snap.data() as Partial<Preferences>
        setPreferences({ ...defaultPreferences, ...data })
      }
    }
    loadPreferences().catch((err) => {
      console.error(err)
      setError('Failed to load preferences.')
    })
  }, [user])

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    if (!user) {
      setError('Sign in first.')
      return
    }
    try {
      const ref = doc(db, `users/${user.uid}/preferences/app`)
      await setDoc(ref, preferences, { merge: true })
      setStatus('Preferences saved.')
      setError(null)
    } catch (err: any) {
      console.error(err)
      setError(err?.message ?? 'Failed to save preferences.')
    }
  }

  const formattedSnapshots = useMemo(
    () =>
      snapshots.map((entry) => ({
        ...entry,
        createdLabel: entry.createdAt
          ? entry.createdAt.toLocaleString(undefined, {
              month: 'short',
              day: 'numeric',
              hour: 'numeric',
              minute: 'numeric'
            })
          : '—'
      })),
    [snapshots]
  )

  async function handleRestore(snapshotId: string) {
    if (!snapshotId) return
    setRestoreError('')
    setRestoreStatus('')
    setRestoringId(snapshotId)
    try {
      await restoreSnapshot(snapshotId)
      setRestoreStatus('Snapshot restored. The workspace view will refresh with the selected version.')
    } catch (err: any) {
      console.error(err)
      setRestoreError(err?.message ?? 'Unable to restore snapshot. Try again soon.')
    } finally {
      setRestoringId(null)
    }
  }

  if (!user) {
    return (
      <div className="glass-card fade-in">
        <h2 style={{ margin: 0, fontSize: 26, fontWeight: 800 }}>Authenticate to personalize Synapse</h2>
      </div>
    )
  }

  return (
    <div className="fade-in" style={{ display: 'grid', gap: 24 }}>
      <section className="glass-card">
        <div className="badge">Workspace preferences</div>
        <h2 style={{ margin: '12px 0 6px', fontSize: 28, fontWeight: 800 }}>Workspace settings</h2>
        <form onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="pref-timezone">Timezone</label>
            <input
              id="pref-timezone"
              name="pref-timezone"
              value={preferences.timezone}
              onChange={(event) => setPreferences((prev) => ({ ...prev, timezone: event.target.value }))}
              required
            />
          </div>
          <div className="field">
            <label htmlFor="pref-dark-mode">Appearance</label>
            <select
              id="pref-dark-mode"
              name="pref-dark-mode"
              value={preferences.darkMode}
              onChange={(event) => setPreferences((prev) => ({ ...prev, darkMode: event.target.value as Preferences['darkMode'] }))}
            >
              <option value="system">Follow system</option>
              <option value="light">Light mode</option>
              <option value="dark">Dark mode</option>
            </select>
          </div>
          <div className="field" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <input
              id="pref-dyslexia-font"
              name="pref-dyslexia-font"
              type="checkbox"
              checked={preferences.dyslexiaFont}
              onChange={(event) => setPreferences((prev) => ({ ...prev, dyslexiaFont: event.target.checked }))}
            />
            <label htmlFor="pref-dyslexia-font" style={{ margin: 0 }}>Enable dyslexia-friendly font</label>
          </div>
          <div className="field" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <input
              id="pref-notifications"
              name="pref-notifications"
              type="checkbox"
              checked={preferences.notifications}
              onChange={(event) => setPreferences((prev) => ({ ...prev, notifications: event.target.checked }))}
            />
            <label htmlFor="pref-notifications" style={{ margin: 0 }}>Email notifications for Gemini insights</label>
          </div>
          <button type="submit" className="primary">Save preferences</button>
        </form>
        {status && <p style={{ marginTop: 12, color: 'var(--text-muted)' }}>{status}</p>}
        {error && <p style={{ marginTop: 12, color: '#fecaca' }}>{error}</p>}
      </section>
      <section className="glass-card">
        <div className="badge">Auto-save & backups</div>
        <h2 style={{ margin: '12px 0 6px', fontSize: 28, fontWeight: 800 }}>Snapshot history</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: 16 }}>
          Synapse auto-saves the entire workspace every few seconds and preserves the last ten versions. Restore a snapshot to
          roll back the shared roster context across dashboards, groups, and assignments.
        </p>
        {formattedSnapshots.length ? (
          <div style={{ display: 'grid', gap: 12 }}>
            {formattedSnapshots.map((entry) => (
              <div
                key={entry.id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  border: '1px solid rgba(148, 163, 184, 0.2)',
                  borderRadius: 16,
                  padding: '14px 18px',
                  background: 'rgba(15, 23, 42, 0.5)'
                }}
              >
                <div>
                  <div style={{ fontWeight: 600 }}>{entry.createdLabel}</div>
                  <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>
                    {entry.summary.totalStudents} students • {entry.summary.totalRecords} assessments • Latest assessment:
                    {entry.summary.latestAssessment ? ` ${entry.summary.latestAssessment}` : ' —'}
                  </div>
                </div>
                <button
                  type="button"
                  className="secondary"
                  disabled={restoringId === entry.id}
                  onClick={() => {
                    void handleRestore(entry.id)
                  }}
                >
                  {restoringId === entry.id ? 'Restoring…' : 'Restore snapshot'}
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">Snapshots will appear after your next auto-save cycle.</div>
        )}
        {restoreStatus && <p style={{ marginTop: 12, color: 'var(--text-muted)' }}>{restoreStatus}</p>}
        {restoreError && <p style={{ marginTop: 12, color: '#fecaca' }}>{restoreError}</p>}
      </section>
      <section className="glass-card">
        <div className="badge">Assisted Mode</div>
        <h2 style={{ margin: '12px 0 6px', fontSize: 28, fontWeight: 800 }}>Hint preferences</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: 16 }}>
          Assisted Mode is currently <strong>{assistedModeEnabled ? 'enabled' : 'disabled'}</strong>. Clear saved hint
          dismissals if you want Synapse to surface micro-guidance again.
        </p>
        <button
          type="button"
          className="secondary"
          onClick={() => {
            void resetHints()
          }}
        >
          Reset assisted hints
        </button>
      </section>
    </div>
  )
}
