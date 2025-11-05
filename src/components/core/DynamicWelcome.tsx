import { useEffect, useMemo, useState, type CSSProperties } from 'react'
import { usePreferences } from '../../hooks/usePreferences'

type Scene = {
  id: 'sunrise' | 'day' | 'sunset' | 'night'
  gradient: string
  caption: string
  greeting: string
  icon: string
  iconColor: string
}

const scenes: Scene[] = [
  {
    id: 'sunrise',
    gradient: 'linear-gradient(140deg, rgba(254,215,170,0.35), rgba(129,140,248,0.2))',
    caption: 'Morning spark: let’s map today’s wins together and sketch the supports you need.',
    greeting: 'Good morning',
    icon: '🌅',
    iconColor: '#fbbf24'
  },
  {
    id: 'day',
    gradient: 'linear-gradient(140deg, rgba(14,165,233,0.28), rgba(59,130,246,0.24))',
    caption: 'Midday boost: grab the right insight, adjust groups, and keep every learner moving.',
    greeting: 'Good afternoon',
    icon: '☀️',
    iconColor: '#fde68a'
  },
  {
    id: 'sunset',
    gradient: 'linear-gradient(140deg, rgba(249,115,22,0.28), rgba(168,85,247,0.24))',
    caption: 'Evening check-in: jot the wins, note the gaps, and queue tomorrow’s nudges.',
    greeting: 'Good evening',
    icon: '🌇',
    iconColor: '#fb923c'
  },
  {
    id: 'night',
    gradient: 'linear-gradient(160deg, rgba(15,118,110,0.28), rgba(99,102,241,0.28))',
    caption: 'Night shift: slow the pace, reflect, and set up tomorrow’s breakthroughs with calm clarity.',
    greeting: 'Good night',
    icon: '🌙',
    iconColor: '#a5b4fc'
  }
]

type WelcomeOrbStyle = CSSProperties & { '--welcome-rotation'?: string }

function pickScene(date: Date) {
  const hour = date.getHours()
  if (hour < 10) return scenes[0]
  if (hour < 16) return scenes[1]
  if (hour < 20) return scenes[2]
  return scenes[3]
}

function getClockRotation(date: Date) {
  const totalMinutes = date.getHours() * 60 + date.getMinutes() + date.getSeconds() / 60
  return (totalMinutes / 1440) * 360
}

export function DynamicWelcome() {
  const [now, setNow] = useState(() => new Date())
  const [isCompact, setIsCompact] = useState(false)
  const { displayName } = usePreferences()

  useEffect(() => {
    const interval = window.setInterval(() => {
      setNow(new Date())
    }, 1_000)
    return () => window.clearInterval(interval)
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
      setIsCompact(false)
      return
    }

    const mediaQuery = window.matchMedia('(max-width: 720px)')

    const updateMatches = () => {
      setIsCompact(mediaQuery.matches)
    }

    updateMatches()

    if (typeof mediaQuery.addEventListener === 'function') {
      mediaQuery.addEventListener('change', updateMatches)
      return () => mediaQuery.removeEventListener('change', updateMatches)
    }

    mediaQuery.addListener(updateMatches)
    return () => mediaQuery.removeListener(updateMatches)
  }, [])

  const scene = useMemo(() => pickScene(now), [now])
  const rotation = useMemo(() => {
    const base = getClockRotation(now)
    const secondFraction = now.getSeconds() / 60
    return base + Math.sin(secondFraction * 2 * Math.PI) * 6
  }, [now])
  const orbStyle = useMemo<WelcomeOrbStyle>(() => ({ '--welcome-rotation': `${rotation}deg` }), [rotation])
  const timeString = useMemo(
    () => new Intl.DateTimeFormat(undefined, { hour: 'numeric', minute: '2-digit' }).format(now),
    [now]
  )
  const dateString = useMemo(
    () => new Intl.DateTimeFormat(undefined, { weekday: 'long', month: 'long', day: 'numeric' }).format(now),
    [now]
  )

  return (
    <section
      className={`glass-card dynamic-welcome ${scene.id}`}
      data-compact={isCompact ? 'true' : undefined}
      style={{
        marginBottom: isCompact ? 24 : 32,
        backgroundImage: scene.gradient,
        position: isCompact ? 'relative' : 'sticky',
        top: isCompact ? undefined : 32,
        zIndex: isCompact ? undefined : 5
      }}
    >
      <div className="welcome-backdrop" aria-hidden>
        <span className="welcome-particle" />
        <span className="welcome-particle" />
        <span className="welcome-particle" />
      </div>
      <div className={`welcome-orb ${scene.id}`} aria-hidden style={orbStyle}>
        <div className="welcome-orb__glow" />
        <div className="welcome-orb__core" />
        <div className="welcome-orb__trail" />
        <div className="welcome-orb__celestial" style={{ color: scene.iconColor }}>
          <span>{scene.icon}</span>
        </div>
      </div>
      <div className="welcome-content">
        <h1 className="welcome-title">
          {scene.greeting}
          {displayName ? `, ${displayName}` : ', educator'}.
        </h1>
        <p className="welcome-caption">{scene.caption}</p>
        <div className="welcome-meta">
          <div>
            <span className="welcome-meta__label">Current time</span>
            <div className="welcome-meta__value">{timeString}</div>
          </div>
          <div>
            <span className="welcome-meta__label">Today</span>
            <div className="welcome-meta__value">{dateString}</div>
          </div>
        </div>
      </div>
    </section>
  )
}
