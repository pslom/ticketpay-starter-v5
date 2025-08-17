'use client';

import React from 'react';

type Row = {
  id: string;
  plate_normalized?: string;
  state?: string;
  city?: string;
  channel?: 'sms'|'email';
  value?: string;
  created_at?: string;
};

export default function ManagePage() {
  const [channel, setChannel] = React.useState<'sms'|'email'>('email');
  const [value, setValue] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [err, setErr] = React.useState('');
  const [rows, setRows] = React.useState<Row[]>([]);
  const [info, setInfo] = React.useState('');

  async function onFind(e: React.FormEvent) {
    e.preventDefault();
    setErr(''); setInfo(''); setRows([]);
    if (!value) { setErr('Enter your email or phone first.'); return; }
    setLoading(true);
    try {
      const r = await fetch('/api/list_subscriptions', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ channel, value }),
      });
      const data = await r.json().catch(()=> ({}));
      if (!r.ok || !Array.isArray(data?.rows)) {
        throw new Error(data?.error || `Lookup failed (${r.status})`);
      }
      setRows(data.rows);
      if (data.rows.length === 0) setInfo('No subscriptions found.');
    } catch (e: any) {
      setErr(e?.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  }

  async function onUnsub(id: string) {
    setErr(''); setInfo('');
    try {
      const r = await fetch('/api/unsubscribe', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      const data = await r.json().catch(()=> ({}));
      if (!r.ok || !data?.ok) throw new Error(data?.error || `Unsubscribe failed (${r.status})`);
      setRows(prev => prev.filter(x => x.id !== id));
      setInfo('Removed. You will no longer receive alerts for that plate.');
    } catch (e: any) {
      setErr(e?.message || 'Something went wrong.');
    }
  }

  return (
    <main className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="text-2xl font-semibold">Manage alerts</h1>
      <p className="mt-2 text-sm text-gray-600">Find and remove your subscriptions.</p>

      <form onSubmit={onFind} className="mt-6 rounded-2xl border border-gray-200 p-5 space-y-3">
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

        <input
          className="w-full rounded-xl border border-gray-300 px-3 py-2"
          placeholder={channel==='email' ? 'you@example.com' : '(202) 555-0123'}
          inputMode={channel==='email' ? 'email' : 'tel'}
          value={value}
          onChange={(e)=>setValue(e.target.value)}
          required
        />

        <button
          type="submit"
          disabled={loading || !value}
          className="h-11 w-full rounded-xl bg-black text-white font-medium disabled:opacity-60"
        >
          {loading ? 'Finding…' : 'Find my subscriptions'}
        </button>

        {err && <p className="text-sm text-red-600">{err}</p>}
        {info && <p className="text-sm text-green-700">{info}</p>}
      </form>

      {rows.length > 0 && (
        <div className="mt-8 rounded-2xl border border-gray-200">
          <div className="border-b border-gray-200 px-5 py-3 text-sm font-medium">Your subscriptions</div>
          <ul className="divide-y divide-gray-200">
            {rows.map((r) => (
              <li key={r.id} className="px-5 py-4 flex items-center justify-between">
                <div className="text-sm">
                  <div className="font-medium">
                    {r.plate_normalized || '—'}{r.state ? ` (${r.state})` : ''}{r.city ? ` · ${r.city}` : ''}
                  </div>
                  <div className="text-gray-500">
                    {r.channel?.toUpperCase()} · {r.value}
                  </div>
                </div>
                <button
                  onClick={() => onUnsub(r.id)}
                  className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm hover:bg-gray-50"
                >
                  Unsubscribe
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </main>
  );
}
