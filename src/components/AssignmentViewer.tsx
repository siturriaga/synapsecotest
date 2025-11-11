import React, { useMemo } from 'react';
import type { Assignment, Item } from '../types/assignment';

interface AssignmentViewerProps {
  assignment: Assignment | null;
  standardsMap: Map<string, string>;
  selectedStandardLabel?: string;
}

const renderItem = (item: Item, index: number) => {
  if (item.type === 'mcq') {
    const options = item.options ?? [];
    return (
      <li key={`${item.stem}-${index}`} className="space-y-1 rounded border border-slate-200 p-3">
        <div className="text-sm font-medium">{index + 1}. {item.stem}</div>
        <ul className="space-y-1 text-sm text-slate-700">
          {options.map((option, optionIndex) => (
            <li key={optionIndex}>
              <span className={optionIndex === item.answerIndex ? 'font-semibold text-slate-900' : ''}>
                {String.fromCharCode(65 + optionIndex)}. {option}
              </span>
            </li>
          ))}
        </ul>
      </li>
    );
  }

  return (
    <li key={`${item.prompt}-${index}`} className="space-y-1 rounded border border-slate-200 p-3">
      <div className="text-sm font-medium">{index + 1}. {item.prompt}</div>
      {item.rubric && <p className="text-xs text-slate-600">Rubric: {item.rubric}</p>}
    </li>
  );
};

const AssignmentViewer: React.FC<AssignmentViewerProps> = ({ assignment, standardsMap, selectedStandardLabel }) => {
  const resolved = useMemo(() => {
    if (!assignment) return null;
    const standardLabel = selectedStandardLabel ?? standardsMap.get(assignment.standardCode) ?? assignment.standardCode;
    return { ...assignment, standardLabel };
  }, [assignment, selectedStandardLabel, standardsMap]);

  const handleDownload = () => {
    if (!assignment) return;
    const blob = new Blob([JSON.stringify(assignment, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `${assignment.title.replace(/\s+/g, '-').toLowerCase() || 'assignment'}.json`;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  const handleCopy = async () => {
    if (!assignment) return;
    try {
      await navigator.clipboard.writeText(JSON.stringify(assignment, null, 2));
    } catch (error) {
      console.warn('Unable to copy assignment JSON', error);
    }
  };

  if (!assignment || !resolved) {
    return (
      <section className="rounded border border-slate-200 bg-white p-4">
        <h2 className="text-base font-semibold">Assignment viewer</h2>
        <p className="text-sm text-slate-600">Select an assignment to inspect its items.</p>
      </section>
    );
  }

  return (
    <section className="space-y-3 rounded border border-slate-200 bg-white p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h2 className="text-base font-semibold">{resolved.title}</h2>
          <p className="text-xs text-slate-600">{resolved.standardCode} – {resolved.standardLabel}</p>
        </div>
        <div className="flex gap-2">
          <button className="rounded border border-slate-300 px-3 py-1 text-sm" onClick={handleCopy}>
            Copy JSON
          </button>
          <button className="rounded border border-slate-300 px-3 py-1 text-sm" onClick={handleDownload}>
            Download JSON
          </button>
        </div>
      </div>
      <ul className="space-y-2">
        {assignment.items.map((item, index) => renderItem(item, index))}
      </ul>
    </section>
  );
};

export default AssignmentViewer;
