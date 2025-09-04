import { getPool } from "@/lib/pg";

export type MagicPayload = {
  subId: string;
  plate: string;
  state: string;
  channel: "sms" | "email";
  contact: string;
};

export async function parseMagicToken(token: string): Promise<MagicPayload> {
  const pool = await getPool();
  const { rows } = await pool.query(
    `select s.id as "subId", s.plate, s.state, c.channel, c.contact
     from verifications v
     join subscriptions s on s.id = v.subscription_id
     join contacts c on c.id = s.contact_id
     where v.token = $1
     order by v.verified_at desc nulls last, v.sent_at desc
     limit 1`,
    [token]
  );
  if (!rows.length) throw new Error("Invalid or expired token");
  return rows[0] as MagicPayload;
}

export function getRepo() {
  return {
    async updateActive(subId: string, active: boolean) {
      const pool = await getPool();
      if (active) {
        await pool.query(`update subscriptions set paused_at = null where id = $1`, [subId]);
      } else {
        await pool.query(`update subscriptions set paused_at = now() where id = $1 and paused_at is null`, [subId]);
      }
    },
    async delete(subId: string) {
      const pool = await getPool();
      await pool.query(`delete from subscriptions where id = $1`, [subId]);
    },
    async listByPlate(plate: string, state: string) {
      const pool = await getPool();
      const { rows } = await pool.query(
        `select s.id, s.plate, s.state, s.paused_at, c.channel, c.contact
         from subscriptions s
         join contacts c on c.id = s.contact_id
         where s.state = upper($1)
           and s.plate = upper(regexp_replace($2,'[^A-Z0-9]','','g'))
         order by s.created_at desc`,
        [state, plate]
      );
      return rows as { id: string; plate: string; state: string; paused_at: string | null; channel: "sms"|"email"; contact: string; }[];
    }
  };
}
