export type SFMTARecord = {
  vehicle_plate?: string;
  vehicle_plate_state?: string;
  citation_number: string;
  citation_issued_datetime?: string;
  violation_desc?: string;
  fine_amount?: number;
  date_added?: string;
  [k: string]: any;
};

function datasetId(): string {
  return process.env.datasf_dataset_ID || process.env.DATASF_DATASET_ID || "ab4h-6ztd";
}

function appToken(): string | null {
  return (process.env.datasf_app_token || process.env.DATASF_APP_TOKEN || "").trim() || null;
}

export async function queryCitationsByPlate(opts: {
  plate: string;
  state: string;
  since: string;
  limit?: number;
}): Promise<SFMTARecord[]> {
  const { plate, state, since, limit = 50 } = opts;
  const ds = datasetId();
  const url = new URL(`https://data.sfgov.org/resource/${ds}.json`);
  const fields = [
    "vehicle_plate",
    "vehicle_plate_state",
    "citation_number",
    "citation_issued_datetime",
    "violation_desc",
    "fine_amount",
    "date_added",
    ":id"
  ];
  url.searchParams.set("$select", fields.join(","));
  url.searchParams.set("$limit", String(limit));
  url.searchParams.set("$order", ":id desc");
  const sinceISO = since.replace("Z", "");
  const where = [
    `upper(vehicle_plate)='${plate.toUpperCase()}'`,
    `upper(vehicle_plate_state)='${state.toUpperCase()}'`,
    `(citation_issued_datetime >= '${sinceISO}' OR date_added >= '${sinceISO}')`
  ].join(" AND ");
  url.searchParams.set("$where", where);
  const token = appToken();
  const headers: Record<string, string> = token ? { "X-App-Token": token } : {};
  const r1 = await fetch(url.toString(), { headers, cache: "no-store" });
  if (r1.status === 403) {
    try {
      const txt = await r1.clone().text();
      if (/invalid app_token|permission_denied/i.test(txt)) {
        const r2 = await fetch(url.toString(), { cache: "no-store" });
        if (!r2.ok) throw new Error(`DataSF ${r2.status}`);
        return (await r2.json()) as SFMTARecord[];
      }
    } catch {}
  }
  if (!r1.ok) throw new Error(`DataSF ${r1.status}`);
  return (await r1.json()) as SFMTARecord[];
}
