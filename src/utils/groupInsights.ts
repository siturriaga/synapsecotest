import type {
  PedagogicalGuidance,
  RosterGroupInsight,
  RosterInsightEntry,
  SavedAssessment,
  AssessmentSnapshotRecord
} from '../types/roster'

const GROUP_TOOLKIT: Record<string, { label: string; practices: string[] }> = {
  foundation: {
    label: 'Emerging understanding',
    practices: [
      'Front-load vocabulary and concepts with visuals, home-language bridges, and concrete representations.',
      'Use collaborative talk moves, sentence frames, and quick formative checks to co-construct meaning with students.',
      'Highlight student assets by connecting examples to their lived experiences and community knowledge.'
    ]
  },
  developing: {
    label: 'Approaching mastery',
    practices: [
      'Facilitate mixed-ability discourse protocols where developing learners explain their reasoning to peers.',
      'Offer choice boards, graphic organizers, or inquiry stems to deepen conceptual understanding.',
      'Invite students to critique sample work and co-create success criteria to build assessment literacy.'
    ]
  },
  extending: {
    label: 'Ready for extension',
    practices: [
      'Design project-based or real-world tasks that let students apply the standard to issues they care about.',
      'Position these learners as peer mentors or discussion facilitators to elevate collective knowledge.',
      'Encourage critical questioning, multiple solution paths, and opportunities for student leadership.'
    ]
  }
}

export const UNIVERSAL_PRACTICES: PedagogicalGuidance = {
  summary:
    'Ground instruction in culturally responsive, student-centered routines that honor learner voice, leverage collaboration, and provide multiple pathways into the content.',
  bestPractices: [
    'Plan with Universal Design for Learning: vary how students engage with the content, how you represent ideas, and how learners express understanding.',
    'Embed critical pedagogy by connecting the standard to community issues students identify and by inviting them to interrogate real-world impacts.',
    'Use asset-based feedback loops and restorative conversations so every learner sees their strengths and next steps.',
    'Build in collaborative structures (think-pair-share, jigsaw, peer feedback) that cultivate shared responsibility for learning.'
  ],
  reflectionPrompts: [
    'Whose voices were centered in the last lesson and how will you widen participation next time?',
    'What choices can students make to demonstrate mastery in ways that reflect their strengths and identities?',
    'Which community, cultural, or interdisciplinary connections will make this standard relevant for your learners?'
  ]
}

export function formatScore(value: number | null | undefined) {
  if (value === null || value === undefined || Number.isNaN(value)) return 'N/A'
  const rounded = Number(value.toFixed(1))
  return Number.isInteger(rounded) ? String(Math.round(rounded)) : rounded.toFixed(1)
}

export function buildGroupInsights(
  records: SavedAssessment[],
  recent: AssessmentSnapshotRecord | null
): {
  groups: RosterGroupInsight[]
  pedagogy: PedagogicalGuidance | null
} {
  const scored = records
    .filter((record) => typeof record.score === 'number' && record.score !== null)
    .sort((a, b) => (a.score ?? 0) - (b.score ?? 0))

  if (!scored.length) {
    return { groups: [], pedagogy: null }
  }

  const total = scored.length
  const foundationEnd = Math.min(total, Math.max(1, Math.round(total / 3)))
  const developingEnd = Math.min(total, Math.max(foundationEnd + 1, Math.round((total * 2) / 3)))

  const slices: Array<{ id: keyof typeof GROUP_TOOLKIT; start: number; end: number }> = [
    { id: 'foundation', start: 0, end: foundationEnd },
    { id: 'developing', start: foundationEnd, end: developingEnd },
    { id: 'extending', start: developingEnd, end: total }
  ]

  const groups: RosterGroupInsight[] = []

  slices.forEach(({ id, start, end }) => {
    if (start >= end) return
    const segment = scored.slice(start, end)
    const toolkit = GROUP_TOOLKIT[id]
    const minScore = segment[0]?.score ?? null
    const maxScore = segment[segment.length - 1]?.score ?? null
    const range = minScore !== null && maxScore !== null ? `${formatScore(minScore)}–${formatScore(maxScore)}` : 'N/A'

    const students: RosterInsightEntry[] = segment.map((record) => ({
      name: record.displayName,
      score: record.score ?? null,
      testName: record.testName ?? null,
      period: record.period ?? null,
      quarter: record.quarter ?? null,
      recordedAt: record.createdAt ?? null
    }))

    groups.push({
      id,
      label: toolkit.label,
      range,
      studentCount: segment.length,
      students,
      recommendedPractices: toolkit.practices
    })
  })

  const averageScore = recent?.averageScore ?? null
  const foundationGroup = groups.find((group) => group.id === 'foundation')
  const extendingGroup = groups.find((group) => group.id === 'extending')

  const summaryParts: string[] = []
  if (averageScore !== null) {
    summaryParts.push(`Class average is about ${formatScore(averageScore)}, showing where shared re-engagement may help.`)
  }
  if (foundationGroup) {
    summaryParts.push(
      `Plan targeted scaffolds for ${foundationGroup.studentCount} learners who are still building confidence; pair them with asset-based routines and community-connected examples.`
    )
  }
  if (extendingGroup) {
    summaryParts.push(
      `Empower ${extendingGroup.studentCount} students ready for extension to mentor peers and co-design inquiry that interrogates real-world contexts.`
    )
  }

  const pedagogy: PedagogicalGuidance = {
    summary: summaryParts.length ? summaryParts.join(' ') : UNIVERSAL_PRACTICES.summary,
    bestPractices: UNIVERSAL_PRACTICES.bestPractices,
    reflectionPrompts: UNIVERSAL_PRACTICES.reflectionPrompts
  }

  return { groups, pedagogy }
}
