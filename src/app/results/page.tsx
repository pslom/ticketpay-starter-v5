'use client'
import { useEffect } from 'react'
import Link from 'next/link'
import PayAtSFMTA from '@/components/PayAtSFMTA'
import { confettiBurst } from '@/lib/confetti'

export default function ResultsPage() {
  const params = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '')
  const state = (params.get('state') || 'CA').toUpperCase()
  const plate = (params.get('plate') || '7ABC123').toUpperCase()
  useEffect(()=>{confettiBurst()},[])
  return (
    <section className="mt-6">
      <div className="badge-pill mx-auto mb-6">SF Bay Area • Deadline protection</div>
      <h1 className="hero-title">Never pay a late fee <span className="accent">ever</span> again</h1>
      <p className="hero-sub">SF ticket alerts by SMS or email. We remind you before fees hit.</p>

      <div className="mx-auto mt-10 max-w-3xl card-agency card-mount p-8">
        <div className="progress mb-6"><div className="fill w-full"></div></div>
        <div className="mx-auto mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100">
          <span className="h-6 w-6 rounded-full bg-emerald-600"></span>
        </div>
        <p className="mb-2 text-center text-lg">Alerts active for <span className="font-semibold">{state} {plate}</span></p>

        <div className="mt-6 flex flex-col items-center gap-3">
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link href="/manage" className="btn-outline">Manage alerts</Link>
            <Link href="/?add=1" className="btn-primary">Add another plate</Link>
          </div>
          <div className="mt-4">
            <PayAtSFMTA size="md" />
          </div>
          <p className="mt-2 text-sm text-slate-600">Official city payment portal.</p>
        </div>

        <div className="mx-auto mt-8 grid max-w-2xl gap-3 text-sm text-slate-700">
          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <div className="font-semibold">What happens next</div>
            <ul className="mt-2 list-disc pl-5">
              <li>We check daily; alerts usually within 24 hours of posting.</li>
              <li>You’ll get reminders at 5-day and 48-hour deadlines.</li>
              <li>To pay, use the official SFMTA portal above.</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
