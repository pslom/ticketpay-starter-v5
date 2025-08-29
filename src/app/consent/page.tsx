export const metadata = { title: 'Consent — TicketPay' }

export default function ConsentPage() {
	return (
		<main className="min-h-[60vh] px-4 py-12">
			<div className="mx-auto max-w-3xl rounded-3xl bg-white p-8 shadow-2xl border border-gray-100">
				<h1 className="text-3xl font-extrabold text-gray-900">SMS Consent & Privacy</h1>

				<p className="mt-4 text-gray-700">
					We don’t pay tickets or collect payment info — we notify you so you can pay on time.
				</p>

				<section className="mt-6">
					<h2 className="text-lg font-semibold text-gray-900">SMS alerts</h2>
					<ul className="mt-3 space-y-2 text-gray-700">
						<li>• Message frequency: new-ticket alerts and deadline reminders only.</li>
						<li>• Message &amp; data rates may apply.</li>
						<li>• Reply <strong>STOP</strong> to cancel, <strong>HELP</strong> for help.</li>
					</ul>
				</section>

				<section className="mt-6">
					<h2 className="text-lg font-semibold text-gray-900">Privacy</h2>
					<ul className="mt-3 space-y-2 text-gray-700">
						<li>• We only use your contact for alerts you requested.</li>
						<li>• Data is encrypted in transit and can be deleted on request.</li>
					</ul>
				</section>

				<p className="mt-8 text-sm text-gray-500">
					Questions? Email <a href="mailto:support@ticketpay.us" className="text-emerald-700 font-medium">support@ticketpay.us</a>.
				</p>
			</div>
		</main>
	)
}
