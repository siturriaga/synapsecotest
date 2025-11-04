import { useCallback } from 'react'
import { printElementById } from '../../utils/print'

type PrintButtonProps = {
  targetId: string
  label?: string
  title?: string
}

export function PrintButton({ targetId, label = 'Print section', title }: PrintButtonProps) {
  const handleClick = useCallback(() => {
    printElementById(targetId, title)
  }, [targetId, title])

  return (
    <button
      type="button"
      onClick={handleClick}
      className="print-button"
      aria-label={label}
      title={label}
    >
      <span className="print-button__icon" aria-hidden="true">
        🖨️
      </span>
      <span className="print-button__label">Print</span>
    </button>
  )
}
