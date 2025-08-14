'use client';
import { useState } from 'react';

type Sub = { id:string; plate:string; state:string; channel:'sms'|'email'; value:string; city:string; created_at:string };

export default function Manage() {
  const [value, setValue] = useState('');
  const [channel, setChannel] = useState<'sms'|'email'>('email');
  const [items, setItems] = useState<Sub[]>([]);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string>('');

  async function load() {
    setBusy(true); setErr('');
    try {
      const r = await fetch('/api/core', {
        method:'POST', headers:{'content-type':'application/json'},
        body: JSON.stringify({ op:'list_subscriptions', value, channel }),
      });
      const j = await r.json();
      if (j?.ok) setItems(j.items || []);
      else setErr(j?.error || 'unknown_error');
    } catch(e:any){ setErr(String(e?.message||e)); }
    setBusy(false);
  }

  async function remove(id: string) {
    setBusy(true); setErr('');
    try {
      const r = await fetch('/api/core', {
        method:'POST', headers:{'content-type':'application/json'},
        body: JSON.stringify({ op:'unsubscribe', id }),
      });
      const j = await r.json();
      if (j?.ok) setItems(prev => prev.filter(x => x.id !== id));
      else setErr(j?.error || 'unknown_error');
    } catch(e:any){ setErr(String(e?.message||e)); }
    setBusy(false);
  }

  return (
    <main className="mx-auto max-w-2xl p-6">
      <h1 className="text-2xl font-semibold mb-4">Manage Subscriptions</h1>
      <div className="flex gap-2 mb-3">
        <select className="border rounded p-2" value={channel} onChange={e => setChannel(e.target.value as any)}>
          <option value="email">Email</option>
          <option value="sms">SMS</option>
        </select>
        <input className="border rounded p-2 flex-1" placeholder={channel==='email'?'you@example.com':'+15555551234'} value={value} onChange={e=>setValue(e.target.value)} />
        <button className="rounded-xl px-4 py-2 bg-black text-white disabled:opacity-50" onClick={load} disabled={busy}>Load</button>
      </div>
      {err && <p className="text-red-600 text-sm mb-2 break-words">{err}</p>}
      {items.length === 0 ? <p className="text-gray-600">No subscriptions found.</p> :
        <ul className="space-y-2">
          {items.map(s => (
            <li key={s.id} className="border rounded-xl p-3 flex items-center justify-between">
              <div className="text-sm">
                <div className="font-medium">{s.plate} / {s.state} • {s.city}</div>
                <div className="text-gray-600">{s.channel}: {s.value}</div>
              </div>
              <button className="rounded-lg px-3 py-1 bg-red-600 text-white" onClick={() => remove(s.id)} disabled={busy}>Unsubscribe</button>
            </li>
          ))}
        </ul>}
    </main>
  );
}
