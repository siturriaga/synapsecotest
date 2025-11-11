import React, { useEffect, useMemo, useState } from 'react';
import { collection, doc, getDoc, onSnapshot, orderBy, query } from 'firebase/firestore';
import { useAuth } from '../components/AuthProvider';
import { firestore } from '../utils/firebaseClient';
import { safeFetch } from '../utils/safeFetch';

type AssignmentItem = {
  type: 'mcq' | 'short' | 'mixed';
  stem: string;
  options?: string[];
  answerIndex?: number;
};

type Assignment = {
  id?: string;
  title: string;
  standardCode: string;
  items: AssignmentItem[];
  gradeLevel: string;
  createdAt: string;
};

const Assignments: React.FC = () => {
  const { user } = useAuth();
  const [standards, setStandards] = useState<string[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [formState, setFormState] = useState({
    title: '',
    gradeLevel: '',
    questionCount: 5,
    type: 'mixed'
  });
  const [selectedStandard, setSelectedStandard] = useState('');
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [generated, setGenerated] = useState<Assignment | null>(null);

  useEffect(() => {
    if (!user) return;
    const standardsRef = doc(firestore, 'users', user.uid, 'settings', 'standards');
    getDoc(standardsRef).then((snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        if (Array.isArray(data.codes)) {
          setStandards(data.codes as string[]);
          setSelectedStandard((data.codes as string[])[0] ?? '');
        }
      }
    });
  }, [user]);

  useEffect(() => {
    if (!user) return;
    const assignmentsRef = collection(firestore, 'users', user.uid, 'assignments');
    const q = query(assignmentsRef, orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs: Assignment[] = snapshot.docs.map((docSnap) => ({ id: docSnap.id, ...(docSnap.data() as Assignment) }));
      setAssignments(docs);
    });
    return () => unsubscribe();
  }, [user]);

  if (!user) {
    return null;
  }

  const handleGenerate = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus(null);
    setError(null);
    if (!selectedStandard) {
      setError('Select at least one standard before generating.');
      return;
    }

    try {
      const payload = {
        title: formState.title,
        gradeLevel: formState.gradeLevel,
        questionCount: formState.questionCount,
        type: formState.type,
        standards: [selectedStandard]
      };
      const assignment = await safeFetch('/api/generateAssignment', {
        method: 'POST',
        body: JSON.stringify(payload)
      });
      setGenerated(assignment);
      setStatus('Assignment generated and saved.');
    } catch (generationError) {
      if (generationError instanceof Error) {
        setError(generationError.message);
      } else {
        setError('Failed to generate assignment.');
      }
    }
  };

  const downloadAssignment = (assignment: Assignment) => {
    const blob = new Blob([JSON.stringify(assignment, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `${assignment.title || 'assignment'}.json`;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  return (
    <section className="space-y-4">
      <h2 className="text-lg font-semibold">Assignments</h2>
      <form className="space-y-3" onSubmit={handleGenerate}>
        <label className="flex flex-col text-sm">
          Title
          <input
            className="border px-2 py-1"
            value={formState.title}
            onChange={(event) => setFormState((prev) => ({ ...prev, title: event.target.value }))}
          />
        </label>
        <label className="flex flex-col text-sm">
          Grade level
          <input
            className="border px-2 py-1"
            value={formState.gradeLevel}
            onChange={(event) => setFormState((prev) => ({ ...prev, gradeLevel: event.target.value }))}
          />
        </label>
        <label className="flex flex-col text-sm">
          Question count
          <input
            className="border px-2 py-1"
            type="number"
            min={1}
            value={formState.questionCount}
            onChange={(event) => setFormState((prev) => ({ ...prev, questionCount: Number(event.target.value) }))}
          />
        </label>
        <label className="flex flex-col text-sm">
          Item type
          <select
            className="border px-2 py-1"
            value={formState.type}
            onChange={(event) => setFormState((prev) => ({ ...prev, type: event.target.value }))}
          >
            <option value="mcq">Multiple choice</option>
            <option value="short">Short response</option>
            <option value="mixed">Mixed</option>
          </select>
        </label>
        <label className="flex flex-col text-sm">
          Standard
          <select
            className="border px-2 py-1"
            value={selectedStandard}
            onChange={(event) => setSelectedStandard(event.target.value)}
          >
            <option value="">Select…</option>
            {standards.map((code) => (
              <option key={code} value={code}>
                {code}
              </option>
            ))}
          </select>
        </label>
        <button className="px-3 py-1 border rounded" type="submit">
          Generate assignment
        </button>
      </form>
      {status && <div className="text-green-700">{status}</div>}
      {error && <div className="text-red-700">{error}</div>}

      {generated && (
        <div className="border rounded p-3">
          <h3 className="font-semibold">Most recent response</h3>
          <pre className="text-xs whitespace-pre-wrap bg-slate-100 p-2 mt-2 rounded">
            {JSON.stringify(generated, null, 2)}
          </pre>
          <button className="mt-2 px-3 py-1 border rounded" onClick={() => downloadAssignment(generated)}>
            Save JSON
          </button>
        </div>
      )}

      <section className="space-y-2">
        <h3 className="font-semibold">Saved assignments</h3>
        {assignments.length === 0 ? (
          <p className="text-sm text-slate-600">No assignments yet. Generate one above.</p>
        ) : (
          assignments.map((assignment) => (
            <article key={assignment.id} className="border rounded p-3 space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold">{assignment.title}</h4>
                  <p className="text-xs text-slate-600">
                    {assignment.standardCode} • {new Date(assignment.createdAt).toLocaleString()}
                  </p>
                </div>
                <button className="px-3 py-1 border rounded" onClick={() => downloadAssignment(assignment)}>
                  Save JSON
                </button>
              </div>
              <pre className="text-xs whitespace-pre-wrap bg-slate-100 p-2 rounded">
                {JSON.stringify(assignment, null, 2)}
              </pre>
            </article>
          ))
        )}
      </section>
    </section>
  );
};

export default Assignments;
