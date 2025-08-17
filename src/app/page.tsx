'use client';

import React from "react";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();
  const [plate, setPlate] = React.useState("");
  const [state] = React.useState("CA"); // SF launch → CA only
  const [err, setErr] = React.useState("");
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => setMounted(true), []);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr("");
    if (!plate.trim()) {
      setErr("Enter your plate to continue.");
      return;
    }
    const q = new URLSearchParams({ plate: plate.trim().toUpperCase(), state });
    router.push(`/results?${q}`);
  }

  return (
    <main className="min-h-dvh bg-white text-black">
      {/* Minimal sticky header */}
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur border-b border-black/5">
        <div className="mx-auto max-w-2xl px-4 h-14 flex items-center justify-between">
          <div className="text-base font-semibold tracking-tight">TicketPay</div>
          <a href="/manage" className="rounded-full px-3 py-1.5 text-sm border border-black/10 hover:bg-black/5">
            Manage alerts
          </a>
        </div>
      </header>

      {/* Hero with brand gradient accent */}
      <section
        className="relative pb-2 pt-10 sm:pt-12"
        aria-label="Hero"
      >
        <div
          className="pointer-events-none absolute inset-x-0 -top-24 h-56 blur-2xl"
          style={{
            background:
              "linear-gradient(135deg,#667eea 0%,#764ba2 100%)",
            opacity: 0.15,
          }}
        />
        <div className="relative mx-auto max-w-2xl px-4">
          <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight">
            Get ticket alerts
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Launching now in <span className="font-medium">San Francisco</span>. Enter your plate to get notified the moment a new ticket is posted. Unsubscribe anytime.
          </p>
        </div>

        {/* Card */}
        <div className={`mx-auto max-w-2xl px-4 pt-6 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-1"} transition-all duration-300`}>
          <form
            onSubmit={onSubmit}
            className="rounded-2xl border border-black/10 bg-white p-5 shadow-sm"
          >
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="sm:col-span-2">
                <label className="text-sm font-medium" htmlFor="plate">Plate</label>
                <input
                  id="plate"
                  className="mt-1 h-12 w-full rounded-xl border border-gray-300 px-4 text-[16px] focus:outline-none focus:ring-2 focus:ring-[#667eea]"
                  placeholder="ABC123"
                  value={plate}
                  onChange={(e) => setPlate(e.target.value.toUpperCase())}
                  inputMode="text"
                  autoComplete="off"
                  required
                />
              </div>

              <div>
                <label className="text-sm font-medium" htmlFor="state">State</label>
                <input
                  id="state"
                  className="mt-1 h-12 w-full rounded-xl border border-gray-300 px-4 text-[16px] bg-gray-50 text-gray-700"
                  value={state}
                  readOnly
                />
                <p className="mt-1 text-[11px] text-gray-500">CA only (SF launch)</p>
              </div>
            </div>

            {/* City is intentionally hidden for SF launch. Keep this note for future expansion. */}

            {err && <p className="mt-3 text-sm text-red-600">{err}</p>}

            <button
              type="submit"
              className="mt-5 h-12 w-full rounded-xl bg-black text-white font-medium text-[16px] hover:opacity-95 active:opacity-90 focus:outline-none focus:ring-2 focus:ring-black/30"
            >
              Check my plate
            </button>
          </form>

          <p className="mt-6 text-xs text-gray-500">
            No payments here. One-tap unsubscribe from every message.
          </p>
        </div>
      </section>

      {/* Mobile-first features section (short, keeps trust high) */}
      <section className="mx-auto max-w-2xl px-4 py-10">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="rounded-xl border border-black/10 p-4">
            <div className="text-sm font-medium">Fast alerts</div>
            <p className="mt-1 text-xs text-gray-600">SMS or email as soon as a ticket posts.</p>
          </div>
          <div className="rounded-xl border border-black/10 p-4">
            <div className="text-sm font-medium">Mobile-first</div>
            <p className="mt-1 text-xs text-gray-600">Large tap targets, quick load on mobile.</p>
          </div>
          <div className="rounded-xl border border-black/10 p-4">
            <div className="text-sm font-medium">One-tap unsubscribe</div>
            <p className="mt-1 text-xs text-gray-600">Every alert includes a direct opt-out.</p>
          </div>
        </div>
      </section>

      <footer className="mx-auto max-w-2xl px-4 py-8 text-[11px] text-gray-500">
        © TicketPay. Alerts for San Francisco plates. More cities coming soon.
      </footer>
    </main>
  );
}
