import React, { useState } from 'react';
import Papa from 'papaparse';
import { safeFetch } from '../utils/safeFetch';

interface RosterRow {
  studentId: string;
  studentName: string;
  testScorePercent: number;
  period: string;
  testTitle: string;
}

const REQUIRED_HEADERS = [
  'Student ID',
  'Student Name',
  'Test Score %',
  'Period',
  'Test Title'
];

const RosterUpload: React.FC = () => {
  const [period, setPeriod] = useState('1');
  const [quarter, setQuarter] = useState('Q1');
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFile = async (file: File) => {
    return new Promise<RosterRow[]>((resolve, reject) => {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          const headers = results.meta.fields ?? [];
          const missingHeaders = REQUIRED_HEADERS.filter((header) => !headers.includes(header));
          if (missingHeaders.length > 0) {
            reject(new Error(`Missing required columns: ${missingHeaders.join(', ')}`));
            return;
          }

          const rows: RosterRow[] = (results.data as Papa.ParseResult<RosterRow>['data']).map((row: any) => ({
            studentId: String(row['Student ID'] ?? '').trim(),
            studentName: String(row['Student Name'] ?? '').trim(),
            testScorePercent: Number(row['Test Score %'] ?? 0),
            period: String(row['Period'] ?? '').trim(),
            testTitle: String(row['Test Title'] ?? '').trim()
          }));

          resolve(rows);
        },
        error: (parseError) => reject(parseError)
      });
    });
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus(null);
    setError(null);
    const formData = new FormData(event.currentTarget);
    const file = formData.get('roster') as File | null;

    if (!file) {
      setError('Please select a CSV file to upload.');
      return;
    }

    try {
      const rows = await handleFile(file);
      const response = await safeFetch(`/api/uploadRoster?period=${encodeURIComponent(period)}&quarter=${encodeURIComponent(quarter)}`, {
        method: 'POST',
        body: JSON.stringify({ entries: rows })
      });
      setStatus(`Uploaded ${response.count} roster entries successfully.`);
    } catch (uploadError) {
      if (uploadError instanceof Error) {
        setError(uploadError.message);
      } else {
        setError('Unexpected error while processing the roster.');
      }
    }
  };

  return (
    <section className="space-y-4">
      <h2 className="text-lg font-semibold">Roster Upload</h2>
      <form className="space-y-3" onSubmit={handleSubmit}>
        <div className="flex gap-3">
          <label className="flex flex-col text-sm">
            Period
            <input
              className="border px-2 py-1"
              name="period"
              value={period}
              onChange={(event) => setPeriod(event.target.value)}
            />
          </label>
          <label className="flex flex-col text-sm">
            Quarter
            <input
              className="border px-2 py-1"
              name="quarter"
              value={quarter}
              onChange={(event) => setQuarter(event.target.value)}
            />
          </label>
        </div>
        <label className="flex flex-col text-sm">
          CSV file
          <input className="border px-2 py-1" type="file" name="roster" accept=".csv" />
        </label>
        <button className="px-3 py-1 border rounded" type="submit">
          Upload roster
        </button>
      </form>
      {status && <div className="text-green-700">{status}</div>}
      {error && <div className="text-red-700">{error}</div>}
    </section>
  );
};

export default RosterUpload;
