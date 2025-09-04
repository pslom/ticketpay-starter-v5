'use client'
import Link from 'next/link'
import { isAllowedPayUrl } from '@/lib/payLinks'

export const SFMTA_PAY_URL = 'https://wmq.etimspayments.com/pbw/include/sanfrancisco/input.jsp'

export default function PayAtSFMTA({ size = 'md', className = '', url = SFMTA_PAY_URL }: { size?: 'sm' | 'md' | 'lg', className?: string, url?: string }) {
  const sizes = { sm: 'px-3 py-2 text-sm', md: 'px-5 py-3 text-base', lg: 'px-6 py-4 text-lg' } as const
  if (!isAllowedPayUrl(url)) return null
  return (
    <Link href={url} target="_blank" rel="noopener noreferrer" prefetch={false}
      className={['btn-primary', sizes[size], className].join(' ')} aria-label="Open the official SFMTA payment portal">
      Pay at SFMTA
    </Link>
  )
}
