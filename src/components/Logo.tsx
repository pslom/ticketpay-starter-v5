import { Shield } from 'lucide-react'

export default function Logo() {
  return (
    <div className="select-none inline-flex items-center gap-2.5" aria-label="TicketPay">
      <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center shadow-md">
        <Shield className="w-5 h-5 text-white" aria-hidden="true" />
      </div>
      <span className="font-bold text-xl text-gray-900">TicketPay</span>
    </div>
  )
}
