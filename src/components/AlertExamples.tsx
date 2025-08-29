import { AlertCircle, Clock } from 'lucide-react'

export function TicketAlert() {
  return (
    <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-amber-200">
      <div className="flex items-start gap-3 sm:gap-4">
        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center flex-shrink-0">
          <AlertCircle className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
        </div>
        <div className="flex-1">
          <p className="font-semibold text-neutral-900 text-sm sm:text-base">
            SF Parking Ticket Alert
          </p>
          <p className="text-sm sm:text-base text-neutral-700 mt-1">
            Street cleaning violation • Mission District
          </p>
          <p className="text-sm sm:text-base text-neutral-700">
            Amount: $82 • Due: May 15 (21 days)
          </p>
          <a href="#" className="inline-flex items-center gap-1 mt-3 text-xs sm:text-sm font-medium text-blue-600 hover:text-blue-700">
            Pay at SFMTA.com →
          </a>
        </div>
      </div>
    </div>
  )
}

export function ReminderAlert() {
  return (
    <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-amber-200">
      <div className="flex items-start gap-3 sm:gap-4">
        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-amber-400 to-amber-500 rounded-xl flex items-center justify-center flex-shrink-0">
          <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
        </div>
        <div className="flex-1">
          <p className="font-semibold text-neutral-900 text-sm sm:text-base">
            Quick heads up - ticket due soon
          </p>
          <p className="text-sm sm:text-base text-neutral-700 mt-1">
            Your parking ticket is due in 5 days
          </p>
          <p className="text-sm sm:text-base text-neutral-700">
            Amount: $82 • Pay by May 15 to avoid late fee
          </p>
          <a href="#" className="inline-flex items-center gap-1 mt-3 text-xs sm:text-sm font-medium text-blue-600 hover:text-blue-700">
            Pay now at SFMTA.com →
          </a>
        </div>
      </div>
    </div>
  )
}
