import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import type { User } from 'firebase/auth'
import { doc, onSnapshot } from 'firebase/firestore'
import { db } from '../firebase'

export type TexturePreference = 'aurora' | 'orbs' | 'grid' | 'minimal'

export type AppPreferences = {
  timezone: string
  darkMode: 'system' | 'light' | 'dark'
  dyslexiaFont: boolean
  notifications: boolean
  displayNameOverride: string | null
  accentColor: string
  surfaceColor: string
  texture: TexturePreference
  microInteractions: boolean
}

export type PreferencesContextValue = {
  preferences: AppPreferences
  ready: boolean
  displayName: string
}

export const DEFAULT_APP_PREFERENCES: AppPreferences = {
  timezone: 'America/New_York',
  darkMode: 'system',
  dyslexiaFont: false,
  notifications: true,
  displayNameOverride: null,
  accentColor: '#6366f1',
  surfaceColor: '#0b1120',
  texture: 'aurora',
  microInteractions: true
}

const PreferencesContext = createContext<PreferencesContextValue | undefined>(undefined)

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const normalized = hex.replace('#', '')
  if (normalized.length !== 6) return null
  const bigint = Number.parseInt(normalized, 16)
  return {
    r: (bigint >> 16) & 255,
    g: (bigint >> 8) & 255,
    b: bigint & 255
  }
}

function mixRgb(
  a: { r: number; g: number; b: number },
  b: { r: number; g: number; b: number },
  weight: number
): { r: number; g: number; b: number } {
  const clampWeight = Math.min(Math.max(weight, 0), 1)
  return {
    r: Math.round(a.r * (1 - clampWeight) + b.r * clampWeight),
    g: Math.round(a.g * (1 - clampWeight) + b.g * clampWeight),
    b: Math.round(a.b * (1 - clampWeight) + b.b * clampWeight)
  }
}

function rgbToHex({ r, g, b }: { r: number; g: number; b: number }) {
  const toHex = (value: number) => value.toString(16).padStart(2, '0')
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`
}

function rgba({ r, g, b }: { r: number; g: number; b: number }, alpha: number) {
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

function deriveDisplayName(user: User | null, preferences: AppPreferences) {
  const manual = preferences.displayNameOverride?.trim()
  if (manual) return manual
  const fromProfile = user?.displayName?.trim()
  if (fromProfile) return fromProfile
  const email = user?.email
  if (email) {
    const [local] = email.split('@')
    if (local) {
      return local
        .split(/[._-]/)
        .filter(Boolean)
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join(' ')
    }
  }
  return 'Educator'
}

function applyTheme(preferences: AppPreferences) {
  const root = document.documentElement
  const baseRgb = hexToRgb(preferences.surfaceColor) ?? { r: 11, g: 17, b: 32 }
  const accentRgb = hexToRgb(preferences.accentColor) ?? { r: 99, g: 102, b: 241 }

  const cardRgb = mixRgb(baseRgb, { r: 255, g: 255, b: 255 }, 0.12)
  const hoverRgb = mixRgb(baseRgb, { r: 255, g: 255, b: 255 }, 0.2)
  const borderRgb = mixRgb(baseRgb, { r: 255, g: 255, b: 255 }, 0.55)
  const accentSecondary = rgbToHex(mixRgb(accentRgb, { r: 255, g: 255, b: 255 }, 0.25))

  root.style.setProperty('--bg', `rgb(${baseRgb.r}, ${baseRgb.g}, ${baseRgb.b})`)
  root.style.setProperty('--bg-soft', rgba(baseRgb, 0.7))
  root.style.setProperty('--bg-card', rgba(cardRgb, 0.55))
  root.style.setProperty('--bg-card-hover', rgba(hoverRgb, 0.75))
  root.style.setProperty('--border', rgba(borderRgb, 0.26))
  root.style.setProperty('--shadow-md', `0 24px 60px rgba(${baseRgb.r}, ${baseRgb.g}, ${baseRgb.b}, 0.42)`)

  root.style.setProperty('--accent', preferences.accentColor)
  root.style.setProperty('--accent-soft', rgba(accentRgb, 0.18))
  root.style.setProperty('--accent-secondary', accentSecondary)
  root.style.setProperty('--glow', `rgba(${accentRgb.r}, ${accentRgb.g}, ${accentRgb.b}, 0.28)`)

  if (preferences.texture === 'minimal') {
    delete document.body.dataset.texture
  } else {
    document.body.dataset.texture = preferences.texture
  }
  document.body.dataset.micro = preferences.microInteractions ? 'on' : 'off'
  if (preferences.dyslexiaFont) {
    document.body.dataset.font = 'dyslexia'
  } else {
    delete document.body.dataset.font
  }
}

export function PreferencesProvider({ user, children }: { user: User | null; children: React.ReactNode }) {
  const [preferences, setPreferences] = useState<AppPreferences>(() => ({ ...DEFAULT_APP_PREFERENCES }))
  const [ready, setReady] = useState<boolean>(false)

  useEffect(() => {
    if (!user) {
      setPreferences({ ...DEFAULT_APP_PREFERENCES })
      setReady(true)
      return
    }

    const ref = doc(db, `users/${user.uid}/preferences/app`)
    const unsubscribe = onSnapshot(
      ref,
      (snapshot) => {
        const data = snapshot.data() as Partial<AppPreferences> | undefined
        setPreferences({ ...DEFAULT_APP_PREFERENCES, ...(data ?? {}) })
        setReady(true)
      },
      (error) => {
        console.error('Failed to subscribe to preferences', error)
        setPreferences({ ...DEFAULT_APP_PREFERENCES })
        setReady(true)
      }
    )

    return () => unsubscribe()
  }, [user])

  useEffect(() => {
    applyTheme(preferences)
  }, [preferences])

  const displayName = useMemo(() => deriveDisplayName(user, preferences), [user, preferences])

  const value = useMemo<PreferencesContextValue>(() => ({ preferences, ready, displayName }), [preferences, ready, displayName])

  return <PreferencesContext.Provider value={value}>{children}</PreferencesContext.Provider>
}

export function usePreferences() {
  const context = useContext(PreferencesContext)
  if (!context) {
    throw new Error('usePreferences must be used within a PreferencesProvider')
  }
  return context
}
