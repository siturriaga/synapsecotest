import { useState } from 'react'

interface ClearButtonProps {
  label: string
  onClear: () => Promise<void> | void
  tone?: 'section' | 'danger'
}

export function ClearButton({ label, onClear, tone = 'section' }: ClearButtonProps) {
  const [busy, setBusy] = useState(false)
  const handleClick = async () => {
    if (busy) return
    const confirmed = window.confirm('Are you sure you want to clear this data? This action cannot be undone.')
    if (!confirmed) return
    try {
      setBusy(true)
      await onClear()
    } finally {
      setBusy(false)
    }
  }

  const background = tone === 'danger' ? 'rgba(248,113,113,0.18)' : 'rgba(94,234,212,0.16)'
  const border = tone === 'danger' ? 'rgba(248,113,113,0.6)' : 'rgba(94,234,212,0.45)'
  const color = tone === 'danger' ? 'rgba(254,226,226,0.92)' : 'rgba(204,251,241,0.92)'

  return (
    <button
      type="button"
      className="clear-button"
      onClick={handleClick}
      disabled={busy}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 8,
        padding: '6px 14px',
        borderRadius: 999,
        border: `1px solid ${border}`,
        background,
        color,
        fontSize: 13,
        textTransform: 'uppercase',
        letterSpacing: '0.08em',
        cursor: busy ? 'not-allowed' : 'pointer',
        opacity: busy ? 0.6 : 1
      }}
    >
      {busy ? 'Clearing…' : label}
    </button>
  )
}

