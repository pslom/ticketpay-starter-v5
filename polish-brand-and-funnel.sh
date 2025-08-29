#!/usr/bin/env bash
set -euo pipefail

echo "1) Header + Footer components…"
mkdir -p src/components

cat > src/components/SiteHeader.tsx <<'TSX'
'use client'
import Link from 'next/link'
import { Shield } from 'lucide-react'

export default function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur border-b border-emerald-100/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-3 flex items-center justify-between">
        <Link href="/" className="group inline-flex items-center gap-2" aria-label="TicketPay home">
          <span className="relative grid size-9 place-items-center rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shadow-md">
            <Shield className="w-5 h-5" aria-hidden />
          </span>
          <span className="font-extrabold text-lg tracking-tight text-gray-900">TicketPay</span>
        </Link>
        <nav className="flex items-center gap-4 text-sm">
          <Link href="/manage" className="text-gray-700 hover:text-gray-900 font-medium">Manage alerts</Link>
          <Link href="/consent" className="text-gray-500 hover:text-gray-800">Consent</Link>
        </nav>
      </div>
    </header>
  )
}
TSX

cat > src/components/SiteFooter.tsx <<'TSX'
export default function SiteFooter() {
  return (
    <footer className="border-t border-emerald-100/60 bg-white/70 backdrop-blur">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-6 text-sm text-gray-600 flex flex-col sm:flex-row items-center gap-3 sm:gap-6 justify-between">
        <div className="text-center sm:text-left">
          ✅ Secure · 🏛 Official SF data · 1-tap unsubscribe
        </div>
        <nav className="flex items-center gap-4">
          <a href="/manage" className="hover:text-gray-900">Manage</a>
          <a href="/consent" className="hover:text-gray-900">Consent & Privacy</a>
          <a href="mailto:support@ticketpay.us" className="hover:text-gray-900">Support</a>
        </nav>
      </div>
    </footer>
  )
}
TSX

echo "2) How-it-works band (reusable, concise)…"
cat > src/components/HowItWorks.tsx <<'TSX'
import { BellRing, Timer, ShieldCheck } from 'lucide-react'

export default function HowItWorks() {
  const items = [
    { icon: <BellRing className="w-5 h-5" />, title: 'Instant alerts', desc: 'We watch SF data and notify you when a ticket posts.' },
    { icon: <Timer className="w-5 h-5" />, title: 'Deadline reminders', desc: 'We nudge you 5 days and 48 hours before late fees.' },
    { icon: <ShieldCheck className="w-5 h-5" />, title: 'You’re in control', desc: 'Pause or unsubscribe anytime. Your data stays private.' },
  ]
  return (
    <section className="mt-8 sm:mt-10">
      <div className="rounded-2xl border border-emerald-100 bg-emerald-50/50 p-4 sm:p-6">
        <h2 className="text-base sm:text-lg font-semibold text-emerald-900">What you’ll get</h2>
        <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
          {items.map((it, i) => (
            <div key={i} className="flex items-start gap-3 rounded-xl bg-white p-3 sm:p-4 border border-emerald-100">
              <div className="text-emerald-600">{it.icon}</div>
              <div>
                <p className="font-medium text-gray-900">{it.title}</p>
                <p className="text-sm text-gray-600">{it.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
TSX

echo "3) Layout: include header/footer and keep the glow…"
cat > src/app/layout.tsx <<'TSX'
import type { Metadata, Viewport } from 'next'
import { Manrope } from 'next/font/google'
import './globals.css'
import SiteHeader from '@/components/SiteHeader'
import SiteFooter from '@/components/SiteFooter'

const manrope = Manrope({ subsets: ['latin'], variable: '--font-manrope' })

export const metadata: Metadata = {
  title: 'TicketPay',
  description: 'Get alerted before late fees hit.',
  openGraph: {
    title: 'TicketPay',
    description: 'Get alerted before late fees hit.',
    url: 'https://www.ticketpay.us.com',
    siteName: 'TicketPay',
    images: [{ url: '/og.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TicketPay',
    description: 'Get alerted before late fees hit.',
    images: ['/og.png'],
  },
  icons: { icon: '/favicon.ico', apple: '/apple-touch-icon.png' },
}

export const viewport: Viewport = { themeColor: '#10b981' }

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={manrope.variable}>
      <body className="min-h-dvh bg-neutral-50 text-gray-900 antialiased bg-glow-top">
        <SiteHeader />
        <div className="min-h-[calc(100dvh-120px)]">{children}</div>
        <SiteFooter />
      </body>
    </html>
  )
}
TSX

echo "4) Home: add top spacing (sticky header), warm chip, how-it-works…"
# Patch only the wrapper & add HowItWorks at the bottom; assumes your Home uses bg-glow-left and the two-step card already.
# If your file differs heavily, feel free to manually merge these two spots.
awk '
  /<main className=/ { print; print "        <div className=\"h-4 sm:h-6\" />"; next }1
' src/app/page.tsx > src/app/page.tmp && mv src/app/page.tmp src/app/page.tsx

# Insert HowItWorks import & component usage if not present
if ! grep -q "HowItWorks" src/app/page.tsx; then
  sed -i '' "1s/^/import HowItWorks from '@/components/HowItWorks'\\n/" src/app/page.tsx
  sed -i '' "s#</div>\\s*</main>#</div>\\n          <HowItWorks />\\n      </main>#g" src/app/page.tsx
fi

echo "5) Results: add top spacing and a concise next-steps band…"
cat > src/app/results/NextSteps.tsx <<'TSX'
export default function NextSteps() {
  return (
    <section className="mx-auto max-w-3xl">
      <div className="rounded-2xl border border-emerald-100 bg-emerald-50/50 p-4 sm:p-6">
        <h2 className="text-base sm:text-lg font-semibold text-emerald-900">What happens next</h2>
        <ul className="mt-2 grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3 text-sm text-gray-700">
          <li className="rounded-xl bg-white p-3 border border-emerald-100">We’ll alert you as soon as a ticket posts.</li>
          <li className="rounded-xl bg-white p-3 border border-emerald-100">We’ll remind you 5 days before the due date.</li>
          <li className="rounded-xl bg-white p-3 border border-emerald-100">We’ll send a final 48-hour reminder to avoid fees.</li>
        </ul>
      </div>
    </section>
  )
}
TSX

# add padding for sticky header and import NextSteps
if ! grep -q "NextSteps" src/app/results/page.tsx; then
  sed -i '' "1s/^/'use client'\\n/" src/app/results/page.tsx
  sed -i '' "1s/^/import NextSteps from '.\\/NextSteps'\\n/" src/app/results/page.tsx
  sed -i '' "s#<main className=\"px-4 bg-glow-right min-h-screen\">#<main className=\"px-4 bg-glow-right min-h-screen\"><div className=\"h-4 sm:h-6\" \/>#g" src/app/results/page.tsx
  sed -i '' "s#</section>#</section>\\n\\n      <NextSteps \\/>#g" src/app/results/page.tsx
fi

echo "✅ Brand header/footer, warmer color accents, and clear \"what to expect\" bands are in."
