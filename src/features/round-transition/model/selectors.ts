import type { ScoreBarChartItem } from "@/shared/ui"

import type { RoundTransitionModalPlayerScore } from "./types"

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

export function getTopScorePlayers(players: RoundTransitionModalPlayerScore[]) {
  const sortedPlayers = sortPlayersByScore(players)
  const topScore = sortedPlayers[0]?.score
  if (topScore === undefined) return []

  return sortedPlayers.filter(player => player.score === topScore)
}
