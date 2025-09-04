'use client'

import clsx from 'clsx'

type Variant = 'grid-aurora' | 'grid-only'

export default function BackgroundFX({
  variant = 'grid-aurora',
  className = '',
}: {
  variant?: Variant
  className?: string
}) {
  return (
    <div
      aria-hidden
      className={clsx(
        'pointer-events-none fixed inset-0 -z-10 overflow-hidden',
        className,
      )}
    >
      {/* Subtle grid that slowly pans */}
      <div className="absolute inset-0 fx-grid animate-grid-pan" />

      {/* Emerald aurora beams (only for grid-aurora) */}
      {variant === 'grid-aurora' && (
        <div className="absolute inset-[-10%] fx-aurora animate-aurora" />
      )}

      {/* Vignette for depth */}
      <div className="absolute inset-0 fx-vignette" />
    </div>
  )
}
