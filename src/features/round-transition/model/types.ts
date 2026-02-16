import type { ScoreBarChartItem } from "@/shared/ui"

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

export type RoundTransitionScoreSlide =
  | {
      key: "score"
      type: "score"
      items: ScoreBarChartItem[]
    }
  | {
      key: "questions"
      type: "questions"
      opened: number
      total: number
      percent: number
    }
  | {
      key: "leader"
      type: "leader"
    }
