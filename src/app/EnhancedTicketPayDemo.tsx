"use client";
import React, { useState } from 'react';
import { ChevronRight, Check, AlertCircle, Clock, Mail, MessageSquare } from 'lucide-react';

// Unified tokens and constants
const TP_GREEN = 'from-[#0F5A37] to-[#0B472C]';
const TP_GREEN_SOLID = 'bg-[#0F5A37]';
const TP_GREEN_HOVER = 'hover:bg-[#106240]';
const TP_SURFACE = 'bg-[#F7F5F2]';
const TP_SHADOW = 'shadow-[0_12px_28px_rgba(16,30,25,0.14)]';
const TP_RADIUS = 'rounded-2xl';

export default function EnhancedTicketPay() {
  const [plate, setPlate] = useState('');
  const [state, setState] = useState('CA');
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [channel, setChannel] = useState<'email' | 'sms'>('email');
  const [contactValue, setContactValue] = useState('');
  const [plateError, setPlateError] = useState('');

  const handlePlateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
    setPlate(value);
    setPlateError('');
    if (value && !/^[A-Z0-9]{1,8}$/.test(value)) setPlateError('Use letters and numbers only');
  };

  const handleSearch = async () => {
    if (!plate || plateError) return;
    setIsLoading(true);
    await new Promise(r => setTimeout(r, 700));
    setIsLoading(false);
    setShowResults(true);
  };

  const handleSubscribe = async () => {
    if (!contactValue) return;
    setIsLoading(true);
    await new Promise(r => setTimeout(r, 600));
    setIsLoading(false);
    alert("You're set. We’ll alert you immediately when a ticket posts.");
  };

  const states = ['CA', 'NY', 'TX', 'FL', 'IL', 'PA', 'OH', 'GA', 'NC', 'MI'];

  if (showResults) {
    return (
      <ResultsPage
        plate={plate}
        state={state}
        channel={channel}
        setChannel={setChannel}
        contactValue={contactValue}
        setContactValue={setContactValue}
        handleSubscribe={handleSubscribe}
        isLoading={isLoading}
        onBack={() => setShowResults(false)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-black/5 bg-white/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <div className={`grid h-8 w-8 place-items-center rounded-lg ${TP_GREEN_SOLID}`}>
              <span className="text-sm font-bold text-white">TP</span>
            </div>
            <span className="font-semibold text-neutral-900">TicketPay</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-neutral-600">
            <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
            <span>Powered by City of SF Data</span>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-10 md:py-16">
        {/* Split hero: left message, right form */}
        <section className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_480px]">
          {/* Left — civic authority + checklist */}
          <div className={`relative overflow-hidden ${TP_RADIUS} ${TP_SHADOW}`}>
            <div className={`absolute inset-0 bg-gradient-to-br ${TP_GREEN}`} />
            <div className="relative p-8 text-white sm:p-10 lg:p-12">
              <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
                Never miss a ticket deadline.
              </h1>
              <p className="mt-4 max-w-md text-lg text-white/90">
                Instant SF ticket alerts by text or email. We’ll keep watch so you don’t have to.
              </p>
              <TrustChecklist />
              <div className="mt-6 border-t border-white/10 pt-4 text-sm text-white/80">
                SMS terms · No spam
              </div>
            </div>
          </div>

          {/* Right — form on warm surface */}
          <div className="flex items-start">
            <div className={`${TP_SURFACE} ${TP_RADIUS} ${TP_SHADOW} w-full max-w-md p-6 sm:p-7`}>
              {/* Plate input */}
              <div className="space-y-4">
                <div>
                  <label className="mb-1 block text-[15px] font-medium text-neutral-800">
                    License plate
                  </label>
                  <input
                    type="text"
                    value={plate}
                    onChange={handlePlateChange}
                    placeholder="7ABC123"
                    maxLength={8}
                    className="w-full rounded-xl border border-neutral-300 bg-white px-4 py-3 font-mono text-lg uppercase outline-none ring-0 transition focus:ring-2 focus:ring-emerald-300"
                    autoCapitalize="characters"
                    autoComplete="off"
                  />
                  {plateError && (
                    <p className="mt-1 flex items-center gap-1 text-xs text-red-600">
                      <AlertCircle className="h-3 w-3" />
                      {plateError}
                    </p>
                  )}
                </div>

                {/* State selector (touch-friendly) */}
                <div>
                  <label className="mb-1 block text-[15px] font-medium text-neutral-800">
                    State
                  </label>
                  <div className="grid grid-cols-5 gap-2">
                    {states.map(s => (
                      <button
                        type="button"
                        key={s}
                        onClick={() => setState(s)}
                        className={[
                          'rounded-xl px-3 py-2 text-sm font-medium transition',
                          state === s
                            ? `${TP_GREEN_SOLID} text-white shadow-md`
                            : 'bg-neutral-100 text-neutral-800 hover:bg-neutral-200',
                        ].join(' ')}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* CTA */}
              <button
                onClick={handleSearch}
                disabled={!plate || !!plateError || isLoading}
                className={[
                  'mt-6 w-full rounded-xl px-6 py-4 font-semibold text-white transition',
                  (!plate || !!plateError || isLoading)
                    ? 'cursor-not-allowed bg-neutral-300'
                    : `${TP_GREEN_SOLID} ${TP_GREEN_HOVER} ${TP_SHADOW}`,
                ].join(' ')}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <Spinner /> Checking…
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    Get ticket alerts <ChevronRight className="h-5 w-5" />
                  </span>
                )}
              </button>

              {/* Trust microcopy row */}
              <div className="mt-4 flex items-center justify-between">
                <div className="tp-micro flex items-center gap-1 text-[13px] text-neutral-600">
                  <LockIcon className="h-3.5 w-3.5 text-[#0F5A37]" />
                  Unsubscribe anytime.
                </div>
                <div className="tp-micro text-[13px] text-neutral-600">Powered by City of SF Data</div>
              </div>
            </div>
          </div>
        </section>

        {/* Inline value preview */}
        <section className="mx-auto mt-12 max-w-lg">
          <p className="mb-3 text-center text-sm font-medium text-neutral-700">Here’s what you’ll get:</p>
          <ExampleAlert />
          <p className="mt-3 text-center text-sm text-neutral-600">You’d get this instantly by email or text.</p>
        </section>
      </main>
    </div>
  );
}

// ... ResultsPage, TrustChecklist, Toggle, BenefitCard, ExampleAlert, Spinner, ShieldIcon, LockIcon, DotIcon ...
// (Paste the rest of your code here, unchanged)
