'use client'
import { useState, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Check, Sparkles } from 'lucide-react'
import Spinner from '@/components/Spinner'

function SuccessContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const plate = searchParams.get('plate') || 'ABC123'
  const channel = searchParams.get('channel') || 'email'
  const contact = searchParams.get('contact') || ''
  
  const [showConfetti, setShowConfetti] = useState(true)
  
  useEffect(() => {
    setTimeout(() => setShowConfetti(false), 3000)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-emerald-50/10 to-white flex items-center justify-center px-4 sm:px-6">
      <div className="text-center max-w-md w-full">
        <div className="relative inline-block mb-6 sm:mb-8">
          <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-2xl sm:rounded-3xl flex items-center justify-center shadow-xl">
            <Check className="w-10 h-10 sm:w-12 sm:h-12 text-white animate-scale-in" />
          </div>
          {showConfetti && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <Sparkles className="w-32 h-32 sm:w-40 sm:h-40 text-emerald-400 animate-ping" />
            </div>
          )}
        </div>

        <h1 className="text-3xl sm:text-4xl font-bold text-neutral-900 mb-3">
          Protection activated!
        </h1>
        
        <p className="text-base sm:text-lg text-neutral-600 mb-8 sm:mb-10 leading-relaxed">
          We'll {channel === 'email' ? 'email' : 'text'} <span className="font-semibold text-neutral-900">{decodeURIComponent(contact)}</span> to keep <span className="font-mono">{plate}</span> deadline-free
        </p>

        <div className="bg-emerald-50 rounded-2xl p-6 sm:p-8 mb-8 sm:mb-10 border border-emerald-200 text-left">
          <p className="text-sm font-semibold text-emerald-900 mb-3">
            Your protection timeline:
          </p>
          <ul className="text-sm text-emerald-800 space-y-3">
            <li className="flex items-start gap-2">
              <span className="text-xs mt-0.5">📋</span>
              <span>Instant alert when any ticket posts</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-xs mt-0.5">⏰</span>
              <span>Friendly reminder 5 days before due</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-xs mt-0.5">🚨</span>
              <span>Final reminder 48 hours before late fee</span>
            </li>
          </ul>
        </div>

        <div className="space-y-3">
          <button
            onClick={() => router.push('/')}
            className="w-full py-3 sm:py-4 px-6 bg-white border-2 border-neutral-200 rounded-xl sm:rounded-2xl font-semibold text-neutral-700 hover:bg-neutral-50 transition-colors"
          >
            Add another plate
          </button>
          
          <a href="/manage" className="inline-block text-sm text-neutral-500 hover:text-neutral-700 transition-colors">
            Manage your alerts →
          </a>
        </div>
      </div>
    </div>
  )
}

export default function SuccessPage() {
 return (
   <Suspense fallback={
     <div className="min-h-screen flex items-center justify-center">
       <Spinner className="w-8 h-8" />
     </div>
   }>
     <SuccessContent />
   </Suspense>
 )
}
