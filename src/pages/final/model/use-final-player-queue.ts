import { useAtom, useAtomValue } from "jotai";
import { useCallback, useMemo } from "react";

import { resolveSelectedPlayers } from "@/entities/players";
import {
  finalActivePlayerIdAtom,
  finalCurrentPlayerIndexAtom,
} from "@/shared/store/finalAtom";
import { setupSelectedPlayerIdsAtom } from "@/shared/store/setupAtoms";

type UseFinalPlayerQueueArgs = {
  preferActivePlayer?: boolean;
};

export function useFinalPlayerQueue({ preferActivePlayer = false }: UseFinalPlayerQueueArgs = {}) {
  const selectedPlayerIds = useAtomValue(setupSelectedPlayerIdsAtom);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useAtom(finalCurrentPlayerIndexAtom);
  const [activePlayerId, setActivePlayerId] = useAtom(finalActivePlayerIdAtom);

  const playersQueue = useMemo(
    () => resolveSelectedPlayers(selectedPlayerIds),
    [selectedPlayerIds],
  );

  const boundedPlayerIndex = Math.min(currentPlayerIndex, playersQueue.length - 1);
  const queuePlayer = playersQueue[boundedPlayerIndex] ?? null;
  const activePlayer = useMemo(
    () => playersQueue.find(player => player.id === activePlayerId) ?? null,
    [activePlayerId, playersQueue],
  );

  const currentPlayer = preferActivePlayer
    ? activePlayer ?? queuePlayer
    : queuePlayer;

  const advancePlayerIndex = useCallback(() => {
    setCurrentPlayerIndex(prev => Math.min(prev + 1, playersQueue.length - 1));
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
