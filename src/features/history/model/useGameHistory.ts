import { useAtom, useAtomValue } from "jotai";

import { resolveSelectedPlayers } from "@/entities/players";
import {
  gameHistoryAtom,
  gameRoundMvpsAtom,
  gameStartedAtAtom,
  type GameHistoryEntry,
} from "@/shared/store/gameHistoryAtom";
import { gamePlayerScoresAtom, type GamePlayerScores } from "@/shared/store/gameAtoms";
import { setupPlayersAtom, setupSelectedPackIdAtom, setupSelectedPlayerIdsAtom } from "@/shared/store/setupAtoms";

function createSequentialHistoryId(history: readonly GameHistoryEntry[]): string {
  const maxIndex = history.reduce((max, entry) => {
    const index = Number(entry.id.replace("history-", ""));

    return Math.max(max, index);
  }, 0);

  return `history-${maxIndex + 1}`;
}

export function useGameHistory() {
  const setupPlayers = useAtomValue(setupPlayersAtom);
  const selectedPlayerIds = useAtomValue(setupSelectedPlayerIdsAtom);
  const selectedPackId = useAtomValue(setupSelectedPackIdAtom);
  const playerScores = useAtomValue(gamePlayerScoresAtom);
  const [history, setHistory] = useAtom(gameHistoryAtom);
  const [roundMvps, setRoundMvps] = useAtom(gameRoundMvpsAtom);
  const [gameStartedAt, setGameStartedAt] = useAtom(gameStartedAtAtom);

  const markGameStarted = (startedAt = new Date().toISOString()) => {
    setGameStartedAt(startedAt);
  };

  const appendCurrentGameToHistory = () => {
    const selectedPlayers = resolveSelectedPlayers(setupPlayers, selectedPlayerIds);

    if (selectedPlayers.length === 0) return;

    const endedAt = new Date().toISOString();
    const startedAt = gameStartedAt ?? endedAt;
    const durationMs = Math.max(0, new Date(endedAt).getTime() - new Date(startedAt).getTime());
    const scoresBySelectedPlayers = selectedPlayers.reduce<GamePlayerScores>((acc, player) => {
      acc[player.id] = playerScores[player.id] ?? 0;
      return acc;
    }, {});

    setHistory(prev => {
      const entry: GameHistoryEntry = {
        id: createSequentialHistoryId(prev),
        startedAt,
        endedAt,
        durationMs,
        selectedPackId,
        selectedPlayers: selectedPlayers.map(player => ({
          id: player.id,
          name: player.name,
          avatarUrl: player.avatarUrl,
          banner: player.banner,
        })),
        playerScores: scoresBySelectedPlayers,
        roundMvps,
      };

      return [entry, ...prev];
    });
  };

  const resetRoundMvps = () => {
    setRoundMvps([]);
    setGameStartedAt(null);
  };

  return {
    history,
    roundMvps,
    gameStartedAt,
    markGameStarted,
    appendCurrentGameToHistory,
    resetRoundMvps,
  };
}
