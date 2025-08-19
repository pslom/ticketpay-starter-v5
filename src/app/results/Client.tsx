'use client';

/* eslint-disable @typescript-eslint/no-explicit-any */

import React from "react";
import { useSearchParams } from "next/navigation";
// import { Wordmark } from "@/components/Wordmark"; // unused
import { triggerConfetti } from "@/components/confetti";
import { useRouter } from "next/navigation";
import { track } from "@/lib/track";

export default function ResultsClient() {
  const sp = useSearchParams();
  const plate = (sp.get("plate") || "").toUpperCase();
  const state = (sp.get("state") || "CA").toUpperCase();
  const router = useRouter();


  React.useEffect(() => {
    const cards = document.querySelectorAll<HTMLElement>('[data-reveal]');
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const el = entry.target as HTMLElement;
          el.classList.remove('opacity-0','translate-y-1');
          el.classList.add('opacity-100','translate-y-0');
          io.unobserve(el);
        }
      });
    }, { threshold: 0.12 });
    cards.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <main className="min-h-dvh bg-gray-50 text-black">

      <section className="mx-auto max-w-2xl px-4 py-10">
        <div className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-gray-50 px-3 py-1 text-xs text-gray-700">
          San Francisco · CA
        </div>

  <h1 className="mt-2 text-2xl font-semibold tp-fade">Check your plate & get alerts</h1>
        <p className="mt-2 text-sm text-gray-600">
          Results for <span className="font-mono">{plate || "—"}</span>{state ? ` (${state})` : ""}.
          If a new ticket posts in San Francisco, we’ll notify you instantly.
        </p>

        <div className="mt-6 rounded-2xl border border-dashed border-gray-200 p-5 text-sm text-gray-600">
          <ul className="space-y-1">
            <li>• We’ll show open tickets here (if any are found).</li>
            <li>• Subscribe to get real-time alerts for new tickets in SF.</li>
            <li>• Private. Secure. One-tap unsubscribe anytime.</li>
          </ul>
        </div>

        <SubscribeBox plate={plate} state={state} />

        <div className="mt-10 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <Card title="Instant alerts" desc="Email or SMS the moment a ticket posts." />
          <Card title="Clear status" desc="Know what’s open so you can act early." />
          <Card title="Easy opt-out" desc="Every alert includes a direct unsubscribe link." />
        </div>
      </section>

      <footer className="mx-auto max-w-2xl px-4 pb-10 text-[11px] text-gray-500">
        © TicketPay • San Francisco, CA
      </footer>
      <span className="sr-only opacity-100 translate-y-0"></span>
    </main>
  );
}

function maskPlate(p: string) {
  // keep last 2 chars: "7ABC123" -> "•••••23"
  return p.replace(/.(?=.{2})/g, "•");
}

function Card({ title, desc }: { title: string; desc: string }) {
  return (
    <div data-reveal className="opacity-0 translate-y-1 transition-all duration-500 rounded-xl border border-black/10 bg-white p-4 shadow-sm">
      <div className="text-sm font-medium">{title}</div>
      <p className="mt-1 text-xs text-gray-600">{desc}</p>
    </div>
  );
}

function SubscribeBox({ plate, state }: { plate: string; state: string }) {
  const [channel, setChannel] = React.useState<'email'|'sms'>('email');
  const [value, setValue] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [err, setErr] = React.useState<string | null>(null);
  const [ok, setOk] = React.useState(false);
  const [honey, setHoney] = React.useState('');
  const [subMsg, setSubMsg] = React.useState('');

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    if (honey) { setErr('Something went wrong. Please try again.'); return; }

    const plateNorm = (plate || '').trim().toUpperCase();
    const stateNorm = (state || '').trim().toUpperCase();
    if (!plateNorm || !stateNorm) { setErr('Enter your plate and state.'); return; }

    const payload: any = { plate: plateNorm, state: stateNorm, city: '', channel, value: '' };

    if (channel === 'email') {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) { setErr('Enter a valid email address.'); return; }
      payload.value = value.trim();
    } else {
      const digits = value.replace(/\D/g, '');
      if (digits.length !== 10) { setErr('Enter a valid US mobile number.'); return; }
      payload.value = `+1${digits}`;
    }

    setLoading(true);
    try {
      const r = await fetch('/api/optin/start', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await r.json().catch(()=> ({}));
      if (!r.ok || !data?.ok) throw new Error(data?.error || `Opt-in failed (${r.status})`);
      setOk(true);
      setSubMsg("Subscribed. You’ll get alerts.");
      triggerConfetti();
    } catch (e: any) {
      setErr(e?.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  }

  if (ok) {
    return (
      <div className="mt-6 rounded-2xl border border-blue-200 bg-blue-50 p-5">
        <h3 className="text-base font-semibold text-blue-900">Check your inbox/phone</h3>
        <p className="mt-1 text-sm text-blue-900/80">
          We just sent a confirmation link to finish signup. Once confirmed, alerts start instantly for San Francisco.
        </p>
      </div>
    );
  }

  return (
    <div className="mt-6 rounded-2xl border border-black/10 bg-white p-5 shadow-card tp-fade">
      <h3 className="text-base font-semibold">Get alerts for {plate || 'your plate'} ({state})</h3>
      <p className="mt-1 text-sm text-gray-600">San Francisco · CA</p>

      <form onSubmit={onSubmit} className="mt-4 space-y-3">
        <input className="hidden" name="company" autoComplete="off" tabIndex={-1} value={honey} onChange={(e)=>setHoney(e.target.value)} />

        <div className="flex gap-6">
          <label className="inline-flex items-center gap-2">
            <input type="radio" name="channel" value="email" checked={channel==='email'} onChange={()=>setChannel('email')} />
            <span>Email</span>
          </label>
          <label className="inline-flex items-center gap-2">
            <input type="radio" name="channel" value="sms" checked={channel==='sms'} onChange={()=>setChannel('sms')} />
            <span>SMS</span>
          </label>
        </div>

        <div>
          <label className="sr-only" htmlFor="contact">Contact</label>
          <input
            id="contact"
            className="tp-input"
            placeholder={channel==='email' ? 'you@example.com' : '(415) 555-0123'}
            value={value}
            onChange={(e)=>setValue(e.target.value)}
            inputMode={channel==='email' ? 'email' : 'tel'}
            required
          />
          <p className="mt-1 tp-micro">
            By subscribing, you agree to receive alerts for this plate. Msg & data rates may apply. Reply STOP to cancel, HELP for help. See our{" "}
            <a href="/consent" className="underline">Consent policy</a>.
          </p>
        </div>

        {err && <p className="text-sm text-red-600">{err}</p>}
        {subMsg && <p className="text-sm text-green-600">{subMsg}</p>}

        <button
          type="submit"
          disabled={loading || !value}
          className="inline-flex items-center justify-center rounded-2xl bg-black px-4 py-2 text-white font-medium transition transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60"
        >
          {loading ? 'Saving…' : 'Get alerts'}
        </button>
      </form>
    </div>
  );
}
