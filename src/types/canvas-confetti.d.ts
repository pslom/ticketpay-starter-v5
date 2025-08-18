declare module "canvas-confetti" {
  export type Options = {
    particleCount?: number;
    spread?: number;
    origin?: { x?: number; y?: number };
  };
  const confetti: (opts?: Options) => void;
  export default confetti;
}