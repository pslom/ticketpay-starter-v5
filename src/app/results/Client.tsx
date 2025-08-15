"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";

type Ticket = {
  citation_no: string; plate: string; state: string;
  amount_cents: number; status: "open" | "paid" | "void";
  violation?: string; location?: string; issued_at?: string; due_at?: string;
};
const dollars = (c:number)=>`$${(c/100).toFixed(2)}`;

export default function ResultsClient() {
  const sp = useSearchParams();
  const plate = (sp.get("plate") || "").toUpperCase();
  const state = (sp.get("state") || "").toUpperCase();

  const [tickets, setTickets] = useState<Ticket[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    let dead = false;
    (async () => {
      setLoading(true); setErr(null);
      try {
        const res = await fetch("/api/lookup", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ plate, state }),
          cache: "no-store",
        });
        if (!res.ok) throw new Error();
        const json = await res.json();
        if (!dead) setTickets(json.tickets || []);
      } catch {
        if (!dead) setErr("Can’t reach the city right now. Try again in a moment.");
      } finally {
        if (!dead) setLoading(false);
      }
    })();
    return () => { dead = true; };
  }, [plate, state]);

  const total = useMemo(() =>
    (tickets || []).filter(t => t.status === "open")
                   .reduce((s, t) => s + t.amount_cents, 0),
    [tickets]
  );

  return (
    <main className="mx-auto max-w-md px-4 py-8 space-y-6">
      <header className="space-y-1">
        <h1 className="text-xl font-semibold">{`Tickets for ${plate} (${state})`}</h1>
        {total > 0 && (
          <p className="text-sm text-neutral-600">
            Total outstanding: <span className="font-medium">{dollars(total)}</span>
          </p>
        )}
      </header>

      {loading && (
        <div className="space-y-3">
          <div className="h-20 rounded-2xl bg-neutral-200 animate-pulse" />
          <div className="h-20 rounded-2xl bg-neutral-200 animate-pulse" />
        </div>
      )}

      {!loading && err && (
        <div className="rounded-2xl border border-[var(--border)] p-4">
          <p className="text-sm">{err}</p>
          <button onClick={() => location.reload()} className="mt-3 h-10 w-full rounded-lg border border-neutral-300">
            Retry
          </button>
        </div>
      )}

      {!loading && !err && tickets && tickets.length > 0 && (
        <div className="space-y-3">
          {tickets.map((t) => (
            <div key={t.citation_no} className="rounded-2xl border border-[var(--border)] p-4">
              <div className="flex items-baseline justify-between">
                <div className="text-sm text-neutral-600">Ticket #{t.citation_no}</div>
                <div className="text-base font-semibold">{dollars(t.amount_cents)}</div>
              </div>
              <div className="mt-2 text-sm text-neutral-700">
                <div>{t.violation || "Violation"}</div>
                <div className="text-neutral-500">{t.location || "Location"}</div>
              </div>
              <div className="mt-3 flex items-center justify-between">
                <span className={`text-xs rounded px-2 py-1 ${t.status === "open" ? "bg-red-50 text-red-700" : "bg-green-50 text-green-700"}`}>
                  {t.status.toUpperCase()}
                </span>
                <a className="text-sm underline" target="_blank" rel="noreferrer">Pay on SF site</a>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && !err && tickets && tickets.length === 0 && (
        <div className="rounded-2xl border border-[var(--border)] p-4">
          <p className="font-medium">No open tickets for {plate} ({state}).</p>
          <p className="mt-1 text-sm text-neutral-600">We’ll keep an eye on it so you don’t have to.</p>
        </div>
      )}
    </main>
  );
}
