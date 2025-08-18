type Props = { dueAt?: string | Date; lateFeeAt?: string | Date; issuedAt?: string | Date; estimated?: boolean; timezone?: string };

function fmt(d?: string | Date, tz?: string) {
  if (!d) return "";
  const x = new Date(d);
  return new Intl.DateTimeFormat(undefined, { dateStyle: "full", timeZone: tz }).format(x);
}
function daysLeft(d?: string | Date) {
  if (!d) return undefined;
  const due = new Date(d);
  const ms = +new Date(due.toDateString()) - +new Date(new Date().toDateString());
  return Math.ceil(ms / 86_400_000);
}

export default function DueDateCard({ dueAt, lateFeeAt, issuedAt, estimated, timezone }: Props) {
  if (!dueAt) return null;
  const left = daysLeft(dueAt) ?? 0;
  return (
    <div className="rounded-xl border border-gray-200 p-4 bg-white">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-gray-700">Due date {estimated && <span className="text-xs text-gray-500">(Estimated)</span>}</h3>
        <span className={`text-xs px-2 py-0.5 rounded ${left <= 3 ? "bg-amber-100 text-amber-800" : "bg-emerald-100 text-emerald-800"}`}>
          {left >= 0 ? `${left} day${left === 1 ? "" : "s"} left` : "Past due"}
        </span>
      </div>
      <p className="mt-1 text-lg font-semibold">{fmt(dueAt, timezone)}</p>
      {lateFeeAt && <p className="mt-1 text-sm text-gray-600">Late fee may apply after {fmt(lateFeeAt, timezone)}.</p>}
      {issuedAt && <p className="mt-2 text-xs text-gray-500">Issued: {fmt(issuedAt, timezone)}</p>}
      <p className="mt-2 text-xs text-gray-500">We’ll send a few helpful reminders before the due date.</p>
    </div>
  );
}