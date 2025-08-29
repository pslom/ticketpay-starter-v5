'use client'
export default function Banner({ children, tone='amber' }:{ children:React.ReactNode; tone?:'amber'|'red'|'emerald' }) {
  const map:any = {
    amber: 'border-amber-200 from-amber-50 to-orange-50',
    red: 'border-red-200 from-red-50 to-rose-50',
    emerald: 'border-emerald-200 from-emerald-50 to-teal-50',
  }
  return (
    <div className={`rounded-xl border bg-gradient-to-br ${map[tone]} p-4`}>
      <div className="text-sm text-neutral-800">{children}</div>
    </div>
  );
}
