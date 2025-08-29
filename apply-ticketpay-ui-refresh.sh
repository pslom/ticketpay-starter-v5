#!/usr/bin/env bash
set -euo pipefail

echo "1) globals.css: base + green glow utilities…"
mkdir -p src/app
cat > src/app/globals.css <<'CSS'
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Base tokens */
@layer base {
  :root { --background: 0 0% 100%; --foreground: 0 0% 3.9%; }
  body { @apply bg-neutral-50 text-gray-900 antialiased; }
}

/* Subtle, brand-forward glow that can 'move' per page */
@layer utilities {
  .bg-glow-top {
    background: radial-gradient(900px 520px at 50% -160px, rgba(16,185,129,.12), transparent 60%);
  }
  .bg-glow-left {
    background: radial-gradient(900px 520px at -160px 30%, rgba(16,185,129,.12), transparent 60%);
  }
  .bg-glow-right {
    background: radial-gradient(900px 520px at calc(100% + 160px) 40%, rgba(16,185,129,.12), transparent 60%);
  }
  .bg-glow-bottom {
    background: radial-gradient(900px 520px at 50% calc(100% + 160px), rgba(16,185,129,.12), transparent 60%);
  }
}
CSS

echo "2) Tailwind config: ensure Manrope + tokens…"
cat > tailwind.config.ts <<'TS'
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        emerald: {
          50: '#ecfdf5',
          100: '#d1fae5',
          200: '#a7f3d0',
          300: '#6ee7b7',
          400: '#34d399',
          500: '#10b981',
          600: '#059669',
          700: '#047857',
          800: '#065f46',
          900: '#064e3b',
        },
        brand: { 50: '#F5FFFA', 600: '#10b981', 700: '#059669' },
      },
      boxShadow: { card: '0 16px 40px -20px rgba(0,0,0,0.25)' },
      borderRadius: { '2xl': '1.25rem' },
      fontFamily: {
        // IMPORTANT: use the Next font variable from layout.tsx
        sans: ['var(--font-manrope)', 'system-ui', '-apple-system', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'scale-in': 'scaleIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
      keyframes: {
        fadeIn: { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        slideUp: { '0%': { opacity: '0', transform: 'translateY(10px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
        scaleIn: { '0%': { transform: 'scale(0)' }, '100%': { transform: 'scale(1)' } },
      },
    },
  },
  plugins: [],
}
export default config
TS

echo "3) Header + Footer components…"
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
          <a href="/consent" className="hover:text-gray-900">Consent &amp; Privacy</a>
          <a href="mailto:support@ticketpay.us" className="hover:text-gray-900">Support</a>
        </nav>
      </div>
    </footer>
  )
}
TSX

echo "4) Reusable 'How it works' band…"
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

