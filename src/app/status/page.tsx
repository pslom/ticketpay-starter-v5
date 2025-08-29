function formatPT(d: Date) {
  try { return new Intl.DateTimeFormat('en-US', { timeZone: 'America/Los_Angeles', dateStyle: 'long', timeStyle: 'short' }).format(d) } catch { return d.toString() }
}

export default function StatusPage() {
  const lastUpdated = new Date() // TODO: replace with real timestamp

  return (
    <div className="px-4 py-10 bg-glow-right">
      <div className="mx-auto max-w-3xl rounded-3xl bg-white p-8 shadow-2xl border border-gray-100">
        <h1 className="text-3xl font-extrabold">System status</h1>
        <p className="mt-2 text-gray-600">We check SF citation data daily.</p>

        <dl className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="rounded-xl border border-gray-200 p-4">
            <dt className="text-sm text-gray-500">Data source</dt>
            <dd className="mt-1 font-medium text-gray-900">SFMTA via DataSF</dd>
          </div>
          <div className="rounded-xl border border-gray-200 p-4">
            <dt className="text-sm text-gray-500">Last update seen</dt>
            <dd className="mt-1 font-medium text-gray-900">{formatPT(lastUpdated)} PT</dd>
          </div>
        </dl>

        <p className="mt-6 text-sm text-gray-600">
          We alert you when a ticket appears (usually within 24 hours of publication), then 5-day and 48-hour reminders.
        </p>
      </div>
    </div>
  )
}
