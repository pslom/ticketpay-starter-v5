"use client";

import { useMemo, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";

const fmt = (cents: number) => (cents / 100).toLocaleString(undefined, { style: "currency", currency: "USD" });

export default function PaymentPage() {
  const sp = useSearchParams();
  const router = useRouter();
  const plate = (sp.get("plate") || "").toUpperCase();
  const state = (sp.get("state") || "").toUpperCase();
  const total = Number(sp.get("total") || "0");
  const [busy, setBusy] = useState(false);
  const [name, setName] = useState("");
  const [card, setCard] = useState("");

  const valid = useMemo(() => plate && state && total > 0, [plate, state, total]);

  async function pay(kind: "wallet" | "card") {
    setBusy(true);
    try {
      // TODO: integrate Stripe. For now, mock success.
      await new Promise((r) => setTimeout(r, 800));
      const receiptId = `rcpt_${Math.random().toString(36).slice(2, 8)}`;
      router.replace(`/receipt/${receiptId}?plate=${encodeURIComponent(plate)}&state=${encodeURIComponent(state)}&total=${total}`);
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="mx-auto max-w-2xl px-4 py-10 grid gap-6 md:grid-cols-[1fr_320px]">
      <section className="space-y-4">
        <header className="space-y-1">
          <h1 className="text-2xl font-semibold">Pay tickets</h1>
          <p className="text-sm text-neutral-600">
            {plate} ({state})
          </p>
        </header>

        <button
          onClick={() => pay("wallet")}
          disabled={!valid || busy}
          className="h-12 w-full rounded-xl bg-black text-white font-medium disabled:opacity-50"
          aria-label="Pay with Apple Pay or Google Pay"
        >
          {busy ? "Processing…" : "Pay with Apple Pay / Google Pay"}
        </button>

        <div className="text-center text-xs text-neutral-500">or pay with card</div>

        <form
          className="space-y-3"
          onSubmit={(e) => {
            e.preventDefault();
            pay("card");
          }}
        >
          <label className="block space-y-1">
            <span className="text-sm">Name on card</span>
            <input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="h-12 w-full rounded-xl border border-neutral-300 px-4"
              placeholder="Full name"
            />
          </label>

          <label className="block space-y-1">
            <span className="text-sm">Card number</span>
            <input
              required
              value={card}
              onChange={(e) => setCard(e.target.value)}
              className="h-12 w-full rounded-xl border border-neutral-300 px-4"
              inputMode="numeric"
              placeholder="4242 4242 4242 4242"
            />
          </label>

          <div className="grid grid-cols-2 gap-3">
            <label className="block space-y-1">
              <span className="text-sm">Exp</span>
              <input className="h-12 w-full rounded-xl border border-neutral-300 px-4" placeholder="MM/YY" required />
            </label>
            <label className="block space-y-1">
              <span className="text-sm">CVC</span>
              <input className="h-12 w-full rounded-xl border border-neutral-300 px-4" placeholder="CVC" required />
            </label>
          </div>

          <button
            type="submit"
            disabled={!valid || busy}
            className="h-12 w-full rounded-xl bg-black text-white font-medium disabled:opacity-50"
          >
            {busy ? "Processing…" : `Pay ${fmt(total)}`}
          </button>

          <p className="text-xs text-neutral-500">
            By paying, you agree to the fee shown.{" "}
            <span className="underline decoration-dotted" title="Covers card processing and platform costs.">
              What’s this?
            </span>
          </p>
        </form>
      </section>

      <aside className="space-y-3 rounded-2xl border border-neutral-200 p-4 h-fit">
        <div className="font-medium">Total</div>
        <div className="text-2xl font-semibold">{fmt(total)}</div>
        <div className="text-xs text-neutral-600">
          Due today at 11:59pm. Need help? <Link href="/support" className="underline">Contact support</Link>.
        </div>
        <Link href={`/results?plate=${plate}&state=${state}`} className="text-sm underline block">
          Back to results
        </Link>
      </aside>
    </main>
  );
}