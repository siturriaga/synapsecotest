import { useEffect, useMemo, useState } from 'react'
import type { User } from 'firebase/auth'
import { collection, getFirestore, onSnapshot, orderBy, query } from 'firebase/firestore'
import { ensureFirebase } from '../firebase'

export type WorkspaceGroupStudent = {
  id: string
  name: string
  readiness: string | null
  period: number | null
  quarter: string | null
  score: number | null
}

export type WorkspaceGroup = {
  id: string
  name: string
  rationale: string
  students: WorkspaceGroupStudent[]
  mode: 'heterogeneous' | 'homogeneous' | null
  refinement: string | null
  source: 'gemini' | 'heuristic' | null
  createdAt: Date | null
}

export type GroupInsightsSummary = {
  totalGroups: number
  totalStudents: number
  readinessBreakdown: {
    extending: number
    developing: number
    foundation: number
    unknown: number
  }
  coveragePercent: number | null
  lastGeneratedAt: Date | null
}

export type LatestGroupingRun = {
  mode: 'heterogeneous' | 'homogeneous' | null
  refinement: string | null
  source: 'gemini' | 'heuristic' | null
  createdAt: Date | null
}

function toGroup(doc: any, id: string): WorkspaceGroup {
  const rawStudents = Array.isArray(doc?.students) ? doc.students : []
  const students: WorkspaceGroupStudent[] = rawStudents
    .map((student: unknown, index: number) => {
      if (!student || typeof student !== 'object') {
        return null
      }
      const data = student as Record<string, unknown>
      const name = typeof data.name === 'string' && data.name.trim() ? data.name.trim() : `Learner ${index + 1}`
      return {
        id: typeof data.id === 'string' && data.id.trim() ? data.id.trim() : `${id}-student-${index + 1}`,
        name,
        readiness: typeof data.readiness === 'string' ? data.readiness : null,
        period:
          typeof data.period === 'number'
            ? data.period
            : typeof data.period === 'string'
            ? Number.parseInt(data.period, 10) || null
            : null,
        quarter: typeof data.quarter === 'string' ? data.quarter : null,
        score:
          typeof data.score === 'number'
            ? data.score
            : typeof data.score === 'string'
            ? Number.parseFloat(data.score)
            : null
      }
    })
    .filter((student: WorkspaceGroupStudent | null): student is WorkspaceGroupStudent => Boolean(student))

  return {
    id,
    name: typeof doc?.name === 'string' && doc.name.trim() ? doc.name.trim() : 'Instructional group',
    rationale:
      typeof doc?.rationale === 'string' && doc.rationale.trim()
        ? doc.rationale.trim()
        : 'Group rationale unavailable.',
    students,
    mode:
      doc?.mode === 'homogeneous'
        ? 'homogeneous'
        : doc?.mode === 'heterogeneous'
        ? 'heterogeneous'
        : null,
    refinement: typeof doc?.refinement === 'string' ? doc.refinement : null,
    source: doc?.source === 'heuristic' ? 'heuristic' : 'gemini',
    createdAt: doc?.createdAt?.toDate?.() ?? null
  }
}

export function useWorkspaceGroups(user: User | null) {
  const [groups, setGroups] = useState<WorkspaceGroup[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!user) {
      setGroups([])
      setLoading(false)
      return
    }

    const { app } = ensureFirebase()
    if (!app) {
      console.warn('Firestore unavailable. Workspace groups cannot be loaded.')
      setGroups([])
      setLoading(false)
      return
    }

    setLoading(true)
    const database = getFirestore(app)
    const groupsQuery = query(collection(database, `users/${user.uid}/groups`), orderBy('createdAt', 'desc'))
    const unsubscribe = onSnapshot(groupsQuery, (snapshot) => {
      const rows: WorkspaceGroup[] = []
      snapshot.forEach((docSnap) => {
        rows.push(toGroup(docSnap.data(), docSnap.id))
      })
      setGroups(rows)
      setLoading(false)
    })
    return () => unsubscribe()
  }, [user])

  const insights = useMemo<GroupInsightsSummary | null>(() => {
    if (!groups.length) return null
    const readinessBreakdown = {
      extending: 0,
      developing: 0,
      foundation: 0,
      unknown: 0
    }
    const seen = new Set<string>()
    let withReadiness = 0

    groups.forEach((group) => {
      group.students.forEach((student) => {
        if (student.id) {
          seen.add(student.id)
        }
        if (typeof student.readiness === 'string') {
          const value = student.readiness.toLowerCase()
          if (value.includes('extend')) {
            readinessBreakdown.extending += 1
          } else if (value.includes('develop')) {
            readinessBreakdown.developing += 1
          } else if (value.includes('foundation')) {
            readinessBreakdown.foundation += 1
          } else {
            readinessBreakdown.unknown += 1
          }
          withReadiness += 1
        } else {
          readinessBreakdown.unknown += 1
        }
      })
    })

    const totalStudents = seen.size || withReadiness
    const lastGeneratedAt = groups.reduce<Date | null>((latest, group) => {
      if (!group.createdAt) return latest
      if (!latest || group.createdAt > latest) {
        return group.createdAt
      }
      return latest
    }, null)

    const coveragePercent = seen.size > 0 ? Math.min(100, Math.round((withReadiness / seen.size) * 100)) : null

    return {
      totalGroups: groups.length,
      totalStudents,
      readinessBreakdown,
      coveragePercent,
      lastGeneratedAt
    }
  }, [groups])

  const latestRun = useMemo<LatestGroupingRun | null>(() => {
    if (!groups.length) return null
    const latest = groups[0]
    return {
      mode: latest.mode,
      refinement: latest.refinement,
      source: latest.source,
      createdAt: latest.createdAt
    }
  }, [groups])

  return {
    groups,
    loading,
    insights,
    latestRun
  }
}
