import { useMemo, type ReactElement, type ReactNode } from 'react'
import { PrintButton } from '../core/PrintButton'
import type { SavedAssessment } from '../../types/roster'

type MasteryTier = 'approaching' | 'developing' | 'onGrade' | 'mastered'

const MASTERY_LEVELS: Array<{
  id: MasteryTier
  label: string
  description: string
  color: string
  background: string
}> = [
  {
    id: 'approaching',
    label: 'Approaching',
    description: 'Below 50% — intensive reteach needed',
    color: '#fda4af',
    background: 'linear-gradient(90deg, rgba(248, 113, 113, 0.38), rgba(244, 114, 182, 0.28))'
  },
  {
    id: 'developing',
    label: 'Developing',
    description: '50-69% — targeted scaffolds',
    color: '#fcd34d',
    background: 'linear-gradient(90deg, rgba(251, 191, 36, 0.38), rgba(250, 204, 21, 0.22))'
  },
  {
    id: 'onGrade',
    label: 'On Grade',
    description: '70-89% — on grade level',
    color: '#4ade80',
    background: 'linear-gradient(90deg, rgba(74, 222, 128, 0.38), rgba(16, 185, 129, 0.26))'
  },
  {
    id: 'mastered',
    label: 'Mastered',
    description: '90%+ — enrichment ready',
    color: '#60a5fa',
    background: 'linear-gradient(90deg, rgba(96, 165, 250, 0.38), rgba(129, 140, 248, 0.26))'
  }
]

type MasterySummary = {
  totalLearners: number
  scoredLearners: number
  average: number | null
  counts: Record<MasteryTier, number>
}

type MasteryScope = {
  id: 'all' | 'class' | 'student'
  title: string
  subtitle: string
  summary: MasterySummary | null
  latestScore?: number | null
  latestAssessment?: string | null
  trendDelta?: number | null
}

type MasteryDistributionProps = {
  scopes: MasteryScope[]
  sectionId?: string
  headerExtras?: ReactNode
  variant?: 'standalone' | 'embedded'
  title?: string
  description?: string
  printLabel?: string
}

const DEFAULT_DESCRIPTION =
  'These visuals reflect the most recent score for each learner. Missing scores stay in the roster as N/A so uploads never block your workflow.'

function percentage(count: number, total: number) {
  if (!total) return 0
  return Math.round((count / total) * 100)
}

function formatAverage(value: number | null) {
  if (value === null || Number.isNaN(value)) return 'N/A'
  const rounded = Number(value.toFixed(1))
  return Number.isInteger(rounded) ? `${Math.round(rounded)}%` : `${rounded.toFixed(1)}%`
}

