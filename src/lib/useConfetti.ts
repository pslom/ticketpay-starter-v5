'use client'
import { useEffect } from 'react'
import confetti from 'canvas-confetti'
export function useConfettiOnce(enabled = true) {
  useEffect(() => {
    if (!enabled) return
    if (typeof window === 'undefined') return
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return
    const end = Date.now() + 600
    const frame = () => {
      confetti({
        particleCount: 32,
        startVelocity: 28,
        spread: 70,
        ticks: 120,
        scalar: 0.9,
        origin: { x: Math.random() * 0.3 + 0.35, y: 0.1 }
      })
      if (Date.now() < end) requestAnimationFrame(frame)
    }
    const t = setTimeout(frame, 200)
    return () => clearTimeout(t)
  }, [enabled])
}
