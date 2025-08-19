export const dynamic = "force-static";

export default function OptInProof() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-12 space-y-6 text-gray-800">
      <h1 className="text-2xl font-semibold">Proof of Consent (SMS & Email)</h1>
      <p className="text-sm text-gray-600">
        This page documents how a user opts in to TicketPay alerts and provides screenshots suitable for carrier review.
      </p>

      <h2 className="text-lg font-medium">Opt-in story</h2>
      <ol className="list-decimal pl-5 space-y-2 text-sm">
        <li>User searches a plate and selects Email or SMS.</li>
        <li>The subscribe card states STOP/HELP and links to the Consent policy.</li>
        <li>We log consent metadata (timestamp, IP, user agent).</li>
        <li>Every message includes STOP/HELP and an unsubscribe link.</li>
      </ol>

      <h2 className="text-lg font-medium mt-6">Screenshots</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <img src="/window.svg" alt="Results: subscribe card" className="rounded-xl border" />
        <img src="/file.svg" alt="Confirmation panel" className="rounded-xl border" />
        <img src="/globe.svg" alt="Consent page" className="rounded-xl border" />
        <img src="/vercel.svg" alt="Manage alerts page" className="rounded-xl border" />
      </div>

      <h2 className="text-lg font-medium mt-6">Sample messages</h2>
      <div className="rounded-2xl border bg-white p-4 shadow-sm text-sm">
        <p><span className="font-medium">Initial confirmation:</span> TicketPay: You’re set for alerts on ABC123 (CA) in San Francisco. Reply STOP to cancel, HELP for help. Msg&data rates may apply.</p>
        <p className="mt-2"><span className="font-medium">Alert:</span> TicketPay: New ticket for ABC123 (CA): $65 · No Parking 7–9a at Mission & 16th. Pay: example.link. Reply STOP to unsubscribe.</p>
      </div>

      <footer className="pt-6 text-xs text-gray-500 border-t">© TicketPay • San Francisco, CA</footer>
    </main>
  );
}
