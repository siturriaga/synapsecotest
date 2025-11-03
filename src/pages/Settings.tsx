import { useEffect, useState } from 'react'
import type { User } from 'firebase/auth'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { db } from '../firebase'

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
    </div>
  )
}
