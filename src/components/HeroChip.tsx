import { MapPin } from 'lucide-react'

export default function HeroChip({ className = '' }: { className?: string }) {
  return (
    <div
      className={
        'inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm ' +
        'border-emerald-200 bg-emerald-50 text-emerald-800 ' + className
      }
    >
      <MapPin className="h-4 w-4" aria-hidden="true" />
      <span>SF Bay Area • Deadline protection</span>
    </div>
  )
}
