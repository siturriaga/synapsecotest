import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties } from 'react'
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

type AmbientState = {
  context: AudioContext
  nodes: Array<AudioBufferSourceNode | OscillatorNode>
  gain: GainNode
}

type WelcomeStyle = CSSProperties & {
  '--welcome-primary'?: string
  '--welcome-accent'?: string
  '--welcome-glow'?: string
  '--welcome-canopy'?: string
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
  const [ambientState, setAmbientState] = useState<{ isPlaying: boolean; error?: string }>({ isPlaying: false })
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)
  const ambientRef = useRef<AmbientState | null>(null)
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

  useEffect(() => {
    return () => {
      if (ambientRef.current) {
        const { context, nodes, gain } = ambientRef.current
        try {
          gain.gain.cancelScheduledValues(context.currentTime)
          gain.gain.linearRampToValueAtTime(0.0001, context.currentTime + 0.6)
        } catch (error) {
          console.error('DynamicWelcome ambient teardown error:', error)
        }
        window.setTimeout(() => {
          nodes.forEach((node) => {
            try {
              if ('stop' in node) {
                node.stop()
              }
            } catch (error) {
              console.error('DynamicWelcome ambient node stop error:', error)
            }
          })
          context.close().catch((error) => {
            console.error('DynamicWelcome ambient context close error:', error)
          })
          ambientRef.current = null
        }, 650)
      }
    }
  }, [])

  const scene = useMemo(() => pickScene(now), [now])

  const welcomeStyle = useMemo<WelcomeStyle>(
    () => ({
      '--welcome-primary': scene.gradient,
      '--welcome-accent': scene.accent,
      '--welcome-glow': scene.glow,
      '--welcome-canopy': scene.canopy,
      marginBottom: isCompact ? 24 : 32,
      position: isCompact ? 'relative' : 'sticky',
      top: isCompact ? undefined : 32,
      zIndex: isCompact ? undefined : 5
    }),
    [isCompact, scene]
  )

  const toggleAmbient = useCallback(async () => {
    if (ambientState.isPlaying) {
      const ambient = ambientRef.current
      if (!ambient) {
        setAmbientState({ isPlaying: false })
        return
      }

      const { context, gain } = ambient
      try {
        gain.gain.cancelScheduledValues(context.currentTime)
        gain.gain.linearRampToValueAtTime(0.0001, context.currentTime + 0.8)
      } catch (error) {
        console.error('DynamicWelcome ambient fade error:', error)
      }
      window.setTimeout(() => {
        ambient.nodes.forEach((node) => {
          try {
            if ('stop' in node) {
              node.stop()
            }
          } catch (error) {
            console.error('DynamicWelcome ambient node stop error:', error)
          }
        })
        ambient.context.close().catch((error) => {
          console.error('DynamicWelcome ambient context close error:', error)
        })
        ambientRef.current = null
      }, 900)
      setAmbientState({ isPlaying: false })
      return
    }

    if (typeof window === 'undefined') {
      return
    }

    const AudioCtor = window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext

    if (!AudioCtor) {
      setAmbientState({ isPlaying: false, error: 'Audio context is unavailable in this browser.' })
      return
    }

    try {
      const context = new AudioCtor()
      const gain = context.createGain()
      gain.gain.value = 0.0001
      gain.connect(context.destination)

      const noiseBuffer = context.createBuffer(1, context.sampleRate * 3, context.sampleRate)
      const data = noiseBuffer.getChannelData(0)
      for (let i = 0; i < data.length; i += 1) {
        data[i] = (Math.random() * 2 - 1) * 0.42
      }

      const noiseSource = context.createBufferSource()
      noiseSource.buffer = noiseBuffer
      noiseSource.loop = true

      const noiseFilter = context.createBiquadFilter()
      noiseFilter.type = 'bandpass'
      noiseFilter.frequency.value = 620
      noiseFilter.Q.value = 0.9

      const noiseGain = context.createGain()
      noiseGain.gain.value = 0.15

      noiseSource.connect(noiseFilter)
      noiseFilter.connect(noiseGain)
      noiseGain.connect(gain)

      const breezeLfo = context.createOscillator()
      breezeLfo.type = 'sine'
      breezeLfo.frequency.value = 0.08

      const breezeDepth = context.createGain()
      breezeDepth.gain.value = 0.08
      breezeLfo.connect(breezeDepth)
      breezeDepth.connect(noiseGain.gain)

      const chimeOsc = context.createOscillator()
      chimeOsc.type = 'sine'
      chimeOsc.frequency.value = 740

      const chimeGain = context.createGain()
      chimeGain.gain.value = 0

      const chimeLfo = context.createOscillator()
      chimeLfo.type = 'sine'
      chimeLfo.frequency.value = 0.04

      const chimeDepth = context.createGain()
      chimeDepth.gain.value = 0.04

      chimeLfo.connect(chimeDepth)
      chimeDepth.connect(chimeGain.gain)

      chimeOsc.connect(chimeGain)
      chimeGain.connect(gain)

      const shimmerOsc = context.createOscillator()
      shimmerOsc.type = 'sine'
      shimmerOsc.frequency.value = 1100

      const shimmerGain = context.createGain()
      shimmerGain.gain.value = 0

      const shimmerLfo = context.createOscillator()
      shimmerLfo.type = 'sine'
      shimmerLfo.frequency.value = 0.065

      const shimmerDepth = context.createGain()
      shimmerDepth.gain.value = 0.03

      shimmerLfo.connect(shimmerDepth)
      shimmerDepth.connect(shimmerGain.gain)

      shimmerOsc.connect(shimmerGain)
      shimmerGain.connect(gain)

      if (context.state === 'suspended') {
        try {
          await context.resume()
        } catch (error) {
          console.error('DynamicWelcome ambient resume error:', error)
        }
      }

      noiseSource.start()
      breezeLfo.start()
      chimeOsc.start()
      chimeLfo.start()
      shimmerOsc.start()
      shimmerLfo.start()

      gain.gain.linearRampToValueAtTime(0.22, context.currentTime + 1.6)

      ambientRef.current = {
        context,
        nodes: [noiseSource, breezeLfo, chimeOsc, chimeLfo, shimmerOsc, shimmerLfo],
        gain
      }

      setAmbientState({ isPlaying: true })
    } catch (error) {
      console.error('DynamicWelcome ambient start error:', error)
      setAmbientState({ isPlaying: false, error: 'Unable to start ambient sound. Please try again.' })
    }
  }, [ambientState.isPlaying])

  const { index: jokeIndex, cycle: jokeCycle } = jokeState
  const greeting = `${scene.greeting}${displayName ? `, ${displayName}` : ', teacher'}.`

  return (
    <section
      className="glass-card dynamic-welcome"
      data-compact={isCompact ? 'true' : undefined}
      data-ready={isReady ? 'true' : undefined}
      data-scene={scene.id}
      style={welcomeStyle}
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
        <div className="welcome-joke" role="status" aria-live="polite">
          <span className="welcome-joke__label">Teacher chuckle</span>
          <p key={jokeCycle} className="welcome-joke__text">
            {teacherJokes[jokeIndex]}
          </p>
        </div>
        <div className="welcome-ambient-toggle">
          <button type="button" onClick={toggleAmbient} className="welcome-ambient-toggle__button">
            <span aria-hidden>{ambientState.isPlaying ? 'Pause serenity' : 'Play forest calm'}</span>
            <span className="sr-only">
              {ambientState.isPlaying ? 'Pause the calming forest soundscape.' : 'Play a calming forest soundscape with gentle chimes.'}
            </span>
          </button>
          <p className="welcome-ambient-toggle__caption">
            {ambientState.error ??
              (ambientState.isPlaying
                ? 'Let the breeze, chimes, and quiet forest hum soften the space.'
                : 'Press play for whispering pines, soft wind, and mellow chimes.')}
          </p>
        </div>
      </div>
    </section>
  )
}
