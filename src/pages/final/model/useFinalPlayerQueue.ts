import { useAtom, useAtomValue } from "jotai";
import { useCallback, useMemo } from "react";

import { resolveSelectedPlayers } from "@/entities/players";
import { gamePlayerScoresAtom } from "@/features/game-session/store/gameAtoms";
import {
  finalActivePlayerIdAtom,
  finalCurrentPlayerIndexAtom,
} from "@/features/game-session/store/finalAtom";
import { setupPlayersAtom, setupSelectedPlayerIdsAtom } from "@/features/game-session/store/setupAtoms";

type UseFinalPlayerQueueArgs = {
  preferActivePlayer?: boolean;
};

export function useFinalPlayerQueue({ preferActivePlayer = false }: UseFinalPlayerQueueArgs = {}) {
  const setupPlayers = useAtomValue(setupPlayersAtom);
  const selectedPlayerIds = useAtomValue(setupSelectedPlayerIdsAtom);
  const playerScores = useAtomValue(gamePlayerScoresAtom);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useAtom(finalCurrentPlayerIndexAtom);
  const [activePlayerId, setActivePlayerId] = useAtom(finalActivePlayerIdAtom);

  const playersQueue = useMemo(
    () => resolveSelectedPlayers(setupPlayers, selectedPlayerIds)
      .filter(player => (playerScores[player.id] ?? 0) > 0),
    [playerScores, selectedPlayerIds, setupPlayers],
  );

  const boundedPlayerIndex = playersQueue.length > 0
    ? Math.min(currentPlayerIndex, playersQueue.length - 1)
    : 0;
  const queuePlayer = playersQueue[boundedPlayerIndex] ?? null;
  const activePlayer = useMemo(
    () => playersQueue.find(player => player.id === activePlayerId) ?? null,
    [activePlayerId, playersQueue],
  );

  const currentPlayer = preferActivePlayer
    ? activePlayer ?? queuePlayer
    : queuePlayer;

  const advancePlayerIndex = useCallback(() => {
    setCurrentPlayerIndex(prev => (
      playersQueue.length > 0
        ? Math.min(prev + 1, playersQueue.length - 1)
        : 0
    ));
  }, [playersQueue.length, setCurrentPlayerIndex]);

  return {
    playersQueue,
    currentPlayer,
    currentPlayerIndex,
    setCurrentPlayerIndex,
    activePlayerId,
    setActivePlayerId,
    advancePlayerIndex,
  };
}
