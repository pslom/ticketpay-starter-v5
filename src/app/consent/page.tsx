export const dynamic = "force-static";
import { ConsentCopy } from "@/lib/copy";

export default function ConsentPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-3xl font-bold">{ConsentCopy.title}</h1>
      <p className="mt-2 text-neutral-700">
        By entering your phone number or email on TicketPay, you agree to receive notifications
        about new parking tickets issued in San Francisco, CA for the plates you follow.
      </p>

      <div className="mt-6 rounded-2xl border border-black/10 bg-white p-6 shadow-card">
        <ul className="list-disc pl-6 space-y-2 text-neutral-800">
          {ConsentCopy.bullets.map((b, i) => <li key={i}>{b}</li>)}
        </ul>
        <p className="mt-6 text-sm text-neutral-700">{ConsentCopy.footer}</p>
      </div>

      <footer className="mt-8 text-sm text-neutral-600">
        © TicketPay • San Francisco, CA • <a href="/legal/optin-proof" className="underline">{ConsentCopy.proofLinkLabel}</a>
      </footer>
    </main>
  );
}