echo "5) StateSelect (CA first, any US state)…"
cat > src/components/StateSelect.tsx <<'TSX'
'use client'
const STATES = [
  { code: 'CA', name: 'California' },
  { code: 'AL', name: 'Alabama' }, { code: 'AK', name: 'Alaska' }, { code: 'AZ', name: 'Arizona' },
  { code: 'AR', name: 'Arkansas' }, { code: 'CO', name: 'Colorado' }, { code: 'CT', name: 'Connecticut' },
  { code: 'DC', name: 'District of Columbia' }, { code: 'DE', name: 'Delaware' }, { code: 'FL', name: 'Florida' },
  { code: 'GA', name: 'Georgia' }, { code: 'HI', name: 'Hawaii' }, { code: 'ID', name: 'Idaho' },
  { code: 'IL', name: 'Illinois' }, { code: 'IN', name: 'Indiana' }, { code: 'IA', name: 'Iowa' },
  { code: 'KS', name: 'Kansas' }, { code: 'KY', name: 'Kentucky' }, { code: 'LA', name: 'Louisiana' },
  { code: 'ME', name: 'Maine' }, { code: 'MD', name: 'Maryland' }, { code: 'MA', name: 'Massachusetts' },
  { code: 'MI', name: 'Michigan' }, { code: 'MN', name: 'Minnesota' }, { code: 'MS', name: 'Mississippi' },
  { code: 'MO', name: 'Missouri' }, { code: 'MT', name: 'Montana' }, { code: 'NE', name: 'Nebraska' },
  { code: 'NV', name: 'Nevada' }, { code: 'NH', name: 'New Hampshire' }, { code: 'NJ', name: 'New Jersey' },
  { code: 'NM', name: 'New Mexico' }, { code: 'NY', name: 'New York' }, { code: 'NC', name: 'North Carolina' },
  { code: 'ND', name: 'North Dakota' }, { code: 'OH', name: 'Ohio' }, { code: 'OK', name: 'Oklahoma' },
  { code: 'OR', name: 'Oregon' }, { code: 'PA', name: 'Pennsylvania' }, { code: 'RI', name: 'Rhode Island' },
  { code: 'SC', name: 'South Carolina' }, { code: 'SD', name: 'South Dakota' }, { code: 'TN', name: 'Tennessee' },
  { code: 'TX', name: 'Texas' }, { code: 'UT', name: 'Utah' }, { code: 'VT', name: 'Vermont' },
  { code: 'VA', name: 'Virginia' }, { code: 'WA', name: 'Washington' }, { code: 'WV', name: 'West Virginia' },
  { code: 'WI', name: 'Wisconsin' }, { code: 'WY', name: 'Wyoming' },
];

export default function StateSelect({
  value, onChange, id = 'state'
}: { value: string; onChange: (v: string) => void; id?: string }) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-2">
        Plate state
      </label>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-2xl outline-none focus:border-emerald-500 focus:bg-white"
      >
        {STATES.map(s => (
          <option key={s.code} value={s.code}>{s.name}</option>
        ))}
      </select>
      <p className="mt-1 text-xs text-gray-500">Plates from any US state; alerts apply to tickets issued in SF.</p>
    </div>
  )
}
TSX

echo "6) Layout: include SiteHeader/SiteFooter and keep the glow…"
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

echo "7) Home (two-step, SMS first, CA preselected, unified card)…"
cat > src/app/page.tsx <<'TSX'
'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import StateSelect from '@/components/StateSelect'
import HowItWorks from '@/components/HowItWorks'
import { ArrowRight, Shield, Clock, MapPin, Bell, Check } from 'lucide-react'

type Step = 'plate' | 'contact'
type Channel = 'sms' | 'email'

const normalizePhone = (v: string) => v.replace(/[^\d]/g, '')
const formatPhone = (v: string) => {
  const d = normalizePhone(v).slice(0, 10)
  if (d.length <= 3) return d
  if (d.length <= 6) return `(${d.slice(0,3)}) ${d.slice(3,6)}`
  return `(${d.slice(0,3)}) ${d.slice(3,6)}-${d.slice(6,10)}`
}
const isValidUsPhone = (v: string) => normalizePhone(v).length === 10
const isValidEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim())
const isValidPlate = (v: string) => /^[A-Z0-9]{2,8}$/.test(v.replace(/\s/g, ''))

