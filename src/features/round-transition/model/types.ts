import type { ReactNode } from "react"

export type RoundTransitionModalPlayerScore = {
  id: string
  name: string
  score: number
}

export type RoundTransitionModalProps = {
  isOpen: boolean
  playerScores: RoundTransitionModalPlayerScore[]
  openedQuestionsCount: number
  totalQuestionsCount: number
  roundNumber: number
  onConfirm?: () => void
  onExitToSetup?: () => void
}

export type RoundTransitionCarouselSlide = {
  key: "score" | "questions" | "leader"
  content: ReactNode
}
