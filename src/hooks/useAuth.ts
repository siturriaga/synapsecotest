import { useEffect, useState } from 'react'
import {
  auth,
  firebaseReady,
  googleSignIn,
  isFirebaseAuthConfigured,
  isFirebaseInitialized,
  logout,
  onAuth,
  resolveRedirectResult
} from '../firebase'
import type { User } from 'firebase/auth'

type AuthState = {
  user: User | null
  loading: boolean
  authConfigured: boolean
  error?: string
}

export function useAuth(): [AuthState, { signIn: () => Promise<void>; signOut: () => Promise<void> }] {
  const [state, setState] = useState<AuthState>(() => {
    const initialized = isFirebaseInitialized()
    const configured = isFirebaseAuthConfigured()
    return {
      user: configured && auth ? auth.currentUser ?? null : null,
      loading: !initialized,
      authConfigured: configured,
      error: undefined
    }
  })

  useEffect(() => {
    let active = true
    let unsubscribe: (() => void) | undefined

    async function initializeAuth() {
      await firebaseReady
      if (!active) {
        return
      }

      const configured = isFirebaseAuthConfigured()
      if (!configured) {
        setState((prev) => ({ ...prev, loading: false, authConfigured: false }))
        return
      }

      try {
        await resolveRedirectResult()
      } catch (err: any) {
        if (err?.code !== 'auth/no-auth-event') {
          console.error(err)
          if (active) {
            setState((prev) => ({ ...prev, loading: false, error: interpretAuthError(err) }))
          }
        }
      }

      if (!active) {
        return
      }

      unsubscribe = onAuth((u) => {
        if (!active) return
        setState((prev) => ({
          user: u,
          loading: false,
          authConfigured: true,
          error: u ? undefined : prev.error
        }))
      })
    }

    initializeAuth()

    return () => {
      active = false
      unsubscribe?.()
    }
  }, [])

  async function signIn() {
    setState((prev) => ({ ...prev, loading: true, error: undefined }))
    await firebaseReady

    if (!isFirebaseAuthConfigured()) {
      setState((prev) => ({
        ...prev,
        loading: false,
        authConfigured: false,
        error: 'Google sign-in is disabled because Firebase auth is not configured.'
      }))
      return
    }

    try {
      await googleSignIn()
    } catch (err: any) {
      console.error(err)
      setState((prev) => ({ ...prev, loading: false, error: interpretAuthError(err) }))
    }
  }

  async function signOut() {
    setState((prev) => ({ ...prev, loading: true, error: undefined }))
    await firebaseReady

    if (!isFirebaseAuthConfigured()) {
      setState((prev) => ({
        ...prev,
        loading: false,
        authConfigured: false,
        error: 'No authentication session to sign out from.'
      }))
      return
    }

    try {
      await logout()
    } catch (err: any) {
      console.error(err)
      setState((prev) => ({ ...prev, loading: false, error: interpretAuthError(err) }))
    }
  }

  return [state, { signIn, signOut }]
}

function interpretAuthError(err: any): string {
  const code: string | undefined = err?.code
  switch (code) {
    case 'auth/network-request-failed':
      return 'Network error while contacting Google. Check your connection and try again.'
    case 'auth/unauthorized-domain':
      return 'This domain is not authorized for Google sign-in. Add it in the Firebase console.'
    case 'auth/popup-blocked':
      return 'The popup was blocked. We attempted a redirect-based sign-in—please retry if it did not start.'
    case 'auth/internal-error':
      return 'Google sign-in failed inside this browser. Reload the page and try again.'
    default:
      break
  }
  const message = err?.message
  if (typeof message === 'string' && message.trim().length > 0) {
    return message
  }
  return 'Unable to complete the authentication request.'
}
