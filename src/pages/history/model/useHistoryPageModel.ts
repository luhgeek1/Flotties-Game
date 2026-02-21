import { useAtomValue } from "jotai";
import { useMemo } from "react";

import { type GameCardData, useGameHistory } from "@/features/history";
import { questionPacksAtom } from "@/shared/store/questionAtom";

function formatDuration(durationMs: number): string {
  const totalSeconds = Math.max(0, Math.floor(durationMs / 1000));
  const seconds = totalSeconds % 60;
  const totalMinutes = Math.floor(totalSeconds / 60);
  const minutes = totalMinutes % 60;
  const hours = Math.floor(totalMinutes / 60);

  const ss = String(seconds).padStart(2, "0");
  const mm = String(minutes).padStart(2, "0");
  if (hours === 0) return `${mm}:${ss}`;

  const hh = String(hours).padStart(2, "0");
  return `${hh}:${mm}:${ss}`;
}

export function useHistoryPageModel() {
  const { history } = useGameHistory();
  const questionPacks = useAtomValue(questionPacksAtom);

  const cards = useMemo<GameCardData[]>(() => {
    const packTitleById = new Map(questionPacks.map(pack => [pack.id, pack.title]));

    return history.map(entry => {
      const playersById = new Map(entry.selectedPlayers.map(player => [player.id, player]));
      const scores = entry.selectedPlayers.map(player => entry.playerScores[player.id] ?? 0);
      const topScore = scores.length > 0 ? Math.max(...scores) : 0;
      const players = entry.selectedPlayers.map(player => {
        const score = entry.playerScores[player.id] ?? 0;

        return {
          id: player.id,
          name: player.name,
          avatarUrl: player.avatarUrl,
          score,
          isWinner: score === topScore,
        };
      });

      const resolveMvpRound = (roundNumber: number) => {
        const round = entry.roundMvps.find(item => item.roundNumber === roundNumber);
        if (!round || round.players.length === 0) return null;

        const names = round.players.map(player => player.playerName).join(", ");
        const firstMvpPlayerId = round.players[0]?.playerId ?? null;
        const avatarUrl = firstMvpPlayerId ? (playersById.get(firstMvpPlayerId)?.avatarUrl ?? null) : null;

        return {
          names,
          avatarUrl,
          score: round.score,
        };
      };

      const packName = packTitleById.get(entry.selectedPackId)!;

      return {
        id: entry.id,
        startTime: entry.startedAt,
        duration: formatDuration(entry.durationMs),
        packName,
        mvp1: resolveMvpRound(1),
        mvp2: resolveMvpRound(2),
        players,
      };
    });
  }, [history, questionPacks]);

  return {
    cards,
  };
}
