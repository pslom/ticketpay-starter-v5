"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function HomePage() {
  const router = useRouter();
  const [plate, setPlate] = useState("ABC123");
  const [stateVal, setStateVal] = useState("CA");

  return (
    <main className="mx-auto max-w-2xl px-4 py-12 space-y-8">
      {/* Removed duplicate header and TP badge */}
      <section className="space-y-2">
        <h1 className="text-4xl font-semibold">Stay ahead of parking tickets</h1>
        <p className="text-neutral-600">
          Real-time alerts in San Francisco. Enter your plate and we’ll notify you when a new ticket is posted.
        </p>
      </section>

      <form
        className="rounded-2xl border border-neutral-200 bg-white p-5 space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          const q = new URLSearchParams({
            plate: plate.toUpperCase(),
            state: stateVal.toUpperCase(),
          }).toString();
          router.push(`/results?${q}`);
        }}
      >
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-[1fr_120px]">
          <label className="space-y-1">
            <span className="text-sm">Plate</span>
            <input
              className="h-12 w-full rounded-xl border border-neutral-300 px-4"
              placeholder="ABC123"
              value={plate}
              onChange={(e) => setPlate(e.target.value)}
            />
          </label>
          <label className="space-y-1">
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

        <button type="submit" className="h-12 w-full rounded-xl bg-black text-white font-medium">
          Get alerts
        </button>

        <p className="text-[12px] text-neutral-500">
          Private • Secure • One‑tap unsubscribe • <a href="/consent" className="underline">SMS terms</a>
        </p>
      </form>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-neutral-200 bg-white p-4">
          <div className="text-sm font-medium">1 · Search</div>
          <p className="text-sm text-neutral-600">Enter your plate (CA). We’ll check SF for open tickets.</p>
        </div>
        <div className="rounded-2xl border border-neutral-200 bg-white p-4">
          <div className="text-sm font-medium">2 · Subscribe</div>
          <p className="text-sm text-neutral-600">Add email or SMS to get instant alerts on new tickets.</p>
        </div>
        <div className="rounded-2xl border border-neutral-200 bg-white p-4">
          <div className="text-sm font-medium">3 · Stay ahead</div>
          <p className="text-sm text-neutral-600">Act early—before late fees ever hit.</p>
        </div>
      </div>
    </main>
  );
}
