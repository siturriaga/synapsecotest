import { useEffect, useState } from 'react'
import { useAssistedMode } from '../../hooks/useAssistedMode'

interface AssistedHintProps {
  id: string
  message: string
  show: boolean
}

export function AssistedHint({ id, message, show }: AssistedHintProps) {
  const { enabled, dismissedHints, dismissHint } = useAssistedMode()
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (!enabled || dismissedHints.has(id) || !show) {
      setVisible(false)
      return
    }
    setVisible(true)
    const timeout = window.setTimeout(() => {
      setVisible(false)
    }, 8000)
    return () => window.clearTimeout(timeout)
  }, [enabled, dismissedHints, id, show])

  if (!enabled || dismissedHints.has(id) || !visible) {
    return null
  }

  return (
    <div className="assisted-hint" role="status" aria-live="polite">
      <span>{message}</span>
      <button
        type="button"
        onClick={() => {
          setVisible(false)
          void dismissHint(id)
        }}
      >
        Got it
      </button>
    </div>
  )
}
