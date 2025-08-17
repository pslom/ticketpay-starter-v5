'use client';

import { useRouter } from "next/navigation";
import React from "react";
import Wordmark from "@/components/Wordmark";

export default function HomePage() {
  const router = useRouter();
  const [plate, setPlate] = React.useState("");
  const [state] = React.useState("CA");
  const [err, setErr] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    const p = plate.trim().toUpperCase();
    if (!p) { setErr("Enter your plate"); return; }
    setLoading(true);
    try {
      const q = new URLSearchParams({ plate: p, state });
      router.push(`/results?${q}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-dvh bg-white text-black">
      {/* Single sticky header (links home) */}
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur border-b border-black/5">
        <div className="mx-auto max-w-2xl px-4 h-14 flex items-center justify-between">
          <a href="/" className="hover:opacity-90" aria-label="TicketPay home">
            <Wordmark />
          </a>
          <a href="/manage" className="rounded-full px-3 py-1.5 text-sm border border-black/10 hover:bg-black/5">
            Manage alerts
          </a>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-gradient-to-b from-[#f4f2ff] to-white">
        <div className="mx-auto max-w-2xl px-4 py-12">
          <h1 className="text-3xl font-semibold tracking-tight">Stay ahead of parking tickets</h1>
          <p className="mt-2 text-sm text-gray-600">
            Real-time alerts in San Francisco. Enter your plate and we’ll notify you the instant a new ticket is posted.
          </p>

          {/* Card */}
          <form onSubmit={onSubmit} className="mt-8 rounded-2xl border border-black/10 bg-white p-5 shadow-sm space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-[1fr_140px]">
              <label className="block space-y-1">
                <span className="text-sm font-medium">Plate</span>
                <input
                  className="h-12 w-full rounded-xl border border-gray-300 bg-gray-50 px-4 text-[16px] focus:outline-none focus:ring-2 focus:ring-[#667eea]"
                  placeholder="ABC123"
                  value={plate}
                  onChange={(e) => setPlate(e.target.value)}
                  autoCapitalize="characters"
                  required
                />
              </label>

              <label className="block space-y-1">
                <span className="text-sm font-medium">State</span>
                <input
                  className="h-12 w-full rounded-xl border border-gray-300 bg-gray-100 px-4 text-[16px]"
                  value={state}
                  readOnly
                  aria-label="California only"
                />
                <p className="mt-1 text-xs text-gray-500">CA only (SF).</p>
              </label>
            </div>

            {err && <p className="text-sm text-red-600">{err}</p>}

            <button
              type="submit"
              disabled={loading || !plate}
              className="h-12 w-full rounded-2xl bg-black text-white font-medium transition transform hover:scale-[1.01] active:scale-[0.99] disabled:opacity-60"
            >
              {loading ? "Checking…" : "Get alerts"}
            </button>

            {/* Trust row */}
            <div className="flex flex-wrap gap-6 pt-1 text-xs text-gray-600">
              <TrustItem icon="lock">Private</TrustItem>
              <TrustItem icon="shield">Secure</TrustItem>
              <TrustItem icon="arrow">One-tap unsubscribe</TrustItem>
            </div>
          </form>

          {/* Steps */}
          <div className="mt-10 grid grid-cols-1 gap-3 sm:grid-cols-3">
            <StepCard n={1} title="Search" desc="Enter your plate (CA). We’ll check SF for open tickets." />
            <StepCard n={2} title="Subscribe" desc="Add email or SMS to get instant alerts on new tickets." />
            <StepCard n={3} title="Stay ahead" desc="Act early—before late fees ever hit." />
          </div>
        </div>
      </section>

      <footer className="mx-auto max-w-2xl px-4 py-8 text-[11px] text-gray-500">
        © TicketPay • San Francisco, CA · <a href="/support" className="underline">Support</a>
      </footer>

      {/* Tailwind safelist sentinel */}
      <span className="sr-only opacity-100 translate-y-0"></span>
    </main>
  );
}

function StepCard({ n, title, desc }: { n: number; title: string; desc: string }) {
  return (
    <div className="rounded-xl border border-black/10 bg-white p-4 shadow-sm">
      <div className="text-sm font-medium">{n} · {title}</div>
      <p className="mt-1 text-xs text-gray-600">{desc}</p>
    </div>
  );
}

function TrustItem({ icon, children }: { icon: "lock" | "shield" | "arrow"; children: React.ReactNode }) {
  return (
    <div className="inline-flex items-center gap-2">
      <Icon kind={icon} />
      <span>{children}</span>
    </div>
  );
}

function Icon({ kind, className = "h-4 w-4" }: { kind: "lock" | "shield" | "arrow"; className?: string }) {
  if (kind === "lock") {
    return (
      <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8">
        <rect x="4" y="10" width="16" height="10" rx="2" />
        <path d="M8 10V7a4 4 0 1 1 8 0v3" />
      </svg>
    );
  }
  if (kind === "shield") {
    return (
      <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M12 3l7 3v6c0 4.5-3 8-7 9-4-1-7-4.5-7-9V6l7-3z" />
        <path d="M9.5 12.5l1.8 1.8 3.7-3.7" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M5 12h12" />
      <path d="M13 6l6 6-6 6" />
    </svg>
  );
}
