import { useEffect, useMemo, useState } from 'react'
import type { User } from 'firebase/auth'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { db } from '../firebase'
import { DEFAULT_APP_PREFERENCES, type AppPreferences, type TexturePreference } from '../hooks/usePreferences'

interface SettingsPageProps {
  user: User | null
}

type Preferences = AppPreferences

const createDefaultPreferences = (): Preferences => ({ ...DEFAULT_APP_PREFERENCES })

const textureOptions: Array<{ value: TexturePreference; label: string; description: string }> = [
  { value: 'aurora', label: 'Aurora waves', description: 'Flowing gradients that pulse softly behind each workspace.' },
  { value: 'orbs', label: 'Floating orbs', description: 'Layered light orbs with gentle motion for a cinematic feel.' },
  { value: 'grid', label: 'Futuristic grid', description: 'Subtle tech grid with premium bloom accents.' },
  { value: 'minimal', label: 'Minimal', description: 'Tone the background down for focused planning sessions.' }
]

const HEX_COLOR = /^#([0-9a-f]{6})$/i

function normalizeTexture(value: any): TexturePreference {
  return textureOptions.some((option) => option.value === value) ? (value as TexturePreference) : 'aurora'
}

function normalizeDarkMode(value: any): Preferences['darkMode'] {
  return value === 'light' || value === 'dark' ? value : 'system'
}

function normalizeColor(value: any, fallback: string) {
  if (typeof value === 'string' && HEX_COLOR.test(value)) {
    return value.toLowerCase()
  }
  return fallback
}

function sanitizePreferences(data?: Partial<Preferences>): Preferences {
  const base = createDefaultPreferences()
  if (!data) return base
  return {
    ...base,
    ...data,
    timezone: typeof data.timezone === 'string' && data.timezone.trim() ? data.timezone : base.timezone,
    darkMode: normalizeDarkMode(data.darkMode),
    dyslexiaFont: typeof data.dyslexiaFont === 'boolean' ? data.dyslexiaFont : base.dyslexiaFont,
    notifications: typeof data.notifications === 'boolean' ? data.notifications : base.notifications,
    displayNameOverride:
      typeof data.displayNameOverride === 'string'
        ? data.displayNameOverride.trim() || null
        : null,
    accentColor: normalizeColor(data.accentColor, base.accentColor),
    surfaceColor: normalizeColor(data.surfaceColor, base.surfaceColor),
    texture: normalizeTexture(data.texture),
    microInteractions: typeof data.microInteractions === 'boolean' ? data.microInteractions : base.microInteractions
  }
}

export default function SettingsPage({ user }: SettingsPageProps) {
  const [preferences, setPreferences] = useState<Preferences>(() => createDefaultPreferences())
  const [status, setStatus] = useState<string>('')
  const [error, setError] = useState<string | null>(null)
  const accentLabel = useMemo(() => preferences.accentColor.toUpperCase(), [preferences.accentColor])
  const surfaceLabel = useMemo(() => preferences.surfaceColor.toUpperCase(), [preferences.surfaceColor])
  const selectedTexture = useMemo(
    () => textureOptions.find((option) => option.value === preferences.texture) ?? textureOptions[0],
    [preferences.texture]
  )

  useEffect(() => {
    async function loadPreferences() {
      if (!user) {
        setPreferences(createDefaultPreferences())
        return
      }
      const ref = doc(db, `users/${user.uid}/preferences/app`)
      const snap = await getDoc(ref)
      setPreferences(sanitizePreferences(snap.exists() ? (snap.data() as Partial<Preferences>) : undefined))
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
      const cleaned = sanitizePreferences(preferences)
      await setDoc(ref, cleaned, { merge: true })
      setPreferences(cleaned)
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
            <label htmlFor="pref-display-name">Preferred welcome name</label>
            <input
              id="pref-display-name"
              name="pref-display-name"
              value={preferences.displayNameOverride ?? ''}
              placeholder="Use your email-based name"
              onChange={(event) =>
                setPreferences((prev) => {
                  const trimmed = event.target.value.trim()
                  return {
                    ...prev,
                    displayNameOverride: trimmed ? trimmed : null
                  }
                })
              }
            />
            <small style={{ color: 'var(--text-muted)' }}>Leave blank to auto-derive from your Google account email.</small>
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
          <div className="field">
            <label htmlFor="pref-accent">Accent color</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <input
                id="pref-accent"
                name="pref-accent"
                type="color"
                value={preferences.accentColor}
                onChange={(event) => setPreferences((prev) => ({ ...prev, accentColor: event.target.value }))}
              />
              <span style={{ fontSize: 13, letterSpacing: 0.08, textTransform: 'uppercase', color: 'var(--text-muted)' }}>
                {accentLabel}
              </span>
            </div>
          </div>
          <div className="field">
            <label htmlFor="pref-surface">Canvas tone</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <input
                id="pref-surface"
                name="pref-surface"
                type="color"
                value={preferences.surfaceColor}
                onChange={(event) => setPreferences((prev) => ({ ...prev, surfaceColor: event.target.value }))}
              />
              <span style={{ fontSize: 13, letterSpacing: 0.08, textTransform: 'uppercase', color: 'var(--text-muted)' }}>
                {surfaceLabel}
              </span>
            </div>
          </div>
          <div className="field">
            <label htmlFor="pref-texture">Interface texture</label>
            <select
              id="pref-texture"
              name="pref-texture"
              value={preferences.texture}
              onChange={(event) => setPreferences((prev) => ({ ...prev, texture: event.target.value as TexturePreference }))}
            >
              {textureOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <small style={{ color: 'var(--text-muted)' }}>{selectedTexture.description}</small>
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
              id="pref-micro"
              name="pref-micro"
              type="checkbox"
              checked={preferences.microInteractions}
              onChange={(event) => setPreferences((prev) => ({ ...prev, microInteractions: event.target.checked }))}
            />
            <label htmlFor="pref-micro" style={{ margin: 0 }}>Enable premium micro-interactions</label>
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
