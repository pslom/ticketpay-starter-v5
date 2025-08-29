export default function SiteFooter() {
  return (
    <footer className="border-t border-emerald-100/60 bg-white/70 backdrop-blur">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-6 text-sm text-gray-600 flex flex-col sm:flex-row items-center gap-3 sm:gap-6 justify-between">
        <div className="text-center sm:text-left">
          ✅ Secure · 🏛 Official SF data · 1-tap unsubscribe
        </div>
        <nav className="flex items-center gap-4">
          <a href="/manage" className="hover:text-gray-900">Manage</a>
          <a href="/consent" className="hover:text-gray-900">Consent &amp; Privacy</a>
          <a href="mailto:support@ticketpay.us" className="hover:text-gray-900">Support</a>
        </nav>
      </div>
    </footer>
  )
}
