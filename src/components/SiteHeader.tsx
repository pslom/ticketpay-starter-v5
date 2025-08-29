import Link from "next/link";

export default function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur border-b border-neutral-200">
      <div className="mx-auto max-w-[1200px] px-4 md:px-6 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-emerald-600 text-white grid place-items-center font-semibold">
            T
          </div>
          <span className="font-semibold">TicketPay</span>
        </Link>
        <nav className="flex items-center gap-6 text-sm">
          <Link href="/manage" className="hover:text-neutral-800 text-neutral-600">Manage alerts</Link>
          <Link href="/trust" className="hover:text-neutral-800 text-neutral-600">Trust</Link>
        </nav>
      </div>
    </header>
  );
}
