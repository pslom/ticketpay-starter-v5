"use client";
import Wordmark from "@/components/Wordmark";
import TrustList from "@/components/TrustList";
import { HomeCopy } from "@/lib/copy";
import { track, EVENTS } from "@/lib/track";

export default function HomePage() {
  // simple impression
  if (typeof window !== "undefined") track(EVENTS.VIEW_LANDING);

  return (
    <main className="min-h-[100svh] bg-white">
      <section className="mx-auto max-w-6xl px-4 py-10 grid grid-cols-1 lg:grid-cols-[1fr_480px] gap-10">
        {/* Left: hero */}
        <div className="relative rounded-2xl overflow-hidden tp-fade">
          <div className="absolute inset-0 tp-hero" />
          <div className="relative p-8 sm:p-10 lg:p-12 text-white">
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
              {HomeCopy.heroTitle}
            </h1>
            <p className="mt-4 text-lg text-white/90 max-w-md">
              Instant SF ticket alerts by text or email. We’ll keep watch so you don’t have to.
            </p>
            <TrustList />
            <div className="mt-6 pt-4 border-t border-white/10 text-sm text-white/80">SMS terms · No spam</div>
          </div>
        </div>

        {/* Right: form card */}
        <div className="flex items-start">
          <div className="tp-card w-full max-w-md p-6 lg:p-7 tp-fade" style={{animationDelay:"80ms"}}>
            <div className="mb-4"><Wordmark /></div>
            <form action="/results" className="space-y-4" onSubmit={()=>track(EVENTS.SUBMIT_PLATE)}>
              <div>
                <label className="tp-label">{HomeCopy.plateLabel}</label>
                <input name="plate" className="tp-input uppercase" placeholder={HomeCopy.platePlaceholder} required />
              </div>
              <div>
                <label className="tp-label">{HomeCopy.stateLabel}</label>
                <div className="relative">
                  <select name="state" className="tp-input appearance-none pr-10">
                    <option>CA</option>
                  </select>
                  <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-tp-green">
                    {/* caret */}
                    <svg width="18" height="18" viewBox="0 0 20 20" fill="none"><path d="M5 7l5 6 5-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
                  </span>
                </div>
              </div>
              <button type="submit" className="tp-btn w-full text-[18px] py-3.5">Get ticket alerts</button>
            </form>
            <div className="mt-4 flex items-center justify-between">
              <div className="tp-micro flex items-center gap-1">
                <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 10h12v10H6z" fill="#0F5A37"/><path d="M8 10V8a4 4 0 118 0v2" stroke="#0F5A37" strokeWidth="2" fill="none"/></svg>
                Unsubscribe anytime.
              </div>
              <div className="tp-micro">Powered by City of SF Data</div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
