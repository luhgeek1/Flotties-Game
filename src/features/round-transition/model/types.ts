import type { ScoreBarChartItem } from "@/shared/ui"

export type RoundTransitionModalPlayerScore = {
  id: string
  name: string
  score: number
}

export type RoundTransitionModalProps = {
  isOpen: boolean
  playerScores: RoundTransitionModalPlayerScore[]
  roundNumber: number
  hasNextRound: boolean
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
      key: "mvp"
      type: "mvp"
      players: RoundTransitionModalPlayerScore[]
    }
  | {
      key: "leader"
      type: "leader"
    }
