export const metadata = {
  title: 'Terms of Service • TicketPay',
  description: 'TicketPay Terms of Service',
};

export default function TermsPage() {
  return (
    <main className="mx-auto max-w-3xl p-6 space-y-4">
      <h1 className="text-2xl font-bold">Terms of Service</h1>
      <p>By using TicketPay, you agree to these terms.</p>

      <h2 className="text-lg font-semibold">Service</h2>
      <p>We send reminders about ticket status. We don’t process payments.</p>

      <h2 className="text-lg font-semibold">Your info</h2>
      <p>You’re responsible for the accuracy of your contact info and for paying any tickets.</p>

      <h2 className="text-lg font-semibold">Messaging</h2>
      <p>By providing your number or email, you agree to receive reminders. Message &amp; data rates may apply.</p>

      <h2 className="text-lg font-semibold">Privacy</h2>
      <p>
        See our <a className="underline" href="/privacy">Privacy Policy</a>.
      </p>

      <h2 className="text-lg font-semibold">Contact</h2>
      <p>
        Support: <a className="underline" href="mailto:support@ticketpay.us.com">support@ticketpay.us.com</a>
      </p>
    </main>
  );
}
