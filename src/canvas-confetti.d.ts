declare module "canvas-confetti" {
  export type ConfettiOrigin = {
    x?: number
    y?: number
  }

  export type Options = {
    particleCount?: number
    spread?: number
    startVelocity?: number
    decay?: number
    gravity?: number
    ticks?: number
    origin?: ConfettiOrigin
  }

  export default function confetti(options?: Options): Promise<null> | null
}
