"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

type Ticket = {
  citation_no: string;
  plate: string;
  state: string;
  amount_cents: number;
  status: "open" | "paid";
  violation: string;
  location: string;
  issued_at: string;
  due_at: string;
};

export default function ResultsClient({ plate, state }: { plate: string; state: string }) {
  const [tickets, setTickets] = useState<Ticket[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  // Subscribe form state
  const [email, setEmail] = useState("");
  const [subMsg, setSubMsg] = useState("");
  const [subBusy, setSubBusy] = useState(false);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoading(true);
        setErr(null);
        const res = await fetch("/api/lookup", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ plate, state }),
        });
        const data = (await res.json()) as { ok: boolean; tickets?: Ticket[] };
        if (!alive) return;
        if (!res.ok || !data.ok) throw new Error("Lookup failed");
        setTickets(data.tickets || []);
      } catch (e: any) {
        setErr(e?.message || "Could not load tickets.");
      } finally {
        setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [plate, state]);

  const openTickets = useMemo(() => (tickets || []).filter((t) => t.status === "open"), [tickets]);
  const totalCents = useMemo(() => openTickets.reduce((s, t) => s + t.amount_cents, 0), [openTickets]);
  const feeCents = Math.round(totalCents * 0.035) + 99; // simple disclosure example
  const grandCents = totalCents + feeCents;
  const fmt = (c: number) => (c / 100).toLocaleString(undefined, { style: "currency", currency: "USD" });

  if (loading) {
    return (
      <main className="mx-auto max-w-md px-4 py-8 space-y-6">
        <header className="space-y-1">
          <h1 className="text-xl font-semibold">Tickets for {plate} ({state})</h1>
        </header>
        <div className="space-y-3">
          <div className="h-20 rounded-2xl bg-neutral-200 animate-pulse" />
          <div className="h-20 rounded-2xl bg-neutral-200 animate-pulse" />
        </div>
      </main>
    );
  }

  if (err) {
    return (
      <main className="mx-auto max-w-md px-4 py-8 space-y-4">
        <h1 className="text-xl font-semibold">Tickets for {plate} ({state})</h1>
        <p className="text-sm text-red-600">{err}</p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-md px-4 py-8 space-y-6">
      <header className="space-y-1">
        <h1 className="text-xl font-semibold">Tickets for {plate} ({state})</h1>
        {openTickets.length === 0 ? (
          <p className="text-sm text-neutral-600">No open tickets found.</p>
        ) : (
          <p className="text-sm text-neutral-600">{openTickets.length} open {openTickets.length === 1 ? "ticket" : "tickets"}.</p>
        )}
      </header>

      <section className="space-y-3">
        {openTickets.map((t) => (
          <article key={t.citation_no} className="rounded-2xl border border-neutral-200 p-4 space-y-1">
            <div className="flex items-center justify-between">
              <div className="font-medium">{t.violation}</div>
              <div className="font-semibold">{fmt(t.amount_cents)}</div>
            </div>
            <div className="text-xs text-neutral-600">
              #{t.citation_no} · {new Date(t.issued_at).toLocaleDateString()} · Due {new Date(t.due_at).toLocaleDateString()}
            </div>
            <div className="text-xs text-neutral-500">{t.location}</div>
          </article>
        ))}
      </section>

      {openTickets.length > 0 && (
        <section className="space-y-2 rounded-2xl border border-neutral-200 p-4">
          <div className="flex items-center justify-between">
            <div className="font-medium">Amount due</div>
            <div className="font-semibold">{fmt(totalCents)}</div>
          </div>
          <div className="flex items-center justify-between text-sm text-neutral-600">
            <div>Processing fee <span className="underline decoration-dotted" title="Covers card processing and platform costs.">What’s this?</span></div>
            <div>{fmt(feeCents)}</div>
          </div>
          <div className="flex items-center justify-between border-t border-neutral-200 pt-2">
            <div className="font-medium">Total</div>
            <div className="font-semibold">{fmt(grandCents)}</div>
          </div>

          <Link
            href={`/payment?plate=${encodeURIComponent(plate)}&state=${encodeURIComponent(state)}&total=${grandCents}`}
            className="mt-3 block text-center h-12 rounded-xl bg-black text-white font-medium hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-black/30"
          >
            Pay now
          </Link>
          <p className="text-[13px] text-neutral-600">Payment deadline: Today 11:59pm PT.</p>
        </section>
      )}

      <section className="space-y-2">
        <h2 className="text-lg font-medium">Get new ticket alerts</h2>
        <p className="text-sm text-neutral-600">
          We’ll email you when SF posts a new citation for {plate} ({state}).
        </p>
        <form
          className="flex gap-2"
          onSubmit={async (e) => {
            e.preventDefault();
            setSubMsg("");
            setSubBusy(true);
            try {
              const res = await fetch("/api/subscribe", {
                method: "POST",
                headers: { "content-type": "application/json" },
                body: JSON.stringify({ email, plate, state }),
              });
              const data = await res.json().catch(() => ({}));
              if (!res.ok || data?.ok === false) throw new Error(data?.error || "Subscribe failed");
              setSubMsg("Subscribed. We’ll email you when new tickets appear. Unsubscribe anytime.");
              setEmail("");
            } catch (e: any) {
              setSubMsg(e?.message || "Something went wrong. Try again.");
            } finally {
              setSubBusy(false);
            }
          }}
        >
          <input
            type="email"
            required
            placeholder="you@example.com"
            className="h-12 flex-1 rounded-xl border border-neutral-300 px-4"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            aria-label="Email address"
          />
          <button
            type="submit"
            disabled={subBusy}
            className="h-12 px-4 rounded-xl bg-black text-white font-medium disabled:opacity-50"
          >
            {subBusy ? "Subscribing…" : "Subscribe"}
          </button>
        </form>
        {subMsg && <p className="text-sm text-neutral-700">{subMsg}</p>}
      </section>
    </main>
  );
}
