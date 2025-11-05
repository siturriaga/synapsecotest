import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import type { User } from 'firebase/auth'
import {
  collection,
  doc,
  getDoc,
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
  RosterInsights,
  SavedAssessment,
  SavedRosterUpload,
  StudentRosterRecord
} from '../types/roster'
import { buildGroupInsights } from '../utils/groupInsights'
import { buildRosterAIContext, type RosterAIContext } from '../utils/aiContext'

interface RosterDataContextValue {
  loading: boolean
  records: SavedAssessment[]
  summaries: AssessmentSnapshotRecord[]
  students: StudentRosterRecord[]
  uploads: SavedRosterUpload[]
  insights: RosterInsights | null
  groupInsights: RosterGroupInsight[]
  pedagogy: PedagogicalGuidance | null
  aiContext: RosterAIContext
  syncStatus: 'idle' | 'saving' | 'error'
  syncError: string | null
  lastSyncedAt: Date | null
  triggerSync: () => Promise<boolean>
}

interface RosterDataProviderProps {
  user: User | null
  children: React.ReactNode
}

const RosterDataContext = createContext<RosterDataContextValue>({
  loading: false,
  records: [],
  summaries: [],
  students: [],
  uploads: [],
  insights: null,
  groupInsights: [],
  pedagogy: null,
  aiContext: {
    focusNarrative: 'Upload mastery rosters so the AI can anchor prompts to real class data.',
    masterySummary: 'Upload mastery rosters so the AI can anchor prompts to real class data.',
    strugglingLearners: [],
    latestAssessmentLabel: null,
    classContext: { pedagogy: null, groups: [] }
  },
  syncStatus: 'idle',
  syncError: null,
  lastSyncedAt: null,
  triggerSync: async () => false
})

