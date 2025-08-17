'use client';

import React from "react";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();
  const [plate, setPlate] = React.useState("");
  const [state, setState] = React.useState("");
  const [city, setCity] = React.useState("");
  const [err, setErr] = React.useState("");

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr("");
    if (!plate || !state) {
      setErr("Enter your plate and state to continue.");
      return;
    }
    const q = new URLSearchParams({ plate, state, ...(city ? { city } : {}) }).toString();
    router.push(`/results?${q}`);
  }

  return (
    <main className="mx-auto max-w-2xl px-4 py-16">
      <header className="mb-8">
        <h1 className="text-3xl font-semibold tracking-tight">Get ticket alerts</h1>
        <p className="mt-2 text-sm text-gray-600">
          We’ll notify you the moment a new ticket posts for your plate. Unsubscribe anytime.
        </p>
      </header>

      <form onSubmit={onSubmit} className="rounded-2xl border border-gray-200 p-6 space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="sm:col-span-2">
            <label className="text-sm font-medium" htmlFor="plate">Plate</label>
            <input
              id="plate"
              className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2"
              placeholder="ABC123"
              value={plate}
              onChange={(e) => setPlate(e.target.value.toUpperCase())}
              required
              autoComplete="off"
            />
          </div>
          <div>
            <label className="text-sm font-medium" htmlFor="state">State</label>
            <input
              id="state"
              className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2"
              placeholder="DC"
              value={state}
              onChange={(e) => setState(e.target.value.toUpperCase())}
              required
              autoComplete="off"
              maxLength={2}
            />
          </div>
        </div>

        <div>
          <label className="text-sm font-medium" htmlFor="city">City (optional)</label>
          <input
            id="city"
            className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-2"
            placeholder="Washington"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            autoComplete="off"
          />
          <p className="mt-1 text-xs text-gray-500">Helps us route to the right feed if your state has multiple cities.</p>
        </div>

        {err && <p className="text-sm text-red-600">{err}</p>}

        <button
          type="submit"
          className="h-12 w-full rounded-xl bg-black text-white font-medium hover:opacity-95 focus:outline-none focus:ring-2 focus:ring-black/30"
        >
          Check my plate
        </button>
      </form>

      <footer className="mt-8 text-xs text-gray-500">
        No payments collected. One-tap unsubscribe from every message.
      </footer>
    </main>
  );
}
