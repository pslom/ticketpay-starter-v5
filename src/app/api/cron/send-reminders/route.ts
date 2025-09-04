import { NextResponse } from "next/server";
// import { getActiveTicketsWithUsers, sendSMS, logNotification, isQuietHour } from "@/lib/your-adapter";
// import { daysUntil } from "@/lib/time";

export async function GET() {
  // 1. Select active tickets joined with users (stub)
  const tickets = [
    {
      id: "ticket-1",
      plate: "ABC123",
      late_fee_date: "2025-09-09T06:00:00Z",
      due_date: "2025-09-09T06:00:00Z",
      created_at: "2025-09-04T06:00:00Z",
      user: { id: "user-1", sms_opt_out: false, phone: "+14155550123" },
    },
  ];

  // 2. For each ticket, determine target date
  const now = new Date();
  for (const ticket of tickets) {
    const target = ticket.late_fee_date || ticket.due_date;
    const created = new Date(ticket.created_at);
    const targetDate = new Date(target);
    const daysToTarget = Math.floor((targetDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    const hoursToTarget = Math.floor((targetDate.getTime() - now.getTime()) / (1000 * 60 * 60));

    // Skip opt-out users
    if (ticket.user.sms_opt_out) continue;
    // Skip quiet hours (stub)
    // if (isQuietHour(now)) continue;

    // 3. Send and log notifications
    // New
    if (created.toDateString() === now.toDateString()) {
      // if (!logNotification.exists(ticket.id, 'new')) {
      //   await sendSMS(ticket.user.phone, `New SF ticket for plate ${ticket.plate}. We’ll include it in your daily summary. Reply STOP to opt out.`);
      //   await logNotification.insert(ticket.id, ticket.user.id, 'new');
      // }
    }
    // Minus5
    if (daysToTarget === 5) {
      // if (!logNotification.exists(ticket.id, 'minus5')) {
      //   await sendSMS(ticket.user.phone, `Heads up: late fee in 5 days for ${ticket.plate}. Check the city site for details. Reply STOP to opt out.`);
      //   await logNotification.insert(ticket.id, ticket.user.id, 'minus5');
      // }
    }
    // Minus48
    if (hoursToTarget <= 48 && hoursToTarget > 47) {
      // if (!logNotification.exists(ticket.id, 'minus48')) {
      //   await sendSMS(ticket.user.phone, `Reminder: late fee in 48 hours for ${ticket.plate}. Reply STOP to opt out.`);
      //   await logNotification.insert(ticket.id, ticket.user.id, 'minus48');
      // }
    }
  }

  return NextResponse.json({ ok: true });
}
