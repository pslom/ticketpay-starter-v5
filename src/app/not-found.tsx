export default function NotFound() {
  return (
    <main className="min-h-dvh bg-gray-50 text-black">
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur border-b border-black/5">
        <div className="mx-auto max-w-2xl px-4 h-14 flex items-center justify-between">
          <a href="/" className="text-base font-semibold tracking-tight">TicketPay</a>
          <span className="text-xs text-gray-600">San Francisco · CA</span>
        </div>
      </header>

      <section className="mx-auto max-w-2xl px-4 py-16 text-center">
        <h1 className="text-2xl font-semibold">Page not found</h1>
        <p className="mt-2 text-sm text-gray-600">The page you’re looking for doesn’t exist.</p>
        <div className="mt-6">
          <a href="/" className="rounded-xl border border-black/10 px-3 py-2 text-sm hover:bg-black/5">Back to home</a>
        </div>
      </section>

      <footer className="mx-auto max-w-2xl px-4 pb-10 text-[11px] text-gray-500">
        © TicketPay • San Francisco, CA
      </footer>

      <span className="sr-only opacity-100 translate-y-0"></span>
    </main>
  );
}
