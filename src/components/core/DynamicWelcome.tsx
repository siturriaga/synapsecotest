import { useEffect, useMemo, useState } from 'react'
import { usePreferences } from '../../hooks/usePreferences'

type Scene = {
  id: 'sunrise' | 'day' | 'sunset'
  gradient: string
  caption: string
  greeting: string
  icon: string
  accent: string
}

const scenes: Scene[] = [
  {
    id: 'sunrise',
    gradient: 'linear-gradient(130deg, rgba(253,224,71,0.32), rgba(168,85,247,0.22), rgba(14,165,233,0.28))',
    caption: 'Morning spark: chart the plan, warm up groups, and launch the day with confidence.',
    greeting: 'Good morning',
    icon: '🌅',
    accent: 'rgba(250,204,21,0.55)'
  },
  {
    id: 'day',
    gradient: 'linear-gradient(130deg, rgba(34,211,238,0.32), rgba(59,130,246,0.26), rgba(129,140,248,0.24))',
    caption: 'Midday boost: refresh the data, regroup learners, and keep the momentum thriving.',
    greeting: 'Good afternoon',
    icon: '☀️',
    accent: 'rgba(14,165,233,0.45)'
  },
  {
    id: 'sunset',
    gradient: 'linear-gradient(130deg, rgba(249,115,22,0.32), rgba(236,72,153,0.26), rgba(56,189,248,0.24))',
    caption: 'Evening exhale: celebrate the wins, capture notes, and set tomorrow up for calm success.',
    greeting: 'Good evening',
    icon: '🌇',
    accent: 'rgba(249,115,22,0.48)'
  }
]

const jokes = [
  'Why did the teacher wear sunglasses? Her class was too bright!',
  'I told my class a joke about pencils — it had no point, but everyone still got it.',
  'Why was the math book so happy? It finally solved all its problems.',
  'My whiteboard joke was so good the class had to erase themselves from laughter.',
  'Why did the student eat homework? The teacher said it was a piece of cake!',
  'I gave a pop quiz joke — nobody expected the punchline either.',
  'Why do geometry teachers love parks? They’re full of natural tangents.',
  'Tried to tell a chemistry joke — got no reaction, but the lab loved it.'
]

function pickScene(date: Date) {
  const hour = date.getHours()
  if (hour < 12) return scenes[0]
  if (hour < 17) return scenes[1]
  return scenes[2]
}

function pickDailyJoke(date: Date) {
  const daySeed = Math.floor(date.getTime() / 86_400_000)
  const index = Math.abs(daySeed) % jokes.length
  return jokes[index]
}

export function DynamicWelcome() {
  const [now, setNow] = useState(() => new Date())
  const [isCompact, setIsCompact] = useState(false)
  const [isStickyAllowed, setIsStickyAllowed] = useState(true)
  const { displayName } = usePreferences()

  useEffect(() => {
    const interval = window.setInterval(() => {
      setNow(new Date())
    }, 60_000)
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

  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
      setIsStickyAllowed(true)
      return
    }

    const mediaQuery = window.matchMedia('(min-width: 1200px)')

    const updateMatches = () => {
      setIsStickyAllowed(mediaQuery.matches)
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
  const dailyJoke = useMemo(() => pickDailyJoke(now), [now])
  const dateString = useMemo(
    () => new Intl.DateTimeFormat(undefined, { weekday: 'long', month: 'long', day: 'numeric' }).format(now),
    [now]
  )
  const shouldStick = !isCompact && isStickyAllowed

  return (
    <section
      className={`glass-card dynamic-welcome ${scene.id}`}
      data-compact={isCompact ? 'true' : undefined}
      style={{
        backgroundImage: scene.gradient,
        position: shouldStick ? 'sticky' : 'relative',
        top: shouldStick ? 32 : undefined,
        zIndex: shouldStick ? 5 : undefined
      }}
    >
      <div className="welcome-ambient" aria-hidden>
        <span className="welcome-ambient__pulse" style={{ background: scene.accent }} />
        <span className="welcome-ambient__pulse" style={{ background: scene.accent }} />
        <span className="welcome-ambient__spark" />
      </div>
      <div className="welcome-frame">
        <div className="welcome-greeting">
          <span className="welcome-icon" aria-hidden>
            {scene.icon}
          </span>
          <div>
            <span className="welcome-label">{scene.greeting}</span>
            <span className="welcome-name">{displayName ? `${displayName}!` : 'educator!'}</span>
          </div>
        </div>
        <p className="welcome-caption">{scene.caption}</p>
        <div className="welcome-meta">
          <div className="welcome-meta__item">
            <span className="welcome-meta__label">Today</span>
            <span className="welcome-meta__value">{dateString}</span>
          </div>
          <div className="welcome-meta__divider" aria-hidden />
          <div className="welcome-meta__item">
            <span className="welcome-meta__label">Staff lounge laugh</span>
            <span className="welcome-meta__value welcome-meta__value--joke">{dailyJoke}</span>
          </div>
        </div>
      </div>
    </section>
  )
}
