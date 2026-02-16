import { useAtom } from "jotai";
import { useEffect, useMemo } from "react";

import { gameRound2StartPickerIdAtom } from "@/shared/store/gameAtoms";

import { getLowestScorePlayerId, resolveCurrentPickerId, resolveRoundStartPickerId } from "./selectors";
import type { PlayerPickParticipant } from "./types";

type UsePlayerPickArgs = {
  players: readonly PlayerPickParticipant[];
  roundIndex: number;
  completedPicksCount: number;
};

export function usePlayerPick({
  players,
  roundIndex,
  completedPicksCount,
}: UsePlayerPickArgs) {
  const [round2StarterId, setRound2StarterId] = useAtom(gameRound2StartPickerIdAtom);

  useEffect(() => {
    if (roundIndex !== 1) return;
    if (round2StarterId && players.some(player => player.id === round2StarterId)) return;

    setRound2StarterId(getLowestScorePlayerId(players));
  }, [players, round2StarterId, roundIndex, setRound2StarterId]);

  const roundStartPickerId = useMemo(
    () => resolveRoundStartPickerId({
      players,
      roundIndex,
    }),
    [players, roundIndex],
  );

  const currentPickerId = useMemo(
    () => resolveCurrentPickerId({
      players,
      roundStartPickerId,
      completedPicksCount,
    }),
    [players, roundStartPickerId, completedPicksCount],
  );

  const currentPicker = useMemo(
    () => players.find(player => player.id === currentPickerId),
    [currentPickerId, players],
  );

  return {
    currentPickerId,
    currentPicker,
  };
}
