import type { Variants } from "motion/react"

import type { RoundTransitionStep } from "@/features/round-transition/store/round-transition-storage"

export const roundTransitionStepVariants: Variants = {
  initial: { opacity: 0, x: 20 },
  animate: { opacity: 1, x: 0, transition: { duration: 0.3 } },
  exit: { opacity: 0, x: -20, transition: { duration: 0.2 } },
}

export const roundTransitionLottiZoom = {
  modalScale: 1.1,
  transition: { duration: 0.6, ease: "easeOut" },
} as const

export const roundTransitionConfettiDefaults = {
  spread: 80,
  ticks: 200,
  gravity: 1.1,
  decay: 0.94,
  startVelocity: 45,
  particleCount: 200,
} as const

export const roundTransitionConfettiOrigins = [
  { x: 0.1, y: 1.1 },
  { x: 0.9, y: 1.1 },
] as const

export const roundTransitionHeadingByStep: Record<RoundTransitionStep, string> = {
  score: "Итоги Раунда",
  confirm: "Следующий этап",
}
