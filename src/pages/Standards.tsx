import React, { useEffect, useState } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { useAuth } from '../components/AuthProvider';
import { firestore } from '../utils/firebaseClient';
import elaStandards from '../../data/standards/ela.json';

type Standard = (typeof elaStandards)[number];

const Standards: React.FC = () => {
  const { user } = useAuth();
  const [selected, setSelected] = useState<string[]>([]);
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    const standardsRef = doc(firestore, 'users', user.uid, 'settings', 'standards');
    getDoc(standardsRef).then((snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        if (Array.isArray(data.codes)) {
          setSelected(data.codes as string[]);
        }
      }
    });
  }, [user]);

  if (!user) {
    return null;
  }

  const toggleStandard = (code: string) => {
    setSelected((prev) => (prev.includes(code) ? prev.filter((item) => item !== code) : [...prev, code]));
  };

  const handleSave = async () => {
    setStatus(null);
    setError(null);
    try {
      const standardsRef = doc(firestore, 'users', user.uid, 'settings', 'standards');
      await setDoc(standardsRef, { codes: selected, updatedAt: new Date().toISOString() }, { merge: true });
      setStatus('Standards saved successfully.');
    } catch (saveError) {
      if (saveError instanceof Error) {
        setError(saveError.message);
      } else {
        setError('Failed to save standards.');
      }
    }
  };

  return (
    <section className="space-y-4">
      <h2 className="text-lg font-semibold">Standards</h2>
      <p className="text-sm text-slate-600">Select the standards you want to focus on.</p>
      <div className="space-y-2">
        {elaStandards.map((standard: Standard) => (
          <label key={standard.code} className="flex items-start gap-2 text-sm">
            <input
              type="checkbox"
              checked={selected.includes(standard.code)}
              onChange={() => toggleStandard(standard.code)}
            />
            <span>
              <strong>{standard.code}</strong> – {standard.description}
            </span>
          </label>
        ))}
      </div>
      <button className="px-3 py-1 border rounded" onClick={handleSave}>
        Save standards
      </button>
      {status && <div className="text-green-700">{status}</div>}
      {error && <div className="text-red-700">{error}</div>}
    </section>
  );
};

export default Standards;
