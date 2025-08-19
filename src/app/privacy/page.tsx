export const metadata = {
  title: 'Privacy Policy • TicketPay',
  description: 'TicketPay Privacy Policy',
};

export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-3xl p-6 space-y-4">
      <h1 className="text-2xl font-bold">Privacy Policy</h1>
      <p>We collect only what we need to send reminders and improve TicketPay.</p>

      <h2 className="text-lg font-semibold">What we collect</h2>
      <ul className="list-disc pl-6">
        <li>Plate and state you provide</li>
        <li>Email and/or mobile number to send reminders</li>
        <li>Basic usage analytics (events, not sensitive contents)</li>
      </ul>

      <h2 className="text-lg font-semibold">How we use it</h2>
      <ul className="list-disc pl-6">
        <li>Send timely reminders</li>
        <li>Maintain and improve the product</li>
        <li>Comply with the law and prevent abuse</li>
      </ul>

      <h2 className="text-lg font-semibold">Sharing</h2>
      <p>We don’t sell your data. We use providers (email/SMS) to deliver messages.</p>

      <h2 className="text-lg font-semibold">Your choices</h2>
      <ul className="list-disc pl-6">
        <li>Unsubscribe anytime (link in emails or reply STOP by SMS)</li>
        <li>Delete requests: <a className="underline" href="mailto:support@ticketpay.us.com">support@ticketpay.us.com</a></li>
      </ul>
    </main>
  );
}
