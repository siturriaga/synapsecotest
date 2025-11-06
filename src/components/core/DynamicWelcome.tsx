import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent
} from 'react'
import { usePreferences } from '../../hooks/usePreferences'

type SceneId = 'morning' | 'afternoon' | 'evening'

type Scene = {
  id: SceneId
  gradient: string
  accent: string
  glow: string
  caption: string
  greeting: string
  icon: string
  iconColor: string
  canopy: string
}

const scenes: Scene[] = [
  {
    id: 'morning',
    gradient:
      'linear-gradient(150deg, rgba(245, 253, 255, 0.9) 0%, rgba(165, 243, 252, 0.5) 45%, rgba(244, 114, 182, 0.35) 100%)',
    accent: 'rgba(56, 189, 248, 0.58)',
    glow: 'rgba(252, 211, 77, 0.8)',
    canopy: 'linear-gradient(180deg, rgba(14, 165, 233, 0.12), rgba(59, 130, 246, 0.05))',
    caption: 'Sunrise stretch: sip the calm, sketch the day, and let your plans bloom with intention.',
    greeting: 'Good morning',
    icon: '🌅',
    iconColor: '#fb923c'
  },
  {
    id: 'afternoon',
    gradient:
      'linear-gradient(160deg, rgba(219, 234, 254, 0.92) 0%, rgba(129, 140, 248, 0.6) 42%, rgba(45, 212, 191, 0.32) 100%)',
    accent: 'rgba(167, 139, 250, 0.65)',
    glow: 'rgba(255, 255, 255, 0.65)',
    canopy: 'linear-gradient(180deg, rgba(34, 211, 238, 0.14), rgba(59, 130, 246, 0.08))',
    caption: 'Midday momentum: breathe, reset groups, and weave the next conversation with care.',
    greeting: 'Good afternoon',
    icon: '☀️',
    iconColor: '#fde68a'
  },
  {
    id: 'evening',
    gradient:
      'linear-gradient(170deg, rgba(148, 163, 184, 0.92) 0%, rgba(59, 130, 246, 0.65) 38%, rgba(17, 94, 89, 0.55) 100%)',
    accent: 'rgba(129, 140, 248, 0.75)',
    glow: 'rgba(96, 165, 250, 0.9)',
    canopy: 'linear-gradient(180deg, rgba(15, 118, 110, 0.22), rgba(79, 70, 229, 0.16))',
    caption: 'Evening exhale: slow the pulse, note the wins, and let reflection light the path for tomorrow.',
    greeting: 'Good evening',
    icon: '🌙',
    iconColor: '#c4b5fd'
  }
]

type WelcomeStyle = CSSProperties & {
  '--welcome-primary'?: string
  '--welcome-accent'?: string
  '--welcome-glow'?: string
  '--welcome-canopy'?: string
  '--welcome-light-x'?: string
  '--welcome-light-y'?: string
  '--welcome-tilt-x'?: string
  '--welcome-tilt-y'?: string
}

const teacherJokes = [
  'Why did the standards coach carry a ladder? To help every objective reach higher-order thinking.',
  "I told my class formative checks were my love language—they said, 'That's a lot of love, Ms. G.'", 
  'Data meeting tip: bring snacks so the pie charts don’t feel like the only slices in the room.',
  "I tried to take attendance with AI once; it marked me absent for being 'extra.'",
  'My pacing guide and reality finally met—they’re in counseling now and it’s going great.',
  'Exit tickets are like boomerangs: toss them with intention and they come back with insight.',
  'Teacher toolbox item #42: the eyebrow raise that aligns behavior faster than any rubric.',
  'Told my students we’d spiral review. They asked if that meant field trip to the stairs.',
  'Standards say “students will.” I say “students already did, wait till you see period 3.”',
  'Professional development hack: add “student voice” and “joy” to every slide—you’ll always be right.'
]

function pickScene(date: Date) {
  const hour = date.getHours()
  if (hour >= 5 && hour < 12) return scenes[0]
  if (hour >= 12 && hour < 18) return scenes[1]
  return scenes[2]
}

