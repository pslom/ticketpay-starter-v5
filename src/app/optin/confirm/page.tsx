// src/app/optin/confirm/page.tsx
"use client";

import PreviewBlock from "@/components/PreviewBlock";
import { ConfirmCopy } from "@/lib/copy";
import { track } from "@/lib/track";

function readDestFromUrl() {
  if (typeof window === "undefined") {
    return { email: undefined as string | undefined, phone: undefined as string | undefined };
  }
  const u = new URL(window.location.href);
  return {
    email: u.searchParams.get("email") || undefined,
    phone: u.searchParams.get("phone") || undefined,
  };
}

function showPreviewFlag() {
  if (typeof window === "undefined") return false;
  const u = new URL(window.location.href);
  if (u.searchParams.get("preview") === "1") return true; // manual override
  return process.env.NEXT_PUBLIC_SHOW_PREVIEW_TEST === "1"; // dev-only env flag
}

export default function ConfirmPage() {
  // fire-and-forget analytics on mount (noop on server)
  if (typeof window !== "undefined") {
    try { track("subscription_confirm_view"); } catch {}
  }

  const { email, phone } = readDestFromUrl();
  const visible = showPreviewFlag();

  return (
    <main className="mx-auto max-w-2xl p-6 space-y-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-bold">{ConfirmCopy.title}</h1>
        <p className="text-gray-600">{ConfirmCopy.subtitle}</p>
      </header>

      <section aria-labelledby="preview-heading">
        <h2 id="preview-heading" className="sr-only">{ConfirmCopy.previewTitle}</h2>
        <PreviewBlock email={email} phone={phone} visible={visible} />
      </section>

      <div className="flex gap-3">
        <a
          href="/"
          className="px-4 py-2 rounded-lg bg-emerald-600 text-white"
          onClick={() => typeof window !== "undefined" && track("cta_add_another_ticket_click")}
        >
          {ConfirmCopy.addAnother}
        </a>
        <a
          href="/share"
          className="px-4 py-2 rounded-lg border border-gray-300"
          onClick={() => typeof window !== "undefined" && track("cta_share_click")}
        >
          {ConfirmCopy.share}
        </a>
      </div>
    </main>
  );
}
