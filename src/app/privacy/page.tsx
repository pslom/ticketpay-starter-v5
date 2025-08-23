export const dynamic = 'force-static';
export default function Privacy() {
  return (
    <div className="mx-auto max-w-[900px] px-5 py-12">
      <div className="card p-8 space-y-6">
        <h1 className="text-2xl font-bold">Privacy</h1>
        <p className="text-neutral-800">TicketPay monitors SFMTA parking citations and notifies you before late fees hit.</p>
        <ul className="list-disc pl-6 space-y-2 text-neutral-800">
          <li>Data we collect: state, plate, and your contact (SMS and/or email).</li>
          <li>We do not collect payment information and we never ask you to pay us.</li>
          <li>Payment happens at the official SFMTA portal.</li>
          <li>Opt out anytime: reply STOP (SMS) or use the unsubscribe link in emails.</li>
          <li>We retain contact info while your subscription is active. Deleted subscriptions are purged on a schedule.</li>
          <li>Questions: support@ticketpay.us.com</li>
        </ul>
      </div>
    </div>
  );
}
