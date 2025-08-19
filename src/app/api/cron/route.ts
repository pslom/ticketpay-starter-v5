export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getPool } from "@/lib/pg";
import { sendSms, sendEmail } from "@/lib/notify";

function j(s:number,b: unknown){return new NextResponse(JSON.stringify(b),{status:s,headers:{'content-type':'application/json'}});}

function readAuth(req: NextRequest) {
  const hAuth = req.headers.get('authorization') || req.headers.get('Authorization') || '';
  const bearer = hAuth.toLowerCase().startsWith('bearer ') ? hAuth.slice(7).trim() : '';
  const xAdmin = req.headers.get('x-admin-token') || '';
  return { bearer, xAdmin };
}

export async function GET(req: NextRequest) {
  const { bearer, xAdmin } = readAuth(req);
  const CRON = process.env.CRON_SECRET || '';
  const ADMIN = process.env.ADMIN_TOKEN || '';
  const authed = (bearer && CRON && bearer === CRON) || (xAdmin && ADMIN && xAdmin === ADMIN) || (bearer && ADMIN && bearer === ADMIN);
  if (!authed) return j(401, { ok:false, error:'unauthorized' });

  try {
    const pool = getPool();
    const { rows } = await pool.query(
      `select id, alert_type, channel, payload
         from public.subscription_alerts
        where sent_at is null
          and scheduled_at <= now()
        order by scheduled_at asc
        limit 100`
    );

    let sent = 0, failed = 0;
    for (const row of rows as any[]) {
      const id = row.id as string | number;
      const type = String(row.alert_type || 'posted');
      const channel = String(row.channel || 'both');
      const payload = row.payload as any;

      try {
        const plate = payload?.plate || undefined;
        if ((channel === 'sms' || channel === 'both') && payload?.phone) {
          await sendSms(payload.phone, type === 'posted' ? `⏰ Ticket posted${plate ? ` for ${plate}` : ''}. We’ll keep you updated.` : `⏰ Late fee in 2 days${plate ? ` for ${plate}` : ''}. Pay on time to avoid fees.`);
        }
        if ((channel === 'email' || channel === 'both') && payload?.email) {
          const title = type === 'posted' ? 'Ticket posted' : 'Late fee in 2 days';
          const p = plate ? ` for ${plate}` : '';
          const html = `<p><strong>${title}${p}</strong></p><p>Manage alerts: <a href=\"/manage\">/manage</a></p>`;
          const text = `${title}${p}\nManage: /manage`;
          await sendEmail(payload.email, `TicketPay: ${title}`, text, html);
        }

        await pool.query(`update public.subscription_alerts set sent_at = now() where id = $1`, [id]);
        sent++;
      } catch {
        failed++;
      }
    }

    return j(200, { ok:true, processed: rows.length, sent, failed });
  } catch (err: any) {
    return j(500, { ok:false, error:'server_error' });
  }
}
