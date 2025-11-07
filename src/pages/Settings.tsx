import { useCallback, useEffect, useMemo, useState } from 'react'
import type { User } from 'firebase/auth'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { db } from '../firebase'
import { safeFetch } from '../utils/safeFetch'
import {
  DEFAULT_APP_PREFERENCES,
  type AppPreferences,
  type TexturePreference,
  sanitizePreferences
} from '../hooks/usePreferences'

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

export default function SettingsPage({ user }: SettingsPageProps) {
  const [preferences, setPreferences] = useState<Preferences>(() => createDefaultPreferences())
  const [status, setStatus] = useState<string>('')
  const [error, setError] = useState<string | null>(null)
  const [healthState, setHealthState] = useState<'idle' | 'loading' | 'ready' | 'error'>('idle')
  const [healthReport, setHealthReport] = useState<HealthPayload | null>(null)
  const [healthError, setHealthError] = useState<string | null>(null)
  const accentLabel = useMemo(() => preferences.accentColor.toUpperCase(), [preferences.accentColor])
  const surfaceLabel = useMemo(() => preferences.surfaceColor.toUpperCase(), [preferences.surfaceColor])
  const selectedTexture = useMemo(
    () => textureOptions.find((option) => option.value === preferences.texture) ?? textureOptions[0],
    [preferences.texture]
  )


  const refreshHealth = useCallback(async () => {
    setHealthState('loading')
    setHealthError(null)
    try {
      const report = await safeFetch<HealthPayload>('/api/health')
      setHealthReport(report)
      setHealthState('ready')
    } catch (err: any) {
      console.error('Health check failed', err)
      setHealthReport(null)
      setHealthState('error')
      setHealthError(err?.message ?? 'Unable to contact Netlify functions.')
    }
  }, [])

  useEffect(() => {
    async function loadPreferences() {
      if (!user) {
        setPreferences(createDefaultPreferences())
        return
      }

      if (!db) {
        console.warn('Firestore unavailable. Unable to load user preferences.')
        setError('Workspace storage is offline. Preferences will stay at their defaults until it returns.')
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
    refreshHealth().catch((err) => {
      console.error(err)
    })
  }, [user, db, refreshHealth])

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    if (!user) {
      setError('Sign in first.')
      return
    }
    if (!db) {
      setError('Workspace storage is offline. Preferences cannot be saved right now.')
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

  const defaultHelperDisplay = defaultHelper || 'Local project (/api/*)'

  const buildHelperStatus = useCallback(
    (nextBase: string) => {
      const normalizedDefault = defaultHelper || ''
      if (!nextBase || nextBase === normalizedDefault) {
        return `Using the default Gemini helper (${defaultHelperDisplay}).`
      }
      return `Gemini helper set to ${nextBase}`
    },
    [defaultHelper, defaultHelperDisplay]
  )

  useEffect(() => {
    setHelperStatus(buildHelperStatus(activeHelper))
  }, [activeHelper, buildHelperStatus])

  function handleHelperSubmit(event: React.FormEvent) {
    event.preventDefault()
    try {
      const trimmed = helperInput.trim()
      const nextBase = trimmed ? setRemoteFunctionBaseOverride(trimmed) : clearRemoteFunctionBaseOverride()
      setHelperInput(trimmed)
      setActiveHelper(nextBase)
      setHelperStatus(buildHelperStatus(nextBase))
      setHelperError(null)
    } catch (err: any) {
      const message = typeof err?.message === 'string' ? err.message : 'Unable to update Gemini helper.'
      setHelperError(message)
      setHelperStatus('')
    }
  }

  function handleHelperReset() {
    const base = clearRemoteFunctionBaseOverride()
    setHelperInput('')
    setActiveHelper(base)
    setHelperStatus(buildHelperStatus(base))
    setHelperError(null)
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
        <h2 style={{ margin: '4px 0 6px', fontSize: 28, fontWeight: 800 }}>Workspace settings</h2>
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
      <section className="glass-card" aria-live="polite">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
          <h2 style={{ margin: '4px 0 6px', fontSize: 24, fontWeight: 800 }}>System diagnostics</h2>
          <button type="button" className="secondary" onClick={() => refreshHealth()} disabled={healthState === 'loading'}>
            {healthState === 'loading' ? 'Checking…' : 'Run check again'}
          </button>
        </div>
        {healthState === 'loading' && <p style={{ color: 'var(--text-muted)' }}>Contacting Netlify functions…</p>}
        {healthState === 'error' && healthError && (
          <p style={{ color: '#fecaca', marginTop: 12 }}>{healthError}</p>
        )}
        {healthState === 'ready' && healthReport && (
          <div style={{ display: 'grid', gap: 12, marginTop: 12 }}>
            <HealthStatusRow
              label="Firebase Admin"
              status={healthReport.firebaseAdmin.configured ? 'Ready' : 'Missing credentials'}
              detail={healthReport.firebaseAdmin.error}
              healthy={healthReport.firebaseAdmin.configured}
            />
            <HealthStatusRow
              label="Gemini API"
              status={healthReport.gemini.configured ? 'Key detected' : 'Not configured'}
              detail={healthReport.gemini.error}
              healthy={healthReport.gemini.configured}
            />
            <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
              <strong>Last check:</strong> {new Date(healthReport.timestamp).toLocaleString()}
            </div>
            {healthReport.notes.length > 0 && (
              <ul style={{ margin: 0, paddingLeft: 20, color: 'var(--text-muted)' }}>
                {healthReport.notes.map((note, index) => (
                  <li key={index}>{note}</li>
                ))}
              </ul>
            )}
          </div>
        )}
      </section>
    </div>
  )
}

type HealthPayload = {
  ok: boolean
  timestamp: string
  firebaseAdmin: { configured: boolean; error?: string }
  gemini: { configured: boolean; error?: string }
  notes: string[]
}

function HealthStatusRow({
  label,
  status,
  detail,
  healthy
}: {
  label: string
  status: string
  detail?: string
  healthy: boolean
}) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '12px 16px',
        borderRadius: 12,
        background: healthy ? 'rgba(34,197,94,0.1)' : 'rgba(248,113,113,0.12)',
        border: healthy ? '1px solid rgba(34,197,94,0.25)' : '1px solid rgba(248,113,113,0.25)'
      }}
    >
      <div style={{ display: 'grid', gap: 4 }}>
        <strong style={{ fontSize: 14, letterSpacing: 0.4 }}>{label}</strong>
        <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>{status}</span>
        {detail && <span style={{ fontSize: 12, color: 'rgba(248,113,113,0.9)' }}>{detail}</span>}
      </div>
      <span
        style={{
          fontSize: 12,
          fontWeight: 700,
          letterSpacing: 1.2,
          textTransform: 'uppercase',
          color: healthy ? 'rgba(34,197,94,0.95)' : 'rgba(248,113,113,0.9)'
        }}
      >
        {healthy ? 'OK' : 'ATTENTION'}
      </span>
    </div>
  )
}
