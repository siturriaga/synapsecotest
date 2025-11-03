import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import type { User } from 'firebase/auth'
import {
  collection,
  doc,
  limit,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc
} from 'firebase/firestore'
import { db } from '../firebase'
import type {
  AssessmentSnapshotRecord,
  PedagogicalGuidance,
  RosterGroupInsight,
  RosterInsightEntry,
  SavedAssessment,
  StudentRosterRecord
} from '../types/roster'

interface RosterDataContextValue {
  loading: boolean
  records: SavedAssessment[]
  summaries: AssessmentSnapshotRecord[]
  students: StudentRosterRecord[]
  insights: RosterInsights | null
  groupInsights: RosterGroupInsight[]
  pedagogy: PedagogicalGuidance | null
  syncStatus: 'idle' | 'saving' | 'error'
  syncError: string | null
  lastSyncedAt: Date | null
  triggerSync: () => Promise<void>
}

interface RosterDataProviderProps {
  user: User | null
  children: React.ReactNode
}

interface RosterInsights {
  totalStudents: number
  averageScore: number | null
  highest: RosterInsightEntry | null
  lowest: RosterInsightEntry | null
  recentAssessment: AssessmentSnapshotRecord | null
}

interface BuildGroupResult {
  groups: RosterGroupInsight[]
  pedagogy: PedagogicalGuidance | null
}

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

