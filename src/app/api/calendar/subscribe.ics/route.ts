export const runtime = "nodejs";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const dueIso = req.nextUrl.searchParams.get("due");
  if (!dueIso) return new NextResponse("missing due", { status: 400 });
  const due = new Date(dueIso);
  const dt = due.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
  const end = new Date(+due + 60 * 60 * 1000).toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
  const ics = [
    "BEGIN:VCALENDAR","VERSION:2.0","PRODID:-//TicketPay//Reminders//EN",
    "BEGIN:VEVENT",`UID:ticketpay-${dt}@ticketpay`,`DTSTAMP:${dt}`,`DTSTART:${dt}`,`DTEND:${end}`,
    "SUMMARY:Ticket due — avoid the late fee","DESCRIPTION:Heads up — this is your TicketPay reminder.",
    "END:VEVENT","END:VCALENDAR",
  ].join("\r\n");
  return new NextResponse(ics, {
    status: 200,
    headers: {
      "content-type": "text/calendar; charset=utf-8",
      "content-disposition": 'attachment; filename="ticketpay-reminder.ics"',
    },
  });
}