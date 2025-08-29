#!/usr/bin/env bash
set -euo pipefail

echo "1) Fix globals.css (green glow utilities, valid CSS)…"
mkdir -p src/app
cat > src/app/globals.css <<'CSS'
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Base tokens */
@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 0 0% 3.9%;
  }
  body {
    @apply bg-neutral-50 text-gray-900 antialiased;
  }
}

/* Green glow utilities (rotate per page) */
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

echo "2) Fix Tailwind fontFamily syntax so Manrope is used…"
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
        brand: {
          50: '#F5FFFA',
          600: '#10b981',
          700: '#059669',
        },
      },
      boxShadow: {
        card: '0 16px 40px -20px rgba(0,0,0,0.25)',
      },
      borderRadius: {
        '2xl': '1.25rem',
      },
      fontFamily: {
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

echo "3) Home page: add missing imports, phone formatter, consent + trust row…"
cat > src/app/page.tsx <<'TSX'
'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import StateSelect from '@/components/StateSelect'
import { ArrowRight, Shield, Clock, MapPin, Bell } from 'lucide-react'

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

          <h1 className="text-center text-5xl font-bold mb-4">
            Never pay a late fee
            <span className="block text-green-600 mt-1">ever again</span>
          </h1>

          <p className="text-center text-xl text-gray-600 mb-12 max-w-md mx-auto">
            We track your tickets and remind you before fees increase. Beat every deadline.
          </p>

          <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 p-8">
            {step === 'plate' ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <StateSelect value={state} onChange={setState} />
                  <div>
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
                  aria-invalid={!!contact && !(channel === 'sms' ? isValidUsPhone(contact) : isValidEmail(contact))}
                />
                <p className={`mt-1 text-xs ${contact && !(channel === 'sms' ? isValidUsPhone(contact) : isValidEmail(contact)) ? 'text-red-600' : 'text-gray-500'}`}>
                  {channel === 'sms'
                    ? 'Message & data rates may apply. Text STOP to cancel, HELP for help.'
                    : 'We’ll send a confirmation first.'}
                </p>
                <p className="mt-1 text-[11px] text-gray-500">
                  See our <a href="/consent" className="underline underline-offset-2">Consent & Privacy</a>.
                </p>

                <button
                  onClick={async () => {
                    const contactOk = channel === 'sms' ? isValidUsPhone(contact) : isValidEmail(contact)
                    if (!contactOk) return
                    setIsLoading(true)
                    await new Promise(r => setTimeout(r, 400))
                    router.push(`/results?plate=${plate.replace(/\s/g,'')}&state=${state}&channel=${channel}&contact=${encodeURIComponent(contact)}`)
                  }}
                  disabled={!(channel === 'sms' ? isValidUsPhone(contact) : isValidEmail(contact)) || isLoading}
                  className={`mt-6 w-full py-5 px-6 rounded-2xl font-semibold text-lg text-white ${!(channel === 'sms' ? isValidUsPhone(contact) : isValidEmail(contact)) || isLoading ? 'bg-gray-300 cursor-not-allowed' : 'bg-gray-900 hover:bg-gray-800'}`}
                >
                  {channel === 'sms' ? 'Start SMS alerts' : 'Start email alerts'}
                </button>

                <div className="mt-3 text-xs sm:text-sm text-gray-500 text-center">
                  ✅ Secure · 🏛 Official data · 1-tap unsubscribe
                </div>

                <button onClick={() => setStep('plate')} className="mt-3 w-full text-sm text-gray-600 hover:text-gray-900">
                  Back
                </button>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
TSX

echo "4) Results page: ensure client and trust row…"
cat > src/app/results/page.tsx <<'TSX'
'use client'
import { useSearchParams, useRouter } from 'next/navigation'
import { Check } from 'lucide-react'

export default function ResultsPage() {
  const sp = useSearchParams()
  const router = useRouter()
  const plate = sp.get('plate') || 'ABC123'
  const state = sp.get('state') || 'CA'
  const channel = sp.get('channel') || 'sms'
  const contact = sp.get('contact') || ''

  return (
    <main className="px-4 bg-glow-right min-h-screen">
      <header className="mx-auto max-w-5xl pt-10 sm:pt-16 text-center">
        <h1 className="mt-2 text-4xl/tight sm:text-5xl/tight font-extrabold">You’re all set</h1>
        <p className="mt-3 text-lg text-gray-600">
          We’ll {channel === 'email' ? 'email' : 'text'} you when a ticket posts for {state} {plate}, plus reminders before late fees.
        </p>
      </header>

      <section className="mx-auto max-w-3xl pt-8 pb-16">
        <div className="rounded-3xl bg-white p-8 shadow-2xl border border-gray-100 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-emerald-100 mb-4">
            <Check className="w-8 h-8 text-emerald-600" />
          </div>
          <p className="text-lg text-gray-700">
            Alerts active to {channel === 'sms' ? 'SMS' : 'Email'} <span className="font-medium text-gray-900">{decodeURIComponent(contact)}</span>
          </p>
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
            <a href="/manage" className="px-5 py-3 rounded-xl border-2 border-gray-200 text-gray-800 hover:bg-gray-50">Manage alerts</a>
            <button onClick={() => router.push('/')} className="px-5 py-3 rounded-xl bg-gray-900 text-white hover:bg-gray-800">Add another plate</button>
          </div>
          <div className="mt-3 text-sm text-gray-500">
            ✅ Secure · 🏛 Official data · 1-tap unsubscribe
          </div>
        </div>
      </section>
    </main>
  )
}
TSX

echo "5) API route: add NextResponse and basic guard…"
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

    // TODO: persist subscription in DB

    if (channel === 'sms') {
      const digits = String(value).replace(/[^\d]/g, '')
      if (digits.length !== 10) {
        return NextResponse.json({ ok: false, error: 'invalid_phone' }, { status: 400 })
      }
      const to = '+1' + digits
      await client.messages.create({
        from: process.env.TWILIO_FROM!,
        to,
        body: `TicketPay: Alerts activated for ${state} ${plate}. We'll text when a ticket posts, plus reminders. Reply STOP to cancel, HELP for help.`,
      })
    }

    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ ok: false, error: 'server_error' }, { status: 500 })
  }
}
TS

echo "✅ All patches written."
