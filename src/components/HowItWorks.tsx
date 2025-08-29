import { BellRing, Timer, ShieldCheck } from 'lucide-react'

export default function HowItWorks() {
  const items = [
    { icon: <BellRing className="w-5 h-5" />, title: 'Instant alerts', desc: 'We watch SF data and notify you when a ticket posts.' },
    { icon: <Timer className="w-5 h-5" />, title: 'Deadline reminders', desc: 'We nudge you 5 days and 48 hours before late fees.' },
    { icon: <ShieldCheck className="w-5 h-5" />, title: 'You’re in control', desc: 'Pause or unsubscribe anytime. Your data stays private.' },
  ]
  return (
    <section className="mt-8 sm:mt-10">
      <div className="rounded-2xl border border-emerald-100 bg-emerald-50/50 p-4 sm:p-6">
        <h2 className="text-base sm:text-lg font-semibold text-emerald-900">What you’ll get</h2>
        <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
          {items.map((it, i) => (
            <div key={i} className="flex items-start gap-3 rounded-xl bg-white p-3 sm:p-4 border border-emerald-100">
              <div className="text-emerald-600">{it.icon}</div>
              <div>
                <p className="font-medium text-gray-900">{it.title}</p>
                <p className="text-sm text-gray-600">{it.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
