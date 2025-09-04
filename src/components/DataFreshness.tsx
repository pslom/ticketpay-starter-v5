import { format } from "date-fns";

export default function DataFreshness({ lastImport }: { lastImport?: string | null }) {
  if (!lastImport)
    return <p className="text-xs text-slate-500">Updated daily. Waiting on the city’s latest file.</p>;
  return (
    <p className="text-xs text-slate-500">
      Updated daily. Last import {format(new Date(lastImport), "MMM d, h:mm a")}. Data is only as current as the city’s feed.
    </p>
  );
}
