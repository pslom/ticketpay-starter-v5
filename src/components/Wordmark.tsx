import * as React from "react";

export function LogoMark(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <circle cx="12" cy="12" r="10" fill="currentColor" />
    </svg>
  );
}

export default function Wordmark({ className = "" }: { className?: string }) {
  return (
    <div className={className}>
      <LogoMark className="h-7 w-7" />
    </div>
  );
}
