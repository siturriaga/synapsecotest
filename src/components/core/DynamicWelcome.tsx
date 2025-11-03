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

type OrbStyle = CSSProperties & { '--welcome-rotation': string }

const scenes: Scene[] = [
  {
    id: 'sunrise',
    gradient: 'linear-gradient(140deg, rgba(254,215,170,0.35), rgba(129,140,248,0.2))',
    caption: 'Line up your goals while the day is fresh — Gemini is ready to draft supports.',
    greeting: 'Good morning',
    icon: '🌅',
    iconColor: '#fbbf24'
  },
  {
    id: 'day',
    gradient: 'linear-gradient(140deg, rgba(14,165,233,0.28), rgba(59,130,246,0.24))',
    caption: 'Midday momentum keeps every learner on track with just-in-time insights.',
    greeting: 'Good afternoon',
    icon: '☀️',
    iconColor: '#fde68a'
  },
  {
    id: 'sunset',
    gradient: 'linear-gradient(140deg, rgba(249,115,22,0.28), rgba(168,85,247,0.24))',
    caption: 'Capture wins, gaps, and reassignment needs before the sun goes down.',
    greeting: 'Good evening',
    icon: '🌇',
    iconColor: '#fb923c'
  },
  {
    id: 'night',
    gradient: 'linear-gradient(160deg, rgba(15,118,110,0.28), rgba(99,102,241,0.28))',
    caption: 'Night mode engaged — prep tomorrow’s breakthroughs with calm clarity.',
    greeting: 'Good night',
    icon: '🌙',
    iconColor: '#a5b4fc'
  }
]

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
  const { displayName } = usePreferences()

  useEffect(() => {
    const interval = window.setInterval(() => {
      setNow(new Date())
    }, 1_000)
    return () => window.clearInterval(interval)
  }, [])

  const scene = useMemo(() => pickScene(now), [now])
  const rotation = useMemo(() => {
    const base = getClockRotation(now)
    const secondFraction = now.getSeconds() / 60
    return base + Math.sin(secondFraction * 2 * Math.PI) * 6
  }, [now])
  const orbStyle = useMemo<OrbStyle>(
    () => ({ '--welcome-rotation': `${rotation}deg` }),
    [rotation]
  )
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
      style={{ marginBottom: 28, backgroundImage: scene.gradient }}
    >
      <div className={`welcome-orb ${scene.id}`} aria-hidden style={orbStyle}>
        <div className="welcome-orb__glow" />
        <div className="welcome-orb__core" />
        <div className="welcome-orb__trail" />
        <div className="welcome-orb__celestial" style={{ color: scene.iconColor }}>
          <span>{scene.icon}</span>
        </div>
      </div>
      <div>
        <div className="badge">Dynamic welcome</div>
        <h1 style={{ fontSize: 34, margin: '12px 0 6px', fontWeight: 800 }}>
          {scene.greeting}
          {displayName ? `, ${displayName}` : ', educator'}.
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: 16, maxWidth: 520 }}>{scene.caption}</p>
        <div style={{ display: 'flex', gap: 14, marginTop: 16, alignItems: 'center', color: 'rgba(226,232,240,0.8)' }}>
          <span style={{ fontSize: 18, fontWeight: 700 }}>{timeString}</span>
          <span style={{ opacity: 0.7 }}>{dateString}</span>
        </div>
      </div>
    </section>
  )
}
