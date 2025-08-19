import Wordmark from "@/components/Wordmark";
import TrustList from "@/components/TrustList";
import { HomeCopy } from "@/lib/copy";

export default function HomePage() {
  return (
    <main className="min-h-[100svh] bg-white">
      <section className="mx-auto max-w-6xl px-4 py-10 grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Left: split-screen green pitch */}
        <div className="relative rounded-2xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-tp-green to-tp-greenDark" />
          <div className="relative p-8 sm:p-10 lg:p-12 text-white">
            <h1 className="tp-fade text-4xl sm:text-5xl font-extrabold tracking-tight">
              {HomeCopy.heroTitle}
            </h1>
            <p className="tp-fade mt-4 text-lg text-white/90 max-w-md" style={{animationDelay:"60ms"}}>
              Real-time SF ticket alerts by text or email. Secure, automatic, no spam.
            </p>
            <TrustList />
            <p className="mt-6 text-sm text-white/80">SMS terms · No spam</p>
          </div>
        </div>

        {/* Right: form card */}
        <div className="flex items-center">
          <div className="tp-card w-full max-w-md p-6 lg:p-7 tp-fade" style={{animationDelay:"80ms"}}>
            <div className="mb-4"><Wordmark /></div>
            <form action="/results" className="space-y-4">
              <div>
                <label className="tp-label">Plate</label>
                <input name="plate" className="tp-input" placeholder={HomeCopy.platePlaceholder} required autoCapitalize="characters"/>
              </div>
              <div>
                <label className="tp-label">State</label>
                <div className="relative">
                  <select name="state" className="tp-input appearance-none pr-10">
                    <option>CA</option>
                  </select>
                  {/* caret */}
                  <svg className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2" width="18" height="18" viewBox="0 0 20 20" aria-hidden="true">
                    <path d="M5 7l5 6 5-6" stroke="#0F5A37" strokeWidth="2" fill="none" strokeLinecap="round"/>
                  </svg>
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
