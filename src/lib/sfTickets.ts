const SF_ENDPOINT = "https://data.sfgov.org/resource/ab4h-6ztd.json";

// Field names from the dataset
const FIELD_PLATE = "vehicle_plate";
const FIELD_STATE = "vehicle_plate_state";
const FIELD_CITATION = "citation_number";
const FIELD_ISSUED_AT = "citation_issued_datetime";

type AnyRec = Record<string, unknown>;

function headers() {
  const h: Record<string, string> = { accept: "application/json" };
  const token = process.env.SFGOV_APP_TOKEN?.trim();
  if (token) h["X-App-Token"] = token;
  return h;
}

export async function sfLookupByPlate(plate: string, state?: string, limit = 5): Promise<AnyRec[]> {
  const url = new URL(SF_ENDPOINT);
  url.searchParams.set(FIELD_PLATE, plate);
  if (state) url.searchParams.set(FIELD_STATE, state);
  url.searchParams.set("$limit", String(limit));
  const r = await fetch(url.toString(), { headers: headers(), cache: "no-store" });
  if (!r.ok) throw new Error(`sf_lookup_failed_${r.status}`);
  return (await r.json()) as AnyRec[];
}

export async function sfLookupByCitation(citation: string): Promise<AnyRec[]> {
  const url = new URL(SF_ENDPOINT);
  url.searchParams.set(FIELD_CITATION, citation);
  url.searchParams.set("$limit", "1");
  const r = await fetch(url.toString(), { headers: headers(), cache: "no-store" });
  if (!r.ok) throw new Error(`sf_lookup_failed_${r.status}`);
  return (await r.json()) as AnyRec[];
}

// Estimated due date: issued + N days (configurable)
export function deriveDueEstimate(rec: AnyRec): { issuedAt?: string; dueAt?: string; lateFeeAt?: string; estimated: true } {
  const issuedStr = (rec[FIELD_ISSUED_AT] as string | undefined)?.toString();
  const issued = issuedStr ? new Date(issuedStr) : undefined;
  const dueDays = Number(process.env.SF_DUE_DAYS || 21);
  const lateGrace = Number(process.env.SF_LATE_FEE_GRACE_DAYS || 7);

  const dueAt = issued ? new Date(issued.getTime() + dueDays * 86_400_000).toISOString() : undefined;
  const lateFeeAt = dueAt ? new Date(new Date(dueAt).getTime() + lateGrace * 86_400_000).toISOString() : undefined;

  return { issuedAt: issuedStr, dueAt, lateFeeAt, estimated: true };
}