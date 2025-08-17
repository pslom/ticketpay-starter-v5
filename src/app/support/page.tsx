export default function SupportPage() {
  return (
    <main className="min-h-dvh bg-gray-50 text-black">
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur border-b border-black/5">
        <div className="mx-auto max-w-2xl px-4 h-14 flex items-center justify-between">
          <a href="/" className="text-base font-semibold tracking-tight">TicketPay</a>
          <span className="text-xs text-gray-600">San Francisco · CA</span>
        </div>
      </header>

      <section className="mx-auto max-w-2xl px-4 py-10">
        <h1 className="text-2xl font-semibold">Support</h1>
        <p className="mt-2 text-sm text-gray-600">
          Questions about your alerts? We’re here to help.
        </p>

        <div className="mt-6 rounded-2xl border border-black/10 bg-white p-5 shadow-sm text-sm">
          <div className="font-medium">Contact</div>
          <p className="mt-1 text-gray-600">
            Email: <a className="underline" href="mailto:support@ticketpay.us.com">support@ticketpay.us.com</a>
          </p>
          <p className="mt-1 text-gray-600">
            Response: typically within 1 business day.
          </p>
        </div>

        <div className="mt-8 text-sm">
          <a href="/" className="underline">Back to home</a>
        </div>
      </section>

      <footer className="mx-auto max-w-2xl px-4 pb-10 text-[11px] text-gray-500">
        © TicketPay • San Francisco, CA
      </footer>

      <span className="sr-only opacity-100 translate-y-0"></span>
    </main>
  );
}
