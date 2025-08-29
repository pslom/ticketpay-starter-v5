export default function BackgroundGrid({ rotate = 0 }: { rotate?: 0 | 90 }) {
  // Very light grid with a radial mask so it fades toward the edges
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 opacity-50
                 [mask-image:radial-gradient(1200px_700px_at_50%_20%,black,transparent_70%)]
                 [-webkit-mask-image:radial-gradient(1200px_700px_at_50%_20%,black,transparent_70%)]"
    >
      <div
        className={`absolute inset-0 ${rotate === 90 ? 'rotate-90' : ''}
                    bg-[linear-gradient(to_right,rgba(16,185,129,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(16,185,129,0.06)_1px,transparent_1px)]
                    [background-size:24px_24px]`}
      />
    </div>
  )
}
