"use client";
import Link from "next/link";

export default function Header() {
  return (
    <header className="sticky top-0 z-40 bg-white/70 backdrop-blur border-b border-white/60">
      <div className="mx-auto max-w-[1100px] px-5 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="grid place-items-center h-8 w-8 rounded-lg bg-emerald-500 text-white font-bold">T</div>
          <span className="text-lg font-semibold">TicketPay</span>
        </Link>
        <nav className="flex items-center gap-5">
          <Link href="/manage" className="text-sm text-neutral-700 hover:text-neutral-900">Manage alerts</Link>
          <Link href="/trust" className="text-sm text-neutral-700 hover:text-neutral-900">Trust</Link>
        </nav>
      </div>
    </header>
  );
}
