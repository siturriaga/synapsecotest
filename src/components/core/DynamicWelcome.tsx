import type { CSSProperties } from 'react'
import { useEffect, useMemo, useState } from 'react'
import { usePreferences } from '../../hooks/usePreferences'
import { useRosterData } from '../../hooks/useRosterData'

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
  const [mounted, setMounted] = useState(false)
  const [highlightIndex, setHighlightIndex] = useState(0)
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)
  const { displayName } = usePreferences()
  const roster = useRosterData()
  const aiContext = roster?.aiContext
  const isLoading = roster?.loading ?? false
  const syncError = roster?.syncError
  const hasInsightData = Boolean(roster?.insights)
  const hasGroups = (roster?.groupInsights?.length ?? 0) > 0
  const hasPedagogy = Boolean(roster?.pedagogy)
  const showEmptyState = !isLoading && !syncError && !hasInsightData && !hasGroups && !hasPedagogy

  useEffect(() => {
    const interval = window.setInterval(() => {
      setNow(new Date())
    }, 60_000)
    return () => window.clearInterval(interval)
  }, [])

  useEffect(() => {
    setMounted(true)
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

  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
      setPrefersReducedMotion(false)
      return
    }

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')

    const updateMatches = () => {
      setPrefersReducedMotion(mediaQuery.matches)
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

  const metrics = useMemo(() => {
    if (isLoading) {
      return [
        {
          id: 'learners',
          label: 'Learners synced',
          value: 'Loading…',
          detail: 'Collecting roster insights',
          loading: true
        },
        {
          id: 'mastery',
          label: 'Average mastery',
          value: 'Loading…',
          detail: 'Refreshing assessment trends',
          loading: true
        },
        {
          id: 'momentum',
          label: 'Learners on track',
          value: 'Loading…',
          detail: 'Preparing group momentum view',
          loading: true
        }
      ]
    }

    const totalStudents = roster?.insights?.totalStudents ?? null
    const averageScore = roster?.insights?.averageScore ?? null
    const latestAssessment = roster?.insights?.recentAssessment ?? null
    const groups = roster?.groupInsights ?? []
    const foundationGroup = groups.find((group) => group.id === 'foundation')
    const nonFoundationCount = groups
      .filter((group) => group.id !== 'foundation')
      .reduce((total, group) => total + group.studentCount, 0)

    const safePercent = (value: number | null | undefined) => {
      if (value === null || value === undefined || Number.isNaN(value)) return undefined
      return Math.max(0, Math.min(100, Number(value)))
    }

    const formattedDate = latestAssessment?.updatedAt
      ? new Intl.DateTimeFormat(undefined, { month: 'short', day: 'numeric' }).format(latestAssessment.updatedAt)
      : roster?.lastSyncedAt
      ? new Intl.DateTimeFormat(undefined, { month: 'short', day: 'numeric' }).format(roster.lastSyncedAt)
      : null

    return [
      {
        id: 'learners',
        label: 'Learners synced',
        value: totalStudents && totalStudents > 0 ? totalStudents.toLocaleString() : 'Awaiting data',
        detail: formattedDate ? `Updated ${formattedDate}` : 'Connect your roster to unlock insights'
      },
      {
        id: 'mastery',
        label: 'Average mastery',
        value: averageScore !== null ? `${averageScore.toFixed(0)}%` : '—',
        detail: latestAssessment?.testName ?? 'No recent assessment',
        progress: safePercent(averageScore)
      },
      {
        id: 'momentum',
        label: 'Learners on track',
        value: nonFoundationCount > 0 ? `${nonFoundationCount}` : '—',
        detail:
          foundationGroup && foundationGroup.studentCount > 0
            ? `${foundationGroup.studentCount} need focused coaching`
            : 'All groups trending upward'
      }
    ]
  }, [isLoading, roster?.groupInsights, roster?.insights, roster?.lastSyncedAt])

  const highlights = useMemo(() => {
    const items: Array<{ title: string; detail: string }> = []
    const latestAssessment = roster?.insights?.recentAssessment
    const topStudent = roster?.insights?.highest
    const guidance = roster?.pedagogy?.summary
    const sceneLabel = scene.id === 'sunrise' ? 'Bright start' : scene.id === 'day' ? 'Momentum check' : 'Evening reflection'

    const latestLabel = aiContext?.latestAssessmentLabel
    if (latestLabel) {
      items.push({ title: 'Latest checkpoint', detail: latestLabel })
    } else if (latestAssessment?.testName) {
      items.push({
        title: `${latestAssessment.testName} snapshot`,
        detail: `${latestAssessment.studentCount ?? 0} learners • ${
          latestAssessment.averageScore !== null && latestAssessment.averageScore !== undefined
            ? `${latestAssessment.averageScore.toFixed(1)}% avg`
            : 'avg pending'
        }`
      })
    }

    if (topStudent?.name) {
      items.push({
        title: 'Spotlight learner',
        detail: `${topStudent.name} is soaring at ${
          topStudent.score !== null && topStudent.score !== undefined ? `${topStudent.score.toFixed(1)}%` : 'a personal best'
        }`
      })
    }

    if (syncError) {
      items.unshift({ title: 'Sync issue', detail: syncError })
    }

    if (guidance) {
      items.push({
        title: 'Teaching move',
        detail: guidance
      })
    }

    items.push({
      title: sceneLabel,
      detail: scene.caption
    })

    return items
  }, [
    aiContext?.latestAssessmentLabel,
    roster?.insights?.recentAssessment,
    roster?.insights?.highest,
    roster?.pedagogy?.summary,
    scene
  ])

  const highlightRotationEnabled = !prefersReducedMotion && highlights.length > 1

  useEffect(() => {
    if (!highlightRotationEnabled) {
      setHighlightIndex(0)
      return
    }
    const interval = window.setInterval(() => {
      setHighlightIndex((current) => (current + 1) % highlights.length)
    }, 8000)
    return () => window.clearInterval(interval)
  }, [highlightRotationEnabled, highlights.length])

  useEffect(() => {
    if (highlightIndex >= highlights.length) {
      setHighlightIndex(0)
    }
  }, [highlightIndex, highlights.length])

  const activeHighlight = highlights[highlightIndex] ?? highlights[0]
  const statusNotice = useMemo(() => {
    if (syncError) {
      return {
        tone: 'error' as const,
        label: 'Sync issue',
        message: syncError
      }
    }
    if (isLoading) {
      return {
        tone: 'loading' as const,
        label: 'Refreshing roster',
        message: 'Pulling the latest mastery trends…'
      }
    }
    if (showEmptyState) {
      return {
        tone: 'info' as const,
        label: 'Connect your roster',
        message: 'Upload mastery rosters so the AI can anchor prompts to real class data.'
      }
    }
    return null
  }, [isLoading, showEmptyState, syncError])

  const highlightKey = activeHighlight ? `${activeHighlight.title}-${activeHighlight.detail}` : 'welcome-highlight'

  return (
    <section
      className={`glass-card dynamic-welcome ${scene.id}`}
      data-compact={isCompact ? 'true' : undefined}
      data-ready={mounted ? 'true' : undefined}
      data-loading={isLoading ? 'true' : undefined}
      data-reduced-motion={prefersReducedMotion ? 'true' : undefined}
      aria-busy={isLoading ? 'true' : undefined}
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
        {statusNotice ? (
          <div className={`welcome-status welcome-status--${statusNotice.tone}`} role={syncError ? 'alert' : 'status'}>
            <span className="welcome-status__label">{statusNotice.label}</span>
            <span className="welcome-status__message">{statusNotice.message}</span>
          </div>
        ) : null}
        {activeHighlight ? (
          <div className="welcome-spotlight" aria-live="polite">
            <span className="welcome-spotlight__badge">Live pulse</span>
            <div className="welcome-spotlight__content" key={highlightKey}>
              <span className="welcome-spotlight__title">{activeHighlight.title}</span>
              <span className="welcome-spotlight__detail">{activeHighlight.detail}</span>
            </div>
          </div>
        ) : null}
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
        <div className="welcome-metrics" role="list">
          {metrics.map((metric) => {
            const style: CSSProperties | undefined =
              metric.progress !== undefined ? { '--welcome-progress': `${metric.progress}%` } : undefined
            return (
              <div
                className="welcome-metrics__item"
                role="listitem"
                key={metric.id}
                style={style}
                data-loading={metric.loading ? 'true' : undefined}
              >
                <span className="welcome-metrics__value">{metric.value}</span>
                <span className="welcome-metrics__label">{metric.label}</span>
                <span className="welcome-metrics__detail">{metric.detail}</span>
                {metric.progress !== undefined ? (
                  <span className="welcome-metrics__progress" aria-hidden>
                    <span className="welcome-metrics__progress-bar" />
                  </span>
                ) : null}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
