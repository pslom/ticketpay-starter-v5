import Link from 'next/link'
export default function SiteTrustLine({ className = '' }: { className?: string }) {
  return (
    <div className={`text-sm text-gray-500 ${className}`}>
      Powered by{' '}
      <Link href="https://data.sfgov.org/Transportation/SFMTA-Parking-Citations-Fines/ab4h-6ztd" target="_blank" rel="noopener noreferrer" className="underline underline-offset-2">
        City of SF Data
      </Link>
      {' '}• Alerts apply to SFMTA tickets only • Pay only at <span className="font-medium">wmq.etimspayments.com</span>.
    </div>
  )
}
