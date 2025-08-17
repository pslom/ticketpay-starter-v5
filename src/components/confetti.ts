type Shape = "square" | "circle" | "triangle";
type Options = {
  x?: number; // 0..1 viewport width
  y?: number; // 0..1 viewport height
  count?: number;
  spread?: number; // deg
  startVelocity?: number;
  gravity?: number;
  decay?: number;
  scalar?: number;
  colors?: string[];
  shapes?: Shape[];
};

export function confetti({
  x = 0.5,
  y = 0.2,
  count = 180,
  spread = 70,
  startVelocity = 16,
  gravity = 0.35,
  decay = 0.985,
  scalar = 1,
  colors = ["#4f46e5", "#7c3aed", "#06b6d4", "#10b981", "#f59e0b", "#ef4444"],
  shapes = ["square", "circle", "triangle"],
}: Options = {}) {
  if (window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches) return;

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d")!;
  const dpr = Math.max(1, window.devicePixelRatio || 1);
  const W = () => (canvas.width = Math.floor(window.innerWidth * dpr));
  const H = () => (canvas.height = Math.floor(window.innerHeight * dpr));
  W(); H();
  canvas.style.cssText = "position:fixed;inset:0;pointer-events:none;z-index:9999";
  document.body.appendChild(canvas);

  const originX = canvas.width * x;
  const originY = canvas.height * y;

  type P = { x:number;y:number;vx:number;vy:number;life:number;color:string;shape:Shape;angle:number;size:number;spin:number;opacity:number; };
  const rand = (min:number, max:number) => Math.random() * (max - min) + min;
  const toRad = (deg:number) => (deg * Math.PI) / 180;

  const parts: P[] = [];
  for (let i = 0; i < count; i++) {
    const angle = toRad(rand(-spread / 2, spread / 2));
    const vel = startVelocity * (0.8 + Math.random() * 0.4);
    const p: P = {
      x: originX, y: originY,
      vx: Math.cos(angle) * vel * dpr,
      vy: Math.sin(angle) * vel * dpr - (startVelocity * 0.6 * dpr),
      life: 800 + Math.random() * 500,
      color: colors[(Math.random() * colors.length) | 0],
      shape: shapes[(Math.random() * shapes.length) | 0],
      angle: rand(0, Math.PI * 2),
      size: (rand(6, 12) * scalar) * dpr,
      spin: rand(-0.2, 0.2),
      opacity: 1,
    };
    parts.push(p);
  }

  let alive = true;
  const started = performance.now();

  const frame = (t: number) => {
    const elapsed = t - started;
    if (!alive) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    alive = false;
    for (const p of parts) {
      // physics
      p.vx *= decay;
      p.vy = p.vy * decay + gravity * dpr;
      p.x += p.vx;
      p.y += p.vy;
      p.angle += p.spin;
      p.life -= 16;
      p.opacity = Math.max(0, Math.min(1, p.life / 1000));

      // draw
      ctx.save();
      ctx.globalAlpha = p.opacity;
      ctx.translate(p.x, p.y);
      ctx.rotate(p.angle);
      ctx.fillStyle = p.color;

      switch (p.shape) {
        case "square":
          ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
          break;
        case "circle":
          ctx.beginPath();
          ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
          ctx.fill();
          break;
        case "triangle":
          ctx.beginPath();
          ctx.moveTo(-p.size / 2, p.size / 2);
          ctx.lineTo(0, -p.size / 2);
          ctx.lineTo(p.size / 2, p.size / 2);
          ctx.closePath();
          ctx.fill();
          break;
      }
      ctx.restore();

      if (p.life > 0 && p.y < canvas.height + 40 * dpr) alive = true;
    }

    if (alive) requestAnimationFrame(frame);
    else document.body.removeChild(canvas);
  };

  requestAnimationFrame(frame);
}