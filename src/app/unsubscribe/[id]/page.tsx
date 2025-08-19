"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { UnsubscribeCopy } from "@/lib/copy";

export default function UnsubscribeSuccess() {
  const { id } = useParams<{ id: string }>();
  const [status, setStatus] = useState<"loading" | "ok" | "error">("loading");

  useEffect(() => {
    const run = async () => {
      try {
        const res = await fetch("/api/unsubscribe", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ id }),
        });
        if (!res.ok) throw new Error();
        setStatus("ok");
      } catch {
        setStatus("error");
      }
    };
    if (id) run();
  }, [id]);

  return (
    <main className="mx-auto max-w-md px-4 py-16">
      <div className="rounded-2xl border border-black/10 bg-white p-6 shadow-card text-center">
        {status === "loading" && (
          <>
            <h1 className="text-2xl font-semibold">Unsubscribing…</h1>
            <p className="mt-2 text-neutral-700">Please wait a moment.</p>
          </>
        )}
        {status === "ok" && (
          <>
            <h1 className="text-2xl font-semibold">{UnsubscribeCopy.title}</h1>
            <p className="mt-2 text-neutral-700">{UnsubscribeCopy.body()}</p>
            <a href="/" className="tp-btn mt-6 w-full">{UnsubscribeCopy.backToSearch}</a>
          </>
        )}
        {status === "error" && (
          <>
            <h1 className="text-2xl font-semibold">We couldn’t unsubscribe you</h1>
            <p className="mt-2 text-neutral-700">The link may be invalid or expired. Please try again later.</p>
            <a href="/" className="tp-btn mt-6 w-full">Back to search</a>
          </>
        )}
      </div>
    </main>
  );
}
