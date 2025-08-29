export function timeAgo(iso?: string | null) {
  if (!iso) return 'Never checked'
  const ms = Date.now() - new Date(iso).getTime()
  const s = Math.max(1, Math.floor(ms/1000))
  if (s < 60) return `${s}s ago`
  const m = Math.floor(s/60)
  if (m < 60) return `${m}m ago`
  const h = Math.floor(m/60)
  if (h < 24) return `${h}h ago`
  const d = Math.floor(h/24)
  return `${d}d ago`
}
