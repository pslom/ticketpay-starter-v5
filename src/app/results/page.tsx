'use client';

import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";

function SubscribeBox({ plate, state, city }: { plate: string; state: string; city?: string }) {
  const [channel, setChannel] = React.useState<'email'|'sms'>('email');
  const [value, setValue] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [msg, setMsg] = React.useState<{kind:'ok'|'err', text:string} | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);
    setLoading(true);
    try {
      const r = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ plate, state, city: city || '', channel, value }),
      });
      const data = await r.json().catch(()=> ({}));
      if (!r.ok || !data?.ok) throw new Error(data?.error || `Subscribe failed (${r.status})`);
      setMsg({ kind: 'ok', text: 'You’re set. We’ll alert you when new tickets post.' });
    } catch (e: any) {
      setMsg({ kind: 'err', text: e?.message || 'Something went wrong.' });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mt-6 rounded-2xl border border-gray-200 p-5">
      <h3 className="text-base font-semibold">Get alerts for {plate} ({state})</h3>
      <p className="mt-1 text-sm text-gray-600">We’ll notify you the moment a new ticket posts.</p>

      <form onSubmit={onSubmit} className="mt-4 space-y-3">
        <div className="flex gap-6">
          <label className="inline-flex items-center gap-2">
            <input type="radio" name="channel" value="email"
              checked={channel==='email'} onChange={()=>setChannel('email')} />
            <span>Email</span>
          </label>
          <label className="inline-flex items-center gap-2">
            <input type="radio" name="channel" value="sms"
              checked={channel==='sms'} onChange={()=>setChannel('sms')} />
            <span>SMS</span>
          </label>
        </div>

        <div>
          <input
            className="w-full rounded-2xl border border-gray-300 px-3 py-2"
            placeholder={channel==='email' ? 'you@example.com' : '(202) 555-0123'}
            inputMode={channel==='email' ? 'email' : 'tel'}
            value={value}
            onChange={(e)=>setValue(e.target.value)}
            required
          />
          <p className="mt-1 text-xs text-gray-500">Unsubscribe anytime in one click.</p>
        </div>

        <button
          type="submit"
          disabled={loading || !value}
          className="inline-flex items-center justify-center rounded-2xl bg-black px-4 py-2 text-white font-medium disabled:opacity-60"
        >
          {loading ? 'Saving…' : 'Get alerts'}
        </button>

        {msg && (
          <p className={`mt-2 text-sm ${msg.kind==='ok' ? 'text-green-600' : 'text-red-600'}`}>
            {msg.text}
          </p>
        )}
      </form>
    </div>
  );
}

function ResultsInner() {
  const sp = useSearchParams();
  const plate = (sp.get('plate') || '').toUpperCase();
  const state = (sp.get('state') || '').toUpperCase();
  const city  = sp.get('city') || '';

  return (
    <main className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="text-2xl font-semibold">Results</h1>
      <p className="mt-2 text-sm text-gray-600">
        Searching for {plate && state ? <><span className="font-mono">{plate}</span> ({state})</> : "your plate"}{city ? ` · ${city}` : ""}.
      </p>

      <div className="mt-6 rounded-2xl border border-dashed border-gray-200 p-5 text-sm text-gray-500">
        <div>• If we find open tickets for this plate, we’ll show them here.</div>
        <div>• Either way, subscribing below guarantees alerts for new tickets.</div>
      </div>

      {plate && state ? (
        <SubscribeBox plate={plate} state={state} city={city} />
      ) : (
        <div className="mt-6 text-sm text-red-600">Missing plate or state. Go back and try again.</div>
      )}

      <div className="mt-8 text-sm">
        <a href="/manage" className="underline">Manage my alerts</a>
      </div>
    </main>
  );
}

export default function ResultsPage() {
  return (
    <Suspense fallback={<main className="mx-auto max-w-2xl px-4 py-12">Loading…</main>}>
      <ResultsInner />
    </Suspense>
  );
}
