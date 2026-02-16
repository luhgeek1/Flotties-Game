import type { Variants } from "motion/react"

import type { RoundTransitionStep } from "@/shared/store/round-transition-storage"

export const roundTransitionStepVariants: Variants = {
  initial: { opacity: 0, x: 20 },
  animate: { opacity: 1, x: 0, transition: { duration: 0.3 } },
  exit: { opacity: 0, x: -20, transition: { duration: 0.2 } },
}

export const roundTransitionHeadingByStep: Record<RoundTransitionStep, string> = {
  score: "Общий счет",
  confirm: "Следующий этап",
}
