import { useEffect, useMemo, useCallback } from "react";
import { useAtom } from "jotai";

import { resolveSelectedPlayers, type PlayerId, type SetupPlayer } from "@/entities/players";
import { gamePlayerScoresAtom, type GamePlayerScores } from "@/features/game-session/store/gameAtoms";
import type { QuestionModalPlayer } from "@/features/question-modal";

function buildScoresByPlayerIds(
  playerIds: readonly string[],
  prevScores: GamePlayerScores = {},
): GamePlayerScores {
  const next: GamePlayerScores = {};
  for (const id of new Set(playerIds)) next[id] = prevScores[id] ?? 0;
  return next;
}

export function useGamePlayers(
  setupPlayers: readonly SetupPlayer[],
  selectedPlayerIds: readonly PlayerId[],
) {
  const [playerScores, setPlayerScores] = useAtom(gamePlayerScoresAtom);

  const selectedPlayers = useMemo(
    () => resolveSelectedPlayers(setupPlayers, selectedPlayerIds),
    [selectedPlayerIds, setupPlayers],
  );

  useEffect(() => {
    setPlayerScores(prev => buildScoresByPlayerIds(selectedPlayers.map(player => player.id), prev));
  }, [selectedPlayers, setPlayerScores]);

  const gamePlayers = useMemo(
    () => selectedPlayers.map(p => ({ ...p, score: playerScores[p.id] ?? 0 })),
    [selectedPlayers, playerScores],
  );

  const questionPlayers: QuestionModalPlayer[] = useMemo(
    () => gamePlayers.map(p => ({
      id: p.id,
      name: p.name,
      keyCode: p.keyCode,
      avatarUrl: p.avatarUrl,
    })),
    [gamePlayers],
  );

  const changePlayerScore = useCallback((playerId: string, delta: number) => {
    setPlayerScores(prev => ({
      ...prev,
      [playerId]: (prev[playerId] ?? 0) + delta,
    }));
  }, [setPlayerScores]);

  return {
    gamePlayers,
    questionPlayers,
    changePlayerScore,
  };
}