export default function HomePage() {
  const [plate, setPlate] = useState('')
  const [state, setState] = useState('CA')
  const [step, setStep] = useState<Step>('plate')
  const [channel, setChannel] = useState<Channel>('sms') // SMS default
  const [contact, setContact] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  const plateOk = isValidPlate(plate)
  const contactOk = channel === 'sms' ? isValidUsPhone(contact) : isValidEmail(contact)

  const handlePlateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '')
    if (value.length > 3 && value.length <= 7) value = value.slice(0, 3) + ' ' + value.slice(3)
    setPlate(value)
  }

  return (
    <div className="min-h-screen bg-glow-left">
      <main className="flex min-h-screen items-center justify-center px-4 py-24">
        <div className="w-full max-w-lg">
          <div className="flex justify-center mb-8">
            <div className="inline-flex items-center gap-2 bg-green-50 border border-green-200 text-green-800 text-sm font-medium px-4 py-2 rounded-full">
              <MapPin className="w-4 h-4" />
              <span>SF Bay Area • Deadline protection</span>
            </div>
          </div>

          <h1 className="text-center text-5xl font-extrabold mb-4">
            Never pay a late fee
            <span className="block text-green-600 mt-1">ever again</span>
          </h1>
          <p className="text-center text-xl text-gray-600 mb-12 max-w-md mx-auto">
            We track your tickets and remind you before fees increase. Beat every deadline.
          </p>

          <div className="rounded-3xl bg-white p-8 shadow-2xl border border-gray-100">
            {step === 'plate' ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <StateSelect value={state} onChange={setState} />
                  <div className="relative">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      License plate
                    </label>
                    <input
                      ref={inputRef}
                      type="text"
                      value={plate}
                      onChange={handlePlateChange}
                      onKeyDown={(e) => e.key === 'Enter' && plateOk && setStep('contact')}
                      placeholder="ABC 1234"
                      maxLength={8}
                      className="w-full px-5 py-4 text-2xl font-mono uppercase bg-gray-50 border-2 border-gray-200 rounded-2xl outline-none focus:border-emerald-500 focus:bg-white"
                      aria-invalid={!!plate && !plateOk}
                    />
                    {plateOk && <Check className="absolute right-3 bottom-3 w-5 h-5 text-emerald-600" />}
                  </div>
                </div>

                <button
                  onClick={() => plateOk && setStep('contact')}
                  disabled={!plateOk}
                  className={`mt-6 w-full py-5 px-6 rounded-2xl font-semibold text-lg text-white ${!plateOk ? 'bg-gray-300 cursor-not-allowed' : 'bg-gray-900 hover:bg-gray-800'}`}
                >
                  Next
                </button>

                <div className="flex items-center justify-center gap-8 text-sm text-gray-500 pt-2">
                  <span className="flex items-center gap-1"><Shield className="w-4 h-4" />Secure</span>
                  <span className="flex items-center gap-1"><Bell className="w-4 h-4" />Smart reminders</span>
                  <span className="flex items-center gap-1"><Clock className="w-4 h-4" />Cancel anytime</span>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-500">
                    Plate <span className="font-mono text-gray-900">{state} {plate.replace(/\s/g,'')}</span>
                  </p>
                  <div role="tablist" aria-label="Choose alert channel" className="inline-flex rounded-full bg-gray-100 p-1">
                    <button
                      role="tab" aria-selected={channel==='sms'}
                      onClick={() => setChannel('sms')}
                      className={`px-3 py-1.5 text-sm rounded-full border ${channel==='sms' ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white text-gray-900 border-gray-300 hover:bg-gray-50'}`}
                    >
                      SMS
                    </button>
                    <button
                      role="tab" aria-selected={channel==='email'}
                      onClick={() => setChannel('email')}
                      className={`ml-2 px-3 py-1.5 text-sm rounded-full border ${channel==='email' ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white text-gray-900 border-gray-300 hover:bg-gray-50'}`}
                    >
                      Email
                    </button>
                  </div>
                </div>

                <label className="block text-sm font-medium text-gray-700 mt-4">
                  {channel === 'sms' ? 'Mobile number' : 'Email address'}
                </label>
                <input
                  type={channel === 'sms' ? 'tel' : 'email'}
                  inputMode={channel === 'sms' ? 'tel' : 'email'}
                  autoComplete={channel === 'sms' ? 'tel' : 'email'}
                  value={contact}
                  onChange={(e) => setContact(channel === 'sms' ? formatPhone(e.target.value) : e.target.value)}
                  placeholder={channel === 'sms' ? '(415) 555-0123' : 'you@example.com'}
                  className="w-full mt-2 px-5 py-4 text-lg bg-gray-50 border-2 border-gray-200 rounded-2xl outline-none focus:border-emerald-500 focus:bg-white"
                  aria-invalid={!!contact && !contactOk}
                />
                <p className={`mt-1 text-xs ${contact && !contactOk ? 'text-red-600' : 'text-gray-500'}`}>
                  {channel === 'sms'
                    ? 'Message & data rates may apply. Text STOP to cancel, HELP for help.'
                    : 'We’ll send a confirmation first.'}
                </p>
                <p className="mt-1 text-[11px] text-gray-500">
                  See our <a href="/consent" className="underline underline-offset-2">Consent & Privacy</a>.
                </p>

                <button
                  onClick={async () => {
                    if (!contactOk) return
                    setIsLoading(true)
                    await new Promise(r => setTimeout(r, 400))
                    router.push(`/results?plate=${plate.replace(/\s/g,'')}&state=${state}&channel=${channel}&contact=${encodeURIComponent(contact)}`)
                  }}
                  disabled={!contactOk || isLoading}
                  className={`mt-6 w-full py-5 px-6 rounded-2xl font-semibold text-lg text-white ${!contactOk || isLoading ? 'bg-gray-300 cursor-not-allowed' : 'bg-gray-900 hover:bg-gray-800'}`}
                >
                  {channel === 'sms' ? 'Start SMS alerts' : 'Start email alerts'}
                </button>

                <div className="mt-3 text-xs sm:text-sm text-gray-500 text-center">
                  ✅ Secure · 🏛 Official city data · 1-tap unsubscribe
                </div>

                <button onClick={() => setStep('plate')} className="mt-3 w-full text-sm text-gray-600 hover:text-gray-900">
                  Back
                </button>
              </>
            )}
          </div>

          <HowItWorks />
        </div>
      </main>
    </div>
  )
}
TSX

