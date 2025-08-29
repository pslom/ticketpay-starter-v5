#!/bin/bash

echo "📄 Updating all pages..."

# Update main landing page
cat > src/app/page.tsx << 'EOF'
'use client'
import { useState, useEffect, useRef } from 'react'
import { ArrowRight, Check, Shield, Clock, MapPin, Bell } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function HomePage() {
  const [plate, setPlate] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showTimeline, setShowTimeline] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  useEffect(() => {
    if (window.innerWidth > 768) {
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [])

  const handlePlateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '')
    if (value.length > 3 && value.length <= 7) {
      value = value.slice(0, 3) + ' ' + value.slice(3)
    }
    setPlate(value)
  }

  const checkPlate = async () => {
    if (!plate.replace(/\s/g, '')) return
    setIsLoading(true)
    await new Promise(r => setTimeout(r, 1500))
    router.push(`/results?plate=${plate.replace(/\s/g, '')}`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-emerald-50/10 to-white">
      <header className="absolute top-0 left-0 right-0 z-10 p-6 sm:p-8">
        <nav className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 sm:w-10 sm:h-10 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-md">
              <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <span className="font-bold text-xl sm:text-2xl text-neutral-900">TicketPay</span>
          </div>
          <a href="/manage" className="text-sm text-neutral-600 hover:text-neutral-900 font-medium transition-colors">
            Manage alerts
          </a>
        </nav>
      </header>
      
      <main className="relative flex min-h-screen items-center justify-center px-4 sm:px-6 py-24 sm:py-32">
        <div className="w-full max-w-lg">
          <div className="flex justify-center mb-6 sm:mb-10">
            <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-medium px-4 py-2 rounded-full">
              <MapPin className="w-4 h-4" />
              <span>SF Bay Area • Deadline protection</span>
            </div>
          </div>

          <h1 className="text-center text-4xl sm:text-5xl lg:text-6xl font-bold text-neutral-900 mb-4 sm:mb-6 leading-[1.1]">
            Never pay a late fee
            <span className="block text-emerald-600 mt-1">ever again</span>
          </h1>
          
          <p className="text-center text-lg sm:text-xl text-neutral-600 mb-8 sm:mb-12 max-w-md mx-auto leading-relaxed">
            We track your tickets and remind you before fees increase. Beat every deadline.
          </p>

          <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl shadow-emerald-900/5 border border-neutral-100 p-6 sm:p-10">
            <div className="space-y-6">
              <div className="relative">
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  License plate
                </label>
                <input
                  ref={inputRef}
                  type="text"
                  value={plate}
                  onChange={handlePlateChange}
                  onKeyDown={(e) => e.key === 'Enter' && checkPlate()}
                  placeholder="ABC 1234"
                  maxLength={8}
                  className="w-full px-5 py-4 text-xl sm:text-2xl font-mono uppercase bg-neutral-50 border-2 border-neutral-200 rounded-xl sm:rounded-2xl outline-none transition-all focus:border-emerald-500 focus:bg-white"
                />
                {plate && (
                  <Check className="absolute right-5 bottom-4 w-6 h-6 text-emerald-500" />
                )}
              </div>

              <button
                onClick={checkPlate}
                disabled={!plate || isLoading}
                className={`relative w-full py-4 sm:py-5 px-6 rounded-xl sm:rounded-2xl font-semibold text-base sm:text-lg text-white transition-all duration-300 transform ${!plate || isLoading ? 'bg-neutral-300 cursor-not-allowed' : 'bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-emerald-600 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0'}`}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-3">
                    <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    <span>Checking SF database...</span>
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <span>Check for tickets</span>
                    <ArrowRight className="w-5 h-5" />
                  </span>
                )}
              </button>

              <div className="flex items-center justify-center gap-4 sm:gap-8 text-xs sm:text-sm text-neutral-500 pt-2">
                <span className="flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5" />
                  <span>Secure</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <Bell className="w-3.5 h-3.5" />
                  <span>Smart reminders</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Cancel anytime</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
EOF

echo "✅ Pages updated successfully!"
echo "🎉 Your TicketPay app is now fully themed!"
echo ""
echo "Run: npm run dev"
echo "Visit: http://localhost:3000"
