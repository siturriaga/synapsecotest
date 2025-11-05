import type { SavedAssessment, StudentRosterRecord } from '../types/roster'

export type StudentPeriodLookup = Map<string, string | null>

export type LatestStudentScoreEntry = {
  studentId: string | null
  displayName: string | null
  period: string | null
  score: number
  testName: string | null
}

export function buildStudentPeriodLookup(students: StudentRosterRecord[]): StudentPeriodLookup {
  const map: StudentPeriodLookup = new Map()
  students.forEach((student) => {
    const period = student.period != null ? String(student.period) : null
    if (student.id) {
      map.set(student.id, period)
    }
    const displayName = student.displayName?.trim()
    if (displayName) {
      map.set(displayName, period)
    }
    if (Array.isArray(student.nameVariants)) {
      student.nameVariants.forEach((variant) => {
        const trimmed = typeof variant === 'string' ? variant.trim() : ''
        if (trimmed) {
          map.set(trimmed, period)
        }
      })
    }
  })
  return map
}

export function buildLatestScoresByStudent(
  records: SavedAssessment[],
  studentPeriodLookup: StudentPeriodLookup,
  students: StudentRosterRecord[] = []
): Map<string, LatestStudentScoreEntry> {
  const map = new Map<string, LatestStudentScoreEntry>()
  const aliasToId = new Map<string, string | null>()
  const fallbackEntriesByAlias = new Map<string, Set<string>>()

  const normalise = (value: unknown) => (typeof value === 'string' ? value.trim() : '')

  const registerAlias = (aliasValue: unknown, studentIdValue: unknown) => {
    const alias = normalise(aliasValue)
    const studentId = normalise(studentIdValue)
    if (!alias || !studentId) {
      return
    }
    if (!aliasToId.has(alias)) {
      aliasToId.set(alias, studentId)
      return
    }
    const current = aliasToId.get(alias)
    if (current === studentId || current === null) {
      return
    }
    aliasToId.set(alias, null)
  }

  const trackFallbackForAlias = (aliasValue: string | null, key: string) => {
    const alias = normalise(aliasValue)
    if (!alias) {
      return
    }
    const existing = fallbackEntriesByAlias.get(alias)
    if (existing) {
      existing.add(key)
    } else {
      fallbackEntriesByAlias.set(alias, new Set([key]))
    }
  }

  students.forEach((student) => {
    registerAlias(student.displayName, student.id)
    if (Array.isArray(student.nameVariants)) {
      student.nameVariants.forEach((variant) => registerAlias(variant, student.id))
    }
  })

  const sortedRecords = [...records].sort((a, b) => {
    const timeA = a.createdAt ? a.createdAt.getTime() : 0
    const timeB = b.createdAt ? b.createdAt.getTime() : 0
    return timeB - timeA
  })

  sortedRecords.forEach((record) => {
    if (typeof record.score !== 'number') {
      return
    }

    const studentIdValue = normalise(record.studentId)
    const studentId = studentIdValue || null
    const displayNameValue = normalise(record.displayName)
    const displayName = displayNameValue || null
    const recordKeyValue = normalise(record.id)
    const recordKey = recordKeyValue || null

    if (studentId && displayName) {
      registerAlias(displayName, studentId)
    }

    let period: string | null = null
    if (record.period !== null && record.period !== undefined) {
      period = String(record.period)
    } else if (studentId && studentPeriodLookup.has(studentId)) {
      period = studentPeriodLookup.get(studentId) ?? null
    } else if (displayName && studentPeriodLookup.has(displayName)) {
      period = studentPeriodLookup.get(displayName) ?? null
    }

    const entry: LatestStudentScoreEntry = {
      studentId,
      displayName,
      period,
      score: record.score,
      testName: record.testName ?? null
    }

    if (studentId) {
      if (displayName) {
        const resolvedAlias = aliasToId.get(displayName)
        if (resolvedAlias === studentId) {
          const fallbackKeys = fallbackEntriesByAlias.get(displayName)
          if (fallbackKeys && fallbackKeys.size) {
            fallbackKeys.forEach((key) => {
              const previousEntry = map.get(key)
              map.delete(key)
              if (!previousEntry || map.has(studentId)) {
                return
              }
              map.set(studentId, { ...previousEntry, studentId })
            })
            fallbackEntriesByAlias.delete(displayName)
          }
        } else if (resolvedAlias === null) {
          fallbackEntriesByAlias.delete(displayName)
        }
      }
      if (map.has(studentId)) {
        return
      }
      map.set(studentId, entry)
      return
    }

    if (displayName) {
      const mappedId = aliasToId.get(displayName)
      if (typeof mappedId === 'string') {
        if (!map.has(mappedId)) {
          map.set(mappedId, { ...entry, studentId: mappedId })
        }
        return
      }
    }

    const fallbackKey =
      recordKey ??
      `${displayName ?? 'student'}::${record.testName ?? ''}::${record.createdAt ? record.createdAt.getTime() : 0}::${
        record.score
      }`
    if (!fallbackKey) {
      return
    }
    if (map.has(fallbackKey)) {
      return
    }
    map.set(fallbackKey, entry)
    if (displayName) {
      trackFallbackForAlias(displayName, fallbackKey)
    }
  })

  return map
}
