
"use client"

import { useState, useEffect } from 'react'
import DataFreshness from "@/components/DataFreshness";


import { US_STATES } from "@/lib/constants";

function formatPhone(input: string) {
  // Remove all non-digit characters
  const digits = input.replace(/\D/g, '')
  if (digits.length <= 3) return digits
  if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 10)}`
}

export default function HomePage() {
  // Mock: fetch SF Jurisdiction row
  const [jurisdiction, setJurisdiction] = useState<{ last_import?: string | null }>({ last_import: null });

  useEffect(() => {
    // Simulate async fetch
    setTimeout(() => {
      setJurisdiction({ last_import: new Date().toISOString() });
    }, 500);
  }, []);
  const [isExistingUser, setIsExistingUser] = useState(false)
  const [plates, setPlates] = useState<any[]>([])
  const [showAddForm, setShowAddForm] = useState(false)
  const [plate, setPlate] = useState('')
  const [state, setState] = useState('CA')
  const [phone, setPhone] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  // Load user data from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('ticketpay_user')
    if (saved) {
      const data = JSON.parse(saved)
      setPlates(data.plates || [])
      setIsExistingUser(true)
      setPhone(data.phone || '')
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const plateClean = plate.trim().toUpperCase()
    const phoneClean = phone.replace(/\D/g, '')
    if (plateClean.length < 2 || plateClean.length > 8) {
      setError('License plate must be 2-8 characters')
      return
    }
    if (phoneClean.length !== 10) {
      setError('Please enter a valid 10-digit phone number')
      return
    }
    setIsLoading(true)
    setError('')
    try {
      // Simulate API call
      await new Promise(res => setTimeout(res, 800))
      const newPlate = {
        id: Date.now(),
        plate: plateClean,
        state,
        created: new Date().toISOString()
      }
      const updatedPlates = [...plates, newPlate]
      setPlates(updatedPlates)
      localStorage.setItem('ticketpay_user', JSON.stringify({
        phone: formatPhone(phone),
        plates: updatedPlates
      }))
      setPlate('')
      setState('CA')
      setShowAddForm(false)
      setIsExistingUser(true)
    } catch {
      setError('Connection error. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const removePlate = (id: string | number) => {
    const updatedPlates = plates.filter(p => p.id !== id)
    setPlates(updatedPlates)
    localStorage.setItem('ticketpay_user', JSON.stringify({
      phone: formatPhone(phone),
      plates: updatedPlates
    }))
  }

  // Dashboard for existing users
  if (isExistingUser && !showAddForm) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
        <div className="bg-white rounded-xl shadow p-8 w-full max-w-xl border border-gray-200">
          <h1 className="text-2xl font-bold mb-4">Welcome back!</h1>
          <DataFreshness lastImport={jurisdiction?.last_import} />
          <p className="mb-6 text-gray-600">Monitoring your vehicles for SFMTA parking tickets</p>
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-2">My Plates</h2>
            {plates.length > 0 ? (
              <ul className="space-y-2">
                {plates.map(p => (
                  <li key={p.id} className="flex items-center justify-between bg-gray-50 rounded p-3">
                    <span className="font-mono">{p.state} {p.plate}</span>
                    <button onClick={() => removePlate(p.id)} className="text-red-600 hover:underline text-sm">Remove</button>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-gray-500">No plates registered</div>
            )}
          </div>
          <button onClick={() => setShowAddForm(true)} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Add Plate</button>
          <a href="/app" className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
            Open app
          </a>
        </div>
      </div>
    )
  }

  // Onboarding/add form
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
      <div className="bg-white rounded-xl shadow p-8 w-full max-w-md border border-gray-200">
        <h1 className="text-2xl font-bold mb-4">Parking ticket alerts for San Francisco</h1>
        <p className="mb-6 text-gray-600">Get notified the moment SFMTA issues a ticket to your vehicle</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">License Plate</label>
            <div className="flex space-x-2">
              <input
                type="text"
                value={plate}
                onChange={e => setPlate(e.target.value.toUpperCase())}
                placeholder="ABC1234"
                maxLength={8}
                className="flex-1 px-3 py-2 border border-gray-300 rounded font-mono uppercase"
                required
              />
              <select
                value={state}
                onChange={e => setState(e.target.value)}
                className="px-2 py-2 border border-gray-300 rounded"
              >
                {US_STATES.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>
          {!isExistingUser && (
            <div>
              <label className="block text-sm font-medium mb-1">Mobile Number</label>
              <input
                type="tel"
                value={phone}
                onChange={e => setPhone(formatPhone(e.target.value))}
                placeholder="(415) 555-0123"
                className="w-full px-3 py-2 border border-gray-300 rounded"
                required
              />
              <p className="mt-1 text-xs text-gray-500">We'll text you when tickets are issued. Standard rates apply.</p>
            </div>
          )}
          {error && <div className="p-2 bg-red-100 text-red-700 rounded text-sm">{error}</div>}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {isLoading ? 'Adding...' : showAddForm ? 'Add Plate' : 'Start Monitoring'}
          </button>
        </form>
      </div>
    </div>
  )
}



