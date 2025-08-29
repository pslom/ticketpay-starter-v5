'use client'
export async function confettiBurst(){
  const confetti = (await import('canvas-confetti')).default
  confetti({particleCount:110,spread:70,origin:{y:.65}})
  setTimeout(()=>confetti({particleCount:80,spread:100,origin:{y:.6}}),180)
}
