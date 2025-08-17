export default function Home() {
  return (
    <main className="mx-auto max-w-md px-4 py-10 space-y-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold">Check a plate. Get alerts. Avoid late fees.</h1>
        <p className="text-sm text-neutral-500">We pull ticket data direct from the City of SF. No spam, ever.</p>
      </header>

      {/* Pure HTML form → /results?plate=...&state=... */}
      <form action="/results" method="GET" className="space-y-4 rounded-2xl border border-neutral-200 p-4" aria-describedby="form-help">
        <label className="block space-y-1">
          <span className="text-sm">Plate</span>
          <input
            name="plate"
            className="h-12 w-full rounded-xl border border-neutral-300 px-4"
            placeholder="7ABC123"
            inputMode="text"
            autoCapitalize="characters"
            required
            pattern="[A-Za-z0-9]{2,10}"
            title="2–10 letters or numbers"
          />
        </label>

        <label className="block space-y-1">
          <span className="text-sm">State</span>
          <input
            name="state"
            className="h-12 w-full rounded-xl border border-neutral-300 px-4 uppercase"
            placeholder="CA"
            required
            pattern="[A-Za-z]{2,3}"
            title="2–3 letters"
            onInput={(e:any)=>{ e.target.value = (e.target.value||'').toUpperCase(); }}
          />
        </label>

        <button
          type="submit"
          className="h-12 w-full rounded-xl bg-black text-white font-medium hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-black/30"
        >
          Search Tickets
        </button>

        <p id="form-help" className="text-xs text-neutral-500">We only store your plate if you subscribe to alerts. Unsubscribe anytime.</p>
      </form>

      <footer className="text-center text-xs text-neutral-500">
        Powered by TicketPay · <a className="underline" href="/privacy">Privacy</a> · <a className="underline" href="/terms">Terms</a>
      </footer>
    </main>
  );
}
