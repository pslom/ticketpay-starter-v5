import { Suspense } from "react";
import ResultsClient from "./Client";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function Page({ searchParams }: { searchParams: { plate?: string; state?: string } }) {
  const plate = (searchParams.plate || "").toUpperCase();
  const state = (searchParams.state || "").toUpperCase();

  return (
    <Suspense fallback={
      <main className="mx-auto max-w-md px-4 py-8 space-y-3">
        <div className="h-20 rounded-2xl bg-neutral-200 animate-pulse" />
        <div className="h-20 rounded-2xl bg-neutral-200 animate-pulse" />
      </main>
    }>
      <ResultsClient plate={plate} state={state} />
    </Suspense>
  );
}
