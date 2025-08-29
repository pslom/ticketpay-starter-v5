export default function TermsPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-extrabold text-gray-900">Terms</h1>
      <p className="mt-4 text-gray-700">
        TicketPay is a notification service for San Francisco parking tickets. We do not collect payment
        or pay tickets on your behalf. Alerts are based on official city data and may have a short delay.
      </p>
      <p className="mt-4 text-gray-700">
        By subscribing, you agree to receive alerts for your selected plate. SMS: Message & data rates may apply.
        Reply STOP to cancel, HELP for help.
      </p>
    </main>
  )
}
