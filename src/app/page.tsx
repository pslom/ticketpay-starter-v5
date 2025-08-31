'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function HomePage() {
  const router = useRouter()
  const [plate, setPlate] = useState('')
  const [state, setState] = useState('CA')
  const [phone, setPhone] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const formatPhone = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 10)
    if (digits.length <= 3) return digits
    if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          op: 'subscribe',
          plate: plate.toUpperCase().replace(/[^A-Z0-9]/g, ''),
          state,
          channel: 'sms',
          value: phone.replace(/\D/g, ''),
          skip_verification: true // NEW: Auto-verify
        })
      })

      const data = await response.json()
      
      if (data.ok) {
        router.push(`/success?plate=${plate}&state=${state}&phone=${encodeURIComponent(phone)}`)
      } else {
        setError(data.error || 'Something went wrong')
      }
    } catch (err) {
      setError('Network error. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const plateValid = /^[A-Z0-9]{2,8}$/i.test(plate)
  const phoneValid = /^\(\d{3}\) \d{3}-\d{4}$/.test(phone)
  const canSubmit = plateValid && phoneValid && !isLoading

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="border-b border-gray-200 bg-white sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <span className="font-semibold text-xl">TicketPay</span>
              <span className="ml-3 px-2 py-0.5 text-xs font-medium text-gray-600 bg-gray-100 rounded">
                SF Beta
              </span>
            </div>
            <div className="flex items-center space-x-6">
              <a href="/how" className="text-sm text-gray-600 hover:text-gray-900">How it works</a>
              <a href="/manage" className="text-sm text-gray-600 hover:text-gray-900">Manage alerts</a>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-12 md:py-20">
        <div className="max-w-2xl mx-auto">
          {/* Hero */}
          <div className="text-center mb-10">
            <h1 className="text-4xl md:text-5xl font-semibold tracking-tight mb-4">
              Parking ticket alerts for<br/>San Francisco
            </h1>
            <p className="text-lg text-gray-600 mb-2">
              Get notified the moment SFMTA issues a ticket to your vehicle.
            </p>
            <p className="text-sm text-gray-500">
              Avoid $108 late fees with automatic SMS reminders.
            </p>
          </div>

          {/* Form */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 md:p-8">
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                {/* Plate and State */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="md:col-span-2">
                    <label htmlFor="plate" className="block text-sm font-medium text-gray-700 mb-1">
                      License plate
                    </label>
                    <input
                      type="text"
                      id="plate"
                      value={plate}
                      onChange={(e) => setPlate(e.target.value.toUpperCase())}
                      placeholder="7ABC123"
                      maxLength={8}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
                    />
                  </div>
                  <div>
                    <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
                      State
                    </label>
                    <select
                      id="state"
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
                    >
                      <option value="CA">CA</option>
                      <option value="NY">NY</option>
                      <option value="TX">TX</option>
                      <option value="FL">FL</option>
                      <option value="IL">IL</option>
                    </select>
                  </div>
                </div>

                {/* Phone */}
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                    Mobile number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    value={phone}
                    onChange={(e) => setPhone(formatPhone(e.target.value))}
                    placeholder="(415) 555-0123"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    We'll text you when tickets are issued. Standard rates apply.
                  </p>
                </div>

                {/* Error */}
                {error && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-md text-sm text-red-600">
                    {error}
                  </div>
                )}

                {/* Submit */}
                <button
                  type="submit"
                  disabled={!canSubmit}
                  className="w-full py-2.5 px-4 bg-gray-900 text-white rounded-md font-medium hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isLoading ? 'Setting up...' : 'Start monitoring'}
                </button>
              </div>
            </form>

            {/* Trust signals */}
            <div className="mt-6 pt-6 border-t border-gray-100">
              <div className="flex items-center justify-center space-x-6 text-xs text-gray-500">
                <span className="flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                  </svg>
                  Encrypted
                </span>
                <span className="flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
                  </svg>
                  No spam
                </span>
                <span>Free during beta</span>
              </div>
            </div>
          </div>

          {/* How it works */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-3 bg-gray-100 rounded-full flex items-center justify-center">
                <span className="text-lg font-semibold">1</span>
              </div>
              <h3 className="font-medium mb-1">Daily monitoring</h3>
              <p className="text-sm text-gray-600">We check SFMTA records for your plate every day</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-3 bg-gray-100 rounded-full flex items-center justify-center">
                <span className="text-lg font-semibold">2</span>
              </div>
              <h3 className="font-medium mb-1">Instant alerts</h3>
              <p className="text-sm text-gray-600">Get a text within hours of ticket issuance</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-3 bg-gray-100 rounded-full flex items-center justify-center">
                <span className="text-lg font-semibold">3</span>
              </div>
              <h3 className="font-medium mb-1">Pay on time</h3>
              <p className="text-sm text-gray-600">Avoid late fees by paying at SFMTA.com</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Aurora from "@/components/Aurora";
import GradientButton from "@/components/GradientButton";
import { normalizePlate } from "@/lib/utils";

// Step type that actually works
type StepType = "plate" | "contact" | "verify" | "success";

const US_STATES = [
  "CA",
  "NY",
  "TX",
  "FL",
  "IL",
  "PA",
  "OH",
  "GA",
  "NC",
  "MI",
  "NJ",
  "VA",
  "WA",
  "AZ",
  "MA",
  "TN",
  "IN",
  "MO",
  "MD",
  "WI",
  "CO",
  "MN",
  "SC",
  "AL",
  "LA",
  "KY",
  "OR",
  "OK",
  "CT",
  "UT",
  "IA",
  "NV",
  "AR",
  "MS",
  "KS",
  "NM",
  "NE",
  "WV",
  "ID",
  "HI",
  "NH",
  "ME",
  "RI",
  "MT",
  "DE",
  "SD",
  "ND",
  "AK",
  "DC",
  "VT",
  "WY",
];

function ShieldIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <path d="M12 2l7 3v7c0 5.25-3.5 8.5-7 10-3.5-1.5-7-4.75-7-10V5l7-3z" />
      <path d="M9 12l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function BellIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <path
        d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M13.73 21a2 2 0 0 1-3.46 0"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ZapIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <polygon
        points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function HomePage() {
  const router = useRouter();
  const [step, setStep] = useState<StepType>("plate");
  const [plate, setPlate] = useState('');
  const [state, setState] = useState('CA');
  const [phone, setPhone] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const formatPhone = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 10);
    if (digits.length <= 3) return digits;
    if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  }
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
  
    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          op: 'subscribe',
          plate: plate.toUpperCase().replace(/[^A-Z0-9]/g, ''),
          state,
          channel: 'sms',
          value: phone.replace(/\D/g, ''),
          skip_verification: true // NEW: Auto-verify
        })
      });
  
      const data = await response.json();
      
      if (data.ok) {
        router.push(`/success?plate=${plate}&state=${state}&phone=${encodeURIComponent(phone)}`);
      } else {
        setError(data.error || 'Something went wrong');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }
  
  const plateValid = /^[A-Z0-9]{2,8}$/i.test(plate);
  const phoneValid = /^\(\d{3}\) \d{3}-\d{4}$/.test(phone);
  const canSubmit = plateValid && phoneValid && !isLoading;
  
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="border-b border-gray-200 bg-white sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <span className="font-semibold text-xl">TicketPay</span>
              <span className="ml-3 px-2 py-0.5 text-xs font-medium text-gray-600 bg-gray-100 rounded">
                SF Beta
              </span>
            </div>
            <div className="flex items-center space-x-6">
              <a href="/how" className="text-sm text-gray-600 hover:text-gray-900">How it works</a>
              <a href="/manage" className="text-sm text-gray-600 hover:text-gray-900">Manage alerts</a>
            </div>
          </div>
        </div>
      </nav>
  
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-12 md:py-20">
        <div className="max-w-2xl mx-auto">
          {/* Hero */}
          <div className="text-center mb-10">
            <h1 className="text-4xl md:text-5xl font-semibold tracking-tight mb-4">
              Parking ticket alerts for<br/>San Francisco
            </h1>
            <p className="text-lg text-gray-600 mb-2">
              Get notified the moment SFMTA issues a ticket to your vehicle.
            </p>
            <p className="text-sm text-gray-500">
              Avoid $108 late fees with automatic SMS reminders.
            </p>
          </div>
  
          {/* Form */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 md:p-8">
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                {/* Plate and State */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="md:col-span-2">
                    <label htmlFor="plate" className="block text-sm font-medium text-gray-700 mb-1">
                      License plate
                    </label>
                    <input
                      type="text"
                      id="plate"
                      value={plate}
                      onChange={(e) => setPlate(e.target.value.toUpperCase())}
                      placeholder="7ABC123"
                      maxLength={8}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
                    />
                  </div>
                  <div>
                    <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
                      State
                    </label>
                    <select
                      id="state"
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
                    >
                      <option value="CA">CA</option>
                      <option value="NY">NY</option>
                      <option value="TX">TX</option>
                      <option value="FL">FL</option>
                      <option value="IL">IL</option>
                    </select>
                  </div>
                </div>
  
                {/* Phone */}
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                    Mobile number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    value={phone}
                    onChange={(e) => setPhone(formatPhone(e.target.value))}
                    placeholder="(415) 555-0123"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    We'll text you when tickets are issued. Standard rates apply.
                  </p>
                </div>
  
                {/* Error */}
                {error && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-md text-sm text-red-600">
                    {error}
                  </div>
                )}
  
                {/* Submit */}
                <button
                  type="submit"
                  disabled={!canSubmit}
                  className="w-full py-2.5 px-4 bg-gray-900 text-white rounded-md font-medium hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isLoading ? 'Setting up...' : 'Start monitoring'}
                </button>
              </div>
            </form>
  
            {/* Trust signals */}
            <div className="mt-6 pt-6 border-t border-gray-100">
              <div className="flex items-center justify-center space-x-6 text-xs text-gray-500">
                <span className="flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                  </svg>
                  Encrypted
                </span>
                <span className="flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
                  </svg>
                  No spam
                </span>
                <span>Free during beta</span>
              </div>
            </div>
          </div>
  
          {/* How it works */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-3 bg-gray-100 rounded-full flex items-center justify-center">
                <span className="text-lg font-semibold">1</span>
              </div>
              <h3 className="font-medium mb-1">Daily monitoring</h3>
              <p className="text-sm text-gray-600">We check SFMTA records for your plate every day</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-3 bg-gray-100 rounded-full flex items-center justify-center">
                <span className="text-lg font-semibold">2</span>
              </div>
              <h3 className="font-medium mb-1">Instant alerts</h3>
              <p className="text-sm text-gray-600">Get a text within hours of ticket issuance</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-3 bg-gray-100 rounded-full flex items-center justify-center">
                <span className="text-lg font-semibold">3</span>
              </div>
              <h3 className="font-medium mb-1">Pay on time</h3>
              <p className="text-sm text-gray-600">Avoid late fees by paying at SFMTA.com</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
  const [plate, setPlate] = useState("");
  const [channel, setChannel] = useState<"sms" | "email">("sms");
  const [contact, setContact] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [subscriptionId, setSubscriptionId] = useState<string | null>(null);

  const normalizedPlate = useMemo(() => normalizePlate(plate), [plate]);
  const plateValid = normalizedPlate.length >= 2 && normalizedPlate;

  return (
    <main className="relative mx-auto max-w-4xl px-4 py-12">
      {/* Background polish */}
      <div className="absolute inset-0 bg-grid -z-10" />
      <Aurora />

      <section className="animate-in space-y-3">
        <h1 className="text-5xl font-semibold tracking-tight">
          Stay ahead of parking tickets
        </h1>
        <p className="text-neutral-600 max-w-2xl">
          Real-time alerts in San Francisco. Enter your plate and we’ll notify
          you when a new ticket is posted.
        </p>
        <p className="text-sm text-neutral-500">
          Trusted by San Francisco drivers to avoid late fees.
        </p>
      </section>

      <div className="mt-8 gradient-border">
        <div className="inner p-5 sm:p-6">
          {step === "plate" && (
            <form
              className="space-y-4"
              onSubmit={(e) => {
                e.preventDefault();
                setStep("contact");
              }}
            >
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-[1fr_140px]">
                <label className="space-y-1.5">
                  <span className="text-sm">Plate</span>
                  <input
                    className="h-12 w-full rounded-xl border border-neutral-300 px-4"
                    placeholder="ABC123"
                    value={plate}
                    onChange={(e) => setPlate(e.target.value)}
                  />
                </label>
                <label className="space-y-1.5">
                  <span className="text-sm">State</span>
                  <input
                    className="h-12 w-full rounded-xl border border-neutral-300 px-4 uppercase"
                    placeholder="CA"
                    value={state}
                    onChange={(e) => setState(e.target.value.toUpperCase())}
                    pattern="[A-Za-z]{2,3}"
                    required
                  />
                </label>
              </div>

              <GradientButton type="submit">Get alerts</GradientButton>

              <p className="text-[12px] text-neutral-500 flex items-center gap-3">
                <span className="inline-flex items-center gap-1">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
                    <path
                      d="M12 17a5 5 0 0 0 5-5V7l-5-3-5 3v5a5 5 0 0 0 5 5Z"
                      stroke="currentColor"
                      strokeWidth="1.6"
                    />
                  </svg>
                  Secure
                </span>
                <span>Private</span>
                <span>One‑tap unsubscribe</span>
                <a href="/consent" className="underline">
                  SMS terms
                </a>
                <span>No spam. No sharing your info.</span>
              </p>
            </form>
          )}
          {step === "contact" && (
            <form
              className="space-y-4"
              onSubmit={(e) => {
                e.preventDefault();
                setStep("verify");
              }}
            >
              <div>
                <label className="block text-sm font-medium">
                  {channel === "sms"
                    ? "Phone number"
                    : "Email address"}
                </label>
                <div className="mt-1">
                  {channel === "sms" ? (
                    <input
                      type="tel"
                      value={contact}
                      onChange={(e) => setContact(e.target.value)}
                      className="block w-full rounded-xl border border-neutral-300 px-4 py-2 text-sm"
                      placeholder="123-456-7890"
                      required
                    />
                  ) : (
                    <input
                      type="email"
                      value={contact}
                      onChange={(e) => setContact(e.target.value)}
                      className="block w-full rounded-xl border border-neutral-300 px-4 py-2 text-sm"
                      placeholder="you@example.com"
                      required
                    />
                  )}
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setChannel(channel === "sms" ? "email" : "sms")}
                  className="flex-1 rounded-xl border border-neutral-300 bg-white px-4 py-2 text-sm font-medium transition hover:bg-neutral-50"
                >
                  {channel === "sms" ? "Use email instead" : "Use SMS instead"}
                </button>
                <GradientButton type="submit">
                  {isLoading ? "Loading..." : "Subscribe"}
                </GradientButton>
              </div>

              {error && (
                <p className="text-red-500 text-sm">{error}</p>
              )}
            </form>
          )}
          {step === "verify" && (
            <div className="space-y-4">
              <p className="text-sm text-neutral-600">
                We just sent a {channel === "sms" ? "SMS" : "email"} to{" "}
                <span className="font-medium">{contact}</span>. Click the link in
                the message to confirm your subscription.
              </p>

              <div className="flex gap-4">
                <Link
                  href="/"
                  className="flex-1 rounded-xl border border-neutral-300 bg-white px-4 py-2 text-sm font-medium transition hover:bg-neutral-50"
                >
                  Cancel
                </Link>
                <GradientButton
                  onClick={() => setStep("success")}
                  disabled={isLoading}
                >
                  {isLoading ? "Loading..." : "Confirm subscription"}
                </GradientButton>
              </div>
            </div>
          )}
          {step === "success" && (
            <div className="text-center">
              <h2 className="text-2xl font-semibold">
                You're all set!
              </h2>
              <p className="mt-2 text-sm text-neutral-600">
                You'll now receive {channel} alerts for new parking tickets.
              </p>

              <Link
                href="/"
                className="mt-4 inline-block rounded-xl bg-black px-4 py-2 text-sm font-medium text-white transition hover:bg-neutral-800"
              >
                Back to home
              </Link>
            </div>
          )}
        </div>
      </div>


