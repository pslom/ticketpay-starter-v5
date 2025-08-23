export const dynamic = 'force-static';
export default function Support() {
  return (
    <div className="mx-auto max-w-[900px] px-5 py-12">
      <div className="card p-8 space-y-6">
        <h1 className="text-2xl font-bold">Support</h1>
        <p className="text-neutral-800">Need help with TicketPay?</p>
        <ul className="list-disc pl-6 space-y-2 text-neutral-800">
          <li>General: support@ticketpay.us.com</li>
          <li>SMS help: reply HELP to any message</li>
          <li>Unsubscribe: reply STOP (SMS) or use the unsubscribe link in emails</li>
          <li>Report suspicious messages: forward to support@ticketpay.us.com</li>
        </ul>
      </div>
    </div>
  );
}
