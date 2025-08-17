export default function NotFound() {
  return (
    <main className="mx-auto max-w-2xl px-4 py-12 space-y-3">
      <h1 className="text-2xl font-semibold">Page not found</h1>
      <p className="text-neutral-600">The page you’re looking for doesn’t exist.</p>
      <a href="/" className="underline">Back to home</a>
    </main>
  );
}