const UNIVERSAL_PRACTICES: PedagogicalGuidance = {
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

function formatScore(value: number | null | undefined) {
  if (value === null || value === undefined || Number.isNaN(value)) return '—'
  const rounded = Number(value.toFixed(1))
  return Number.isInteger(rounded) ? String(Math.round(rounded)) : rounded.toFixed(1)
}

function buildGroupInsights(records: SavedAssessment[], recent: AssessmentSnapshotRecord | null): BuildGroupResult {
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
    const range = minScore !== null && maxScore !== null ? `${formatScore(minScore)}–${formatScore(maxScore)}` : '—'

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

const RosterDataContext = createContext<RosterDataContextValue>({
  loading: false,
  records: [],
  summaries: [],
  students: [],
  insights: null,
  groupInsights: [],
  pedagogy: null,
  syncStatus: 'idle',
  syncError: null,
  lastSyncedAt: null,
  triggerSync: async () => {}
})

export function RosterDataProvider({ user, children }: RosterDataProviderProps) {
  const [records, setRecords] = useState<SavedAssessment[]>([])
  const [summaries, setSummaries] = useState<AssessmentSnapshotRecord[]>([])
  const [students, setStudents] = useState<StudentRosterRecord[]>([])
  const [loading, setLoading] = useState(false)
  const [syncStatus, setSyncStatus] = useState<'idle' | 'saving' | 'error'>('idle')
  const [syncError, setSyncError] = useState<string | null>(null)
  const [lastSyncedAt, setLastSyncedAt] = useState<Date | null>(null)

  const payloadRef = useRef<{
    records: SavedAssessment[]
    summaries: AssessmentSnapshotRecord[]
    students: StudentRosterRecord[]
    groupInsights: RosterGroupInsight[]
    pedagogy: PedagogicalGuidance | null
  } | null>(null)
  const hasPendingSync = useRef(false)
  const savingRef = useRef(false)

  useEffect(() => {
    if (!user) {
      setRecords([])
      setSummaries([])
      setStudents([])
      setLoading(false)
      payloadRef.current = null
      hasPendingSync.current = false
      setSyncStatus('idle')
      setSyncError(null)
      setLastSyncedAt(null)
      return
    }

    setLoading(true)
    let recordsLoaded = false
    let summariesLoaded = false
    let studentsLoaded = false

    const done = () => {
      if (recordsLoaded && summariesLoaded && studentsLoaded) {
        setLoading(false)
      }
    }

    const assessmentsQuery = query(
      collection(db, `users/${user.uid}/assessments`),
      orderBy('createdAt', 'desc'),
      limit(200)
    )
    const unsubscribeAssessments = onSnapshot(assessmentsQuery, (snapshot) => {
      const rows: SavedAssessment[] = []
      snapshot.forEach((docSnap) => {
        const data = docSnap.data() as any
        rows.push({
          id: docSnap.id,
          displayName: data.displayName ?? 'Student',
          score:
            typeof data.score === 'number'
              ? data.score
              : data.score
              ? Number(data.score)
              : null,
          period: data.period ?? null,
          quarter: data.quarter ?? null,
          testName: data.testName ?? null,
          createdAt: data.createdAt?.toDate?.() ?? null,
          sheetRow: data.sheetRow ?? null
        })
      })
      setRecords(rows)
      recordsLoaded = true
      done()
    })

    const summariesQuery = query(
      collection(db, `users/${user.uid}/assessments_summary`),
      orderBy('updatedAt', 'desc'),
      limit(50)
    )
    const unsubscribeSummaries = onSnapshot(summariesQuery, (snapshot) => {
      const rows: AssessmentSnapshotRecord[] = []
      snapshot.forEach((docSnap) => {
        const data = docSnap.data() as any
        rows.push({
          id: docSnap.id,
          testName: data.testName ?? 'Assessment',
          period: data.period ?? null,
          quarter: data.quarter ?? null,
          studentCount: data.studentCount ?? null,
          averageScore: data.averageScore ?? null,
          medianScore: data.medianScore ?? null,
          maxScore: data.maxScore ?? null,
          minScore: data.minScore ?? null,
          updatedAt: data.updatedAt?.toDate?.() ?? null
        })
      })
      setSummaries(rows)
      summariesLoaded = true
      done()
    })

    const studentsQuery = query(
      collection(db, `users/${user.uid}/students`),
      orderBy('updatedAt', 'desc'),
      limit(200)
    )
    const unsubscribeStudents = onSnapshot(studentsQuery, (snapshot) => {
      const rows: StudentRosterRecord[] = []
      snapshot.forEach((docSnap) => {
        const data = docSnap.data() as any
        rows.push({
          id: docSnap.id,
          displayName: data.displayName ?? 'Student',
          nameVariants: Array.isArray(data.nameVariants) ? data.nameVariants : [],
          lastScore: typeof data.lastScore === 'number' ? data.lastScore : null,
          lastAssessment: data.lastAssessment ?? data.testName ?? null,
          period: data.period ?? null,
          quarter: data.quarter ?? null,
          lastUploadId: data.lastUploadId ?? null,
          lastSheetRow: data.lastSheetRow ?? null,
          updatedAt: data.updatedAt?.toDate?.() ?? null,
          uploads: data.uploads ?? null
        })
      })
      setStudents(rows)
      studentsLoaded = true
      done()
    })

    return () => {
      unsubscribeAssessments()
      unsubscribeSummaries()
      unsubscribeStudents()
    }
  }, [user])

  const groupResult = useMemo(() => buildGroupInsights(records, summaries[0] ?? null), [records, summaries])
  const groupInsights = groupResult.groups
  const pedagogicalGuidance = groupResult.pedagogy

  useEffect(() => {
    payloadRef.current = { records, summaries, students, groupInsights, pedagogy: pedagogicalGuidance }
    if (user) {
      hasPendingSync.current = true
    }
  }, [records, summaries, students, groupInsights, pedagogicalGuidance, user])

  const computeInsights = useMemo<RosterInsights | null>(() => {
    if (!records.length && !summaries.length) return null
    const recent = summaries[0] ?? null
    const scoredRecords = records.filter((record) => typeof record.score === 'number')
    const totalStudents = recent?.studentCount ?? scoredRecords.length
    const averageScore = recent?.averageScore ?? null
    const sorted = [...scoredRecords].sort((a, b) => {
      const scoreA = a.score ?? -Infinity
      const scoreB = b.score ?? -Infinity
      return scoreB - scoreA
    })

    const toEntry = (record: SavedAssessment | undefined): RosterInsightEntry | null => {
      if (!record) return null
      return {
        name: record.displayName,
        score: record.score,
        testName: record.testName,
        period: record.period,
        quarter: record.quarter,
        recordedAt: record.createdAt ?? null
      }
    }

    return {
      totalStudents,
      averageScore,
      highest: toEntry(sorted[0]),
      lowest: toEntry(sorted.length ? sorted[sorted.length - 1] : undefined),
      recentAssessment: recent
    }
  }, [records, summaries])

  const saveSnapshot = useCallback(async () => {
    if (!user || savingRef.current) return
    const payload = payloadRef.current
    if (!payload) return
    savingRef.current = true
    setSyncStatus('saving')
    setSyncError(null)
    try {
      const nowIso = new Date().toISOString()
      const docRef = doc(db, `users/${user.uid}/workspace_cache/rosterSnapshot`)
      const scored = payload.records
        .filter((record) => typeof record.score === 'number')
        .sort((a, b) => (b.score ?? -Infinity) - (a.score ?? -Infinity))
      const top = scored.slice(0, 5).map((record) => ({
        name: record.displayName,
        score: record.score,
        testName: record.testName,
        period: record.period,
        quarter: record.quarter,
        recordedAt: record.createdAt ? record.createdAt.toISOString() : null
      }))
      const bottomSource = scored.slice(-5).reverse()
      const bottom = bottomSource.map((record) => ({
        name: record.displayName,
        score: record.score,
        testName: record.testName,
        period: record.period,
        quarter: record.quarter,
        recordedAt: record.createdAt ? record.createdAt.toISOString() : null
      }))

      await setDoc(
        docRef,
        {
          lastClientSyncAt: nowIso,
          updatedAt: serverTimestamp(),
          stats: {
            totalAssessments: payload.records.length,
            totalSummaries: payload.summaries.length,
            totalStudents: payload.students.length
          },
          latestAssessment: payload.summaries[0]
            ? {
                id: payload.summaries[0].id,
                testName: payload.summaries[0].testName,
                period: payload.summaries[0].period,
                quarter: payload.summaries[0].quarter,
                studentCount: payload.summaries[0].studentCount,
                averageScore: payload.summaries[0].averageScore,
                maxScore: payload.summaries[0].maxScore,
                minScore: payload.summaries[0].minScore,
                updatedAt: payload.summaries[0].updatedAt
                  ? payload.summaries[0].updatedAt.toISOString()
                  : null
              }
            : null,
          highlights: {
            topStudents: top,
            needsSupport: bottom
          },
          groupInsights: payload.groupInsights.map((group) => ({
            id: group.id,
            label: group.label,
            range: group.range,
            studentCount: group.studentCount,
            recommendedPractices: group.recommendedPractices,
            students: group.students.map((student) => ({
              name: student.name,
              score: student.score,
              testName: student.testName,
              period: student.period,
              quarter: student.quarter,
              recordedAt: student.recordedAt ? student.recordedAt.toISOString() : null
            }))
          })),
          pedagogy: payload.pedagogy
            ? {
                summary: payload.pedagogy.summary,
                bestPractices: payload.pedagogy.bestPractices,
                reflectionPrompts: payload.pedagogy.reflectionPrompts
              }
            : null,
          recentStudents: payload.records.slice(0, 20).map((record) => ({
            name: record.displayName,
            score: record.score,
            testName: record.testName,
            period: record.period,
            quarter: record.quarter,
            sheetRow: record.sheetRow ?? null,
            uploadedAt: record.createdAt ? record.createdAt.toISOString() : null
          }))
        },
        { merge: true }
      )
      hasPendingSync.current = false
      setSyncStatus('idle')
      setLastSyncedAt(new Date())
    } catch (error: any) {
      console.error('Failed to sync roster snapshot', error)
      setSyncStatus('error')
      setSyncError(error?.message ?? 'Unable to sync roster snapshot')
    } finally {
      savingRef.current = false
    }
  }, [user])

  useEffect(() => {
    if (!user) return
    const interval = setInterval(() => {
      if (hasPendingSync.current && !savingRef.current) {
        void saveSnapshot()
      }
    }, 15000)
    return () => clearInterval(interval)
  }, [saveSnapshot, user])

  const value = useMemo<RosterDataContextValue>(
    () => ({
      loading,
      records,
      summaries,
      students,
      insights: computeInsights,
      groupInsights,
      pedagogy: pedagogicalGuidance,
      syncStatus,
      syncError,
      lastSyncedAt,
      triggerSync: async () => {
        await saveSnapshot()
      }
    }),
    [
      loading,
      records,
      summaries,
      students,
      computeInsights,
      groupInsights,
      pedagogicalGuidance,
      syncStatus,
      syncError,
      lastSyncedAt,
      saveSnapshot
    ]
  )

  return <RosterDataContext.Provider value={value}>{children}</RosterDataContext.Provider>
}

export function useRosterData() {
  return useContext(RosterDataContext)
}
