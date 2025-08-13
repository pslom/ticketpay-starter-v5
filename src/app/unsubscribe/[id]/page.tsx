"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function UnsubPage() {
  const params = useParams<{ id: string }>();
  const id = String(params?.id || "");
  const [status, setStatus] = useState<string>("Processing…");

  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        const r = await fetch("/api/unsubscribe", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ subscription_id: id })
        });
        const json = await r.json();
        if (json.ok) setStatus("You have been unsubscribed.");
        else setStatus("Unable to unsubscribe.");
      } catch {
        setStatus("Network error.");
      }
    })();
  }, [id]);

  return (
    <main className="min-h-screen bg-white text-gray-900">
      <div className="mx-auto max-w-xl px-6 py-16">
        <h1 className="text-2xl font-semibold">Unsubscribe</h1>
        <p className="mt-4 text-gray-700">{status}</p>
      </div>
    </main>
  );
}
