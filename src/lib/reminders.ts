import { getPool } from "@/lib/pg";

export async function enqueueReminders() {
  const pool = await getPool();
  await pool.query(
    `insert into reminder_queue (alert_id, run_at)
     select a.id, a.posted_at + interval '5 days'
     from alerts a
     left join reminder_queue q on q.alert_id = a.id and q.run_at = a.posted_at + interval '5 days'
     where a.first_notified_at is null;

     insert into reminder_queue (alert_id, run_at)
     select a.id, a.posted_at + interval '13 days'
     from alerts a
     left join reminder_queue q on q.alert_id = a.id and q.run_at = a.posted_at + interval '13 days'
     where a.first_notified_at is null;`
  );
}
