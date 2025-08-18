export async function track(event: string, payload: any = {}) {
  try {
    await fetch("/api/events", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        event,
        payload,
        // optional: attach a simple session id if you generate one client-side
      }),
      keepalive: true,
    });
  } catch {
    // swallow errors — analytics should never block UX
  }
}
