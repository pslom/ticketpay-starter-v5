'use client';
import { useEffect, useState } from 'react';

type Sub = {
  id: string; plate: string; plate_normalized: string; state: string;
  channel: 'sms'|'email'; value: string; city: string; created_at: string;
};

export default function ManagePage() {
  const [value, setValue] = useState('');
  const [channel, setChannel] = useState<'sms'|'email'>('sms');
  const [items, setItems] = useState<Sub[]>([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string>('');

  async function load() {
    setErr(''); setLoading(true);
    try {
      const r = await fetch('/api/core', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ op: 'list_subscriptions', value, channel })
      });
      const j = await r.json();
      if (!j.ok) throw new Error(j.error || 'server_error');
      setItems(j.items || []);
    } catch (e:any) {
      setErr(String(e?.message || e));
    } finally { setLoading(false); }
  }

  async function remove(id: string) {
    const prev = items;
    setItems(prev.filter(x => x.id !== id));
    try {
      const r = await fetch('/api/core', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ op: 'unsubscribe', id })
      });
      const j = await r.json();
      if (!j.ok) throw new Error(j.error || 'server_error');
    } catch (e) {
      // rollback on error
      setItems(prev);
      alert('Unsubscribe failed. Please try again.');
    }
  }

  useEffect(() => { /* no-op */ }, []);

  return (
    <main className="mx-auto max-w-2xl p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Manage alerts</h1>

      <div className="rounded-2xl p-4 shadow bg-white space-y-3">
        <label className="block text-sm font-medium">Channel</label>
        <div className="flex gap-3">
          <label className="inline-flex items-center gap-2">
            <input type="radio" name="channel" checked={channel==='sms'} onChange={()=>setChannel('sms')} />
            SMS
          </label>
          <label className="inline-flex items-center gap-2">
            <input type="radio" name="channel" checked={channel==='email'} onChange={()=>setChannel('email')} />
            Email
          </label>
        </div>

        <label className="block text-sm font-medium">
          {channel === 'sms' ? 'Phone number (E.164, e.g. +15555551234)' : 'Email'}
        </label>
        <input
          className="w-full rounded-xl border p-2"
          placeholder={channel === 'sms' ? '+15555551234' : 'you@example.com'}
          value={value} onChange={e=>setValue(e.target.value)}
        />
        <button
          className="rounded-xl bg-black text-white px-4 py-2 disabled:opacity-50"
          disabled={!value || loading}
          onClick={load}
        >
          {loading ? 'Loading…' : 'Find subscriptions'}
        </button>

        {err && <p className="text-red-600 text-sm break-words">{err}</p>}
      </div>

      {items.length > 0 && (
        <div className="rounded-2xl p-4 shadow bg-white">
          <h2 className="text-lg font-medium mb-3">Your subscriptions</h2>
          <ul className="divide-y">
            {items.map(sub => (
              <li key={sub.id} className="py-3 flex items-center justify-between">
                <div className="text-sm">
                  <div className="font-medium">{sub.plate_normalized} · {sub.state}</div>
                  <div className="text-gray-600">{sub.channel}: {sub.value}</div>
                  <div className="text-gray-400 text-xs">Created {new Date(sub.created_at).toLocaleString()}</div>
                </div>
                <button
                  className="rounded-xl border px-3 py-1 hover:bg-gray-50"
                  onClick={()=>remove(sub.id)}
                >
                  Unsubscribe
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {items.length === 0 && !loading && !err && (
        <p className="text-gray-600">No subscriptions yet. Search above to view yours.</p>
      )}
    </main>
  );
}
