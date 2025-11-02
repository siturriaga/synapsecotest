import { useEffect, useState } from 'react'
import type { User } from 'firebase/auth'
import {
  Timestamp,
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  updateDoc
} from 'firebase/firestore'
import { db } from '../firebase'

interface AssignmentsPageProps {
  user: User | null
}

type Assignment = {
  id: string
  title: string
  standardCode: string
  tier: 'emerging' | 'on-level' | 'accelerated'
  dueDate?: string
  status: 'draft' | 'assigned' | 'completed'
}

export default function AssignmentsPage({ user }: AssignmentsPageProps) {
  const [assignments, setAssignments] = useState<Assignment[]>([])
  const [title, setTitle] = useState('')
  const [standardCode, setStandardCode] = useState('MA.7.AR.1.1')
  const [tier, setTier] = useState<Assignment['tier']>('emerging')
  const [dueDate, setDueDate] = useState('')
  const [statusMessage, setStatusMessage] = useState<string>('')

  useEffect(() => {
    if (!user) {
      setAssignments([])
      return
    }
    const q = collection(db, `users/${user.uid}/assignments`)
    const unsub = onSnapshot(q, (snap) => {
      const rows: Assignment[] = []
      snap.forEach((docSnap) => {
        const data = docSnap.data() as any
        rows.push({
          id: docSnap.id,
          title: data.title,
          standardCode: data.standardCode,
          tier: data.tier || 'emerging',
          dueDate: data.dueDate,
          status: data.status || 'draft'
        })
      })
      setAssignments(rows)
    })
    return () => unsub()
  }, [user])

  async function createAssignment(event: React.FormEvent) {
    event.preventDefault()
    if (!user) return
    if (!title.trim()) {
      setStatusMessage('Title is required.')
      return
    }
    await addDoc(collection(db, `users/${user.uid}/assignments`), {
      title,
      standardCode,
      tier,
      status: 'draft',
      dueDate: dueDate || null,
      createdAt: Timestamp.now()
    })
    setTitle('')
    setDueDate('')
    setStatusMessage('Assignment created.')
  }

  async function updateStatus(id: string, status: Assignment['status']) {
    if (!user) return
    await updateDoc(doc(db, `users/${user.uid}/assignments/${id}`), { status })
    setStatusMessage('Status updated.')
  }

  async function removeAssignment(id: string) {
    if (!user) return
    await deleteDoc(doc(db, `users/${user.uid}/assignments/${id}`))
    setStatusMessage('Assignment deleted.')
  }

  if (!user) {
    return (
      <div className="glass-card fade-in">
        <h2 style={{ margin: 0, fontSize: 26, fontWeight: 800 }}>Authenticate to manage assignments</h2>
        <p style={{ color: 'var(--text-muted)' }}>
          Assignments are stored securely within your Firestore workspace scope.
        </p>
      </div>
    )
  }

  return (
    <div className="fade-in" style={{ display: 'grid', gap: 24 }}>
      <section className="glass-card">
        <div className="badge">Create assignment</div>
        <h2 style={{ margin: '12px 0 6px', fontSize: 28, fontWeight: 800 }}>Launch differentiated tasks</h2>
        <form onSubmit={createAssignment}>
          <div className="field">
            <label htmlFor="assignment-title">Title</label>
            <input
              id="assignment-title"
              name="assignment-title"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              required
            />
          </div>
          <div className="field">
            <label htmlFor="assignment-standard">Standard code</label>
            <input
              id="assignment-standard"
              name="assignment-standard"
              value={standardCode}
              onChange={(event) => setStandardCode(event.target.value)}
              required
            />
          </div>
          <div className="field">
            <label htmlFor="assignment-tier">Tier</label>
            <select
              id="assignment-tier"
              name="assignment-tier"
              value={tier}
              onChange={(event) => setTier(event.target.value as Assignment['tier'])}
            >
              <option value="emerging">Emerging</option>
              <option value="on-level">On-level</option>
              <option value="accelerated">Accelerated</option>
            </select>
          </div>
          <div className="field">
            <label htmlFor="assignment-due">Due date</label>
            <input
              id="assignment-due"
              name="assignment-due"
              type="date"
              value={dueDate}
              onChange={(event) => setDueDate(event.target.value)}
            />
          </div>
          <button type="submit" className="primary">Create assignment</button>
        </form>
        {statusMessage && <p style={{ marginTop: 12, color: 'var(--text-muted)' }}>{statusMessage}</p>}
      </section>

      <section className="glass-card">
        <h3 style={{ margin: 0, fontSize: 24, fontWeight: 700 }}>Assignment tracker</h3>
        {assignments.length === 0 ? (
          <div className="empty-state">Create an assignment to populate this table.</div>
        ) : (
          <table className="table" style={{ marginTop: 16 }}>
            <thead>
              <tr>
                <th>Title</th>
                <th>Standard</th>
                <th>Tier</th>
                <th>Due date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {assignments.map((assignment) => (
                <tr key={assignment.id}>
                  <td>{assignment.title}</td>
                  <td>{assignment.standardCode}</td>
                  <td style={{ textTransform: 'capitalize' }}>{assignment.tier.replace('-', ' ')}</td>
                  <td>{assignment.dueDate ? new Date(assignment.dueDate).toLocaleDateString() : '—'}</td>
                  <td style={{ textTransform: 'capitalize' }}>{assignment.status}</td>
                  <td style={{ display: 'flex', gap: 8 }}>
                    <button className="secondary" onClick={() => updateStatus(assignment.id, 'assigned')}>Mark assigned</button>
                    <button className="secondary" onClick={() => updateStatus(assignment.id, 'completed')}>Mark complete</button>
                    <button className="secondary" onClick={() => removeAssignment(assignment.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  )
}
