export function confirmSms(badge: string) {
  return `TicketPay: Reply YES to confirm alerts for ${badge} (SF tickets). Msg&data rates may apply. HELP for help, STOP to cancel.`
}
export function welcomeSms(badge: string) {
  return `TicketPay: Alerts active for ${badge}. We’ll notify if SFMTA posts a ticket and before late fees. Manage: https://ticketpay.us/manage`
}
export function citationSms(badge: string, amount: string, dueDate: string) {
  return `TicketPay: New SFMTA ticket for ${badge}. ${amount} due ${dueDate}. Pay at SFMTA: https://wmq.etimspayments.com/pbw/include/sanfrancisco/input.jsp`
}
export function plateBadge(state: string, plate: string) {
  return `${state.toUpperCase()} ${plate.replace(/\s|-/g,'').toUpperCase()}`
}
