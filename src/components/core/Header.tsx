import { useMemo } from 'react'
import { usePreferences } from '../../hooks/usePreferences'

const greetings = [
  'Empower every learner today',
  'Crafting differentiated brilliance',
  'Driving mastery with insight',
  'Designing learning adventures'
]

function getGreeting() {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 17) return 'Good afternoon'
  return 'Good evening'
}

export function Header({ user: _user }: { user: { displayName?: string | null } | null }) {
  const { preferences, displayName } = usePreferences()
  const base = getGreeting()
  const tagline = greetings[(new Date().getDay() + new Date().getHours()) % greetings.length]
  const now = new Date()
  const [dateFormatter, timeFormatter, timezoneLabel] = useMemo(() => {
    const { timezone } = preferences
    let safeZone = timezone
    try {
      // Attempt to instantiate with the preferred zone to validate it.
      new Intl.DateTimeFormat(undefined, { timeZone: timezone })
    } catch (error) {
      console.warn('Falling back to UTC timezone for header display', error)
      safeZone = 'UTC'
    }
    return [
      new Intl.DateTimeFormat(undefined, { weekday: 'long', month: 'short', day: 'numeric', timeZone: safeZone }),
      new Intl.DateTimeFormat(undefined, { hour: '2-digit', minute: '2-digit', timeZone: safeZone }),
      safeZone.replace('_', ' ')
    ]
  }, [preferences.timezone])
  return (
    <header style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '18px 28px',
      borderBottom: '1px solid rgba(148, 163, 184, 0.18)',
      backdropFilter: 'blur(12px)',
      background: 'rgba(15, 23, 42, 0.45)',
      position: 'sticky',
      top: 0,
      zIndex: 20
    }}>
      <div>
        <div style={{ fontSize: 28, fontWeight: 800 }}>{base}{displayName ? `, ${displayName}` : ''}</div>
        <div style={{ color: 'var(--text-muted)', marginTop: 4 }}>{tagline}</div>
      </div>
      <div style={{ textAlign: 'right', color: 'var(--text-muted)' }}>
        <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--text)' }}>{timeFormatter.format(now)}</div>
        <div>{dateFormatter.format(now)}</div>
        <div style={{ fontSize: 13, opacity: 0.8 }}>{timezoneLabel} • Secure Gemini orchestration</div>
      </div>
    </header>
  )
}
