'use client';

import { useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';

type Channel = 'email' | 'sms';

function isValidEmail(v: string) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()); }
function normalizePhone(v: string) { return v.replace(/[^\d]/g, ''); }
function isValidUsPhone(v: string) { return normalizePhone(v).length === 10; }

export default function AlertSubscribeCard({
  smsEnabled = false,
  manageHref = '/manage',
}: {
  smsEnabled?: boolean;
  manageHref?: string;
}) {
  const sp = useSearchParams();
  const plate = sp.get('plate') || 'ABC123';
  const state = sp.get('state') || 'CA';

  const [channel, setChannel] = useState<Channel>('email');
  const [value, setValue] = useState('');
  const [touched, setTouched] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);

  const hasError = useMemo(() => {
    if (!touched) return false;
    if (channel === 'email') return value.trim() !== '' && !isValidEmail(value);
    return value.trim() !== '' && !isValidUsPhone(value);
  }, [touched, value, channel]);

  const isValid = useMemo(() => {
    if (channel === 'email') return isValidEmail(value);
    return isValidUsPhone(value);
  }, [value, channel]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setTouched(true);
    if (!isValid || submitting) return;
    setSubmitting(true);
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          plate, state, channel,
          value: channel === 'sms' ? normalizePhone(value) : value.trim(),
        }),
      });
      if (!res.ok) {
        const text = await res.text();
        // Handle Postgres duplicate (23505) or API-provided 409
        if (res.status === 409 || /duplicate key|23505/i.test(text)) {
          alert(
            `You already have ${state.toUpperCase()} ${plate.toUpperCase()} on this contact. ` +
            `You can manage or add another plate from Manage alerts.`
          );
          setSubmitting(false);
          return;
        }
        alert('Something went wrong. Please try again.');
        setSubmitting(false);
        return;
      }
      setSuccessOpen(true);
    } finally {
      setSubmitting(false);
    }
  }

  const inputId = channel === 'email' ? 'email' : 'phone';
  const helperId = `${inputId}-help`;

  const basePill = 'px-3 py-1.5 text-sm rounded-full border transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2';
  const activePill = 'bg-emerald-600 text-white border-emerald-600';
  const inactivePill = 'bg-white text-gray-900 border-gray-300 hover:bg-gray-50';

  return (
    <div className="w-full">
      <div className="flex justify-end">
        <a href={manageHref} className="text-sm text-gray-600 hover:text-gray-900 underline underline-offset-2">
          Manage alerts
        </a>
      </div>

      <div className="mt-3 rounded-2xl bg-white shadow-card ring-1 ring-black/5 p-6 sm:p-8">
        <h2 className="text-3xl font-extrabold text-gray-900 text-center">Alerts for {state} {plate}</h2>
        <p className="mt-2 text-center text-gray-600">Get an alert when a new ticket posts. Unsubscribe anytime.</p>

        <div className="mt-6 flex justify-center">
          <div role="tablist" aria-label="Choose alert channel" className="inline-flex gap-2">
            <button
              type="button"
              role="tab"
              aria-selected={channel === 'email'}
              className={`${basePill} ${channel === 'email' ? activePill : inactivePill}`}
              onClick={() => !submitting && setChannel('email')}
              disabled={submitting}
            >
              EMAIL
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={channel === 'sms'}
              className={`${basePill} ${channel === 'sms' ? activePill : inactivePill} ${!smsEnabled ? 'opacity-50 cursor-not-allowed' : ''}`}
              onClick={() => smsEnabled && !submitting && setChannel('sms')}
              disabled={submitting || !smsEnabled}
              aria-disabled={!smsEnabled}
              title={smsEnabled ? 'Get SMS alerts' : 'SMS coming soon'}
            >
              SMS{!smsEnabled ? ' · Soon' : ''}
            </button>
          </div>
        </div>

        <form className="mt-5 max-w-md mx-auto space-y-3" onSubmit={handleSubmit} noValidate>
          <div>
            <label htmlFor={inputId} className="block text-sm font-medium text-gray-900">
              {channel === 'email' ? 'Email address' : 'Mobile number'}
            </label>
            <input
              id={inputId}
              name={inputId}
              type={channel === 'email' ? 'email' : 'tel'}
              inputMode={channel === 'email' ? 'email' : 'tel'}
              autoComplete={channel === 'email' ? 'email' : 'tel'}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onBlur={() => setTouched(true)}
              aria-invalid={hasError ? 'true' : 'false'}
              aria-describedby={helperId}
              placeholder={channel === 'email' ? 'you@example.com' : '415 555 0123'}
              className={`mt-1 w-full rounded-lg border px-3 py-2.5 focus:outline-none focus:ring-2
                ${hasError ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-emerald-500'}`}
            />
            <p id={helperId} className={`mt-1 text-xs ${hasError ? 'text-red-600' : 'text-gray-500'}`} aria-live="polite">
              {submitting
                ? 'Sending…'
                : !touched || value.trim() === ''
                  ? channel === 'email' ? 'We’ll send a confirmation first.' : (smsEnabled ? 'US mobile only.' : 'SMS alerts are coming soon.')
                  : hasError
                    ? channel === 'email' ? 'Use a valid email like name@domain.com' : 'Enter a 10-digit US mobile number'
                    : 'Looks good.'}
            </p>
          </div>

          <button
            type="submit"
            disabled={!isValid || submitting}
            className={`w-full sm:max-w-[360px] mx-auto rounded-lg px-4 py-3 font-medium text-white
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2
              ${!isValid || submitting ? 'bg-gray-300 text-gray-700' : 'bg-gray-900 hover:bg-gray-800'}`}
          >
            {submitting ? 'Sending…' : channel === 'email' ? 'Start email alerts' : 'Start SMS alerts'}
          </button>

          <p className="text-[11px] leading-5 text-gray-500 text-center">
            By subscribing, you agree to get alerts for this plate. Msg &amp; data rates may apply. Reply STOP to cancel. See our <a href="/consent" className="underline underline-offset-2">Consent policy</a>.
          </p>
        </form>
      </div>

      {successOpen && (
        <div role="dialog" aria-modal="true" className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-lg ring-1 ring-gray-200">
            <h3 className="text-xl font-semibold text-gray-900">You’re set.</h3>
            <p className="mt-2 text-gray-700">We’ll alert you when {state} {plate} gets a new ticket. Want SMS too?</p>
            <div className="mt-5 flex flex-wrap gap-3">
              <button
                type="button"
                className="rounded-lg bg-emerald-600 px-4 py-2 text-white hover:bg-emerald-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
                onClick={() => {
                  if (smsEnabled) { setChannel('sms'); setSuccessOpen(false); setTouched(false); setValue(''); }
                  else { window.location.href = '/sms-waitlist'; }
                }}
              >
                Add SMS
              </button>
              <a href={manageHref} className="rounded-lg border border-gray-300 px-4 py-2 text-gray-900 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2">
                Manage alerts
              </a>
              <button type="button" onClick={() => setSuccessOpen(false)} className="ml-auto text-gray-600 hover:text-gray-900 underline underline-offset-2">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
