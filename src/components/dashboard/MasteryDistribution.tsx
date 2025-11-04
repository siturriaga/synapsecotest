import { useMemo } from 'react'
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
    background: 'linear-gradient(90deg, rgba(248, 113, 113, 0.28), rgba(244, 114, 182, 0.18))'
  },
  {
    id: 'developing',
    label: 'Developing',
    description: '50-69% — targeted scaffolds',
    color: '#fcd34d',
    background: 'linear-gradient(90deg, rgba(251, 191, 36, 0.28), rgba(250, 204, 21, 0.14))'
  },
  {
    id: 'onGrade',
    label: 'On Grade',
    description: '70-89% — on grade level',
    color: '#4ade80',
    background: 'linear-gradient(90deg, rgba(74, 222, 128, 0.28), rgba(16, 185, 129, 0.18))'
  },
  {
    id: 'mastered',
    label: 'Mastered',
    description: '90%+ — enrichment ready',
    color: '#60a5fa',
    background: 'linear-gradient(90deg, rgba(96, 165, 250, 0.28), rgba(129, 140, 248, 0.2))'
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
}

function percentage(count: number, total: number) {
  if (!total) return 0
  return Math.round((count / total) * 100)
}

function formatAverage(value: number | null) {
  if (value === null || Number.isNaN(value)) return 'N/A'
  const rounded = Number(value.toFixed(1))
  return Number.isInteger(rounded) ? `${Math.round(rounded)}%` : `${rounded.toFixed(1)}%`
}

export function MasteryDistribution({ scopes }: MasteryDistributionProps) {
  const renderedScopes = useMemo(() => scopes.filter((scope) => scope.summary), [scopes])

  if (!renderedScopes.length) {
    return (
      <section className="glass-card" style={{ display: 'grid', gap: 16 }}>
        <div className="badge">Proficiency distribution</div>
        <article
          className="glass-subcard"
          style={{
            border: '1px solid rgba(148,163,184,0.25)',
            borderRadius: 16,
            padding: 18,
            background: 'rgba(15,23,42,0.55)'
          }}
        >
          <strong style={{ fontSize: 18, display: 'block', marginBottom: 6 }}>Mastery data</strong>
          <p style={{ margin: 0, color: 'var(--text-muted)' }}>
            Proficiency metrics are currently N/A. Upload data when you have it, but your workflow stays flexible in the
            meantime.
          </p>
        </article>
      </section>
    )
  }

  return (
    <section className="glass-card" style={{ display: 'grid', gap: 20 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 16, flexWrap: 'wrap' }}>
        <div>
          <div className="badge">Proficiency distribution</div>
          <h3 style={{ margin: '12px 0 0', fontSize: 24, fontWeight: 700 }}>Track mastery momentum</h3>
        </div>
        <p style={{ margin: 0, color: 'var(--text-muted)', maxWidth: 420 }}>
          These visuals reflect the most recent score for each learner. Missing scores remain flexible — they stay in the roster as
          N/A so uploads never block your workflow.
        </p>
      </div>
      <div style={{ display: 'grid', gap: 18, gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))' }}>
        {renderedScopes.map((scope) => {
          const { summary } = scope
          if (!summary) return null
          const insightParts: string[] = []
          const masteryPercent = percentage(summary.counts.mastered + summary.counts.onGrade, summary.scoredLearners)
          const scoredDisplay = summary.scoredLearners > 0 ? summary.scoredLearners : 'N/A'
          const totalDisplay = summary.totalLearners > 0 ? summary.totalLearners : 'N/A'
          const hasScoredLearners = summary.scoredLearners > 0
          if (summary.scoredLearners) {
            if (masteryPercent >= 80) {
              insightParts.push('Strong mastery trend — celebrate and extend learning!')
            } else if (masteryPercent >= 60) {
              insightParts.push('Solid footing — keep reinforcing core concepts to lift more learners.')
            } else {
              insightParts.push('Reinforce foundations — focus reteach groups and formative checks.')
            }
          }
          if (scope.trendDelta != null && !Number.isNaN(scope.trendDelta)) {
            const deltaText =
              scope.trendDelta > 0 ? `▲${scope.trendDelta.toFixed(1)} pts` : `▼${Math.abs(scope.trendDelta).toFixed(1)} pts`
            insightParts.push(`Latest shift: ${deltaText}`)
          }
          return (
            <article
              key={scope.id}
              className="glass-subcard"
              style={{
                border: '1px solid rgba(148,163,184,0.25)',
                borderRadius: 18,
                padding: 20,
                display: 'grid',
                gap: 14,
                background: 'rgba(15,23,42,0.55)'
              }}
            >
              <header style={{ display: 'grid', gap: 4 }}>
                <strong style={{ fontSize: 18 }}>{scope.title}</strong>
                <span style={{ color: 'var(--text-muted)', fontSize: 13 }}>{scope.subtitle}</span>
              </header>
              <div style={{ display: 'flex', gap: 18, alignItems: 'baseline', flexWrap: 'wrap' }}>
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
              <div style={{ display: 'grid', gap: 10 }}>
                {MASTERY_LEVELS.map((level) => {
                  const count = summary.counts[level.id]
                  const percent = percentage(count, summary.scoredLearners)
                  return (
                    <div key={level.id} style={{ display: 'grid', gap: 6 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: 'var(--text-muted)' }}>
                        <span>
                          {level.label} · {level.description}
                        </span>
                        <span>
                          {hasScoredLearners ? (
                            <>
                              {count}
                              {` · ${percent}%`}
                            </>
                          ) : (
                            'N/A'
                          )}
                        </span>
                      </div>
                      <div
                        style={{
                          height: 10,
                          borderRadius: 999,
                          background: 'rgba(148,163,184,0.16)',
                          overflow: 'hidden'
                        }}
                      >
                        <div
                          style={{
                            width: `${percent}%`,
                            height: '100%',
                            transition: 'width 320ms ease',
                            background: level.background,
                            boxShadow: `0 0 12px ${level.color}`
                          }}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
              {insightParts.length > 0 && (
                <p style={{ margin: 0, fontSize: 13, color: 'rgba(226,232,240,0.78)' }}>{insightParts.join(' ')}</p>
              )}
            </article>
          )
        })}
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
