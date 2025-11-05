import { useId } from 'react'

interface ProgressSparklineProps {
  data: Array<{ label: string; value: number | null }>
  stroke?: string
  fill?: string
}

export function ProgressSparkline({ data, stroke = 'rgba(94,234,212,0.9)', fill = 'rgba(94,234,212,0.25)' }: ProgressSparklineProps) {
  const gradientId = useId()
  if (!data.length) {
    return <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>No trend data</div>
  }

  const numericValues = data.map((point) => (typeof point.value === 'number' ? point.value : null))
  const validValues = numericValues.filter((value): value is number => value !== null)

  if (!validValues.length) {
    return <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>No scored trend</div>
  }

  const min = Math.min(...validValues)
  const max = Math.max(...validValues)
  const range = max - min || 1

  const points = numericValues.map((value, index) => {
    const x = (index / Math.max(1, data.length - 1)) * 100
    const y = value === null ? null : 100 - ((value - min) / range) * 100
    return { x, y }
  })

  let firstValid = true
  const path = points
    .map((point) => {
      if (point.y === null) return ''
      const command = firstValid ? 'M' : 'L'
      firstValid = false
      return `${command}${point.x},${point.y}`
    })
    .filter(Boolean)
    .join(' ')

  const areaPath = path ? `${path} L100,100 L0,100 Z` : ''

  return (
    <div style={{ display: 'grid', gap: 6 }}>
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" style={{ width: '100%', height: 90 }}>
        <defs>
          <linearGradient id={`${gradientId}-sparkline`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={fill} stopOpacity={0.9} />
            <stop offset="100%" stopColor={fill} stopOpacity={0.1} />
          </linearGradient>
        </defs>
        {areaPath && <path d={areaPath} fill={`url(#${gradientId}-sparkline)`} stroke="none" opacity={0.8} />}
        {path && <path d={path} fill="none" stroke={stroke} strokeWidth={2.5} strokeLinecap="round" />}
      </svg>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--text-muted)' }}>
        <span>{data[0]?.label}</span>
        <span>{data[data.length - 1]?.label}</span>
      </div>
    </div>
  )
}

