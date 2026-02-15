import { useEffect, useMemo, useCallback } from "react";
import { useAtom } from "jotai";

import { createDefaultPlayers } from "@/entities/players";
import { gamePlayerScoresAtom, type GamePlayerScores } from "@/shared/store/gameAtoms";
import type { QuestionModalPlayer } from "@/features/question-modal";

function buildScoresByPlayerIds(
  playerIds: readonly string[],
  prevScores: GamePlayerScores = {},
): GamePlayerScores {
  const next: GamePlayerScores = {};
  for (const id of new Set(playerIds)) next[id] = prevScores[id] ?? 0;
  return next;
}

export function useGamePlayers(selectedPlayerIds: readonly string[]) {
  const [playerScores, setPlayerScores] = useAtom(gamePlayerScoresAtom);

  const selectedPlayers = useMemo(() => {
    const all = createDefaultPlayers();
    const set = new Set(selectedPlayerIds);
    const picked = all.filter(p => set.has(p.id));
    return picked.length ? picked : all;
  }, [selectedPlayerIds]);

  const selectedPlayerIdsForGame = useMemo(
    () => selectedPlayers.map(p => p.id),
    [selectedPlayers],
  );

  useEffect(() => {
    setPlayerScores(prev => buildScoresByPlayerIds(selectedPlayerIdsForGame, prev));
  }, [selectedPlayerIdsForGame, setPlayerScores]);

  const gamePlayers = useMemo(
    () => selectedPlayers.map(p => ({ ...p, score: playerScores[p.id] ?? 0 })),
    [selectedPlayers, playerScores],
  );

  const questionPlayers: QuestionModalPlayer[] = useMemo(
    () => gamePlayers.map(p => ({ id: p.id, name: p.name, keyCode: p.keyCode })),
    [gamePlayers],
  );

  const resetScores = useCallback(() => {
    setPlayerScores(buildScoresByPlayerIds(selectedPlayerIdsForGame));
  }, [setPlayerScores, selectedPlayerIdsForGame]);

  const changePlayerScore = useCallback((playerId: string, delta: number) => {
    setPlayerScores(prev => ({
      ...prev,
      [playerId]: (prev[playerId] ?? 0) + delta,
    }));
  }, [setPlayerScores]);

  return {
    gamePlayers,
    questionPlayers,
    selectedPlayerIdsForGame,
    resetScores,
    changePlayerScore,
  };
}
