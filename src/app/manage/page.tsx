import ManageClient from "./ManageClient";

export const dynamic = "force-dynamic";

export default function ManagePage() {
  return (
    <main className="mx-auto max-w-2xl p-6 space-y-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-bold">Manage alerts</h1>
        <p className="text-gray-600">View or remove your active reminders.</p>
      </header>
      <ManageClient />
    </main>
  );
}
