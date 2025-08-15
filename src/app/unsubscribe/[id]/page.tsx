'use client';

import { useEffect, useState } from 'react';

export default function Page(props: any) {
  const id: string = typeof props?.params?.id === 'string' ? props.params.id : '';
  const [state, setState] = useState<'idle'|'ok'|'err'>('idle');
  const [detail, setDetail] = useState('');

  useEffect(() => {
    const run = async () => {
      try {
        const r = await fetch('/api/unsub', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ id }),
          cache: 'no-store'
        });
        const j = await r.json().catch(() => ({} as any));
        if (r.ok && j?.ok) setState('ok');
        else { setState('err'); setDetail(j?.error || `HTTP ${r.status}`); }
      } catch (e: any) {
        setState('err'); setDetail(String(e?.message || e));
      }
    };
    run();
  }, [id]);

  return (
    <main className="mx-auto max-w-xl p-6">
      <h1 className="text-2xl font-semibold mb-4">TicketPay</h1>
      {state === 'idle' && <p>Processing your request…</p>}
      {state === 'ok' && (
        <div className="rounded-2xl p-4 shadow bg-white">
          <h2 className="text-xl font-medium mb-2">You’re unsubscribed ✅</h2>
          <p className="text-gray-600">You will no longer receive alerts for this subscription.</p>
        </div>
      )}
      {state === 'err' && (
        <div className="rounded-2xl p-4 shadow bg-white">
          <h2 className="text-xl font-medium mb-2">Unsubscribe error</h2>
          <p className="text-red-600 text-sm break-words">{detail || 'server_error'}</p>
        </div>
      )}
    </main>
  );
}
