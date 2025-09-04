'use client'
import { useMemo, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { PAY_AT_SFMTA_URL } from '@/lib/externals'
import { ChannelGroup } from '@/components/ChannelChips';
import { timeAgo } from '@/lib/time'

type Row = {
  id: string
  plate: string
  state: string
  channel: 'sms'|'email'
  contact: string
  verified: boolean | null
  paused_at: string | null
  last_checked_at: string | null
  created_at: string
}

export default function ManageTable({ rows }: { rows: Row[] }) {
  const r = useRouter()
  const [q, setQ] = useState('')
  const [busyId, setBusyId] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const filtered = useMemo(() => {
    const k = q.trim().toLowerCase()
    if (!k) return rows
    return rows.filter(x =>
      x.plate.toLowerCase().includes(k) ||
      x.state.toLowerCase().includes(k) ||
      x.contact.toLowerCase().includes(k)
    )
  }, [rows, q])

  async function act(id: string, op: 'pause'|'resume'|'delete') {
    setBusyId(id)
    try {
      if (op === 'delete') {
        await fetch(`/api/subscriptions/${id}`, { method: 'DELETE' })
      } else {
        await fetch(`/api/subscriptions/${id}`, {
          method: 'PATCH',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ op })
        })
      }
    } finally {
      startTransition(() => r.refresh())
      setBusyId(null)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <input
          className="input px-3 w-full md:w-80"
          placeholder="Search plates or contacts…"
          value={q}
          onChange={(e)=>setQ(e.target.value)}
        />
      </div>

      {filtered.map((row) => {
        const paused = !!row.paused_at
        return (
          <div key={row.id} className="card p-4 flex items-center justify-between gap-4 hover:ring-2 hover:ring-emerald-200/70 transition">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center justify-center h-7 px-2 rounded-full border border-neutral-200 text-xs">{row.state}</span>
                <span className="font-medium">{row.plate}</span>
                <ChannelGroup channel={row.channel as any} paused={paused} />
                {!row.verified && <span className="text-xs text-amber-700">unverified</span>}
              </div>
              <div className="text-sm text-neutral-600 truncate">
                {row.channel === "email" && <>EMAIL · {row.contact}</>}
                {row.channel === "sms" && <>SMS · {row.contact}</>}
                {row.channel === "both" && <>SMS+EMAIL · {row.contact}</>}
                {row.last_checked_at && <span className="text-neutral-500"> · {timeAgo(row.last_checked_at)}</span>}
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <a href={PAY_AT_SFMTA_URL} target="_blank" rel="noreferrer" className="btn-secondary">Pay at SFMTA</a>
              {paused ? (
                <button className="btn-primary" disabled={busyId===row.id||isPending} onClick={()=>act(row.id,'resume')}>Resume</button>
              ) : (
                <button className="btn-secondary" disabled={busyId===row.id||isPending} onClick={()=>act(row.id,'pause')}>Pause</button>
              )}
              <button className="btn-danger" disabled={busyId===row.id||isPending} onClick={()=>act(row.id,'delete')}>Delete</button>
            </div>
          </div>
        )
      })}

      {filtered.length === 0 ? (
        <div className="text-center text-neutral-600 py-10">No matches.</div>
      ) : null}
    </div>
  )
}
