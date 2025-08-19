export default function LogoMark({ className = "h-6 w-6" }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
      <defs>
        <linearGradient id="tpG" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#0F5A37"/>
          <stop offset="1" stopColor="#0B472C"/>
        </linearGradient>
      </defs>
      <path fill="url(#tpG)" d="M10 16c4 0 6-2 6-6h26c6 0 10 4 10 10v24c0 6-4 10-10 10H16c0-4-2-6-6-6V16z"/>
      <circle cx="16" cy="28" r="5" fill="white"/>
    </svg>
  );
}
