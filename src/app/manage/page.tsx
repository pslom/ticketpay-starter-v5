'use client'

import { useState, useEffect } from 'react'
import { formatUSD } from "@/lib/format";
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface Subscription {
  id: string
  plate: string
  plate_normalized: string
  state: string
  channel: 'sms' | 'email'
  value: string
  city: string
  created_at: string
  paused_at?: string | null
  verified_at?: string | null
}

interface Citation {
  id: string
  citation_number: string
  amount_cents: number
  issued_at: string
  status: string
  location?: string
  violation?: string
}

export default function ManagePage() {
  const router = useRouter()
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([])
  const [citations, setCitations] = useState<Record<string, Citation[]>>({})
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)

  // Load subscriptions from localStorage or URL params
  useEffect(() => {
    loadSubscriptions()
  }, [])

  const loadSubscriptions = async () => {
    setLoading(true)
    setError('')
    
    try {
      // Try to get subscriptions from URL params (if coming from email/SMS link)
      const urlParams = new URLSearchParams(window.location.search)
      const contact = urlParams.get('contact')
      const channel = urlParams.get('channel')
      
      let subs: Subscription[] = []
      
      if (contact) {
        // Fetch from API
        const response = await fetch('/api/subscribe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            op: 'list_subscriptions',
            value: contact,
            channel: channel || undefined,
            city: 'SF'
          })
        })
        
        const data = await response.json()
        if (data.ok && data.items) {
          subs = data.items
        }
      } else {
        // Try localStorage for recent subscriptions
        const stored = localStorage.getItem('ticketpay_subscriptions')
        if (stored) {
          subs = JSON.parse(stored)
        }
      }
      
      setSubscriptions(subs)
      
      // Check for active tickets for each subscription
      for (const sub of subs) {
        await checkTickets(sub)
      }
    } catch (err) {
      setError('Failed to load subscriptions. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const checkTickets = async (sub: Subscription) => {
    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          op: 'lookup_ticket',
          plate: sub.plate,
          state: sub.state,
          city: sub.city
        })
      })
      
      const data = await response.json()
      if (data.ok && data.items) {
        setCitations(prev => ({
          ...prev,
          [sub.id]: data.items
        }))
      }
    } catch (err) {
      console.error('Failed to check tickets:', err)
    }
  }

  const handleDelete = async (id: string) => {
    if (deleteConfirm !== id) {
      setDeleteConfirm(id)
      setTimeout(() => setDeleteConfirm(null), 3000)
      return
    }
    
    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          op: 'unsubscribe',
          id
        })
      })
      
      const data = await response.json()
      if (data.ok) {
        setSubscriptions(prev => prev.filter(s => s.id !== id))
        
        // Update localStorage
        const updated = subscriptions.filter(s => s.id !== id)
        localStorage.setItem('ticketpay_subscriptions', JSON.stringify(updated))
      }
    } catch (err) {
      setError('Failed to remove subscription')
    } finally {
      setDeleteConfirm(null)
    }
  }

  const handlePause = async (id: string) => {
    // In a real app, this would call an API endpoint
    setSubscriptions(prev => prev.map(s => 
      s.id === id 
        ? { ...s, paused_at: s.paused_at ? null : new Date().toISOString() }
        : s
    ))
  }

  const formatContact = (channel: string, value: string) => {
    if (channel === 'sms') {
      const digits = value.replace(/\D/g, '')
      if (digits.length === 10) {
        return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`
      }
      return value
    }
    return value
  }

  const filteredSubscriptions = subscriptions.filter(sub => {
    if (!searchQuery) return true
    const query = searchQuery.toLowerCase()
    return (
      sub.plate.toLowerCase().includes(query) ||
      sub.state.toLowerCase().includes(query) ||
      sub.value.toLowerCase().includes(query)
    )
  })

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 px-4 py-12">
        <div className="mx-auto max-w-4xl">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="space-y-4">
              <div className="h-24 bg-gray-200 rounded"></div>
              <div className="h-24 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="mx-auto max-w-4xl px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Manage Alerts</h1>
              <p className="mt-1 text-sm text-gray-600">
                {subscriptions.length} active {subscriptions.length === 1 ? 'alert' : 'alerts'}
              </p>
            </div>
            <Link
              href="/"
              className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-500 transition"
            >
              Add plate
            </Link>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-4xl px-4 py-8">
        {/* Search */}
        {subscriptions.length > 0 && (
          <div className="mb-6">
            <input
              type="search"
              placeholder="Search plates or contacts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border-gray-300 px-4 py-2 text-gray-900 shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
            />
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-6 rounded-lg bg-red-50 p-4 text-red-700">
            {error}
          </div>
        )}

        {/* Subscriptions List */}
        {filteredSubscriptions.length > 0 ? (
          <div className="space-y-4">
            {filteredSubscriptions.map(sub => {
              const tickets = citations[sub.id] || []
              const activeTickets = tickets.filter(t => t.status !== 'PAID')
              
              return (
                <div key={sub.id} className="overflow-hidden rounded-lg bg-white shadow">
                  <div className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        {/* Plate and State */}
                        <div className="flex items-center gap-3">
                          <span className="inline-flex items-center rounded-lg bg-gray-100 px-3 py-1 text-lg font-mono font-semibold text-gray-900">
                            {sub.state} {sub.plate}
                          </span>
                          {sub.paused_at && (
                            <span className="rounded-full bg-yellow-100 px-2 py-1 text-xs font-medium text-yellow-800">
                              Paused
                            </span>
                          )}
                          {!sub.verified_at && (
                            <span className="rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600">
                              Unverified
                            </span>
                          )}
                        </div>

                        {/* Contact Info */}
                        <div className="mt-2 flex items-center gap-4 text-sm text-gray-600">
                          <span className="flex items-center gap-1">
                            {sub.channel === 'sms' ? (
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                              </svg>
                            ) : (
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                              </svg>
                            )}
                            {formatContact(sub.channel, sub.value)}
                          </span>
                          <span>•</span>
                          <span>
                            Added {new Date(sub.created_at).toLocaleDateString()}
                          </span>
                        </div>

                        {/* Active Tickets */}
                        {activeTickets.length > 0 && (
                          <div className="mt-4 rounded-lg bg-amber-50 p-3">
                            <div className="flex items-center gap-2 text-amber-800">
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                              </svg>
                              <span className="font-medium">
                                {activeTickets.length} active {activeTickets.length === 1 ? 'ticket' : 'tickets'}
                              </span>
                              <span className="text-sm">
                                {formatUSD(activeTickets.reduce((sum, t) => sum + (t.amount_cents / 100), 0))} total
                              </span>
                            </div>
                            <a
                              href="https://wmq.etimspayments.com/pbw/include/sanfrancisco/input.jsp"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-amber-900 hover:text-amber-700"
                            >
                              Pay at SFMTA
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                              </svg>
                            </a>
                          </div>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handlePause(sub.id)}
                          className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
                        >
                          {sub.paused_at ? 'Resume' : 'Pause'}
                        </button>
                        <button
                          onClick={() => handleDelete(sub.id)}
                          className={`rounded-lg px-3 py-1.5 text-sm font-medium transition ${
                            deleteConfirm === sub.id
                              ? 'bg-red-600 text-white hover:bg-red-700'
                              : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          {deleteConfirm === sub.id ? 'Confirm' : 'Remove'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="rounded-lg bg-white p-12 text-center shadow">
            <svg className="mx-auto w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <h3 className="mt-4 text-lg font-medium text-gray-900">No active alerts</h3>
            <p className="mt-2 text-sm text-gray-600">
              {searchQuery 
                ? 'No alerts match your search'
                : 'Add a license plate to start monitoring for tickets'}
            </p>
            <Link
              href="/"
              className="mt-6 inline-flex items-center rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-500 transition"
            >
              Add your first plate
            </Link>
          </div>
        )}

        {/* Help Text */}
        <div className="mt-8 rounded-lg bg-blue-50 p-4">
          <h3 className="font-medium text-blue-900">Need help?</h3>
          <p className="mt-1 text-sm text-blue-700">
            If you're not seeing your alerts, try searching with the phone number or email you used to sign up.
            You can also add the plate again if needed.
          </p>
          <div className="mt-3 flex gap-4 text-sm">
            <Link href="/trust" className="font-medium text-blue-900 hover:text-blue-700">
              Trust & Safety
            </Link>
            <a href="mailto:help@ticketpay.us" className="font-medium text-blue-900 hover:text-blue-700">
              Contact Support
            </a>
          </div>
        </div>
      </div>
    </main>
  )
}
