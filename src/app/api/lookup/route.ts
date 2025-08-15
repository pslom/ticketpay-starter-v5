export const dynamic = "force-dynamic";

type Ticket = {
  citation_no: string;
  plate: string;
  state: string;
  amount_cents: number;
  status: "open" | "paid" | "void";
  violation?: string;
  location?: string;
  issued_at?: string;
  due_at?: string;
};

const MOCK: Record<string, Ticket[]> = {
  "CA|7ABC123": [
    {
      citation_no: "SF-10001",
      plate: "7ABC123",
      state: "CA",
      amount_cents: 6500,
      status: "open",
      violation: "No Parking 7–9AM",
      location: "Mission & 16th",
      issued_at: new Date(Date.now() - 2 * 864e5).toISOString(),
      due_at: new Date(Date.now() + 12 * 864e5).toISOString(),
    },
    {
      citation_no: "SF-10002",
      plate: "7ABC123",
      state: "CA",
      amount_cents: 8200,
      status: "open",
      violation: "Expired Meter",
      location: "3rd & Folsom",
      issued_at: new Date(Date.now() - 1 * 864e5).toISOString(),
      due_at: new Date(Date.now() + 13 * 864e5).toISOString(),
    },
    {
      citation_no: "SF-10003",
      plate: "7ABC123",
      state: "CA",
      amount_cents: 9800,
      status: "open",
      violation: "Street Cleaning",
      location: "Valencia & 19th",
      issued_at: new Date(Date.now() - 5 * 864e5).toISOString(),
      due_at: new Date(Date.now() + 9 * 864e5).toISOString(),
    },
  ],
};

function normPlate(s: string) {
  return (s || "").toUpperCase().replace(/\s+/g, "");
}
function normState(s: string) {
  return (s || "").toUpperCase().trim();
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const plate = normPlate(body.plate);
    const state = normState(body.state);
    if (!/^[A-Z0-9]{2,10}$/.test(plate) || !/^[A-Z]{2,3}$/.test(state)) {
      return Response.json({ ok: false, error: "Invalid plate/state." }, { status: 400 });
    }
    const key = `${state}|${plate}`;
    const tickets = MOCK[key] ?? [];
    return Response.json({ ok: true, tickets }, { status: 200 });
  } catch {
    return Response.json({ ok: false, error: "Lookup temporarily unavailable." }, { status: 500 });
  }
}
