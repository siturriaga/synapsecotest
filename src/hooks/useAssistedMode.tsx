import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import type { User } from 'firebase/auth'
import { arrayUnion, doc, onSnapshot, serverTimestamp, setDoc } from 'firebase/firestore'
import { db } from '../firebase'

interface AssistedModeContextValue {
  enabled: boolean
  loading: boolean
  dismissedHints: Set<string>
  toggleEnabled: () => Promise<void>
  dismissHint: (id: string) => Promise<void>
  resetHints: () => Promise<void>
}

const AssistedModeContext = createContext<AssistedModeContextValue | undefined>(undefined)

interface AssistedModeProviderProps {
  user: User | null
  children: React.ReactNode
}

export function AssistedModeProvider({ user, children }: AssistedModeProviderProps) {
  const [enabled, setEnabled] = useState(false)
  const [loading, setLoading] = useState(false)
  const [dismissed, setDismissed] = useState<Set<string>>(new Set())

  useEffect(() => {
    if (!user) {
      setEnabled(false)
      setDismissed(new Set())
      return
    }

    const prefRef = doc(db, `users/${user.uid}/workspace_cache/preferences`)
    const unsubscribe = onSnapshot(prefRef, (snapshot) => {
      const data = snapshot.data()
      setEnabled(Boolean(data?.assistedModeEnabled))
      const hints = Array.isArray(data?.dismissedHints) ? data?.dismissedHints : []
      setDismissed(new Set(hints.filter((value): value is string => typeof value === 'string')))
    })
    return unsubscribe
  }, [user])

  const updateEnabled = useCallback(
    async (next: boolean) => {
      if (!user) return
      const prefRef = doc(db, `users/${user.uid}/workspace_cache/preferences`)
      await setDoc(
        prefRef,
        {
          assistedModeEnabled: next,
          updatedAt: serverTimestamp()
        },
        { merge: true }
      )
      setEnabled(next)
    },
    [user]
  )

  const toggleEnabled = useCallback(async () => {
    if (loading) return
    setLoading(true)
    try {
      await updateEnabled(!enabled)
    } finally {
      setLoading(false)
    }
  }, [enabled, loading, updateEnabled])

  const dismissHint = useCallback(
    async (id: string) => {
      if (!user || !id) return
      const prefRef = doc(db, `users/${user.uid}/workspace_cache/preferences`)
      setDismissed((prev) => new Set([...prev, id]))
      await setDoc(
        prefRef,
        {
          dismissedHints: arrayUnion(id),
          updatedAt: serverTimestamp()
        },
        { merge: true }
      )
    },
    [user]
  )

  const resetHints = useCallback(async () => {
    if (!user) return
    const prefRef = doc(db, `users/${user.uid}/workspace_cache/preferences`)
    setDismissed(new Set())
    await setDoc(
      prefRef,
      {
        dismissedHints: [],
        updatedAt: serverTimestamp()
      },
      { merge: true }
    )
  }, [user])

  const value = useMemo<AssistedModeContextValue>(
    () => ({ enabled, loading, dismissedHints: dismissed, toggleEnabled, dismissHint, resetHints }),
    [dismissed, enabled, loading, toggleEnabled, dismissHint, resetHints]
  )

  return <AssistedModeContext.Provider value={value}>{children}</AssistedModeContext.Provider>
}

export function useAssistedMode() {
  const context = useContext(AssistedModeContext)
  if (!context) {
    throw new Error('useAssistedMode must be used within an AssistedModeProvider')
  }
  return context
}
