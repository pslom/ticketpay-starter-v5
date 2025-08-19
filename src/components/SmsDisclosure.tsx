// src/components/SmsDisclosure.tsx
import Link from "next/link";

export default function SmsDisclosure() {
  return (
    <p className="text-xs text-neutral-600">
      By subscribing, you agree to receive reminders by SMS and/or email. Message &amp; data rates may apply. Frequency varies. Reply STOP to cancel, HELP for help. See{" "}
      <Link href="/terms" className="underline">Terms</Link> and{" "}
      <Link href="/privacy" className="underline">Privacy</Link>.
    </p>
  );
}