echo "8) Results (server component version, no hooks, unified card + next steps)…"
mkdir -p src/app/results
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

cat > src/app/results/page.tsx <<'TSX'
import Link from 'next/link'
import { Check } from 'lucide-react'
import NextSteps from './NextSteps'

type SearchParams = { plate?: string; state?: string; channel?: string; contact?: string }

export default function ResultsPage({ searchParams }: { searchParams: SearchParams }) {
  const plate = (searchParams.plate ?? 'ABC123').toString()
  const state = (searchParams.state ?? 'CA').toString()
  const channel = (searchParams.channel ?? 'sms').toString()
  const contact = searchParams.contact ? decodeURIComponent(searchParams.contact) : ''

  return (
    <main className="px-4 bg-glow-right min-h-screen">
      <div className="h-4 sm:h-6" />
      <header className="mx-auto max-w-5xl pt-8 sm:pt-12 pb-2 text-center">
        <h1 className="mt-2 text-4xl/tight sm:text-5xl/tight font-extrabold">You’re all set</h1>
        <p className="mt-3 text-lg text-gray-600">
          We’ll {channel === 'email' ? 'email' : 'text'} you when a ticket posts for {state} {plate}, plus reminders before late fees.
        </p>
      </header>

      <section className="mx-auto max-w-3xl pt-8 pb-10">
        <div className="rounded-3xl bg-white p-8 shadow-2xl border border-gray-100 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-emerald-100 mb-4">
            <Check className="w-8 h-8 text-emerald-600" />
          </div>
          <p className="text-lg text-gray-700">
            Alerts active to {channel === 'sms' ? 'SMS' : 'Email'}
            {contact ? <> for <span className="font-medium text-gray-900">{contact}</span></> : null}
          </p>
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/manage" className="px-5 py-3 rounded-xl border-2 border-gray-200 text-gray-800 hover:bg-gray-50">Manage alerts</Link>
            <Link href="/" className="px-5 py-3 rounded-xl bg-gray-900 text-white hover:bg-gray-800">Add another plate</Link>
          </div>
          <div className="mt-3 text-sm text-gray-500">
            ✅ Secure · 🏛 Official city data · 1-tap unsubscribe
          </div>
        </div>
      </section>

      <NextSteps />
    </main>
  )
}
TSX

