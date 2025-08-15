export function Line({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse rounded bg-neutral-200 ${className}`} />;
}
export function CardSkeleton() {
  return (
    <div className="rounded-2xl border border-neutral-200 p-4">
      <Line className="h-4 w-1/3 mb-3" />
      <Line className="h-4 w-1/2 mb-2" />
      <Line className="h-4 w-2/3" />
    </div>
  );
}
