export default function NextSteps() {
  return (
    <section className="mx-auto max-w-3xl">
      <div className="rounded-2xl border border-emerald-100 bg-emerald-50/50 p-4 sm:p-6">
        <h2 className="text-base sm:text-lg font-semibold text-emerald-900">What happens next</h2>
        <ul className="mt-2 grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3 text-sm text-gray-700">
          <li className="rounded-xl bg-white p-3 border border-emerald-100">We’ll alert you as soon as a ticket posts.</li>
          <li className="rounded-xl bg-white p-3 border border-emerald-100">We’ll remind you 5 days before the due date.</li>
          <li className="rounded-xl bg-white p-3 border border-emerald-100">We’ll send a final 48-hour reminder to avoid fees.</li>
        </ul>
      </div>
    </section>
  )
}
