import { getPool } from "@/lib/pg";
import { normPlate, normState } from "./normalize";

type Cit = {
  citation_number: string;
  citation_issued_datetime: Date|null;
  violation: string|null;
  violation_desc: string|null;
  citation_location: string|null;
  vehicle_plate_state: string;
  vehicle_plate: string;
  fine_amount_cents: number|null;
  date_added: Date|null;
  lat: number|null;
  lon: number|null;
};

export async function upsertAndMatch(rows: Cit[]) {
  const pool = await getPool();
  const client = await pool.connect();
  try {
    await client.query("begin");
    let maxDate: Date|null = null;

    for (const r of rows) {
      await client.query(
        `insert into citations
           (citation_number, citation_issued_datetime, violation, violation_desc, citation_location,
            vehicle_plate_state, vehicle_plate, fine_amount_cents, date_added, lat, lon)
         values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
         on conflict (state_norm, plate_norm, citation_number) do update
         set citation_issued_datetime = excluded.citation_issued_datetime,
             violation = excluded.violation,
             violation_desc = excluded.violation_desc,
             citation_location = excluded.citation_location,
             fine_amount_cents = excluded.fine_amount_cents,
             date_added = excluded.date_added,
             lat = excluded.lat,
             lon = excluded.lon`,
        [
          r.citation_number,
          r.citation_issued_datetime,
          r.violation,
          r.violation_desc,
          r.citation_location,
          r.vehicle_plate_state,
          r.vehicle_plate,
          r.fine_amount_cents,
          r.date_added,
          r.lat,
          r.lon
        ]
      );

      const st = normState(r.vehicle_plate_state);
      const pl = normPlate(r.vehicle_plate);
      if (st && pl) {
        const subs = await client.query(
          `select id from subscriptions
           where state = $1 and plate = $2 and paused_at is null`,
          [st, pl]
        );
        for (const row of subs.rows) {
          await client.query(
            `insert into alerts
               (subscription_id, citation_number, posted_at, amount_cents, violation, violation_desc, citation_location, pay_url, first_notified_at)
             values ($1,$2,$3,$4,$5,$6,$7,$8, null)
             on conflict (subscription_id, citation_number) do nothing`,
            [
              row.id,
              r.citation_number,
              r.citation_issued_datetime || r.date_added,
              r.fine_amount_cents,
              r.violation,
              r.violation_desc,
              r.citation_location,
              "https://wmq.etimspayments.com/pbw/include/sanfrancisco/input.jsp"
            ]
          );
        }
      }

      if (r.date_added && (!maxDate || r.date_added > maxDate)) maxDate = r.date_added;
    }

    await client.query("commit");
    return { maxDate };
  } catch (e) {
    await client.query("rollback");
    throw e;
  } finally {
    client.release();
  }
}