export function DynamicWelcome() {
  const [now, setNow] = useState(() => new Date())
  const [isCompact, setIsCompact] = useState(false)
  const [isReady, setIsReady] = useState(false)
  const [jokeState, setJokeState] = useState(() => ({ index: Math.floor(Math.random() * teacherJokes.length), cycle: 0 }))
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)
  const [lightVector, setLightVector] = useState({ x: 52, y: 46 })
  const [tilt, setTilt] = useState({ x: 0, y: 0 })
  const pointerTimeoutRef = useRef<number | undefined>(undefined)
  const pointerActiveRef = useRef(false)
  const cardRef = useRef<HTMLElement | null>(null)
  const { displayName } = usePreferences()

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      setIsReady(true)
    })
    return () => window.cancelAnimationFrame(frame)
  }, [])

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
    const reduceMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')

    const updateMatches = () => {
      setIsCompact(mediaQuery.matches)
    }

    const updateMotion = () => {
      setPrefersReducedMotion(reduceMotionQuery.matches)
    }

    updateMatches()
    updateMotion()

    const useModernListener = typeof mediaQuery.addEventListener === 'function'

    if (useModernListener) {
      mediaQuery.addEventListener('change', updateMatches)
      reduceMotionQuery.addEventListener('change', updateMotion)
      return () => {
        mediaQuery.removeEventListener('change', updateMatches)
        reduceMotionQuery.removeEventListener('change', updateMotion)
      }
    }

    mediaQuery.addListener(updateMatches)
    reduceMotionQuery.addListener(updateMotion)
    return () => {
      mediaQuery.removeListener(updateMatches)
      reduceMotionQuery.removeListener(updateMotion)
    }
  }, [])

  useEffect(() => {
    if (prefersReducedMotion) {
      return
    }

    const interval = window.setInterval(() => {
      setJokeState((prev) => ({ index: (prev.index + 1) % teacherJokes.length, cycle: prev.cycle + 1 }))
    }, 12_000)

    return () => window.clearInterval(interval)
  }, [prefersReducedMotion])

  const scene = useMemo(() => pickScene(now), [now])

  const welcomeStyle = useMemo<WelcomeStyle>(
    () => ({
      '--welcome-primary': scene.gradient,
      '--welcome-accent': scene.accent,
      '--welcome-glow': scene.glow,
      '--welcome-canopy': scene.canopy,
      '--welcome-light-x': `${lightVector.x}%`,
      '--welcome-light-y': `${lightVector.y}%`,
      '--welcome-tilt-x': `${tilt.x}deg`,
      '--welcome-tilt-y': `${tilt.y}deg`,
      marginBottom: isCompact ? 24 : 32,
      position: isCompact ? 'relative' : 'sticky',
      top: isCompact ? undefined : 32,
      zIndex: isCompact ? undefined : 5
    }),
    [isCompact, scene, lightVector.x, lightVector.y, tilt.x, tilt.y]
  )

  const { index: jokeIndex, cycle: jokeCycle } = jokeState
  const greeting = `${scene.greeting}${displayName ? `, ${displayName}` : ', teacher'}.`

  const schedulePointerReset = useCallback(() => {
    window.clearTimeout(pointerTimeoutRef.current)
    pointerTimeoutRef.current = window.setTimeout(() => {
      pointerActiveRef.current = false
      setTilt({ x: 0, y: 0 })
    }, 2600)
  }, [])

  const handlePointer = useCallback(
    (event: PointerEvent<HTMLElement>) => {
      if (prefersReducedMotion) {
        return
      }

      const card = cardRef.current
      if (!card) {
        return
      }

      const rect = card.getBoundingClientRect()
      const xRatio = (event.clientX - rect.left) / rect.width
      const yRatio = (event.clientY - rect.top) / rect.height

      const clampedX = Math.min(Math.max(xRatio, 0), 1)
      const clampedY = Math.min(Math.max(yRatio, 0), 1)

      setLightVector({ x: clampedX * 100, y: clampedY * 100 })
      setTilt({ x: (0.5 - clampedY) * 6, y: (clampedX - 0.5) * 8 })

      pointerActiveRef.current = true
      schedulePointerReset()
    },
    [prefersReducedMotion, schedulePointerReset]
  )

  const handlePointerLeave = useCallback(() => {
    pointerActiveRef.current = false
    window.clearTimeout(pointerTimeoutRef.current)
    setTilt({ x: 0, y: 0 })
  }, [])

  useEffect(() => {
    if (prefersReducedMotion) {
      setTilt({ x: 0, y: 0 })
      setLightVector({ x: 52, y: 46 })
      return
    }

    let frame = 0
    const animate = (time: number) => {
      if (!pointerActiveRef.current) {
        const nextX = 50 + Math.sin(time / 3400) * 12
        const nextY = 46 + Math.cos(time / 3800) * 10

        setLightVector((prev) => {
          if (Math.abs(prev.x - nextX) < 0.2 && Math.abs(prev.y - nextY) < 0.2) {
            return prev
          }
          return { x: nextX, y: nextY }
        })
      }
      frame = window.requestAnimationFrame(animate)
    }

    frame = window.requestAnimationFrame(animate)
    return () => window.cancelAnimationFrame(frame)
  }, [prefersReducedMotion])

  useEffect(() => {
    return () => {
      window.clearTimeout(pointerTimeoutRef.current)
    }
  }, [])

  return (
    <section
      className="glass-card dynamic-welcome"
      data-compact={isCompact ? 'true' : undefined}
      data-ready={isReady ? 'true' : undefined}
      data-scene={scene.id}
      style={welcomeStyle}
      ref={cardRef}
      onPointerMove={handlePointer}
      onPointerDown={handlePointer}
      onPointerLeave={handlePointerLeave}
    >
      <div className="welcome-atmosphere" aria-hidden>
        <div className="welcome-sky">
          <div className="welcome-sky__wash" />
          <div className="welcome-sky__texture" />
          <div className="welcome-cloud welcome-cloud--one" />
          <div className="welcome-cloud welcome-cloud--two" />
          <div className="welcome-cloud welcome-cloud--three" />
          <div className="welcome-moon">
            <span className="welcome-moon__halo" />
            <span className="welcome-moon__body" />
          </div>
          <div className="welcome-stars">
            {Array.from({ length: 12 }).map((_, index) => (
              <span key={index} style={{ '--star-index': index } as CSSProperties} />
            ))}
          </div>
        </div>
        <div className="welcome-forest">
          <div className="welcome-forest__mist" />
          <div className="welcome-forest__line" />
          <div className="welcome-forest__line welcome-forest__line--near" />
        </div>
        <div className="welcome-fireflies">
          {Array.from({ length: 8 }).map((_, index) => (
            <span key={index} style={{ '--firefly-index': index } as CSSProperties} />
          ))}
        </div>
        <div className="welcome-glints">
          {Array.from({ length: 6 }).map((_, index) => (
            <span key={index} style={{ '--glint-index': index } as CSSProperties} />
          ))}
        </div>
      </div>
      <div className="welcome-frame">
        <div className="welcome-greeting">
          <div className="welcome-icon" aria-hidden>
            <span>{scene.icon}</span>
          </div>
          <div className="welcome-headline">
            <span className="welcome-label">Welcome back</span>
            <h1 className="welcome-title">{greeting}</h1>
          </div>
        </div>
        <p className="welcome-caption">{scene.caption}</p>
        <div className="welcome-divider" aria-hidden>
          <span />
        </div>
        <div className="welcome-joke" role="status" aria-live="polite">
          <span className="welcome-joke__label">Teacher chuckle</span>
          <p key={jokeCycle} className="welcome-joke__text">
            {teacherJokes[jokeIndex]}
          </p>
        </div>
      </div>
    </section>
  )
}
