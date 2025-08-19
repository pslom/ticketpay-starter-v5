import ManageClient from "./ManageClient";
import { ManageCopy } from "@/lib/copy";

export const dynamic = "force-dynamic";

export default function ManagePage() {
  return (
    <main className="mx-auto max-w-2xl p-6 space-y-6">
      <header className="space-y-1">
  <h1 className="text-2xl font-bold">{ManageCopy.title}</h1>
  <p className="text-gray-600">{ManageCopy.subtitle}</p>
      </header>
      <ManageClient />
    </main>
  );
}
