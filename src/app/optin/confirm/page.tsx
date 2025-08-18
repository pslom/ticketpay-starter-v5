// src/app/optin/confirm/page.tsx
import Link from "next/link";
import DueDateCard from "@/components/DueDateCard";
import { ConfirmCopy } from "@/lib/copy";
import ConfirmClient from "./ConfirmClient";

export default async function ConfirmPage({
  searchParams,
}: {
  searchParams: { email?: string; phone?: string; preview?: string; plate?: string; state?: string };
}) {
  const email = (searchParams.email ?? "").trim();
  const phone = (searchParams.phone ?? "").trim();
  const plate = (searchParams.plate ?? "").trim();
  const state = (searchParams.state ?? "").trim();
  const visible = searchParams.preview === "1" || process.env.NEXT_PUBLIC_SHOW_PREVIEW_TEST === "1";

  // Server-side fetch of SF estimate (if plate present)
  let dueAt: string | undefined;
  let lateFeeAt: string | undefined;
  let issuedAt: string | undefined;
  let estimated: boolean | undefined;

  if (plate) {
    const u = new URL(`${process.env.BASE_URL || "http://127.0.0.1:3000"}/api/tickets/sf/lookup`);
    u.searchParams.set("plate", plate);
    if (state) u.searchParams.set("state", state);
    const r = await fetch(u, { cache: "no-store" });
    const j = (await r.json().catch(() => ({}))) as {
      ok?: boolean;
      dueAt?: string;
      lateFeeAt?: string;
      issuedAt?: string;
      estimated?: boolean;
    };
    if (j?.ok) {
      dueAt = j.dueAt;
      lateFeeAt = j.lateFeeAt;
      issuedAt = j.issuedAt;
      estimated = j.estimated;
    }
  }

  return (
    <main className="mx-auto max-w-2xl p-6 space-y-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-bold">{ConfirmCopy.title}</h1>
        <p className="text-gray-600">{ConfirmCopy.subtitle}</p>
      </header>

      {dueAt && (
        <DueDateCard
          dueAt={dueAt}
          lateFeeAt={lateFeeAt}
          issuedAt={issuedAt}
          estimated={estimated}
        />
      )}

      {/* This client component handles the actual confirm UX */}
      <ConfirmClient email={email} phone={phone} visible={visible} />

      {/* Success CTAs (safe to always show; harmless if user re-visits) */}
      <section className="rounded-2xl border border-gray-200 bg-white p-5">
        <h2 className="text-lg font-semibold">What’s next?</h2>
        <p className="mt-1 text-sm text-gray-600">
          You’re set. We’ll keep you updated until it’s resolved.
        </p>

        <div className="mt-4 flex flex-col sm:flex-row gap-3">
          <Link
            href="/"
            className="rounded-xl bg-black px-4 py-2 text-sm font-medium text-white text-center"
          >
            Add another plate
          </Link>
          <Link
            href="/manage"
            className="rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-center"
          >
            Manage alerts
          </Link>
        </div>

        <p className="mt-3 text-xs text-gray-500">
          You can unsubscribe anytime. See{" "}
          <a href="/privacy" className="underline">Privacy</a> and{" "}
          <a href="/terms" className="underline">Terms</a>. For help, email{" "}
          <a href="mailto:support@ticketpay.us.com" className="underline">support@ticketpay.us.com</a>.
        </p>
      </section>
    </main>
  );
}
