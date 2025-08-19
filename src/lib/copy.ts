// src/lib/copy.ts
// ================================================================
// TicketPay — Central Copy Repository
// ================================================================
// Voice & Tone
// - Clear, human, professional. Short sentences.
// - Build trust without hype: privacy, security, control.
// - Emphasize the benefit: never miss a deadline.
// - Empathetic error copy. Offer a next step where possible.
// - Avoid teasing payments until it’s on the roadmap.
// ================================================================

export const Brand = {
  name: "TicketPay",
  city: "San Francisco",
  shortCity: "SF",
};

// ---------------- Homepage ----------------
export const HomeCopy = {
  heroTitle: "Never miss a ticket deadline.",
  heroSub: "Real‑time SF ticket alerts by text or email. Secure, automatic, no spam.",
  plateLabel: "Plate",
  platePlaceholder: "7ABC123",
  stateLabel: "State",
  statePlaceholder: "CA",
  ctaSearch: "Get ticket alerts",
  trustNote: "We only store your plate if you subscribe. Unsubscribe anytime.",
  faqTitle: "Questions",
  faq: [
    {
      q: "Where does the data come from?",
      a: "From official City of SF records. We query the same sources the city uses.",
    },
    {
      q: "How fast are alerts?",
      a: "As soon as a new citation appears in the city feed. Our target is under 5 minutes.",
    },
    {
      q: "Do you take payments?",
      a: "Not yet. We link you to the city’s secure payment page for now.",
    },
    {
      q: "How do you handle my data?",
      a: "We keep it minimal. Your plate is only saved if you subscribe, and you can unsubscribe anytime.",
    },
  ],
};

// ---------------- Results Page ----------------
export const ResultsCopy = {
  headingFound: (plate: string, state: string) => `Tickets for ${plate} (${state})`,
  headingNone: (plate: string, state: string) => `No open tickets for ${plate} (${state}).`,
  noneBody: "We’ll keep watch and notify you the moment a ticket appears.",
  subscribeLead: "Stay ahead of late fees — get instant text or email alerts.",
  channelLabel: "Alert by",
  channelEmail: "Email",
  channelSms: "Text",
  inputEmailPlaceholder: "name@email.com",
  inputPhonePlaceholder: "415‑555‑0137",
  subscribeCta: "Set up alerts",
  subscribeTrust: "Only alerts for this plate. Unsubscribe anytime.",
  toastSubscribed: (plate: string, state: string) => `You’re set — we’ll alert you about new tickets for ${plate} (${state}).`,
  toastDuplicate: "Already subscribed for this destination.",
  toastError: "Something went wrong. Try again in a minute.",
  payCta: "Pay on SF site",
  summaryBar: (count: number, total: string) => `${count} open ${count === 1 ? "ticket" : "tickets"} · Total due ${total}`,
  ticketLabels: {
    citation: "Ticket #",
    amount: "Amount",
    status: "Status",
    issued: "Issued",
    violation: "Violation",
    location: "Location",
    due: "Due",
  },
};

// ---------------- Confirmation & Share ----------------
export const ConfirmCopy = {
  title: "You’re all set!",
  subtitle: "We’ll send alerts until this ticket is resolved.",
  addAnother: "Track another plate",
  share: "Help a friend avoid late fees — Share TicketPay.",
  previewTitle: "Preview a reminder",
  previewHelp: "See what a reminder looks like before one arrives.",
  sendTest: "Send test alert",
  testSent: "Test alert sent. Check your inbox or phone.",
};

// ---------------- Unsubscribe ----------------
export const UnsubscribeCopy = {
  title: "Alerts stopped.",
  body: (plate?: string, state?: string) =>
    plate && state
      ? `You won’t receive more updates for ${plate} (${state}). You can resubscribe anytime.`
      : "You won’t receive more updates to this destination.",
  backToSearch: "Back to search",
  manageOther: "Manage other plates",
};

// ---------------- Errors & Validation ----------------
export const ErrorsCopy = {
  generic: "Something went wrong on our end. Please try again.",
  network: "Can’t reach the city right now. Try again in a moment.",
  validationPlate: "Plates must be letters and numbers only.",
  validationState: "Enter a valid 2–3 letter state code (e.g., CA).",
  rateLimit: "Too many requests. Please wait a minute and try again.",
};

// ---------------- Footer ----------------
export const FooterCopy = {
  powered: "TicketPay — Trusted ticket alerts.",
  privacy: "Privacy",
  terms: "Terms",
  accessibility: "Accessibility",
};

// ---------------- Example Alert (Preview + onboarding) ----------------
export const ExampleAlertCopy = {
  cardTitle: "Example alert",
  sms: (plate: string, state: string) =>
    `TicketPay: New ticket for ${plate} (${state}): $65 · No Parking · Mission & 16th. Pay: link.example. Reply STOP to unsubscribe.`,
  emailSubject: (plate: string, state: string) => `TicketPay alerts active for ${plate} (${state}).`,
  emailBody: (plate: string, state: string) =>
    `You’ll get an update the moment a new ticket is posted. Unsubscribe anytime with one click.`,
};

// ---------------- Policies (short, friendly headers) ----------------
export const PoliciesCopy = {
  privacyTitle: "Privacy Policy",
  privacyBody: [
    "We value your trust.",
    "We collect your plate only when you subscribe to alerts.",
    "We do not sell your data.",
    "You can unsubscribe at any time via the link in each message.",
    "We use trusted providers (e.g., email/SMS) to deliver alerts.",
  ],
  termsTitle: "Terms of Service",
  termsBody: [
    "Simple and transparent.",
    "TicketPay links to official city payment sites and does not process payments.",
    "Data availability depends on city systems. We cannot guarantee uptime.",
    "Use at your own discretion; always confirm details on the official city site.",
  ],
  accessibilityTitle: "Accessibility",
  accessibilityBody: [
    "We aim to meet WCAG 2.1 AA.",
    "If you find an issue, please contact support@ticketpay.us.com.",
  ],
};
