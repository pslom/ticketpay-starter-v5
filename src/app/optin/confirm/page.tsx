// src/app/optin/confirm/page.tsx
import Link from "next/link";
import DueDateCard from "@/components/DueDateCard";
import { ConfirmCopy } from "@/lib/copy";
import ConfirmClient from "./ConfirmClient";

type SearchParams = Record<string, string | string[] | undefined>;

export default async function ConfirmPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const sp = await searchParams;
  const pick = (v?: string | string[]) => (Array.isArray(v) ? (v[0] || "") : (v || ""));

  const email = pick(sp.email).trim();
  const phone = pick(sp.phone).trim();
  const plate = pick(sp.plate).trim();
  const state = pick(sp.state).trim();
  const visible = pick(sp.preview) === "1" || process.env.NEXT_PUBLIC_SHOW_PREVIEW_TEST === "1";

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
    <main className="mx-auto max-w-2xl px-4 py-10">
      <div className="rounded-2xl border border-black/10 bg-white p-6 shadow-card tp-fade">
        <h1 className="text-2xl font-semibold">{ConfirmCopy.title}</h1>
        <p className="mt-2 text-neutral-700">{ConfirmCopy.subtitle}</p>

        {dueAt && (
          <div className="mt-4">
            <DueDateCard
              dueAt={dueAt}
              lateFeeAt={lateFeeAt}
              issuedAt={issuedAt}
              estimated={estimated}
            />
          </div>
        )}

        {/* Client-side confirm/preview logic retained */}
        <div className="mt-4">
          <ConfirmClient email={email} phone={phone} visible={visible} />
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <a href="/" className="tp-btn"> {ConfirmCopy.addAnother} </a>
          <a href="/" className="rounded-xl border px-4 py-3 text-sm"> {ConfirmCopy.share} </a>
        </div>
      </div>
    </main>
  );
}
