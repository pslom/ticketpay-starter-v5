export const Brand = {
  name: "TicketPay",
  city: "San Francisco",
  shortCity: "SF",
};

export const HomeCopy = {
  heroTitle: "Never miss a ticket deadline.",
  heroSub: "Instant SF ticket alerts by text or email.",
  benefits: ["Avoid late fees", "Alerts only when it matters"],
  plateLabel: "Plate",
  platePlaceholder: "7ABC123",
  stateLabel: "State",
  ctaSearch: "Get ticket alerts",
  microLock: "Unsubscribe anytime.",
  powered: "Powered by City of SF Data",
};

export const ResultsCopy = {
  title: "Check your plate & get alerts",
  lead: (plate: string, state: string) =>
    `Results for ${plate} (${state}). If a new ticket posts in San Francisco, we’ll notify you instantly.`,
  subscribeLead: "Choose where to get alerts.",
  channelEmail: "Email",
  channelSms: "SMS",
  inputEmailPlaceholder: "you@example.com",
  inputPhonePlaceholder: "(415) 555-0123",
  ctaSubscribe: "Subscribe",
  trust:
  "By subscribing, you agree to receive alerts for this plate. Message & data rates may apply. Reply STOP to cancel, HELP for help. See our Consent policy.",
  trustConsentLinkLabel: "Consent policy",
  toastSubscribed: (p: string, s: string) =>
    `You're set. We’ll alert you about new tickets for ${p} (${s}).`,
  toastDuplicate: "You’re already subscribed for this destination.",
  toastError: "Something went wrong. Try again in a minute.",
};

export const ConfirmCopy = {
  title: "You’re set.",
  subtitle: "We’ll send alerts as soon as a new ticket is posted.",
  previewTitle: "Preview a reminder",
  previewHelp: "Send yourself a sample alert so you know what to expect.",
  sendTest: "Send test alert",
  testSent: "Test alert sent. Check your inbox/phone.",
  addAnother: "Add another plate",
  share: "Share TicketPay",
};

export const ManageCopy = {
  title: "Manage alerts",
  subtitle: "View or remove your active reminders.",
  modeContact: "By contact",
  modePlate: "By plate/state",
  channelEmail: "Email",
  channelSms: "SMS",
  inputContactPlaceholder: "you@example.com or (415) 555-0123",
  inputPlatePlaceholder: "7ABC123",
  stateLabel: "State",
  ctaFind: "Find",
  refresh: "Refresh",
  noneTitle: "No active alerts yet.",
  noneBody: "Set one up to get notified instantly.",
  listTitle: "Your subscriptions",
};

export const ConsentCopy = {
  title: "SMS/Text Alert Consent",
  bullets: [
    "Message frequency: immediate alerts when a new ticket posts.",
    "Message and data rates may apply.",
    "Text STOP to cancel. Text HELP for help.",
    "Your information is private and will not be sold or shared.",
    "Support: support@ticketpay.us.com.",
  ],
  footer:
    "Consent is not a condition of purchase. TicketPay is a notification-only public utility and does not accept payments.",
  proofLinkLabel: "Proof of consent",
};

export const UnsubscribeCopy = {
  title: "You’re unsubscribed.",
  body: (plate?: string, state?: string) =>
    plate && state
      ? `We’ll stop sending alerts for ${plate} (${state}).`
      : "We’ll stop sending alerts to this destination.",
  backToSearch: "Back to search",
};

export const ErrorsCopy = {
  generic: "Something went wrong. Try again or come back later.",
  network: "Can’t reach the city right now. Try again in a moment.",
  validationPlate: "Plate should be letters and numbers only.",
  validationState: "Use a 2–3 letter state code (e.g., CA).",
  rateLimit: "Too many requests. Please try again in a minute.",
};

export const FooterCopy = {
  powered: "Powered by TicketPay",
  privacy: "Privacy",
  terms: "Terms",
  accessibility: "Accessibility",
};

export const ExampleAlertCopy = {
  cardTitle: "Example alert",
  sms: (plate: string, state: string) =>
    `TicketPay: New ticket for ${plate} (${state}): $65 · No Parking 7–9a at Mission & 16th. Pay: example.link. Reply STOP to unsubscribe.`,
  emailSubject: (plate: string, state: string) =>
    `TicketPay: you’re set for alerts on ${plate} (${state})`,
  emailBody: (plate: string, state: string) =>
    `You’ll get an email whenever a new ticket is posted for ${plate} (${state}). You can unsubscribe at any time.`,
};
