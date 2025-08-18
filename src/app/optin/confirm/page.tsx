import PreviewBlock from "@/components/PreviewBlock";
import { ConfirmCopy } from "@/lib/copy";
import { track } from "@/lib/track";

export default function ConfirmPage() {
  // If you have the user’s email/phone in a cookie or search param, pass it to PreviewBlock
  // const email = ...; const phone = ...;

  // fire-and-forget analytics on mount (RSC-safe no-op if not hydrated)
  if (typeof window !== "undefined") {
    track("subscription_confirm_view");
  }

  return (
    <main className="mx-auto max-w-2xl p-6 space-y-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-bold">{ConfirmCopy.title}</h1>
        <p className="text-gray-600">{ConfirmCopy.subtitle}</p>
      </header>

      <section aria-labelledby="preview-heading">
        <h2 id="preview-heading" className="sr-only">{ConfirmCopy.previewTitle}</h2>
        <PreviewBlock /* email={email} phone={phone} */ />
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
