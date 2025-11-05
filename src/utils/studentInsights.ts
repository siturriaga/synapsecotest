import type {
  PedagogicalGuidance,
  RosterGroupInsight,
  SavedAssessment,
  StudentRosterRecord
} from '../types/roster'

export type StudentInsight = {
  headline: string
  highlights: string[]
  recommendations: string[]
}

type BuildStudentInsightParams = {
  student: StudentRosterRecord | null
  history: SavedAssessment[]
  classAverage: number | null | undefined
  trendDelta: number | null | undefined
  groupInsights: RosterGroupInsight[]
  pedagogy: PedagogicalGuidance | null
}

function normalise(value: string) {
  return value.toLowerCase().replace(/\s+/g, ' ').trim()
}

export function buildStudentInsight({
  student,
  history,
  classAverage,
  trendDelta,
  groupInsights,
  pedagogy
}: BuildStudentInsightParams): StudentInsight | null {
  if (!student) return null

  const latestRecord = history[0] ?? null
  const latestScore = typeof latestRecord?.score === 'number' ? latestRecord.score : student.lastScore
  const latestAssessment = latestRecord?.testName ?? student.lastAssessment

  const headlineParts: string[] = []
  if (typeof latestScore === 'number') {
    const formatted = latestScore.toFixed(1).replace(/\.0$/, '')
    const context = latestAssessment ? ` on ${latestAssessment}` : ''
    headlineParts.push(`${student.displayName} is working around ${formatted}%${context}, giving us a clear snapshot for next steps.`)
    if (typeof classAverage === 'number') {
      const delta = latestScore - classAverage
      const direction = delta > 0 ? 'ahead of' : delta < 0 ? 'just behind' : 'right in step with'
      const magnitude = Math.abs(delta).toFixed(1).replace(/\.0$/, '')
      if (delta !== 0) {
        headlineParts.push(`That’s about ${magnitude} pts ${direction} the class average of ${classAverage.toFixed(1)}%.`)
      } else {
        headlineParts.push('They are right in step with the current class average.')
      }
    }
  } else {
    headlineParts.push(`${student.displayName} doesn’t have a recent scored checkpoint yet. Let’s capture the next one together so we can tailor support.`)
  }

  if (typeof trendDelta === 'number' && !Number.isNaN(trendDelta) && trendDelta !== 0) {
    const trendText = trendDelta > 0 ? `building ▲${trendDelta.toFixed(1)} pts momentum` : `showing a ▼${Math.abs(trendDelta).toFixed(1)} pts dip`
    headlineParts.push(`Recent trajectory is ${trendText} across the last two assessments.`)
  }

  const highlights: string[] = []
  history.slice(0, 3).forEach((record) => {
    const when = record.createdAt ? record.createdAt.toLocaleDateString() : 'Recent'
    const scoreText = typeof record.score === 'number' ? `${record.score.toFixed(1).replace(/\.0$/, '')}%` : 'N/A'
    const label = record.testName ?? 'Assessment'
    highlights.push(`${label} (${when}): ${scoreText}`)
  })

  if (!highlights.length && typeof latestScore === 'number') {
    highlights.push(`Latest recorded score: ${latestScore.toFixed(1).replace(/\.0$/, '')}%`)
  }

  const recommendations: string[] = []
  const variants = new Set<string>([student.displayName, ...(student.nameVariants ?? [])].map(normalise))
  const matchedGroup = groupInsights.find((group) =>
    group.students.some((rosterStudent) => variants.has(normalise(rosterStudent.name)))
  )

  if (matchedGroup) {
    const firstPractice = matchedGroup.recommendedPractices[0]
    recommendations.push(
      `${student.displayName} sits in the ${matchedGroup.label.toLowerCase()} cohort (${matchedGroup.range}). Let’s lean on ${firstPractice ?? 'targeted feedback and collaborative routines'} this week.`
    )
  }

  if (pedagogy?.bestPractices?.length) {
    pedagogy.bestPractices.slice(0, 2).forEach((practice) => {
      recommendations.push(practice)
    })
  }

  if (!recommendations.length) {
    recommendations.push('Celebrate strengths during conferences and co-design the next learning target side by side.')
  }

  return {
    headline: headlineParts.join(' '),
    highlights,
    recommendations
  }
}
