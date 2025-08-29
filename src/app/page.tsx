import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

import PlateForm from "@/components/PlateForm";

function PhonePreview() {
  return (
    <div className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-sm">
      {/* Device shell */}
      <div className="relative mx-auto w-[340px]">
        <div className="relative rounded-[44px] bg-neutral-900 p-2 shadow-2xl">
          {/* Screen */}
          <div className="relative rounded-[36px] overflow-hidden bg-neutral-50">
            {/* Status area with notch */}
            <div className="relative h-10 bg-neutral-200/60">
              <div
                className="absolute left-1/2 -translate-x-1/2 top-0 w-40 h-6 bg-neutral-900 rounded-b-2xl"
                aria-hidden
              />
            </div>

            {/* Message content */}
            <div className="p-4 space-y-3">
              <div className="text-center text-[11px] text-neutral-500">TicketPay</div>

              <div className="rounded-2xl bg-white border border-neutral-200 p-3 text-[13px] leading-5 shadow-sm">
                <div className="font-semibold">New ticket for CA 7ABC123</div>
                <div className="text-neutral-600">$73 · Expired meter · Mission &amp; 3rd</div>
                <div className="text-neutral-500 text-[12px]">Posted 12m ago · Due in 21 days</div>
              </div>

              <div className="rounded-2xl bg-white border border-neutral-200 p-3 text-[13px] leading-5 shadow-sm">
                <div>Pay safely at the official portal:</div>
                <div className="mt-2 inline-flex rounded-full bg-emerald-600 text-white text-[12px] px-3 py-1.5">
                  Pay at SFMTA
                </div>
              </div>

              <div className="text-[12px] text-neutral-500">SMS · (415) 555-0123</div>
            </div>

            {/* Home indicator */}
            <div className="h-10 flex items-center justify-center">
              <div className="h-1.5 w-28 rounded-full bg-neutral-300" />
            </div>
          </div>
        </div>
      </div>

      <p className="mt-3 text-center text-xs text-neutral-500">Sample SMS (simulated)</p>
    </div>
  );
}

export default function Page() {
  return (
    <main className="min-h-[calc(100vh-56px)]">
      {/* USE the custom CSS class directly (no /50) */}
      <section className="bg-aurora-hero">
        <div className="mx-auto max-w-[1200px] px-4 md:px-6 py-10 md:py-14">
          <div className="grid md:grid-cols-12 gap-8">
            {/* Left (60%) */}
            <div className="md:col-span-7">
              <div className="bg-white rounded-2xl border border-neutral-200 p-6 md:p-8 shadow-sm">
                <div className="mb-3">
                  <span className="inline-flex items-center gap-2 text-xs px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100">
                    SF Bay Area • Deadline protection
                  </span>
                </div>
                <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight leading-tight">
                  Never pay a late fee <span className="text-emerald-700">ever again</span>
                </h1>
                <p className="mt-5 text-neutral-700">
                  SF ticket alerts by SMS or email. We remind you before fees hit.
                </p>

                <div className="mt-6">
                  <PlateForm />
                </div>
              </div>
            </div>

            {/* Right (40%) */}
            <div className="md:col-span-5">
              <div className="bg-white rounded-2xl border border-neutral-200 p-6 md:p-8 shadow-sm">
                <h3 className="text-sm font-medium text-neutral-700 mb-4">What it looks like</h3>
                <PhonePreview />
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
