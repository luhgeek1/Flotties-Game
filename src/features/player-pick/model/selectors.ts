import type { PlayerPickParticipant, ResolveCurrentPickerIdArgs, ResolveRoundStartPickerIdArgs } from "./types";

export function getLowestScorePlayerId(
  players: readonly PlayerPickParticipant[],
): string{
  return players.reduce((lowestPlayer, player) => {
    if (player.score < lowestPlayer.score) return player;
    return lowestPlayer;
  }).id;
}

export function resolveRoundStartPickerId({
  players,
  roundIndex,
}: ResolveRoundStartPickerIdArgs): string{
  if (roundIndex === 0) return players[0].id;

  return getLowestScorePlayerId(players);
}

export function resolveCurrentPickerId({
  players,
  roundStartPickerId,
  completedPicksCount,
}: ResolveCurrentPickerIdArgs): string{

  const startIndex = players.findIndex(player => player.id === roundStartPickerId);
  const shift = completedPicksCount % players.length;
  const currentIndex = (startIndex + shift) % players.length;

  return players[currentIndex].id;
}
