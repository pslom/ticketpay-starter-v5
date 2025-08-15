"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Home() {
  const r = useRouter();
  const [plate, setPlate] = useState("");
  const [stateVal, setStateVal] = useState("CA");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string|null>(null);

  function onSubmit(e: React.FormEvent){
    e.preventDefault();
    setErr(null);
    const p = plate.trim().toUpperCase().replace(/\s+/g,"");
    const s = stateVal.trim().toUpperCase();
    if(!/^[A-Z0-9]{2,10}$/.test(p)) return setErr("Enter a valid plate (letters/numbers).");
    if(!/^[A-Z]{2,3}$/.test(s)) return setErr("Enter a 2–3 letter state code.");
    setBusy(true);
    r.push(`/results?plate=${encodeURIComponent(p)}&state=${encodeURIComponent(s)}`);
  }

  return (
    <main className="mx-auto max-w-md px-4 py-10 space-y-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold">Check a plate. Get alerts. Avoid late fees.</h1>
        <p className="text-sm text-neutral-500">We pull ticket data direct from the City of SF. No spam, ever.</p>
      </header>

      <form onSubmit={onSubmit} className="space-y-4 rounded-2xl border border-[var(--border)] p-4" aria-describedby="form-help">
        <label className="block space-y-1">
          <span className="text-sm">Plate</span>
          <input
            aria-label="License plate"
            value={plate}
            onChange={(e)=>setPlate(e.target.value)}
            className="h-12 w-full rounded-xl border border-neutral-300 px-4"
            placeholder="7ABC123"
            inputMode="text"
            autoCapitalize="characters"
          />
        </label>

        <label className="block space-y-1">
          <span className="text-sm">State</span>
          <input
            aria-label="State"
            value={stateVal}
            onChange={(e)=>setStateVal(e.target.value.toUpperCase())}
            className="h-12 w-full rounded-xl border border-neutral-300 px-4 uppercase"
            placeholder="CA"
          />
        </label>

        <button
          type="submit"
          disabled={busy}
          className="h-12 w-full rounded-xl bg-[var(--primary)] text-white font-medium hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-black/30 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {busy ? "Searching…" : "Search Tickets"}
        </button>

        {err && <p className="text-sm text-[var(--error)]" role="alert">{err}</p>}
        <p id="form-help" className="text-xs text-neutral-500">We only store your plate if you subscribe to alerts. Unsubscribe anytime.</p>
      </form>

      <section className="space-y-2">
        <h2 className="text-sm font-medium">Questions</h2>
        <div className="rounded-xl border border-[var(--border)] p-3 text-sm text-neutral-700">
          <details className="mb-2">
            <summary className="cursor-pointer font-medium">Where does the data come from?</summary>
            <div className="mt-1 text-neutral-600">Official City of SF records.</div>
          </details>
          <details className="mb-2">
            <summary className="cursor-pointer font-medium">Do you take payments?</summary>
            <div className="mt-1 text-neutral-600">We link to the city’s secure payment page.</div>
          </details>
          <details>
            <summary className="cursor-pointer font-medium">How is my data used?</summary>
            <div className="mt-1 text-neutral-600">Only to send alerts for this plate. Opt out anytime.</div>
          </details>
        </div>
      </section>

      <footer className="text-center text-xs text-neutral-500">
        Powered by TicketPay · <a className="underline" href="/privacy">Privacy</a> · <a className="underline" href="/terms">Terms</a>
      </footer>
    </main>
  );
}