echo "9) Manage: unify card + add obvious 'Add a plate'…"
mkdir -p src/app/manage
cat > src/app/manage/page.tsx <<'TSX'
'use client'
import { useState } from 'react'
import { Plus, Search, Trash2, Pause, Play } from 'lucide-react'
import Link from 'next/link'

export default function ManagePage() {
  const [searchTerm, setSearchTerm] = useState('')

  // Mock data (replace with real data)
  const [alerts, setAlerts] = useState([
    { id: 1, plate: 'CA ABC123', channel: 'sms', contact: '(415) 555-0123', active: true },
    { id: 2, plate: 'NY XYZ789', channel: 'email', contact: 'user@example.com', active: true },
  ])

  const filtered = alerts.filter(a =>
    a.plate.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.contact.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const toggleActive = (id: number) => {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, active: !a.active } : a))
  }
  const remove = (id: number) => setAlerts(prev => prev.filter(a => a.id !== id))

  return (
    <main className="min-h-screen bg-glow-top px-4 py-8 sm:py-12">
      <div className="mx-auto max-w-4xl">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-2">Manage alerts</h1>
          <p className="text-gray-600">View, pause, or remove your plate alerts</p>
        </div>

        <div className="rounded-3xl bg-white p-6 sm:p-8 shadow-2xl border border-gray-100">
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search plates or contacts…"
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl outline-none focus:border-emerald-500 focus:bg-white"
              />
            </div>
            <Link href="/" className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-xl font-semibold hover:bg-gray-800">
              <Plus className="w-5 h-5" />
              <span>Add a plate</span>
            </Link>
          </div>

          {filtered.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-4">No alerts found</p>
              <Link href="/" className="text-emerald-600 font-semibold hover:text-emerald-700">
                Add your first plate →
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {filtered.map(a => (
                <div key={a.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <span className="font-mono font-semibold text-gray-900">{a.plate}</span>
                      <span className={`px-2 py-0.5 rounded-full text-xs ${a.active ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-200 text-gray-700'}`}>
                        {a.active ? 'Active' : 'Paused'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">{a.channel === 'sms' ? '💬' : '📧'} {a.contact}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => toggleActive(a.id)} className="p-2 rounded-lg border border-gray-300 hover:bg-white">
                      {a.active ? <Pause className="w-5 h-5 text-gray-700" /> : <Play className="w-5 h-5 text-gray-700" />}
                    </button>
                    <button onClick={() => remove(a.id)} className="p-2 rounded-lg border border-gray-300 hover:bg-white text-red-500">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
TSX

echo "10) API subscribe route (sane guards + NextResponse)…"
mkdir -p src/app/api/subscribe
cat > src/app/api/subscribe/route.ts <<'TS'
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import twilio from 'twilio'

const client = twilio(process.env.TWILIO_SID!, process.env.TWILIO_AUTH!)

export async function POST(req: Request) {
  try {
    const { plate, state, channel, value } = await req.json()
    if (!plate || !state || !channel || !value) {
      return NextResponse.json({ ok: false, error: 'missing_fields' }, { status: 400 })
    }

    // TODO: persist to DB first

    if (channel === 'sms') {
      const digits = String(value).replace(/[^\d]/g, '')
      if (digits.length !== 10) {
        return NextResponse.json({ ok: false, error: 'invalid_phone' }, { status: 400 })
      }
      const to = '+1' + digits
      await client.messages.create({
        from: process.env.TWILIO_FROM!, // or Messaging Service SID
        to,
        body: `TicketPay: Alerts activated for ${state} ${plate}. We'll text when a ticket posts, plus reminders. Reply STOP to cancel, HELP for help.`,
      })
    }

    // email path can be added later
    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ ok: false, error: 'server_error' }, { status: 500 })
  }
}
TS

echo "✅ All files written."
