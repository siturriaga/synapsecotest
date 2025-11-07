import { useEffect, useState } from 'react'
import {
  auth,
  AUTH_DISABLED_MESSAGE,
  googleSignIn,
  isAuthConfigured,
  logout,
  onAuth,
  resolveRedirectResult
} from '../firebase'
import type { User } from 'firebase/auth'

type AuthState = {
  user: User | null
  loading: boolean
  error?: string
  authAvailable: boolean
}

export function useAuth(): [AuthState, { signIn: () => Promise<void>; signOut: () => Promise<void> }] {
  const [state, setState] = useState<AuthState>({
    user: auth?.currentUser ?? null,
    loading: Boolean(auth),
    error: undefined,
    authAvailable: isAuthConfigured
  })

  useEffect(() => {
    let mounted = true

    async function checkRedirectResult() {
      try {
        await resolveRedirectResult()
      } catch (err: any) {
        if (err?.code === 'auth/no-auth-event') {
          return
        }
        console.error(err)
        if (mounted) {
          setState((prev) => ({ ...prev, loading: false, error: interpretAuthError(err) }))
        }
      }
    }

    checkRedirectResult()

    if (!auth) {
      setState((prev) => ({ ...prev, loading: false }))
      return () => {
        mounted = false
      }
    }

    const unsub = onAuth((u) => {
      if (!mounted) return
      setState((prev) => ({
        user: u,
        loading: false,
        error: u ? undefined : prev.error,
        authAvailable: prev.authAvailable
      }))
    })

    return () => {
      mounted = false
      unsub()
    }
  }, [])

  async function signIn() {
    if (!isAuthConfigured) {
      setState((prev) => ({ ...prev, loading: false, error: AUTH_DISABLED_MESSAGE, authAvailable: false }))
      return
    }
    try {
      setState((prev) => ({ ...prev, loading: true, error: undefined, authAvailable: prev.authAvailable }))
      await googleSignIn()
    } catch (err: any) {
      console.error(err)
      setState((prev) => ({
        ...prev,
        loading: false,
        error: interpretAuthError(err),
        authAvailable: prev.authAvailable
      }))
    }
  }

  async function signOut() {
    if (!isAuthConfigured) {
      setState((prev) => ({ ...prev, loading: false, authAvailable: false }))
      return
    }
    try {
      setState((prev) => ({ ...prev, loading: true, error: undefined, authAvailable: prev.authAvailable }))
      await logout()
    } catch (err: any) {
      console.error(err)
      setState((prev) => ({
        ...prev,
        loading: false,
        error: interpretAuthError(err),
        authAvailable: prev.authAvailable
      }))
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
