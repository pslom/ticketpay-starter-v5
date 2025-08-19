export const dynamic = "force-static";

export default function ConsentPage() {
  return (
    <main className="mx-auto max-w-2xl px-4 py-12 space-y-6 text-gray-800">
      <h1 className="text-2xl font-semibold">SMS/Text Alert Consent</h1>
      <p>
        By entering your phone number or email on TicketPay, you agree to receive
        notifications about new parking tickets issued in San Francisco, CA for the plates you follow.
      </p>
      <ul className="list-disc pl-5 space-y-2 text-sm text-gray-700">
        <li>Message frequency: immediate alerts when a new ticket posts.</li>
        <li>Message and data rates may apply.</li>
        <li>Text STOP to cancel. Text HELP for help.</li>
        <li>Your information is private and will not be sold or shared.</li>
        <li>Support: <a href="mailto:support@ticketpay.us.com" className="underline">support@ticketpay.us.com</a>.</li>
      </ul>
      <p className="text-sm text-gray-600">
        Consent is not a condition of purchase. TicketPay is a notification-only public utility and does not accept payments.
      </p>
      <footer className="mt-8 text-sm text-gray-500">
        © TicketPay • San Francisco, CA • <a className="underline" href="/legal/optin-proof">Proof of consent</a>
      </footer>
    </main>
  );
}