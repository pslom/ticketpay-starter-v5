import { Suspense } from "react";
import ResultsClient from "./Client";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type SP = Record<string, string | string[] | undefined>;
const toStr = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] ?? "" : v ?? "");

export default async function Page({ searchParams }: { searchParams: Promise<SP> }) {
  const sp = await searchParams;
  const plate = toStr(sp.plate).toUpperCase();
  const state = toStr(sp.state).toUpperCase();

  return (
    <Suspense
      fallback={
        <main className="mx-auto max-w-md px-4 py-8 space-y-3">
          <div className="h-20 rounded-2xl bg-neutral-200 animate-pulse" />
          <div className="h-20 rounded-2xl bg-neutral-200 animate-pulse" />
        </main>
      }
    >
      <ResultsClient plate={plate} state={state} />
    </Suspense>
  );
}
