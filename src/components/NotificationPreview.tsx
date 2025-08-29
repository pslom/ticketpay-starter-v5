export default function NotificationPreview() {
  return (
    <div className="mt-6">
      <p className="text-center text-sm text-neutral-600 mb-2">Here’s what an alert looks like</p>
      <div className="mx-auto max-w-md rounded-xl border border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50 p-3">
        <div className="rounded-lg border border-amber-200 bg-white p-3">
          <p className="text-sm font-semibold text-neutral-900">TicketPay Alert</p>
          <p className="text-sm text-neutral-800 mt-1">
            CA 7ABC123 — Unpaid parking — $82 fine. Due in 21 days.
          </p>
        </div>
      </div>
    </div>
  );
}