export function RosterDataProvider({ user, children }: RosterDataProviderProps) {
  const [records, setRecords] = useState<SavedAssessment[]>([])
  const [summaries, setSummaries] = useState<AssessmentSnapshotRecord[]>([])
  const [students, setStudents] = useState<StudentRosterRecord[]>([])
  const [uploads, setUploads] = useState<SavedRosterUpload[]>([])
  const [loading, setLoading] = useState(false)
  const [syncStatus, setSyncStatus] = useState<'idle' | 'saving' | 'error'>('idle')
  const [syncError, setSyncError] = useState<string | null>(null)
  const [lastSyncedAt, setLastSyncedAt] = useState<Date | null>(null)

  const hasPendingSync = useRef(false)
  const savingRef = useRef(false)

  useEffect(() => {
    setRecords([])
    setSummaries([])
    setStudents([])
    setUploads([])
    hasPendingSync.current = false
    savingRef.current = false
    setSyncStatus('idle')
    setSyncError(null)
    setLastSyncedAt(null)

    if (!user) {
      setLoading(false)
      return
    }

    setLoading(true)
    let recordsLoaded = false
    let summariesLoaded = false
    let studentsLoaded = false
    let uploadsLoaded = false

    const done = () => {
      if (recordsLoaded && summariesLoaded && studentsLoaded && uploadsLoaded) {
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
        const rawScore = data.score
        let normalizedScore: number | null = null
        if (typeof rawScore === 'number') {
          normalizedScore = Number.isFinite(rawScore) ? rawScore : null
        } else if (rawScore != null) {
          const parsed = Number.parseFloat(String(rawScore).trim())
          normalizedScore = Number.isFinite(parsed) ? parsed : null
        }

        rows.push({
          id: docSnap.id,
          displayName: data.displayName ?? 'N/A',
          score: normalizedScore,
          period: data.period ?? null,
          quarter: data.quarter ?? null,
          testName: data.testName ?? 'N/A',
          createdAt: data.createdAt?.toDate?.() ?? null,
          sheetRow: data.sheetRow ?? null,
          studentId: data.studentId ?? null
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
          testName: data.testName ?? 'N/A',
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
          displayName: data.displayName ?? 'N/A',
          nameVariants: Array.isArray(data.nameVariants) ? data.nameVariants : [],
          lastScore: typeof data.lastScore === 'number' ? data.lastScore : null,
          lastAssessment: data.lastAssessment ?? data.testName ?? null,
          period: data.period ?? null,
          quarter: data.quarter ?? null,
          lastUploadId: data.lastUploadId ?? null,
          lastSheetRow: data.lastSheetRow ?? null,
          updatedAt: data.updatedAt?.toDate?.() ?? null,
          uploads: data.uploads ?? null,
          periodHistory: Array.isArray(data.periodHistory) ? data.periodHistory : undefined,
          quarterHistory: Array.isArray(data.quarterHistory) ? data.quarterHistory : undefined
        })
      })
      setStudents(rows)
      studentsLoaded = true
      done()
    })

    const uploadsQuery = query(
      collection(db, `users/${user.uid}/uploads`),
      orderBy('createdAt', 'desc'),
      limit(12)
    )
    const unsubscribeUploads = onSnapshot(uploadsQuery, (snapshot) => {
      const rows: SavedRosterUpload[] = []
      snapshot.forEach((docSnap) => {
        const data = docSnap.data() as any
        const storageRaw = data.storage ?? {}
        let storage: SavedRosterUpload['storage']
        if (storageRaw?.kind === 'bucket' && typeof storageRaw.objectPath === 'string') {
          storage = { kind: 'bucket', objectPath: storageRaw.objectPath }
        } else {
          const inlineSource =
            typeof storageRaw?.data === 'string'
              ? storageRaw.data
              : typeof data.inlineData === 'string'
              ? data.inlineData
              : ''
          storage = { kind: 'inline', data: inlineSource }
        }
        rows.push({
          id: docSnap.id,
          filename: data.filename ?? 'Roster upload',
          period: data.period ?? null,
          quarter: data.quarter ?? null,
          testName: data.testName ?? null,
          createdAt: data.createdAt?.toDate?.() ?? null,
          size: typeof data.size === 'number' ? data.size : null,
          storage,
          storageWarning: data.storageWarning ?? null,
          inlineData:
            typeof data.inlineData === 'string'
              ? data.inlineData
              : typeof storageRaw?.data === 'string'
              ? storageRaw.data
              : null
        })
      })
      setUploads(rows)
      uploadsLoaded = true
      done()
    })

    return () => {
      unsubscribeAssessments()
      unsubscribeSummaries()
      unsubscribeStudents()
      unsubscribeUploads()
    }
  }, [user])

  const groupResult = useMemo(() => buildGroupInsights(records, summaries[0] ?? null), [records, summaries])
  const groupInsights = groupResult.groups
  const pedagogicalGuidance = groupResult.pedagogy

  useEffect(() => {
    if (!user || loading) return
    hasPendingSync.current = true
  }, [user, loading, records, summaries, students, uploads, groupInsights, pedagogicalGuidance])

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

  const aiContext = useMemo(
    () =>
      buildRosterAIContext({
        insights: computeInsights,
        summaries,
        records,
        groupInsights,
        pedagogy: pedagogicalGuidance,
        students
      }),
    [computeInsights, summaries, records, groupInsights, pedagogicalGuidance, students]
  )

  const saveSnapshot = useCallback(async (): Promise<boolean> => {
    if (!user) return false

    if (savingRef.current) {
      hasPendingSync.current = true
      return true
    }

    const snapshotRecords = records
    const snapshotSummaries = summaries
    const snapshotStudents = students
    const snapshotGroups = groupInsights
    const snapshotPedagogy = pedagogicalGuidance

    const hasData =
      snapshotRecords.length > 0 ||
      snapshotSummaries.length > 0 ||
      snapshotStudents.length > 0 ||
      uploads.length > 0

    if (!hasData) {
      hasPendingSync.current = false
      setSyncStatus('idle')
      return true
    }

    savingRef.current = true
    setSyncStatus('saving')
    setSyncError(null)

    try {
      const nowIso = new Date().toISOString()
      const docRef = doc(db, `users/${user.uid}/workspace_cache/rosterSnapshot`)
      const scored = snapshotRecords
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

      const metricsRef = doc(db, `users/${user.uid}/dashboard_stats/metrics`)
      const metricsSnap = await getDoc(metricsRef)
      const previousRosterGroupCount = metricsSnap.exists()
        ? Number(metricsSnap.data()?.rosterGroupCount ?? metricsSnap.data()?.groupCount ?? 0)
        : 0
      const foundationGroup = snapshotGroups.find((group) => group.id === 'foundation')
      const nonFoundationCount = snapshotGroups
        .filter((group) => group.id !== 'foundation')
        .reduce((total, group) => total + group.studentCount, 0)

      const isAssessmentEntry = (
        entry: SavedAssessment | StudentRosterRecord
      ): entry is SavedAssessment => (entry as SavedAssessment).score !== undefined

      const recentRosterEntries = (snapshotRecords.length ? snapshotRecords : snapshotStudents)
        .slice(0, 20)
        .map((entry) => {
          if (isAssessmentEntry(entry)) {
            return {
              name: entry.displayName,
              score: entry.score,
              testName: entry.testName,
              period: entry.period,
              quarter: entry.quarter,
              sheetRow: entry.sheetRow ?? null,
              uploadedAt: entry.createdAt ? entry.createdAt.toISOString() : null
            }
          }

          return {
            name: entry.displayName,
            score: entry.lastScore ?? null,
            testName: entry.lastAssessment ?? null,
            period: entry.period ?? null,
            quarter: entry.quarter ?? null,
            sheetRow: entry.lastSheetRow ?? null,
            uploadedAt: entry.updatedAt ? entry.updatedAt.toISOString() : null
          }
        })

      await Promise.all([
        setDoc(
          docRef,
          {
            lastClientSyncAt: nowIso,
            updatedAt: serverTimestamp(),
            stats: {
              totalAssessments: snapshotRecords.length,
              totalSummaries: snapshotSummaries.length,
              totalStudents: snapshotStudents.length
            },
            latestAssessment: snapshotSummaries[0]
              ? {
                  id: snapshotSummaries[0].id,
                  testName: snapshotSummaries[0].testName,
                  period: snapshotSummaries[0].period,
                  quarter: snapshotSummaries[0].quarter,
                  studentCount: snapshotSummaries[0].studentCount,
                  averageScore: snapshotSummaries[0].averageScore,
                  maxScore: snapshotSummaries[0].maxScore,
                  minScore: snapshotSummaries[0].minScore,
                  updatedAt: snapshotSummaries[0].updatedAt
                    ? snapshotSummaries[0].updatedAt.toISOString()
                    : null
                }
              : null,
            highlights: {
              topStudents: top,
              needsSupport: bottom
            },
            groupInsights: snapshotGroups.map((group) => ({
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
            pedagogy: snapshotPedagogy
              ? {
                  summary: snapshotPedagogy.summary,
                  bestPractices: snapshotPedagogy.bestPractices,
                  reflectionPrompts: snapshotPedagogy.reflectionPrompts
                }
              : null,
            recentStudents: recentRosterEntries
          },
          { merge: true }
        ),
        setDoc(
          metricsRef,
          {
            totalEnrollment: snapshotStudents.length,
            lastClientSyncAt: nowIso,
            rosterGroupCount: snapshotGroups.length,
            rosterGroupDelta: snapshotGroups.length - previousRosterGroupCount,
            onTrack: nonFoundationCount,
            atRisk: foundationGroup?.studentCount ?? 0,
            latestAssessment: snapshotSummaries[0]
              ? {
                  testName: snapshotSummaries[0].testName,
                  period: snapshotSummaries[0].period,
                  quarter: snapshotSummaries[0].quarter,
                  studentCount: snapshotSummaries[0].studentCount,
                  averageScore: snapshotSummaries[0].averageScore,
                  maxScore: snapshotSummaries[0].maxScore,
                  minScore: snapshotSummaries[0].minScore,
                  updatedAt: snapshotSummaries[0].updatedAt
                    ? snapshotSummaries[0].updatedAt.toISOString()
                    : null
                }
              : null
          },
          { merge: true }
        )
      ])

      hasPendingSync.current = false
      setSyncStatus('idle')
      setLastSyncedAt(new Date())
      return true
    } catch (error: any) {
      console.error('Failed to sync roster snapshot', error)
      setSyncStatus('error')
      setSyncError(error?.message ?? 'Unable to sync roster snapshot')
      hasPendingSync.current = true
      return false
    } finally {
      savingRef.current = false
    }
  }, [
    user,
    records,
    summaries,
    students,
    uploads,
    groupInsights,
    pedagogicalGuidance
  ])

  useEffect(() => {
    if (!user) return
    const interval = setInterval(() => {
      if (hasPendingSync.current && !savingRef.current) {
        void saveSnapshot()
      }
    }, 15000)
    return () => clearInterval(interval)
  }, [saveSnapshot, user])

  useEffect(() => {
    if (!user || loading) return
    if (!hasPendingSync.current || savingRef.current) return
    void saveSnapshot()
  }, [
    user,
    loading,
    records,
    summaries,
    students,
    uploads,
    groupInsights,
    pedagogicalGuidance,
    saveSnapshot
  ])

  const value = useMemo<RosterDataContextValue>(
    () => ({
      loading,
      records,
      summaries,
      students,
      uploads,
      insights: computeInsights,
      groupInsights,
      pedagogy: pedagogicalGuidance,
      aiContext,
      syncStatus,
      syncError,
      lastSyncedAt,
      triggerSync: async () => saveSnapshot()
    }),
    [
      loading,
      records,
      summaries,
      students,
      uploads,
      computeInsights,
      groupInsights,
      pedagogicalGuidance,
      aiContext,
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
