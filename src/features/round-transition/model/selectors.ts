import type { ScoreBarChartItem } from "@/shared/ui"

import type { RoundTransitionModalPlayerScore } from "./types"

export type RoundTransitionQuestionsStats = {
  safeOpenedQuestionsCount: number
  safeTotalQuestionsCount: number
  completionPercent: number
}

export function sortPlayersByScore(players: RoundTransitionModalPlayerScore[]) {
  return [...players].sort((a, b) => b.score - a.score)
}

export function buildScoreChartItems(
  players: RoundTransitionModalPlayerScore[],
): ScoreBarChartItem[] {
  return players.map(player => ({
    id: player.id,
    label: player.name,
    value: player.score,
    colorClassName: "bg-emerald-700",
  }))
}

export function clampValue(value: number, minValue: number, maxValue: number) {
  if (maxValue < minValue) {
    return minValue
  }

  return Math.min(Math.max(value, minValue), maxValue)
}

export function getRoundTransitionQuestionsStats(
  openedQuestionsCount: number,
  totalQuestionsCount: number,
): RoundTransitionQuestionsStats {
  const safeTotalQuestionsCount = Math.max(totalQuestionsCount, 0)
  const safeOpenedQuestionsCount = safeTotalQuestionsCount > 0 ? clampValue(openedQuestionsCount, 0, safeTotalQuestionsCount) : Math.max(openedQuestionsCount, 0)
  const completionPercent = safeTotalQuestionsCount > 0 ? Math.round((safeOpenedQuestionsCount / safeTotalQuestionsCount) * 100) : 0

  return {
    safeOpenedQuestionsCount,
    safeTotalQuestionsCount,
    completionPercent,
  }
}
