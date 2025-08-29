export const metadata = { title: 'Verify a TicketPay message' }
export default function VerifyPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="text-3xl font-extrabold tracking-tight">Verify a TicketPay message</h1>
      <p className="mt-4 text-gray-700">
        TicketPay will never ask for payment or personal financial information. Pay only on the official SFMTA site.
      </p>
      <div className="mt-8 space-y-4">
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="font-semibold">What a real message looks like</h2>
          <p className="mt-2 text-sm text-gray-600">
            Sender: <span className="font-mono">+1 (415)…</span> or <span className="font-mono">alerts@ticketpay.us.com</span><br/>
            Link domains: <span className="font-mono">wmq.etimspayments.com</span>, <span className="font-mono">ticketpay.us.com</span>
          </p>
          <p className="mt-2 rounded-md bg-gray-50 p-3 text-sm font-mono text-gray-700">
            TicketPay: New SFMTA ticket for CA 7ABC123. Due May 15. Pay at SFMTA: https://wmq.etimspayments.com/… Reply STOP to cancel, HELP for help.
          </p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="font-semibold">If something looks off</h2>
          <ul className="mt-2 list-disc pl-5 text-sm text-gray-700">
            <li>Do not click links from unknown domains or link shorteners.</li>
            <li>We never collect payment; pay only at SFMTA.</li>
            <li>Report suspicious messages to <a className="underline" href="mailto:security@ticketpay.us.com">security@ticketpay.us.com</a>.</li>
          </ul>
        </div>
      </div>
    </main>
  )
}
