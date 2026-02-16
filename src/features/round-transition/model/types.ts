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
      player: RoundTransitionModalPlayerScore | null
    }
  | {
      key: "leader"
      type: "leader"
    }
