const DATASET = process.env.datasf_dataset_ID || process.env.SFMTA_DATASET_ID || "";
const APP_TOKEN = process.env.datasf_app_token || process.env.SFMTA_APP_TOKEN || "";

type Raw = {
  citation_number?: string;
  citation_issued_datetime?: string;
  violation?: string;
  violation_desc?: string;
  citation_location?: string;
  vehicle_plate_state?: string;
  vehicle_plate?: string;
  fine_amount?: string;
  date_added?: string;
  the_geom?: { coordinates?: [number, number] };
};

function mapRows(rows: Raw[]) {
  return rows.map(x => ({
    citation_number: x.citation_number || "",
    citation_issued_datetime: x.citation_issued_datetime ? new Date(x.citation_issued_datetime) : null,
    violation: x.violation || null,
    violation_desc: x.violation_desc || null,
    citation_location: x.citation_location || null,
    vehicle_plate_state: (x.vehicle_plate_state || "").toUpperCase(),
    vehicle_plate: (x.vehicle_plate || "").toUpperCase(),
    fine_amount_cents: x.fine_amount ? Math.round(parseFloat(x.fine_amount) * 100) : null,
    date_added: x.date_added ? new Date(x.date_added) : null,
    lat: x.the_geom?.coordinates ? x.the_geom.coordinates[1] : null,
    lon: x.the_geom?.coordinates ? x.the_geom.coordinates[0] : null
  }));
}

export function getConfig() {
  if (!DATASET) throw new Error("Missing datasf_dataset_ID");
  const headers: Record<string,string> = {};
  if (APP_TOKEN) headers["X-App-Token"] = APP_TOKEN;
  return { dataset: DATASET, headers };
}

export async function fetchCitationsSince(iso: string) {
  const { dataset, headers } = getConfig();
  const url = new URL(`https://data.sfgov.org/resource/${dataset}.json`);
  url.searchParams.set("$select", [
    "citation_number",
    "citation_issued_datetime",
    "violation",
    "violation_desc",
    "citation_location",
    "vehicle_plate_state",
    "vehicle_plate",
    "fine_amount",
    "date_added",
    "the_geom"
  ].join(","));
  url.searchParams.set("$where", `(date_added > '${iso}' OR citation_issued_datetime > '${iso}')`);
  url.searchParams.set("$order", "date_added asc, citation_issued_datetime asc");
  url.searchParams.set("$limit", "50000");
  const r = await fetch(url.toString(), { headers, cache: "no-store" });
  if (!r.ok) throw new Error(`SFMTA ${r.status}`);
  return mapRows(await r.json());
}

export async function fetchRecent(limit = 50) {
  const { dataset, headers } = getConfig();
  const url = new URL(`https://data.sfgov.org/resource/${dataset}.json`);
  url.searchParams.set("$select", [
    "citation_number",
    "citation_issued_datetime",
    "violation",
    "violation_desc",
    "citation_location",
    "vehicle_plate_state",
    "vehicle_plate",
    "fine_amount",
    "date_added",
    "the_geom",
    ":id"
  ].join(","));
  url.searchParams.set("$order", ":id desc");
  url.searchParams.set("$limit", String(limit));
  const r = await fetch(url.toString(), { headers, cache: "no-store" });
  if (!r.ok) throw new Error(`SFMTA ${r.status}`);
  return mapRows(await r.json());
}

function isoNDaysAgo(n: number) {
  const d = new Date(Date.now() - n * 86400000);
  return d.toISOString();
}

export function initialSinceISO() {
  return isoNDaysAgo(30);
}
