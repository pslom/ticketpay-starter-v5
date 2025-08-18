'use client';

import React, { useState } from 'react';
import Link from "next/link";

type Sub = {
  id: string;
  plate_normalized: string;
  state: string;
  channel: 'sms' | 'email';
  value: string;
  city: string | null;
  created_at: string;
};

type ListResp =
  | { ok: true; items: Sub[] }
  | { ok: false; error: string };

type UnsubResp =
  | { ok: true }
  | { ok: false, error: string };

export default function ManagePage() {
  const [channel, setChannel] = React.useState<'sms' | 'email'>('email');
  const [value, setValue] = React.useState('');
  const [items, setItems] = React.useState<Sub[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [err, setErr] = React.useState<string>('');
  const [ok, setOk] = React.useState<string>('');
  const [email, setEmail] = useState('');
  const [freq, setFreq] = useState<'immediate' | 'daily' | 'off'>('immediate');
  const [msg, setMsg] = useState('');

  // Subtle reveal on list items
  React.useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>('[data-reveal]');
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (e.isIntersecting) {
          const el = e.target as HTMLElement;
          el.classList.remove('opacity-0', 'translate-y-1');
          el.classList.add('opacity-100', 'translate-y-0');
          io.unobserve(el);
        }
      }
    }, { threshold: 0.1 });
    Array.from(els).forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [items.length]);

  async function load() {
    setErr('');
    setOk('');
    setLoading(true);
    try {
      const r = await fetch('/api/core', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ op: 'list_subscriptions', value: value.trim(), channel }),
      });
      const j = (await r.json().catch(() => ({}))) as Partial<ListResp>;
      if (!r.ok || j.ok !== true || !Array.isArray(j.items)) {
        const msg = (j as { error?: string })?.error || `Lookup failed (${r.status})`;
        throw new Error(msg);
      }
      setItems(j.items);
      if (j.items.length === 0) setOk('No subscriptions found for that contact.');
    } catch (e: unknown) {
      setErr(e instanceof Error ? e.message : 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  }

  async function remove(id: string) {
    setErr('');
    setOk('');
    const prev = items;
    setItems((cur) => cur.filter((x) => x.id !== id));
    try {
      const r = await fetch('/api/core', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ op: 'unsubscribe', id }),
      });
      const j = (await r.json().catch(() => ({}))) as Partial<UnsubResp>;
      if (!r.ok || j.ok !== true) {
        const msg = (j as { error?: string })?.error || `Unsubscribe failed (${r.status})`;
        throw new Error(msg);
      }
      setOk('Unsubscribed.');
    } catch (e: unknown) {
      setItems(prev);
      setErr(e instanceof Error ? e.message : 'Unsubscribe failed.');
    }
  }

  function save(e: React.FormEvent) {
    e.preventDefault();
    setMsg('');
    // TODO: call your real API when ready. For now, succeed locally.
    setTimeout(() => setMsg('Preferences saved.'), 300);
  }

  return (
    <main className="min-h-dvh bg-gray-50 text-black">
      <section className="mx-auto max-w-2xl px-4 py-10">
        <h1 className="text-2xl font-semibold">Manage alerts</h1>
        <p className="mt-2 text-sm text-gray-600">
          Look up your subscriptions and unsubscribe with one tap. Private. Secure.
        </p>

        {/* Lookup card */}
        <div className="mt-6 rounded-2xl border border-black/10 bg-white p-5 shadow-sm">
          <label className="block text-sm font-medium">Channel</label>
          <div className="mt-2 flex gap-6">
            <label className="inline-flex items-center gap-2">
              <input
                type="radio"
                name="channel"
                value="email"
                checked={channel === 'email'}
                onChange={() => setChannel('email')}
              />
              <span>Email</span>
            </label>
            <label className="inline-flex items-center gap-2">
              <input
                type="radio"
                name="channel"
                value="sms"
                checked={channel === 'sms'}
                onChange={() => setChannel('sms')}
              />
              <span>SMS</span>
            </label>
          </div>

          <div className="mt-4">
            <label className="text-sm font-medium" htmlFor="contact">
              {channel === 'email' ? 'Email address' : 'Mobile number'}
            </label>
            <input
              id="contact"
              className="mt-1 h-12 w-full rounded-xl border border-gray-300 px-4 text-[16px] focus:outline-none focus:ring-2 focus:ring-[#667eea]"
              placeholder={channel === 'email' ? 'you@example.com' : '(415) 555-0123'}
              inputMode={channel === 'email' ? 'email' : 'tel'}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              required
            />
            <p className="mt-1 text-[11px] text-gray-500">We’ll only use this to find your alerts.</p>
          </div>

          {err && <p className="mt-3 text-sm text-red-600 break-words">{err}</p>}
          {ok && !err && <p className="mt-3 text-sm text-green-700">{ok}</p>}

          <div className="mt-5">
            <button
              onClick={load}
              disabled={!value.trim() || loading}
              className="h-12 w-full rounded-xl bg-black text-white font-medium text-[16px] transition transform hover:scale-[1.01] active:scale-[0.99] disabled:opacity-60"
            >
              {loading ? 'Loading…' : 'Find subscriptions'}
            </button>
          </div>
        </div>

        {/* Results */}
        <div className="mt-8">
          <h2 className="text-lg font-medium">Your subscriptions</h2>

          {items.length === 0 && !loading && !err && !ok && (
            <p className="mt-2 text-sm text-gray-600">No subscriptions yet. Search above to view yours.</p>
          )}

          <ul className="mt-3 divide-y rounded-2xl border border-black/10 bg-white shadow-sm">
            {items.map((sub) => (
              <li
                key={sub.id}
                data-reveal
                className="opacity-0 translate-y-1 transition-all duration-500 px-4 py-3 flex items-center justify-between"
              >
                <div>
                  <div className="font-medium">
                    {sub.plate_normalized} · {sub.state}
                  </div>
                  <div className="text-sm text-gray-600">
                    {sub.channel}: {sub.value}
                  </div>
                  <div className="text-[11px] text-gray-400">
                    Created {new Date(sub.created_at).toLocaleString()}
                  </div>
                </div>
                <button
                  onClick={() => remove(sub.id)}
                  className="rounded-xl border border-black/10 px-3 py-1.5 text-sm hover:bg-black/5"
                >
                  Unsubscribe
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-10 text-sm">
          <Link href="/" className="underline">Back to home</Link>
        </div>
      </section>

      <footer className="mx-auto max-w-2xl px-4 pb-10 text:[11px] text-gray-500">
        © TicketPay • San Francisco, CA
      </footer>

      {/* Keep these classes in Tailwind build */}
      <span className="sr-only opacity-100 translate-y-0"></span>
        {msg && <p className="text-sm text-green-700">{msg}</p>}
        <p className="text-[12px] text-neutral-500">
          See SMS terms at <a href="/consent" className="underline">/consent</a>. Reply STOP to opt out.
        </p>
    </main>
  );
}
