// src/components/StatusStrip.tsx
'use client';

import { useEffect, useState } from 'react';

type StatusPayload = {
  status: 'operational' | 'degraded';
  lastImportISO: string | null;
  source: string;
};

export default function StatusStrip() {
  const [data, setData] = useState<StatusPayload | null>(null);

  useEffect(() => {
    let isMounted = true;
    fetch('/api/status')
      .then(r => r.json())
      .then(d => isMounted && setData(d))
      .catch(() => {});
    return () => { isMounted = false; };
  }, []);

  const badge =
    data?.status === 'operational'
      ? 'bg-green-100 text-green-800'
      : 'bg-yellow-100 text-yellow-800';

  return (
    <div className="w-full border-b border-slate-200 bg-white">
      <div className="mx-auto max-w-4xl px-4 py-2 text-sm flex items-center gap-3">
        <span className={`inline-flex items-center px-2 py-0.5 rounded ${badge}`}>
          {data?.status === 'operational' ? 'Status: Operational' : 'Status: Degraded'}
        </span>
        <span className="text-slate-600">
          {data?.lastImportISO
            ? `Last import ${new Date(data.lastImportISO).toLocaleString()}`
            : 'Last import not available'}
          {' • '}
          Source: {data?.source ?? 'SFMTA daily feed'}
        </span>
      </div>
    </div>
  );
}
