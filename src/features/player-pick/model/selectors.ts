import type { PlayerPickParticipant, ResolveCurrentPickerIdArgs, ResolveRoundStartPickerIdArgs } from "./types";

export function getLowestScorePlayerId(
  players: readonly PlayerPickParticipant[],
): string | null {
  if (players.length === 0) return null;

  return players.reduce((lowestPlayer, player) => {
    if (player.score < lowestPlayer.score) return player;
    return lowestPlayer;
  }).id;
}

export function resolveRoundStartPickerId({
  players,
  roundIndex,
  round2StarterId,
}: ResolveRoundStartPickerIdArgs): string | null {
  if (players.length === 0) return null;

  if (roundIndex === 0) return players[0]?.id ?? null;

  if (round2StarterId && players.some(player => player.id === round2StarterId)) {
    return round2StarterId;
  }

  return getLowestScorePlayerId(players);
}

export function resolveCurrentPickerId({
  players,
  roundStartPickerId,
  completedPicksCount,
}: ResolveCurrentPickerIdArgs): string | null {
  if (!players.length || !roundStartPickerId) return null;

  const startIndex = players.findIndex(player => player.id === roundStartPickerId);
  const safeStartIndex = startIndex >= 0 ? startIndex : 0;
  const shift = completedPicksCount % players.length;
  const currentIndex = (safeStartIndex + shift) % players.length;

  return players[currentIndex]?.id ?? players[0]?.id ?? null;
}
