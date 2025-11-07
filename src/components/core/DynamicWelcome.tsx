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
  canopy: string
  caption: string
  greeting: string
  icon: string
  iconColor: string
  celestial: 'sun' | 'moon'
}

const scenes: Scene[] = [
  {
    id: 'morning',
    gradient:
      'linear-gradient(152deg, rgba(248, 250, 252, 0.95) 0%, rgba(191, 219, 254, 0.75) 42%, rgba(147, 197, 253, 0.6) 100%)',
    accent: 'rgba(59, 130, 246, 0.55)',
    glow: 'rgba(253, 224, 71, 0.82)',
    canopy: 'linear-gradient(180deg, rgba(125, 211, 252, 0.18), rgba(59, 130, 246, 0.08))',
    caption: 'Morning glimmers pour over the treetops as soft clouds drift and lessons stretch awake.',
    greeting: 'Good morning',
    icon: '🌅',
    iconColor: '#fbbf24',
    celestial: 'sun'
  },
  {
    id: 'afternoon',
    gradient:
      'linear-gradient(165deg, rgba(224, 242, 254, 0.92) 0%, rgba(147, 197, 253, 0.72) 40%, rgba(129, 140, 248, 0.52) 100%)',
    accent: 'rgba(59, 130, 246, 0.58)',
    glow: 'rgba(251, 191, 36, 0.7)',
    canopy: 'linear-gradient(180deg, rgba(96, 165, 250, 0.14), rgba(59, 130, 246, 0.06))',
    caption: 'Afternoon light shimmers across the grove while ideas gather like gentle breezes.',
    greeting: 'Good afternoon',
    icon: '☀️',
    iconColor: '#fde68a',
    celestial: 'sun'
  },
  {
    id: 'evening',
    gradient:
      'linear-gradient(178deg, rgba(30, 64, 175, 0.92) 0%, rgba(15, 23, 42, 0.9) 38%, rgba(12, 74, 110, 0.82) 100%)',
    accent: 'rgba(129, 140, 248, 0.72)',
    glow: 'rgba(96, 165, 250, 0.86)',
    canopy: 'linear-gradient(180deg, rgba(30, 64, 175, 0.28), rgba(15, 23, 42, 0.18))',
    caption: 'Starlight drapes the forest canopy as the night sky paints quiet paths in silver and indigo.',
    greeting: 'Good evening',
    icon: '🌙',
    iconColor: '#c4b5fd',
    celestial: 'moon'
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
          <div className="welcome-celestial" data-type={scene.celestial}>
            <span className="welcome-celestial__halo" />
            <span className="welcome-celestial__body" />
            {scene.celestial === 'sun' ? <span className="welcome-celestial__flare" /> : null}
          </div>
          <div className="welcome-stars">
            {Array.from({ length: 18 }).map((_, index) => (
              <span key={index} style={{ '--star-index': index } as CSSProperties} />
            ))}
          </div>
          <div className="welcome-shooting-stars">
            {Array.from({ length: 3 }).map((_, index) => (
              <span key={index} style={{ '--shooting-index': index } as CSSProperties} />
            ))}
          </div>
        </div>
        <div className="welcome-forest">
          <div className="welcome-forest__mist" />
          <div className="welcome-forest__line" />
          <div className="welcome-forest__line welcome-forest__line--mid" />
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
      </div>
    </section>
  )
}
