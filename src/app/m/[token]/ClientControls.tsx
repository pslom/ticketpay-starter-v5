'use client'

import { useState } from 'react'

export default function ClientControls({
  token,
  initialActive,
}: { token: string; initialActive: boolean }) {
  const [active, setActive] = useState(initialActive)
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  async function toggle() {
    if (busy) return
    setBusy(true)
    setMessage(null)
    try {
      const res = await fetch('/api/subscription', {
        method: 'PATCH',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ token, active: !active }),
      })
      if (!res.ok) throw new Error('failed')
      setActive(!active)
      setMessage(!active ? 'Alert resumed.' : 'Alert paused.')
    } catch {
      setMessage('Something went wrong. Try again.')
    } finally {
      setBusy(false)
    }
  }

  async function unsubscribe() {
    if (busy) return
    setBusy(true)
    setMessage(null)
    try {
      const res = await fetch('/api/subscription', {
        method: 'DELETE',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ token }),
      })
      if (!res.ok) throw new Error('failed')
      setMessage('You have unsubscribed from this alert.')
    } catch {
      setMessage('Something went wrong. Try again.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
      <button onClick={toggle} disabled={busy} className="btn-secondary">
        {active ? 'Pause' : 'Resume'}
      </button>
      <button onClick={unsubscribe} disabled={busy} className="rounded-xl px-5 py-3 bg-red-600 text-white hover:bg-red-700">
        Unsubscribe
      </button>
      {message ? <p className="mt-2 text-sm text-gray-600">{message}</p> : null}
    </div>
  )
}
