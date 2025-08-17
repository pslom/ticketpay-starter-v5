"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export const dynamic = "force-dynamic";

export default function Home() {
  const router = useRouter();
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
          const q = new URLSearchParams({
            plate: plate.toUpperCase(),
            state: stateVal.toUpperCase(),
          }).toString();
          router.push(`/results?${q}`);
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
            />
          </label>

          <label className="block space-y-1">
            <span className="text-sm">State</span>
            <input
              value={stateVal}
              onChange={(e) => setStateVal(e.target.value.toUpperCase())}
              className="h-12 w-full rounded-xl border border-neutral-300 px-4 uppercase"
              placeholder="CA"
              pattern="[A-Za-z]{2,3}"
              title="2–3 letters"
              required
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
    </main>
  );
}
