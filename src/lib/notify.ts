// Deprecated: use '@/lib/notifier'.
// Temporary shim to keep older imports working during migration.
import { createNotifier } from "./notifier";

export async function sendEmailPreview(to: string) {
	const notifier = createNotifier();
	const text = "TicketPay: New ticket — $65 · No Parking · Mission & 16th. Pay: https://example.invalid";
	return notifier.notify({ channel: "email", to, subject: "TicketPay — example alert", text, html: `<p>${text}</p>` });
}

export async function sendSmsPreview(to: string) {
	const notifier = createNotifier();
	const text = "TicketPay: New ticket — $65 · No Parking · Mission & 16th. Pay: https://example.invalid";
	return notifier.notify({ channel: "sms", to, text });
}

export function createNotifierShim() {
	return createNotifier();
}

