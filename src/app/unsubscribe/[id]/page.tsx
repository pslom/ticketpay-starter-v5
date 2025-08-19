"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function UnsubscribePage() {
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
    <main className="mx-auto max-w-md px-4 py-10 space-y-4">
      {status === "loading" && <p>Unsubscribing…</p>}
      {status === "ok" && (
        <>
          <h1 className="text-2xl font-semibold">You’re unsubscribed</h1>
          <p className="text-neutral-600 text-sm">
            You’ll no longer receive ticket alerts for this subscription.
          </p>
        </>
      )}
      {status === "error" && (
        <>
          <h1 className="text-2xl font-semibold">We couldn’t unsubscribe you</h1>
          <p className="text-neutral-600 text-sm">
            The link may be invalid or expired. Please try again later.
          </p>
        </>
      )}
    </main>
  );
}
