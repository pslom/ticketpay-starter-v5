
import Link from 'next/link';

export const metadata = {
  title: 'Trust · TicketPay',
  description:
    'How TicketPay keeps you safe: clear scope, minimal data, anti-phishing guardrails, and official links only.',
};

export default function Trust() {
  return (
    <main className="min-h-screen bg-aurora">
      {/* Header */}
      <header className="mx-auto flex max-w-[1200px] items-center justify-between px-4 py-5 md:px-6">
        <Link href="/" className="inline-flex items-center gap-3">
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-emerald-600 text-white">T</div>
          <span className="text-xl font-semibold text-neutral-900">TicketPay</span>
        </Link>
        <nav className="flex items-center gap-6 text-sm">
          <Link href="/manage" className="text-neutral-700 hover:text-neutral-900">Manage alerts</Link>
          <Link href="/trust" className="text-neutral-900 font-medium">Trust</Link>
        </nav>
      </header>

      {/* Body */}
      <div className="mx-auto max-w-[860px] px-4 pb-24 md:px-6">
        <div className="mb-6">
          <h1 className="text-3xl font-extrabold tracking-tight md:text-4xl">Trust & safety</h1>
          <p className="mt-2 text-[15px] text-neutral-700">
            Clear scope, minimal data, and anti-phishing guardrails. You always pay at the official SFMTA portal.
          </p>
          <p className="mt-1 text-sm text-neutral-500">Last updated: August 2025</p>
        </div>

        <Card title="What TicketPay does">
          <ul className="list-disc space-y-1 pl-5 text-neutral-700">
            <li>Checks SFMTA data daily and alerts you if a ticket appears.</li>
            <li>Sends deadline reminders at 5-day and 48-hour marks.</li>
            <li>
              Provides a single <span className="font-semibold">Pay at SFMTA</span> action that opens the official portal.
            </li>
          </ul>
        </Card>

        <Card title="What we never do">
          <ul className="list-disc space-y-1 pl-5 text-neutral-700">
            <li>We never collect or process payments.</li>
            <li>We never ask for passwords, SSN, or sensitive personal info.</li>
            <li>We never send “warrant/collections” threats or demand immediate payment.</li>
          </ul>
        </Card>

        <Card title="Official links you’ll see">
          <div className="flex flex-wrap gap-2">
            {['ticketpay.us.com', 'sfgov.org', 'etimspayments.com'].map((d) => (
              <span
                key={d}
                className="rounded-lg border border-neutral-200 bg-neutral-50 px-2 py-1 font-mono text-[13px] text-neutral-800"
              >
                {d}
              </span>
            ))}
          </div>
          <p className="mt-2 text-sm text-neutral-600">
            We maintain a strict allow-list for external links. Anything else is not from us.
          </p>
        </Card>

        <Card title="How to verify a real alert">
          <ul className="list-disc space-y-1 pl-5 text-neutral-700">
            <li>Sender shows as <span className="font-semibold">TicketPay</span>.</li>
            <li>Links resolve to <span className="font-mono text-[13px]">ticketpay.us.com</span> or the domains above.</li>
            <li>Language is calm and factual; we never request payment directly.</li>
            <li>Your manage link shows your plate & state (no login required).</li>
          </ul>
        </Card>

        <Card title="How to spot scams">
          <ul className="list-disc space-y-1 pl-5 text-neutral-700">
            <li>Threatening language like “warrant,” “collections,” or “pay immediately.”</li>
            <li>Requests for credit cards, gift cards, or PII in SMS/email.</li>
            <li>Links to unknown domains or link shorteners you don’t recognize.</li>
          </ul>
        </Card>

        <Card title="Unsubscribe or pause">
          <ul className="list-disc space-y-1 pl-5 text-neutral-700">
            <li><span className="font-semibold">SMS</span>: reply <span className="font-mono text-[13px]">STOP</span> to opt-out; <span className="font-mono text-[13px]">START</span> to resume; <span className="font-mono text-[13px]">HELP</span> for help.</li>
            <li><span className="font-semibold">Email</span>: click “Unsubscribe”.</li>
            <li><span className="font-semibold">In app</span>: go to <Link href="/manage" className="underline">Manage</Link> to pause or delete a plate.</li>
          </ul>
        </Card>

        <Card title="Data use & retention">
          <ul className="list-disc space-y-1 pl-5 text-neutral-700">
            <li>We store your plate, state, and contact to deliver alerts.</li>
            <li>PII is minimized and encrypted at rest where appropriate.</li>
            <li>When you delete a subscription, we purge contact details after a short retention window.</li>
          </ul>
        </Card>

        <Card title="Messaging compliance">
          <ul className="list-disc space-y-1 pl-5 text-neutral-700">
            <li>A2P 10DLC registered sending.</li>
            <li>Opt-in captured with timestamp.</li>
            <li>STOP/START/HELP handling.</li>
            <li>Consistent sender name & link policy.</li>
          </ul>
        </Card>

        <Card title="Contact">
          <p className="text-neutral-700">
            Questions or something look off? Email{' '}
            <a href="mailto:support@ticketpay.us.com" className="underline">
              support@ticketpay.us.com
            </a>.
          </p>
        </Card>
      </div>

      {/* Footer */}
      <footer className="mx-auto flex max-w-[1200px] items-center justify-between px-4 pb-12 text-sm text-neutral-600 md:px-6">
        <span>© TicketPay</span>
        <div className="flex items-center gap-6">
          <Link href="/trust" className="text-neutral-900">Trust</Link>
          <Link href="/privacy" className="hover:text-neutral-900">Privacy</Link>
          <Link href="/support" className="hover:text-neutral-900">Support</Link>
        </div>
      </footer>
    </main>
  );
}

function Card({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mb-4 rounded-2xl bg-white/90 p-6 shadow-sm ring-1 ring-black/5 md:mb-6 md:p-8">
      <h2 className="mb-3 text-lg font-semibold text-neutral-900">{title}</h2>
      <div className="space-y-2">{children}</div>
    </section>
  );
}
