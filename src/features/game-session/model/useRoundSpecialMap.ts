import { useAtom } from "jotai";
import { useEffect, useMemo } from "react";

import { createRoundSpecialMap } from "@/entities/special-map";
import type { QuestionPack } from "@/shared/api/questionPack";
import { roundSpecialMapsAtom, type RoundSpecialMap } from "@/shared/store/specialCIBAtom";

function buildRoundSpecialKey(packId: string, roundId: string): string {
  return `${packId}:${roundId}`;
}

export function useRoundSpecialMap(selectedPack: QuestionPack, roundIndex: number) {
  const [roundSpecialMaps, setRoundSpecialMaps] = useAtom(roundSpecialMapsAtom);

  const activeRound = selectedPack.rounds.main[roundIndex];
  if (!activeRound) {
    throw new Error("НЕТ РАУНДОВ В ПАКЕ");
  }
  const roundSpecialKey = useMemo(
    () => buildRoundSpecialKey(selectedPack.id, activeRound.id),
    [selectedPack.id, activeRound.id],
  );


  useEffect(() => {
    setRoundSpecialMaps(prev => {
      if (prev[roundSpecialKey]) return prev;

      return {
        ...prev,
        [roundSpecialKey]: createRoundSpecialMap({
          round: activeRound,
          special: selectedPack.special,
        }),
      };
    });
  }, [activeRound, roundSpecialKey, selectedPack.special, setRoundSpecialMaps]);

  const roundSpecialMap = useMemo<RoundSpecialMap>(
    () => roundSpecialMaps[roundSpecialKey] ?? {},
    [roundSpecialKey, roundSpecialMaps],
  );

  return {
    roundSpecialKey,
    roundSpecialMap,
  };
}
