'use client';

import React from "react";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();
  const [plate, setPlate] = React.useState("");
  const [state] = React.useState("CA"); // SF launch → CA only
  const [err, setErr] = React.useState("");
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);

    // Scroll-trigger fade for reveal cards (no dependencies)
    const cards = document.querySelectorAll<HTMLElement>('[data-reveal]');
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target as HTMLElement;
            el.classList.remove('opacity-0','translate-y-1');
            el.classList.add('opacity-100','translate-y-0');
            io.unobserve(el);
          }
        });
      },
      { threshold: 0.12 }
    );
    cards.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

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
      <section className="relative pb-2 pt-10 sm:pt-12" aria-label="Hero">
        <div
          className="pointer-events-none absolute inset-x-0 -top-24 h-56 blur-2xl"
          style={{ background: "linear-gradient(135deg,#667eea 0%,#764ba2 100%)", opacity: 0.15 }}
        />
        <div className="relative mx-auto max-w-2xl px-4">
          <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight">
            Stay ahead of parking tickets
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Real-time alerts in <span className="font-medium">San Francisco</span>. Enter your plate and we’ll notify you the instant a new ticket is posted.
          </p>
          <div className="mx-auto my-6 h-0.5 w-24 rounded-full" style={{ background: "linear-gradient(90deg,#667eea,#764ba2)" }} />
        </div>

        {/* Search Card */}
        <div className={`mx-auto max-w-2xl px-4 pt-2 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-1"} transition-all duration-300`}>
          <form onSubmit={onSubmit} className="rounded-2xl border border-black/10 bg-white p-5 shadow-sm">
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
                <p className="mt-1 text-[11px] text-gray-500">CA only</p>
              </div>
            </div>

            {err && <p className="mt-3 text-sm text-red-600">{err}</p>}

            <button
              type="submit"
              className="mt-5 h-12 w-full rounded-xl bg-black text-white font-medium text-[16px] hover:opacity-95 active:opacity-90 focus:outline-none focus:ring-2 focus:ring-black/30 transition transform hover:scale-[1.01] active:scale-[0.99]"
            >
              Get alerts
            </button>

            {/* Trust strip */}
            <div className="mt-4 grid grid-cols-3 gap-3 text-[11px] text-gray-600">
              <div className="flex items-center gap-2">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M12 2l7 4v6c0 5-3.5 9-7 10-3.5-1-7-5-7-10V6l7-4z" stroke="currentColor"/></svg>
                Private
              </div>
              <div className="flex items-center gap-2">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M12 17l-5 3 1.5-5.5L4 10l5.5-.5L12 4l2.5 5.5L20 10l-4.5 4.5L17 20l-5-3z" stroke="currentColor"/></svg>
                Secure
              </div>
              <div className="flex items-center gap-2">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor"/></svg>
                One-tap unsubscribe
              </div>
            </div>
          </form>
        </div>
      </section>

      {/* How it works + Features */}
      <section className="mx-auto max-w-2xl px-4 py-10">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div data-reveal className="opacity-0 translate-y-1 transition-all duration-500 rounded-xl border border-black/10 p-4">
            <div className="text-sm font-medium">1 · Search</div>
            <p className="mt-1 text-xs text-gray-600">Enter your plate (CA). We’ll check SF for open tickets.</p>
          </div>
          <div data-reveal className="opacity-0 translate-y-1 transition-all duration-500 rounded-xl border border-black/10 p-4">
            <div className="text-sm font-medium">2 · Subscribe</div>
            <p className="mt-1 text-xs text-gray-600">Add email or SMS to get instant alerts on new tickets.</p>
          </div>
          <div data-reveal className="opacity-0 translate-y-1 transition-all duration-500 rounded-xl border border-black/10 p-4">
            <div className="text-sm font-medium">3 · Stay ahead</div>
            <p className="mt-1 text-xs text-gray-600">Action items early—before late fees ever hit.</p>
          </div>
        </div>
      </section>

      <footer className="mx-auto max-w-2xl px-4 py-8 text-[11px] text-gray-500">
        © TicketPay • San Francisco, CA · <a href="/support" className="underline">Support</a>
      </footer>

      {/* Keep these classes in Tailwind build */}
      <span className="sr-only opacity-100 translate-y-0"></span>
    </main>
  );
}