export function MasteryDistribution({
  scopes,
  sectionId = 'mastery-distribution',
  headerExtras,
  variant = 'standalone',
  title = 'Track mastery momentum',
  description = DEFAULT_DESCRIPTION,
  printLabel = 'Print mastery distribution'
}: MasteryDistributionProps) {
  const renderedScopes = useMemo(() => scopes.filter((scope) => scope.summary), [scopes])

  const cards = useMemo(() => {
    return renderedScopes.reduce<ReactElement[]>((acc, scope) => {
      const summary = scope.summary
      if (!summary) return acc

      const insightParts: string[] = []
      const masteryPercent = percentage(summary.counts.mastered + summary.counts.onGrade, summary.scoredLearners)
      const scoredDisplay = summary.scoredLearners > 0 ? summary.scoredLearners : 'N/A'
      const totalDisplay = summary.totalLearners > 0 ? summary.totalLearners : 'N/A'
      const hasScoredLearners = summary.scoredLearners > 0

      if (summary.scoredLearners) {
        if (masteryPercent >= 80) {
          insightParts.push('Celebrate the wins — offer enrichment bursts to keep the momentum going.')
        } else if (masteryPercent >= 60) {
          insightParts.push('Solid footing — a few targeted scaffolds can push more learners into mastery.')
        } else {
          insightParts.push('Let’s shore up essentials with small-group reteach and quick checks for understanding.')
        }
      }

      if (scope.trendDelta != null && !Number.isNaN(scope.trendDelta)) {
        const deltaText =
          scope.trendDelta > 0 ? `▲${scope.trendDelta.toFixed(1)} pts` : `▼${Math.abs(scope.trendDelta).toFixed(1)} pts`
        insightParts.push(`Latest shift: ${deltaText} across the newest uploads.`)
      }

      if (hasScoredLearners && insightParts.length === 0) {
        insightParts.push('Scores are steady — keep the evidence flowing to spotlight the next growth area.')
      }

      const insight = insightParts.join(' ')

      acc.push(
        <article
          key={scope.id}
          className="glass-subcard"
          style={{
            border: '1px solid rgba(148,163,184,0.32)',
            borderRadius: 20,
            padding: 22,
            display: 'grid',
            gap: 16,
            background: 'linear-gradient(135deg, rgba(15,23,42,0.72), rgba(30,64,175,0.25))',
            boxShadow: '0 28px 60px rgba(15,23,42,0.45)'
          }}
        >
          <header style={{ display: 'grid', gap: 6 }}>
            <strong style={{ fontSize: 18 }}>{scope.title}</strong>
            <span style={{ color: 'var(--text-muted)', fontSize: 13 }}>{scope.subtitle}</span>
          </header>
          <div style={{ display: 'flex', gap: 20, alignItems: 'baseline', flexWrap: 'wrap' }}>
            <div>
              <div style={{ fontSize: 30, fontWeight: 700 }}>{formatAverage(summary.average)}</div>
              <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>Average proficiency</div>
            </div>
            <div>
              <div style={{ fontSize: 24, fontWeight: 700 }}>{scoredDisplay}</div>
              <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>Scored / {totalDisplay}</div>
            </div>
            {scope.latestScore !== undefined && scope.latestScore !== null && (
              <div>
                <div style={{ fontSize: 24, fontWeight: 700 }}>{scope.latestScore.toFixed(1)}%</div>
                <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>{scope.latestAssessment ?? 'Latest score'}</div>
              </div>
            )}
          </div>
          <div style={{ display: 'grid', gap: 12 }}>
            {MASTERY_LEVELS.map((level) => {
              const count = summary.counts[level.id]
              const percent = percentage(count, summary.scoredLearners)
              const hasLearnerCount = hasScoredLearners && count > 0
              return (
                <div
                  key={level.id}
                  style={{
                    borderRadius: 16,
                    padding: '12px 14px',
                    display: 'grid',
                    gap: 6,
                    background: level.background,
                    border: '1px solid rgba(148,163,184,0.28)'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 12 }}>
                    <span style={{ fontWeight: 600 }}>{level.label}</span>
                    <span style={{ fontSize: 18, fontWeight: 700, color: level.color }}>
                      {hasScoredLearners ? `${percent}%` : '—'}
                    </span>
                  </div>
                  <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: 12 }}>{level.description}</p>
                  {hasLearnerCount && (
                    <span style={{ fontSize: 12, color: 'rgba(226,232,240,0.86)' }}>
                      {count.toLocaleString()} learners
                    </span>
                  )}
                </div>
              )
            })}
          </div>
          {insight && (
            <p style={{ margin: 0, color: 'rgba(226,232,240,0.88)', fontSize: 13, lineHeight: 1.5 }}>{insight}</p>
          )}
        </article>
      )
      return acc
    }, [])
  }, [renderedScopes])

  if (!renderedScopes.length) {
    if (variant === 'embedded') {
      return (
        <div
          id={sectionId}
          style={{
            borderRadius: 20,
            border: '1px dashed rgba(148,163,184,0.35)',
            padding: 24,
            display: 'grid',
            gap: 12,
            background: 'rgba(15,23,42,0.45)'
          }}
        >
          <strong style={{ fontSize: 16 }}>Mastery data will appear once assessments are uploaded.</strong>
          <p style={{ margin: 0, color: 'var(--text-muted)' }}>
            Keep adding evidence — the charts refresh automatically for the class and selected learner.
          </p>
        </div>
      )
    }

    return (
      <section id={sectionId} className="glass-card" style={{ display: 'grid', gap: 16 }}>
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16 }}>
          <div>
            <h3 style={{ margin: 0, fontSize: 24, fontWeight: 700 }}>{title}</h3>
          </div>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            {headerExtras}
            <PrintButton targetId={sectionId} label={printLabel} />
          </div>
        </header>
        <article
          className="glass-subcard"
          style={{
            border: '1px solid rgba(148,163,184,0.35)',
            borderRadius: 18,
            padding: 18,
            background: 'rgba(15,23,42,0.62)'
          }}
        >
          <strong style={{ fontSize: 18, display: 'block', marginBottom: 6 }}>Mastery data</strong>
          <p style={{ margin: 0, color: 'var(--text-muted)' }}>
            Proficiency metrics are currently N/A. Upload data when you have it, but your workflow stays flexible in the meantime.
          </p>
        </article>
      </section>
    )
  }

  if (variant === 'embedded') {
    return (
      <div id={sectionId} style={{ display: 'grid', gap: 18 }}>
        {headerExtras && (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
            {headerExtras}
            <PrintButton targetId={sectionId} label={printLabel} />
          </div>
        )}
        <div
          style={{
            display: 'grid',
            gap: 18,
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))'
          }}
        >
          {cards}
        </div>
      </div>
    )
  }

  return (
    <section id={sectionId} className="glass-card" style={{ display: 'grid', gap: 20 }}>
      <header
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          gap: 16,
          flexWrap: 'wrap'
        }}
      >
        <div>
          <h3 style={{ margin: 0, fontSize: 24, fontWeight: 700 }}>{title}</h3>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap', maxWidth: 520 }}>
          {headerExtras}
          <p style={{ margin: 0, color: 'var(--text-muted)' }}>{description}</p>
          <PrintButton targetId={sectionId} label={printLabel} />
        </div>
      </header>
      <div
        style={{
          display: 'grid',
          gap: 18,
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))'
        }}
      >
        {cards}
      </div>
    </section>
  )
}

