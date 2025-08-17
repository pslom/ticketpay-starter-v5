export function triggerConfetti() {
  const root = document.createElement("div");
  root.className = "confetti";
  const colors = ["#4f46e5", "#7c3aed", "#06b6d4", "#10b981", "#f59e0b", "#ef4444"];
  for (let i = 0; i < 24; i++) {
    const p = document.createElement("i");
    const left = 45 + Math.random() * 10;   // center burst
    const delay = Math.random() * 120;
    const color = colors[(Math.random() * colors.length) | 0];
    p.style.left = `${left + (Math.random() * 20 - 10)}%`;
    p.style.top = `20%`;
    p.style.background = color;
    p.style.transform = `translateY(-20px) rotate(${Math.random() * 180}deg)`;
    p.style.animationDelay = `${delay}ms`;
    root.appendChild(p);
  }
  document.body.appendChild(root);
  setTimeout(() => root.remove(), 1200);
}