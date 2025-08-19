"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */

import React from "react";
import { useSearchParams } from "next/navigation";
// import { Wordmark } from "@/components/Wordmark"; // unused
import { triggerConfetti } from "@/components/confetti";
import { useRouter } from "next/navigation";
import { track } from "@/lib/track";
import TogglePills from "@/components/TogglePills";
import { ResultsCopy } from "@/lib/copy";

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
    <main className="bg-white">
      <section className="mx-auto max-w-2xl px-4 py-8">
        {/* Header */}
        <div className="tp-fade">
          <h1 className="text-3xl font-bold text-neutral-900">{ResultsCopy.title}</h1>
          <p className="mt-2 text-neutral-700">{ResultsCopy.lead(plate || "—", state || "CA")}</p>
        </div>

        {/* Subscribe card */}
        <SubscribeBox plate={plate} state={state} />

        {/* Benefits */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="tp-card p-4">
            <h3 className="font-medium">Instant alerts</h3>
            <p className="tp-micro mt-1">Email or SMS the moment a ticket posts.</p>
          </div>
          <div className="tp-card p-4">
            <h3 className="font-medium">Clear status</h3>
            <p className="tp-micro mt-1">Know what’s open so you can act early.</p>
          </div>
          <div className="tp-card p-4">
            <h3 className="font-medium">Easy opt-out</h3>
            <p className="tp-micro mt-1">Every alert includes a direct unsubscribe link.</p>
          </div>
        </div>
      </section>
    </main>
  );
}

function maskPlate(p: string) {
  // keep last 2 chars: "7ABC123" -> "•••••23"
  return p.replace(/.(?=.{2})/g, "•");
}

// Removed old Card; using tp-card benefits above

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
    <div className="mt-6 rounded-2xl border border-black/10 bg-white p-5 shadow-card tp-fade" style={{animationDelay:"60ms"}}>
      <p className="text-sm text-neutral-800 mb-3">{ResultsCopy.subscribeLead}</p>
      <form onSubmit={onSubmit} className="space-y-3">
        <input className="hidden" name="company" autoComplete="off" tabIndex={-1} value={honey} onChange={(e)=>setHoney(e.target.value)} />
        <TogglePills
          value={channel}
          onChange={(v) => setChannel(v as any)}
          options={[
            { label: ResultsCopy.channelEmail, value: "email" },
            { label: ResultsCopy.channelSms, value: "sms" },
          ]}
        />

        <div className="mt-3">
          <input
            className="tp-input"
            placeholder={channel === "email" ? ResultsCopy.inputEmailPlaceholder : ResultsCopy.inputPhonePlaceholder}
            inputMode={channel === "email" ? "email" : "tel"}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            required
          />
        </div>

        {err && <p className="text-sm text-red-600">{err}</p>}
        {subMsg && <p className="text-sm text-green-600">{subMsg}</p>}

        <button type="submit" disabled={loading || !value} className="tp-btn mt-1">
          {ResultsCopy.ctaSubscribe}
        </button>
      </form>

      <p className="tp-micro mt-3">
        By subscribing, you agree to receive alerts for this plate. Msg &amp; data rates may apply.
        Reply STOP to cancel, HELP for help. See our <a href="/consent" className="underline">Consent policy</a>.
      </p>
    </div>
  );
}
