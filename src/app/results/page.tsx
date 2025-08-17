'use client';

import React, { Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { isEmail, normalizeUSPhone } from "@/lib/validate";

function SubscribeBox({ plate, state, city }: { plate: string; state: string; city?: string }) {
  const [channel, setChannel] = React.useState<'email'|'sms'>('email');
  const [value, setValue] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [err, setErr] = React.useState<string | null>(null);
  const [ok, setOk] = React.useState(false);
  const [honey, setHoney] = React.useState(''); // honeypot

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);

    // Honeypot
    if (honey) {
      setErr('Something went wrong. Please try again.');
      return;
    }

    const plateNorm = (plate || '').trim().toUpperCase();
    const stateNorm = (state || '').trim().toUpperCase();

    if (!plateNorm || !stateNorm) {
      setErr('Enter your plate and state.');
      return;
    }

    let payload: any = { plate: plateNorm, state: stateNorm, city: city || '', channel, value: '' };

    if (channel === 'email') {
      if (!isEmail(value)) {
        setErr('Enter a valid email address.');
        return;
      }
      payload.value = value.trim();
    } else {
      const phone = normalizeUSPhone(value);
      if (!phone) {
        setErr('Enter a valid US mobile number.');
        return;
      }
      payload.value = phone;
    }

    setLoading(true);
    try {
      const r = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await r.json().catch(()=> ({}));
      if (!r.ok || !data?.ok) throw new Error(data?.error || `Subscribe failed (${r.status})`);
      setOk(true);
    } catch (e: any) {
      setErr(e?.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  }

  if (ok) {
    return (
      <div className="mt-6 rounded-2xl border border-green-200 bg-green-50 p-5">
        <h3 className="text-base font-semibold text-green-900">You’re set</h3>
        <p className="mt-1 text-sm text-green-900/80">
          We’ll notify you the moment a new ticket is posted for {plate} ({state}) in San Francisco, CA. You can unsubscribe anytime.
        </p>
        <div className="mt-4 flex gap-3">
          <a href="/manage" className="rounded-xl border border-green-300 bg-white px-3 py-2 text-sm">
            Manage my alerts
          </a>
          <a href="/" className="rounded-xl border border-green-300 bg-white px-3 py-2 text-sm">
            Search another plate
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-6 rounded-2xl border border-gray-200 p-5">
      <h3 className="text-base font-semibold">Get alerts for {plate} ({state})</h3>
      <p className="mt-1 text-sm text-gray-600">
        San Francisco launch (CA only). We’ll notify you the moment a new ticket posts.
      </p>

      <form onSubmit={onSubmit} className="mt-4 space-y-3">
        {/* Honeypot */}
        <input
          className="hidden"
          name="company"
          autoComplete="off"
          tabIndex={-1}
          value={honey}
          onChange={(e)=>setHoney(e.target.value)}
        />

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
            placeholder={channel==='email' ? 'you@example.com' : '(415) 555-0123'}
            inputMode={channel==='email' ? 'email' : 'tel'}
            value={value}
            onChange={(e)=>setValue(e.target.value)}
            required
          />
          <p className="mt-1 text-xs text-gray-500">Unsubscribe anytime in one click.</p>
        </div>

        {err && <p className="text-sm text-red-600">{err}</p>}

        <button
          type="submit"
          disabled={loading || !value}
          className="inline-flex items-center justify-center rounded-2xl bg-black px-4 py-2 text-white font-medium disabled:opacity-60"
        >
          {loading ? 'Saving…' : 'Get alerts'}
        </button>
      </form>
    </div>
  );
}

function ResultsInner() {
  const router = useRouter();
  const sp = useSearchParams();
  const plate = (sp.get('plate') || '').toUpperCase();
  const state = (sp.get('state') || '').toUpperCase();
  const city  = sp.get('city') || '';

  return (
    <main className="mx-auto max-w-2xl px-4 py-12">
      <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-black/10 bg-gray-50 px-3 py-1 text-xs text-gray-700">
        CA only — San Francisco launch
      </div>

      <h1 className="text-2xl font-semibold">Results</h1>
      <p className="mt-2 text-sm text-gray-600">
        {plate && state ? (
          <>Searching for <span className="font-mono">{plate}</span> ({state}).</>
        ) : (
          <>Missing plate or state.</>
        )}
      </p>

      <div className="mt-6 rounded-2xl border border-dashed border-gray-200 p-5 text-sm text-gray-500">
        <div>• If we find open tickets for this plate, we’ll show them here.</div>
        <div>• Either way, subscribing below guarantees alerts for new tickets in San Francisco, CA.</div>
      </div>

      {plate && state ? (
        <SubscribeBox plate={plate} state={state} city={city} />
      ) : (
        <div className="mt-6 text-sm text-red-600">
          Missing plate or state. <button onClick={()=>router.push('/')} className="underline">Go back</button>.
        </div>
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