export function buildMasterySummary(scores: Array<number | null | undefined>): MasterySummary | null {
  const totalLearners = scores.length
  const counts: Record<MasteryTier, number> = {
    approaching: 0,
    developing: 0,
    onGrade: 0,
    mastered: 0
  }
  const validScores: number[] = []
  scores.forEach((score) => {
    if (typeof score === 'number' && Number.isFinite(score)) {
      validScores.push(score)
      if (score >= 90) {
        counts.mastered += 1
      } else if (score >= 70) {
        counts.onGrade += 1
      } else if (score >= 50) {
        counts.developing += 1
      } else {
        counts.approaching += 1
      }
    }
  })
  const scoredLearners = validScores.length
  const average = scoredLearners
    ? validScores.reduce((total, value) => total + value, 0) / scoredLearners
    : null
  return { totalLearners, scoredLearners, average, counts }
}

export function computeTrendDelta(history: SavedAssessment[]): number | null {
  if (!history.length) return null
  const scored = history.filter((entry) => typeof entry.score === 'number') as Array<SavedAssessment & { score: number }>
  if (scored.length < 2) return null
  const latest = scored[0].score
  const previous = scored[1].score
  return latest - previous
}

export function classifyScore(score: number | null | undefined): MasteryTier | 'na' {
  if (score === null || score === undefined || Number.isNaN(score)) return 'na'
  if (score >= 90) return 'mastered'
  if (score >= 70) return 'onGrade'
  if (score >= 50) return 'developing'
  return 'approaching'
}

export type { MasterySummary, MasteryScope, MasteryTier }
