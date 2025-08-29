import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-neutral-200/60">
      <div className="mx-auto max-w-[960px] px-5 py-6 text-sm text-neutral-600 flex items-center justify-between">
        <span>© TicketPay</span>
        <div className="flex items-center gap-4">
          <Link href="/trust" className="hover:underline">Trust</Link>
          <Link href="/privacy" className="hover:underline">Privacy</Link>
          <Link href="/support" className="hover:underline">Support</Link>
        </div>
      </div>
    </footer>
  );
}
