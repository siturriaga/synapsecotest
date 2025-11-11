import React, { useCallback, useEffect, useMemo, useState } from 'react';
import type { User } from 'firebase/auth';
import { safeFetch } from '../utils/safeFetch';
import type { Assignment } from '../types/assignment';
import type { Standard } from '../types/standards';
import AssignmentForm from '../components/AssignmentForm';
import AssignmentList from '../components/AssignmentList';
import AssignmentViewer from '../components/AssignmentViewer';

interface AssignmentsPageProps {
  user: User;
}

type StandardsResponse = {
  ok: boolean;
  standards?: Standard[];
  error?: string;
};

type AssignmentsResponse = {
  ok: boolean;
  assignments?: Assignment[];
  error?: string;
};

type GenerateResponse = {
  ok: boolean;
  assignment?: Assignment;
  mockUsed?: boolean;
  warnings?: string[];
  error?: string;
};

type SaveResponse = {
  ok: boolean;
  assignment?: Assignment;
  error?: string;
};

const AssignmentsPage: React.FC<AssignmentsPageProps> = ({ user }) => {
  const [standards, setStandards] = useState<Standard[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selected, setSelected] = useState<Assignment | null>(null);
  const [loadingAssignments, setLoadingAssignments] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [banner, setBanner] = useState<string | null>(null);

  const fetchStandards = useCallback(async () => {
    const result = await safeFetch<StandardsResponse>('/api/getStandards');
    if (result.ok && result.data?.ok && result.data.standards) {
      setStandards(result.data.standards);
    } else {
      setError(result.data?.error ?? result.error ?? 'Unable to load standards.');
    }
  }, []);

  const fetchAssignments = useCallback(async () => {
    setLoadingAssignments(true);
    const result = await safeFetch<AssignmentsResponse>('/api/getAssignments');
    if (result.ok && result.data?.ok && result.data.assignments) {
      const sorted = [...result.data.assignments].sort((a, b) => b.createdAt - a.createdAt);
      setAssignments(sorted);
      if (sorted.length > 0) {
        setSelected(sorted[0]);
        setSelectedId(sorted[0].id ?? null);
      } else {
        setSelected(null);
        setSelectedId(null);
      }
    } else {
      setError(result.data?.error ?? result.error ?? 'Unable to load assignments.');
    }
    setLoadingAssignments(false);
  }, []);

  useEffect(() => {
    fetchStandards();
    fetchAssignments();
  }, [fetchAssignments, fetchStandards, user.uid]);

  const handleGenerated = useCallback(
    async (payload: { title: string; standardCode: string; questionCount: number; type: string; }) => {
      setError(null);
      setBanner(null);
      const generateResult = await safeFetch<GenerateResponse>('/api/generateAssignment', {
        method: 'POST',
        body: JSON.stringify(payload)
      });

      if (!generateResult.ok || !generateResult.data?.ok || !generateResult.data.assignment) {
        setError(generateResult.data?.error ?? generateResult.error ?? 'Unable to generate assignment.');
        return;
      }

      const generatedAssignment = generateResult.data.assignment;
      setSelected(generatedAssignment);
      setSelectedId(generatedAssignment.id ?? null);

      if (generateResult.data.mockUsed) {
        setBanner('Using mock Gemini output until a valid GEMINI_API_KEY is configured.');
      } else if (generateResult.data.warnings && generateResult.data.warnings.length > 0) {
        setBanner(generateResult.data.warnings[0]);
      }

      const saveResult = await safeFetch<SaveResponse>('/api/saveAssignment', {
        method: 'POST',
        body: JSON.stringify({ assignment: generatedAssignment })
      });

      if (!saveResult.ok || !saveResult.data?.ok || !saveResult.data.assignment) {
        setError(saveResult.data?.error ?? saveResult.error ?? 'Unable to save assignment. The generated draft is still visible.');
        return;
      }

      const savedAssignment = saveResult.data.assignment;
      if (!savedAssignment) {
        setError('Assignment saved without a payload.');
        return;
      }

      setAssignments((prev) => [savedAssignment, ...prev]);
      setSelected(savedAssignment);
      setSelectedId(savedAssignment.id ?? null);
    },
    []
  );

  const onSelectAssignment = useCallback((assignment: Assignment) => {
    setSelected(assignment);
    setSelectedId(assignment.id ?? null);
  }, []);

  const standardsMap = useMemo(() => new Map(standards.map((standard) => [standard.code, standard.label])), [standards]);

  const selectedStandardLabel = selected?.standardCode
    ? standardsMap.get(selected.standardCode) ?? selected.standardCode
    : undefined;

  return (
    <section className="space-y-4">
      <p className="text-sm text-slate-600">Signed in as {user.email ?? user.displayName ?? 'teacher'}.</p>
      {banner && <div className="rounded border border-amber-300 bg-amber-50 p-3 text-sm text-amber-900">{banner}</div>}
      {error && <div className="rounded border border-red-200 bg-red-50 p-3 text-sm text-red-800">{error}</div>}

      <AssignmentForm standards={standards} onGenerate={handleGenerated} />

      <div className="grid gap-6 md:grid-cols-2">
        <AssignmentList
          assignments={assignments}
          onSelect={onSelectAssignment}
          selectedId={selectedId}
          refreshing={loadingAssignments}
          onRefresh={fetchAssignments}
          standardsMap={standardsMap}
        />
        <AssignmentViewer assignment={selected} standardsMap={standardsMap} selectedStandardLabel={selectedStandardLabel} />
      </div>
    </section>
  );
};

export default AssignmentsPage;
