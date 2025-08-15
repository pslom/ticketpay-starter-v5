"use client";

import { useState } from "react";

export default function Home() {
  const [plate, setPlate] = useState("7ABC123");
  const [stateVal, setStateVal] = useState("CA");

  return (
    <main className="mx-auto max-w-md px-4 py-10 space-y-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold">TicketPay</h1>
        <p className="text-sm text-neutral-500">
          Look up SF parking citations and subscribe to alerts.
        </p>
      </header>

      <form
        className="space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          console.log("Lookup:", { plate, state: stateVal });
          // TODO: navigate to /results?plate=...&state=...
        }}
      >
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <label className="block space-y-1">
            <span className="text-sm">Plate</span>
            <input
              value={plate}
              onChange={(e) => setPlate(e.target.value)}
              className="h-12 w-full rounded-xl border border-neutral-300 px-4"
              placeholder="7ABC123"
              inputMode="text"
            />
          </label>

          <label className="block space-y-1">
            <span className="text-sm">State</span>
            <input
              value={stateVal}
              onChange={(e) => setStateVal(e.target.value.toUpperCase())}
              className="h-12 w-full rounded-xl border border-neutral-300 px-4 uppercase"
              placeholder="CA"
            />
          </label>
        </div>

        <button
          type="submit"
          className="h-12 w-full rounded-xl bg-black text-white font-medium hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-black/30"
        >
          Search Tickets
        </button>
      </form>

      <footer className="text-center text-xs text-neutral-500">
        Powered by TicketPay ·{" "}
        <a className="underline" href="/privacy">
          Privacy
        </a>{" "}
        ·{" "}
        <a className="underline" href="/terms">
          Terms
        </a>
      </footer>
    </main>
  );
}
