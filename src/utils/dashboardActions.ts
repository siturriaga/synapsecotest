import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  getFirestore,
  limit as limitDocs,
  query,
  writeBatch,
  type Firestore,
  type DocumentReference
} from 'firebase/firestore'
import { ensureFirebase } from '../firebase'

function getDatabase(): Firestore | null {
  const { app } = ensureFirebase()
  return app ? getFirestore(app) : null
}
async function clearCollection(path: string, database: Firestore | null = getDatabase()) {
  if (!database) {
    console.warn(`Firestore unavailable. Skipping collection clear for ${path}.`)
    return
  }
  const target = collection(database, path)
  // Firestore write batches are limited to 500 operations. Loop until the
  // collection is empty, deleting documents in chunks that respect that cap.
  while (true) {
    const snapshot = await getDocs(query(target, limitDocs(500)))
    if (snapshot.empty) return

    const batch = writeBatch(database)
    snapshot.docs.forEach((docSnap) => {
      batch.delete(docSnap.ref)
    })
    await batch.commit()
  }
}

async function clearDocument(ref: DocumentReference | null) {
  if (!ref) {
    return
  }
  try {
    await deleteDoc(ref)
  } catch (error) {
    console.error('Failed to delete document', ref.path, error)
  }
}

export async function clearDashboardMetrics(userId: string) {
  const database = getDatabase()
  if (!database) {
    console.warn('Firestore unavailable. Cannot clear dashboard metrics.')
    return
  }
  await clearDocument(doc(database, `users/${userId}/dashboard_stats/metrics`))
}

export async function clearLogs(userId: string) {
  await clearCollection(`users/${userId}/logs`)
}

export async function clearAssignments(userId: string) {
  await clearCollection(`users/${userId}/assignments`)
}

export async function clearAssessmentSummaries(userId: string) {
  await clearCollection(`users/${userId}/assessments_summary`)
}

export async function clearAssessments(userId: string) {
  await clearCollection(`users/${userId}/assessments`)
}

export async function clearStudents(userId: string) {
  await clearCollection(`users/${userId}/students`)
}

export async function clearUploads(userId: string) {
  await clearCollection(`users/${userId}/uploads`)
}

export async function clearWorkspaceCache(userId: string) {
  const database = getDatabase()
  if (!database) {
    console.warn('Firestore unavailable. Cannot clear workspace cache.')
    return
  }
  await clearDocument(doc(database, `users/${userId}/workspace_cache/rosterSnapshot`))
  await clearDocument(doc(database, `users/${userId}/workspace_cache/groupInsights`))
}

export async function clearRosterData(userId: string) {
  await Promise.all([
    clearAssessments(userId),
    clearAssessmentSummaries(userId),
    clearStudents(userId),
    clearUploads(userId),
    clearWorkspaceCache(userId)
  ])
}

export async function clearAllUserData(userId: string) {
  await Promise.all([
    clearDashboardMetrics(userId),
    clearLogs(userId),
    clearAssignments(userId),
    clearRosterData(userId)
  ])
}

