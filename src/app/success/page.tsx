// src/app/success/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

export default function SuccessPage() {
  const searchParams = useSearchParams()
  const [timeLeft, setTimeLeft] = useState(10)
  
  const plate = searchParams.get('plate') || 'ABC123'
  const state = searchParams.get('state') || 'CA'
  const needsVerification = searchParams.get('verify') === '1'
  
  // Countdown timer for auto-redirect
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          window.location.href = 'https://wmq.etimspayments.com/pbw/include/sanfrancisco/input.jsp'
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [])
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50">
      {/* Simple nav */}
      <nav className="border-b bg-white/80 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <span className="font-bold text-xl">TicketPay</span>
          </Link>
        </div>
      </nav>

      <main className="max-w-2xl mx-auto px-4 py-16 text-center">
        {/* Success animation */}
        <div className="mb-8">
          <div className="w-24 h-24 mx-auto bg-emerald-100 rounded-full flex items-center justify-center animate-bounce">
            <svg className="w-12 h-12 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>

        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          {needsVerification ? 'Almost done!' : 'You\'re all set!'}
        </h1>

        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 mb-8">
          {needsVerification ? (
            <>
              <p className="text-lg text-gray-700 mb-6">
                Check your phone for a text from TicketPay
              </p>
              
              <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
                <p className="text-sm font-medium text-gray-900 mb-2">To activate alerts:</p>
                <p className="text-gray-700">
                  Reply <span className="font-mono font-bold bg-emerald-100 px-2 py-1 rounded">YES</span> to confirm monitoring for{' '}
                  <span className="font-mono font-bold">{state} {plate}</span>
                </p>
              </div>
              
              <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                </svg>
                Waiting for confirmation...
              </div>
            </>
          ) : (
            <>
              <p className="text-lg text-gray-700 mb-6">
                You’ll get a text alert if a new ticket is found for <span className="font-mono font-bold">{state} {plate}</span>.
              </p>
              <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
                <p className="text-sm font-medium text-gray-900 mb-2">Next steps:</p>
                <ul className="list-disc list-inside text-gray-700 text-sm">
                  <li>Pay tickets promptly to avoid late fees</li>
                  <li>Check your phone for instant alerts</li>
                  <li>Manage or cancel alerts anytime</li>
                </ul>
              </div>
              <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                <svg className="w-4 h-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Redirecting to SFMTA payment site in {timeLeft} seconds...
              </div>
            </>
          )}
        </div>

        <Link href="/" className="inline-block mt-4 text-emerald-700 hover:underline">
          &larr; Back to home
        </Link>
      </main>
    </div>
  )
}
