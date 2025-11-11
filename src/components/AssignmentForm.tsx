import React, { useEffect, useMemo, useState } from 'react';
import { parse, serialize } from 'cookie';
import type { Standard } from '../types/standards';

type AssignmentPayload = {
  title: string;
  standardCode: string;
  questionCount: number;
  type: string;
};

interface AssignmentFormProps {
  standards: Standard[];
  onGenerate: (payload: AssignmentPayload) => Promise<void> | void;
}

const questionCounts = [5, 10, 15];

const cookieKey = 'synapse_standard_code';

const AssignmentForm: React.FC<AssignmentFormProps> = ({ standards, onGenerate }) => {
  const [title, setTitle] = useState('Civics Knowledge Check');
  const [questionCount, setQuestionCount] = useState<number>(questionCounts[0]);
  const [type, setType] = useState<'mcq' | 'short' | 'mixed'>('mixed');
  const [standardCode, setStandardCode] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    try {
      const stored = parse(document.cookie ?? '')[cookieKey];
      if (stored) {
        setStandardCode(stored);
      }
    } catch (error) {
      console.warn('Unable to read standard cookie', error);
    }
  }, []);

  useEffect(() => {
    if (!standardCode) return;
    try {
      document.cookie = serialize(cookieKey, standardCode, { path: '/', maxAge: 60 * 60 * 24 * 30 });
    } catch (error) {
      console.warn('Unable to persist standard cookie', error);
    }
  }, [standardCode]);

  const options = useMemo(() => standards.map((standard) => ({ value: standard.code, label: standard.label })), [standards]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    if (!standardCode) {
      setError('Choose a standard before generating.');
      return;
    }

    setSubmitting(true);
    try {
      await onGenerate({ title, questionCount, type, standardCode });
      setSuccess('Assignment generated and saved.');
    } catch (submissionError) {
      const message = submissionError instanceof Error ? submissionError.message : 'Unable to generate assignment.';
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="space-y-3 rounded border border-slate-200 bg-white p-4" onSubmit={handleSubmit}>
      <h2 className="text-base font-semibold">Generate a new assignment</h2>
      <label className="flex flex-col gap-1 text-sm">
        Title
        <input
          className="rounded border border-slate-300 px-3 py-2"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="Assignment title"
        />
      </label>
      <label className="flex flex-col gap-1 text-sm">
        Standard
        <select
          className="rounded border border-slate-300 px-3 py-2"
          value={standardCode}
          onChange={(event) => setStandardCode(event.target.value)}
        >
          <option value="">Select a standard…</option>
          {options.map((standard) => (
            <option key={standard.value} value={standard.value}>
              {standard.value} – {standard.label}
            </option>
          ))}
        </select>
      </label>
      <div className="grid gap-3 md:grid-cols-3">
        <label className="flex flex-col gap-1 text-sm">
          Question count
          <select
            className="rounded border border-slate-300 px-3 py-2"
            value={questionCount}
            onChange={(event) => setQuestionCount(Number(event.target.value))}
          >
            {questionCounts.map((count) => (
              <option key={count} value={count}>
                {count}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1 text-sm md:col-span-2">
          Item type
          <select
            className="rounded border border-slate-300 px-3 py-2"
            value={type}
            onChange={(event) => setType(event.target.value as typeof type)}
          >
            <option value="mcq">Multiple choice</option>
            <option value="short">Short response</option>
            <option value="mixed">Mixed</option>
          </select>
        </label>
      </div>
      <button
        className="rounded border border-slate-300 bg-slate-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
        type="submit"
        disabled={submitting}
      >
        {submitting ? 'Generating…' : 'Generate assignment'}
      </button>
      {error && <div className="rounded border border-red-200 bg-red-50 p-3 text-sm text-red-800">{error}</div>}
      {success && <div className="rounded border border-green-200 bg-green-50 p-3 text-sm text-green-800">{success}</div>}
    </form>
  );
};

export default AssignmentForm;
