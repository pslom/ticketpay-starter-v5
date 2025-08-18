export const Brand = {
  name: "TicketPay",
  city: "San Francisco",
  shortCity: "SF",
};

export const HomeCopy = {
  heroTitle: "Stay ahead of every ticket deadline.",
  heroSub: "Get official SF ticket alerts by text or email — fast, secure, no spam.",
  plateLabel: "License plate",
  platePlaceholder: "7ABC123",
  stateLabel: "State",
  statePlaceholder: "CA",
  ctaSearch: "Check tickets",
  trustNote: "We only store your plate if you subscribe to alerts. Unsubscribe anytime.",
  faqTitle: "Questions",
  faq: [
    {
      q: "Where does the data come from?",
      a: "Direct from official City of SF records — the same source the city uses."
    },
    {
      q: "How fast are alerts?",
      a: "Typically within minutes of a new citation posting."
    },
    {
      q: "Do you take payments?",
      a: "Not today. We link you to the city’s secure payment site."
    },
    {
      q: "How do you handle my data?",
      a: "We keep it minimal. Your plate is only saved if you subscribe, and you can unsubscribe anytime."
    }
  ]
};

export const ResultsCopy = {
  headingFound: (plate: string, state: string) =>
    `Tickets for ${plate} (${state})`,
  headingNone: (plate: string, state: string) =>
    `No open tickets for ${plate} (${state}).`,
  noneBody: "We’ll keep an eye on it so you don’t have to.",
  subscribeLead: "Get a text or email the moment a new ticket posts.",
  channelLabel: "Alert by",
  channelEmail: "Email",
  channelSms: "Text",
  inputEmailPlaceholder: "name@email.com",
  inputPhonePlaceholder: "415-555-0137",
  subscribeCta: "Subscribe to alerts",
  subscribeTrust: "Only alerts for this plate. Unsubscribe anytime.",
  toastSubscribed: (plate: string, state: string) =>
    `You’re set — we’ll alert you about new tickets for ${plate} (${state}).`,
  toastDuplicate: "You’re already subscribed for this destination.",
  toastError: "Something went wrong. Try again in a minute.",
  payCta: "Pay on SF site",
  summaryBar: (count: number, total: string) =>
    `${count} open ${count === 1 ? "ticket" : "tickets"} · Total due ${total}`,
  ticketLabels: {
    citation: "Ticket #",
    amount: "Amount",
    status: "Status",
    issued: "Issued",
    violation: "Violation",
    location: "Location",
    due: "Due"
  }
};

export const UnsubscribeCopy = {
  title: "You’re unsubscribed.",
  body: (plate?: string, state?: string) =>
    plate && state
      ? `We’ll stop sending alerts for ${plate} (${state}).`
      : "We’ll stop sending alerts to this destination.",
  backToSearch: "Back to search",
  manageOther: "Manage other plates"
};

export const ErrorsCopy = {
  generic: "Something went wrong. Try again or come back later.",
  network: "Can’t reach the city right now. Try again in a moment.",
  validationPlate: "Use letters and numbers only.",
  validationState: "Use a 2–3 letter state code (e.g., CA).",
  rateLimit: "You’ve hit the limit. Please wait a bit and try again."
};

export const FooterCopy = {
  powered: "Powered by TicketPay",
  privacy: "Privacy",
  terms: "Terms",
  accessibility: "Accessibility"
};

export const ExampleAlertCopy = {
  cardTitle: "Example alert",
  sms: (plate: string, state: string) =>
    `TicketPay: New ticket for ${plate} (${state}) — $65 · No Parking · Mission & 16th. Pay: link.example. Reply STOP to unsubscribe.`,
  emailSubject: (plate: string, state: string) =>
    `TicketPay: you’re set for alerts on ${plate} (${state})`,
  emailBody: (plate: string, state: string) =>
    `You’ll get an email whenever a new ticket is posted for ${plate} (${state}). You can unsubscribe anytime.`
};

export const PoliciesCopy = {
  privacyTitle: "Privacy Policy",
  privacyBody: [
    "We collect your plate only when you subscribe to alerts.",
    "We do not sell your data.",
    "You can unsubscribe at any time via the link in each message.",
    "We use trusted providers (e.g., email/SMS) to deliver alerts."
  ],
  termsTitle: "Terms of Service",
  termsBody: [
    "TicketPay links to official city payment sites and does not process payments.",
    "Data availability depends on city systems. We cannot guarantee uptime.",
    "Use at your own discretion; always confirm details on the official city site."
  ],
  accessibilityTitle: "Accessibility",
  accessibilityBody: [
    "We aim to meet WCAG 2.1 AA. If you find an issue, please contact support@ticketpay.us.com."
  ]
};
export const ConfirmCopy = {
  title: "All set!",
  subtitle: "We’ll send updates until this ticket’s handled.",
  addAnother: "Add another ticket",
  share: "Share TicketPay",
  previewTitle: "See how reminders look",
  previewHelp: "We’ll send a sample so you know exactly what to expect.",
  sendTest: "Send me a test",
  testSent: "Test sent! Check your inbox or phone."
};

// Minimal keys referenced by onboarding components
export const COPY = {
  selectChannel: "How should we alert you?",
  whereSend: "Where should we send alerts?",
  setReminders: "Set reminders",
};
