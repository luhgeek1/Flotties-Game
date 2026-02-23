import { PLAYER_SELECTION_KEY_CODES } from "./defaults";
import type { Player, PlayerId, SetupPlayer } from "./types";

export function resolveSelectedPlayers(
  setupPlayers: readonly SetupPlayer[],
  selectedPlayerIds: readonly PlayerId[],
): Player[] {
  const playersById = new Map(setupPlayers.map(player => [player.id, player]));
  const selectedPlayers: Player[] = [];

  selectedPlayerIds
    .slice(0, PLAYER_SELECTION_KEY_CODES.length)
    .forEach((playerId, index) => {
      const setupPlayer = playersById.get(playerId)!;

      selectedPlayers.push({
        ...setupPlayer,
        keyCode: PLAYER_SELECTION_KEY_CODES[index],
        score: 0,
      });
    });

  return selectedPlayers;
}
