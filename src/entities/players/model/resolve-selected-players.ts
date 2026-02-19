import { createDefaultPlayers } from "./defaults";
import type { Player, PlayerId } from "./types";

export function resolveSelectedPlayers(selectedPlayerIds: readonly PlayerId[]): Player[] {
  const defaultPlayers = createDefaultPlayers();
  const byId = new Map(defaultPlayers.map(player => [player.id, player]));
  const pickedPlayers = selectedPlayerIds
    .map(playerId => byId.get(playerId))
    .filter((player): player is Player => Boolean(player));

  return pickedPlayers.length ? pickedPlayers : defaultPlayers;
}
