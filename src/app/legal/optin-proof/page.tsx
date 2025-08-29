'use client'

import Logo from '@/components/Logo'
import Link from 'next/link'
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
      <header className="mx-auto max-w-5xl pt-8 sm:pt-12 pb-2 flex items-center justify-between">
        <Link href="/" aria-label="Go to home" className="inline-flex items-center gap-2 focus:outline-none">
          <Logo />
        </Link>
      </header>

      <div className="mx-auto max-w-5xl text-center">
        <h1 className="mt-2 text-4xl/tight sm:text-5xl/tight font-extrabold">You’re all set</h1>
        <p className="mt-3 text-lg text-gray-600">
          We’ll {channel === 'email' ? 'email' : 'text'} you when a ticket posts for {state} {plate}, plus reminders before late fees.
        </p>
      </div>

      <section className="mx-auto max-w-3xl pt-8 pb-16">
        <div className="rounded-3xl bg-white p-8 shadow-2xl border border-gray-100 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-emerald-100 mb-4">
            <Check className="w-8 h-8 text-emerald-600" />
          </div>

          <p className="text-lg text-gray-700">
            Alerts active to {channel === 'sms' ? 'SMS' : 'Email'}{' '}
            {contact ? <span className="font-medium text-gray-900">{decodeURIComponent(contact)}</span> : null}
          </p>

          <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/manage" className="px-5 py-3 rounded-xl border-2 border-gray-200 text-gray-800 hover:bg-gray-50">
              Manage alerts
            </Link>
            <button onClick={() => router.push('/')} className="px-5 py-3 rounded-xl bg-gray-900 text-white hover:bg-gray-800">
              Add another plate
            </button>
          </div>

          <div className="mt-3 text-sm text-gray-500">
            ✅ Secure · 🏛 Official data · 1-tap unsubscribe
          </div>
        </div>
      </section>
    </main>
  )
}
