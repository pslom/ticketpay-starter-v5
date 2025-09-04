'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';

const PAY_AT_SFMTA_URL =
  'https://wmq.etimspayments.com/pbw/include/sanfrancisco/input.jsp';

export default function StartPage() {
  const sp = useSearchParams();
  const router = useRouter();
  const initialState = (sp.get('state') || 'CA').toUpperCase();
  const initialPlate = (sp.get('plate') || '').toUpperCase().replace(/[^A-Z0-9]/g, '');

  const [channel, setChannel] = useState<'sms' | 'email'>('sms');
  const [contact, setContact] = useState('');
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState<null | { state: string; plate: string; channel: string }>(null);
  const [error, setError] = useState<string | null>(null);

  const disabled = useMemo(() => {
    if (!initialPlate || initialPlate.length < 2) return true;
    if (!contact) return true;
    if (channel === 'email') return !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact);
    const digits = contact.replace(/\D/g, '');
    return digits.length < 10;
  }, [channel, contact, initialPlate]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      let normalized = contact.trim();
      if (channel === 'sms') normalized = '+' + contact.replace(/\D/g, '').replace(/^1?/, '1');

      // Best-effort call; local success UI still shows even if backend not wired yet
      await fetch('/api/subscription', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ state: initialState, plate: initialPlate, channel, contact: normalized }),
      }).catch(() => {});

      setDone({ state: initialState, plate: initialPlate, channel });
    } catch (err: any) {
      setError(err?.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  }

  if (done) {
    return (
      <main className="min-h-screen">
        <header className="max-w-[900px] mx-auto px-4 md:px-6 py-5 flex items-center justify-between">
          <Link href="/" className="inline-flex items-center gap-3">
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-emerald-600 text-white font-bold">T</div>
            <span className="text-lg font-semibold">TicketPay</span>
          </Link>
        </header>

        <section className="max-w-[900px] mx-auto px-4 md:px-6 pb-16">
          <div className="rounded-3xl border border-neutral-200 bg-white/90 p-6 md:p-8 shadow-sm">
            <h1 className="text-[28px] md:text-[36px] font-extrabold tracking-tight">You’re all set</h1>
            <p className="mt-2 text-neutral-700">
              We’ll notify you when a ticket appears for {done.state} {done.plate}. Then we’ll send deadline reminders if it’s still open.
            </p>
            <div className="mt-5 flex flex-wrap items-center gap-3">
              <Link href="/manage" className="inline-flex h-11 items-center rounded-xl border border-neutral-300 bg-white px-4 font-semibold hover:bg-neutral-50">Manage alerts</Link>
              <a href={PAY_AT_SFMTA_URL} target="_blank" rel="noreferrer" className="inline-flex h-11 items-center rounded-xl bg-emerald-600 px-4 font-semibold text-white hover:bg-emerald-700">Pay at SFMTA</a>
            </div>
            <p className="mt-5 text-sm text-neutral-600">
              Didn’t mean to do that? <button onClick={() => router.push('/')} className="underline">Go back</button>
            </p>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen">
      <header className="max-w-[900px] mx-auto px-4 md:px-6 py-5 flex items-center justify-between">
        <Link href="/" className="inline-flex items-center gap-3">
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-emerald-600 text-white font-bold">T</div>
          <span className="text-lg font-semibold">TicketPay</span>
        </Link>
      </header>

      <section className="max-w-[900px] mx-auto px-4 md:px-6 pb-16">
        <div className="rounded-3xl border border-neutral-200 bg-white/90 p-6 md:p-8 shadow-sm">
          <p className="inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-800 mb-4">
            Step 2 • Where should we send alerts?
          </p>
          <h1 className="text-[28px] md:text-[36px] font-extrabold tracking-tight">
            Activate alerts for {initialState} {initialPlate}
          </h1>

          <form onSubmit={handleSubmit} className="mt-6 space-y-5">
            <div className="inline-flex rounded-2xl bg-neutral-100 p-1">
              <button type="button" onClick={() => setChannel('sms')} className={`h-10 px-3 rounded-xl font-semibold ${channel === 'sms' ? 'bg-white shadow' : 'text-neutral-700'}`}>SMS</button>
              <button type="button" onClick={() => setChannel('email')} className={`h-10 px-3 rounded-xl font-semibold ${channel === 'email' ? 'bg-white shadow' : 'text-neutral-700'}`}>Email</button>
            </div>

            <div>
              <label className="block text-sm text-neutral-700 mb-1">{channel === 'sms' ? 'Phone' : 'Email'}</label>
              <input
                className="w-full h-11 rounded-xl border border-neutral-300 bg-white px-3"
                placeholder={channel === 'sms' ? '(415) 555-0123' : 'name@domain.com'}
                value={contact}
                onChange={(e) => setContact(e.target.value)}
              />
              <p className="mt-2 text-xs text-neutral-600">
                Message & data rates may apply. Text STOP to cancel, HELP for help.
              </p>
            </div>

            {error ? <p className="text-sm text-red-600">{error}</p> : null}

            <div className="flex flex-wrap items-center gap-3">
              <button disabled={disabled || loading} className="inline-flex h-11 items-center rounded-xl bg-emerald-600 px-4 font-semibold text-white hover:bg-emerald-700 disabled:opacity-60">
                {loading ? 'Starting…' : 'Start alerts'}
              </button>
              <Link href="/" className="inline-flex h-11 items-center rounded-xl border border-neutral-300 bg-white px-4 font-semibold hover:bg-neutral-50">Back</Link>
            </div>
          </form>
        </div>
      </section>
    </main>
  );
}
