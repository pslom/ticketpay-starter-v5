'use client';

import React, { Suspense, useState } from 'react';
import { useSearchParams } from 'next/navigation';

function PaymentInner() {
  const sp = useSearchParams();

  // Accept both old and new param names
  const ticketId =
    sp.get('ticket') ??
    sp.get('plate') ?? // fallback
    '';

  const amountCents = Number(
    sp.get('amount_cents') ??
    sp.get('total') ?? // fallback
    '0'
  );

  const amount = (amountCents / 100).toFixed(2);

  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');
  const [ok, setOk] = useState('');

  async function onPay(e: React.FormEvent) {
    e.preventDefault();
    setErr('');
    setOk('');
    setLoading(true);
    try {
      // TODO: wire to your real checkout/session route
      const r = await fetch('/api/pay', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ ticketId, amountCents, email }),
      });
      if (!r.ok) {
        const data = await r.json().catch(() => ({}));
        throw new Error(data?.error || `Payment init failed (${r.status})`);
      }
      setOk('Redirecting to payment…');
      // const { url } = await r.json();
      // window.location.href = url;
    } catch (e: any) {
      setErr(e?.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto max-w-xl px-4 py-10">
      <h1 className="text-2xl font-semibold">Pay Ticket</h1>
      <p className="mt-2 text-sm text-gray-600">
        Ticket: <span className="font-mono">{ticketId || '—'}</span>
      </p>

      <form onSubmit={onPay} className="mt-8 space-y-6">
        <div className="space-y-1">
          <label className="text-sm font-medium">Amount</label>
          <input
            className="w-full rounded-md border border-gray-300 bg-gray-50 px-3 py-2"
            value={`$${amount}`}
            disabled
            readOnly
          />
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium" htmlFor="email">Receipt email</label>
          <input
            id="email"
            type="email"
            className="w-full rounded-md border border-gray-300 px-3 py-2"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <p className="text-xs text-gray-500">We’ll send your receipt here.</p>
        </div>

        {err && <p className="text-sm text-red-600">{err}</p>}
        {ok && <p className="text-sm text-green-600">{ok}</p>}

        <button
          type="submit"
          disabled={loading || !ticketId || !amountCents}
          className="inline-flex items-center justify-center rounded-md bg-black px-4 py-2 text-white disabled:opacity-60"
        >
          {loading ? 'Processing…' : 'Pay now'}
        </button>
      </form>
    </main>
  );
}

export default function PaymentPage() {
  return (
    <Suspense fallback={<main className="mx-auto max-w-xl px-4 py-10">Loading…</main>}>
      <PaymentInner />
    </Suspense>
  );
}
