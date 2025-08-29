'use client';
import React from 'react';

export default function DemoAside() {
  // Static sample values for the preview only
  const sample = {
    state: 'CA',
    plate: '7ABC123',
    phone: '(415) 555-0123',
    fine: '$73',
    violation: 'Expired meter',
    location: 'Mission & 3rd',
    posted: '12m ago',
    due: '21 days'
  };

  return (
    <aside
      className="relative rounded-2xl border bg-white/70 backdrop-blur-sm p-4 md:p-6 shadow-sm w-full md:w-[520px] pointer-events-none select-none"
      aria-hidden="true"
    >
      <p className="mb-3 text-sm text-neutral-600 font-medium">What it looks like</p>

      <div className="grid gap-6 place-items-center">
        <div className="relative max-w-[340px] md:max-w-[360px] lg:max-w-[380px] pointer-events-none select-none">
          {/* iPhone frame */}
          <div className="relative w-[280px] h-[560px] rounded-[2.2rem] bg-neutral-900 shadow-2xl overflow-hidden">
            {/* Outer bevel */}
            <div className="absolute inset-0 rounded-[2.2rem] ring-1 ring-black/30" />

            {/* Dynamic Island / notch */}
            <div className="absolute left-1/2 -translate-x-1/2 top-2 w-28 h-6 bg-black/70 rounded-full" />

            {/* Subtle glass reflection */}
            <div className="pointer-events-none absolute inset-0 rounded-[2.2rem] opacity-20"
                 style={{
                   background:
                     'linear-gradient(135deg, rgba(255,255,255,.18) 0%, rgba(255,255,255,0) 40%)'
                 }} />

            {/* Screen */}
            <div className="absolute inset-[10px] rounded-[2rem] bg-white flex flex-col overflow-hidden">
              {/* Status / Title bar */}
              <div className="flex items-center justify-between px-4 pt-3 pb-2">
                <div className="text-[10px] text-neutral-400">9:41</div>
                <div className="text-xs font-semibold">TicketPay</div>
                <div className="text-[10px] text-neutral-400">•••</div>
              </div>

              {/* Messages area (fixed, no reflow) */}
              <div className="flex-1 bg-neutral-50 px-3 pb-3 overflow-hidden">
                <div className="mt-1 text-[10px] text-neutral-400 text-center">Today 9:41 AM</div>

                {/* Incoming bubble: ticket details */}
                <div
                  className="mt-3 max-w-[92%] rounded-2xl rounded-bl-sm px-3 py-2 text-[12px] leading-snug text-neutral-900 shadow-[0_1px_0_rgba(0,0,0,0.03)]"
                  style={{
                    background:
                      'linear-gradient(180deg, rgba(245,245,245,1) 0%, rgba(235,235,235,1) 100%)',
                    animation: 'bubbleIn .4s ease both'
                  }}
                >
                  <div className="font-semibold">New ticket for {sample.state} {sample.plate}</div>
                  <div className="mt-1">{sample.fine} • {sample.violation} • {sample.location}</div>
                  <div className="mt-1 text-[11px] text-neutral-600">Posted {sample.posted} • Due in {sample.due}</div>
                </div>

                {/* Incoming bubble: guidance */}
                <div
                  className="mt-2 max-w-[78%] rounded-2xl rounded-bl-sm px-3 py-2 text-[12px] leading-snug text-neutral-900 shadow-[0_1px_0_rgba(0,0,0,0.03)]"
                  style={{
                    background:
                      'linear-gradient(180deg, rgba(245,245,245,1) 0%, rgba(235,235,235,1) 100%)',
                    animation: 'bubbleIn .4s ease .08s both'
                  }}
                >
                  Pay safely at the official portal:
                </div>

                {/* Link pill */}
                <div
                  className="mt-2 inline-flex rounded-full bg-emerald-600 text-white text-[12px] font-semibold px-3 py-1.5 shadow-sm"
                  style={{ animation: 'bubbleIn .35s ease .16s both' }}
                >
                  Pay at SFMTA
                </div>

                {/* Footer line */}
                <div className="mt-3 text-[11px] text-neutral-500">SMS · {sample.phone}</div>
              </div>

              {/* Input bar (decorative) */}
              <div className="px-3 py-2 bg-white border-t">
                <div className="h-8 rounded-full bg-neutral-100" />
              </div>
            </div>
          </div>
          <p className="mt-3 text-[12px] text-neutral-500 text-center">Sample SMS (simulated)</p>
        </div>

        {/* Manage row preview (fixed height, won’t jitter) */}
        <div className="w-full rounded-xl border bg-white p-4 h-[96px]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-semibold">
                {sample.state}
              </span>
              <span className="font-semibold tracking-wide">{sample.plate}</span>
              <span className="rounded-full bg-emerald-100 text-emerald-800 text-xs px-2 py-0.5">
                Active
              </span>
            </div>
            <div className="flex items-center gap-2 opacity-60">
              <span className="rounded-lg border px-3 py-1 text-sm">Pause</span>
              <span className="rounded-lg border px-3 py-1 text-sm">Delete</span>
            </div>
          </div>
          <div className="mt-2 text-xs text-neutral-600">SMS · {sample.phone}</div>
        </div>
      </div>

      {/* Animations: disabled if user prefers reduced motion */}
      <style jsx>{`
        @media (prefers-reduced-motion: reduce) {
          * { animation: none !important; transition: none !important; }
        }
        @keyframes bubbleIn {
          from { opacity: 0; transform: translateY(6px) scale(0.99); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </aside>
  );
}
