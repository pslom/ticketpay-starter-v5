"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Aurora from "@/components/Aurora";
import GradientButton from "@/components/GradientButton";

export default function HomePage() {
  const router = useRouter();
  const [plate, setPlate] = useState("ABC123");
  const [stateVal, setStateVal] = useState("CA");

  return (
    <main className="relative mx-auto max-w-4xl px-4 py-12">
      {/* Background polish */}
      <div className="absolute inset-0 bg-grid -z-10" />
      <Aurora />

      <section className="animate-in space-y-3">
        <h1 className="text-5xl font-semibold tracking-tight">Stay ahead of parking tickets</h1>
        <p className="text-neutral-600 max-w-2xl">
          Real-time alerts in San Francisco. Enter your plate and we’ll notify you when a new ticket is posted.
        </p>
        <p className="text-sm text-neutral-500">Trusted by San Francisco drivers to avoid late fees.</p>
      </section>

      <div className="mt-8 gradient-border">
        <div className="inner p-5 sm:p-6">
          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              const q = new URLSearchParams({ plate: plate.toUpperCase(), state: stateVal.toUpperCase() }).toString();
              router.push(`/results?${q}`);
            }}
          >
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-[1fr_140px]">
              <label className="space-y-1.5">
                <span className="text-sm">Plate</span>
                <input
                  className="h-12 w-full rounded-xl border border-neutral-300 px-4"
                  placeholder="ABC123"
                  value={plate}
                  onChange={(e) => setPlate(e.target.value)}
                />
              </label>
              <label className="space-y-1.5">
                <span className="text-sm">State</span>
                <input
                  className="h-12 w-full rounded-xl border border-neutral-300 px-4 uppercase"
                  placeholder="CA"
                  value={stateVal}
                  onChange={(e) => setStateVal(e.target.value.toUpperCase())}
                  pattern="[A-Za-z]{2,3}"
                  required
                />
              </label>
            </div>

            <GradientButton type="submit">Get alerts</GradientButton>

            <p className="text-[12px] text-neutral-500 flex items-center gap-3">
              <span className="inline-flex items-center gap-1">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <path
                    d="M12 17a5 5 0 0 0 5-5V7l-5-3-5 3v5a5 5 0 0 0 5 5Z"
                    stroke="currentColor"
                    strokeWidth="1.6"
                  />
                </svg>
                Secure
              </span>
              <span>Private</span>
              <span>One‑tap unsubscribe</span>
              <a href="/consent" className="underline">
                SMS terms
              </a>
              <span>No spam. No sharing your info.</span>
            </p>
          </form>
        </div>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-neutral-200 bg-white p-4 transition hover:-translate-y-0.5">
          <div className="text-sm font-medium">1 · Search</div>
          <p className="text-sm text-neutral-600">Enter your plate (CA). We’ll check SF for open tickets.</p>
        </div>
        <div className="rounded-2xl border border-neutral-200 bg-white p-4 transition hover:-translate-y-0.5">
          <div className="text-sm font-medium">2 · Subscribe</div>
          <p className="text-sm text-neutral-600">Add email or SMS to get instant alerts on new tickets.</p>
        </div>
        <div className="rounded-2xl border border-neutral-200 bg-white p-4 transition hover:-translate-y-0.5">
          <div className="text-sm font-medium">3 · Stay ahead</div>
          <p className="text-sm text-neutral-600">Act early—before late fees ever hit.</p>
        </div>
      </div>
    </main>
  );
}
