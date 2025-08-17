export const dynamic = "force-dynamic";

type SP = Record<string, string | string[] | undefined>;
const toStr = (v?: string | string[]) => (Array.isArray(v) ? v[0] : v) || "";

export default async function ReceiptPage({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: Promise<SP>;
}) {
  const sp = await searchParams;
  const plate = toStr(sp.plate).toUpperCase();
  const state = toStr(sp.state).toUpperCase();
  const total = Number(toStr(sp.total) || "0");
  const fmt = (c: number) => (c / 100).toLocaleString(undefined, { style: "currency", currency: "USD" });

  return (
    <main className="mx-auto max-w-md px-4 py-10 space-y-4">
      <h1 className="text-2xl font-semibold">Payment received</h1>
      <p className="text-neutral-700">
        Receipt #{params.id}. {plate && state ? `${plate} (${state}) · ` : ""}{fmt(total)}.
      </p>

      <div className="flex gap-2">
        <a href="#" onClick={(e) => { e.preventDefault(); window?.print?.(); }} className="underline text-sm">
          Print
        </a>
        <a href={`mailto:?subject=Ticket%20receipt%20${params.id}&body=Amount%3A%20${fmt(total)}`} className="underline text-sm">
          Email receipt
        </a>
      </div>

      <p className="text-xs text-neutral-500">
        Have a dispute or question? <a href="/support" className="underline">Contact support</a>.
      </p>
    </main>
  );
}