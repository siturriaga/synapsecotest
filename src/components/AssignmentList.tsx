import React from 'react';
import type { Assignment } from '../types/assignment';

interface AssignmentListProps {
  assignments: Assignment[];
  onSelect: (assignment: Assignment) => void;
  selectedId: string | null;
  refreshing: boolean;
  onRefresh: () => void | Promise<void>;
  standardsMap: Map<string, string>;
}

const formatDate = (value: number) => {
  try {
    return new Date(value).toLocaleString();
  } catch {
    return 'Unknown time';
  }
};

const AssignmentList: React.FC<AssignmentListProps> = ({ assignments, onSelect, selectedId, refreshing, onRefresh, standardsMap }) => {
  return (
    <section className="space-y-3 rounded border border-slate-200 bg-white p-4">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold">Saved assignments</h2>
        <button className="rounded border border-slate-300 px-3 py-1 text-sm" onClick={() => onRefresh()} disabled={refreshing}>
          {refreshing ? 'Refreshing…' : 'Refresh'}
        </button>
      </div>
      {assignments.length === 0 ? (
        <p className="text-sm text-slate-600">No assignments yet. Generate one to see it here.</p>
      ) : (
        <ul className="space-y-2">
          {assignments.map((assignment) => {
            const standardLabel = standardsMap.get(assignment.standardCode) ?? assignment.standardCode;
            const isSelected = assignment.id === selectedId;
            return (
              <li key={assignment.id ?? assignment.title}>
                <button
                  className={`w-full rounded border px-3 py-2 text-left text-sm ${
                    isSelected ? 'border-slate-900 bg-slate-100' : 'border-slate-200 hover:border-slate-400'
                  }`}
                  onClick={() => onSelect(assignment)}
                >
                  <div className="font-medium">{assignment.title}</div>
                  <div className="text-xs text-slate-600">{standardLabel}</div>
                  <div className="text-xs text-slate-500">{formatDate(assignment.createdAt)}</div>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
};

export default AssignmentList;
