import { useAtom } from "jotai";
import { useEffect, useMemo } from "react";

import { createRoundSpecialMap, type RoundSpecialMap } from "@/entities/special-map";
import { roundSpecialMapsAtom } from "@/features/cat-in-bag/store/specialCIBAtom";
import type { QuestionPack, QuestionPackSpecial } from "@/shared/api/questionPack";

function buildRoundSpecialKey(packId: string, roundId: string): string {
  return `${packId}:${roundId}`;
}

function createEmptyRoundSpecial(): QuestionPackSpecial {
  return {
    catInBag: { questions: [] },
    auction: { questions: [] },
  };
}

export function useRoundSpecialMap(selectedPack: QuestionPack, roundIndex: number) {
  const [roundSpecialMaps, setRoundSpecialMaps] = useAtom(roundSpecialMapsAtom);

  const activeRound = selectedPack.rounds.main[roundIndex];
  const roundSpecialKey = useMemo(
    () => buildRoundSpecialKey(selectedPack.id, activeRound.id),
    [selectedPack.id, activeRound.id],
  );
  const roundSpecial = useMemo<QuestionPackSpecial>(
    () => selectedPack.special.byRound[activeRound.id] ?? createEmptyRoundSpecial(),
    [activeRound.id, selectedPack.special.byRound],
  );


  useEffect(() => {
    setRoundSpecialMaps(prev => {
      if (prev[roundSpecialKey]) return prev;

      return {
        ...prev,
        [roundSpecialKey]: createRoundSpecialMap({
          round: activeRound,
          special: roundSpecial,
        }),
      };
    });
  }, [activeRound, roundSpecial, roundSpecialKey, setRoundSpecialMaps]);

  const roundSpecialMap = useMemo<RoundSpecialMap>(
    () => roundSpecialMaps[roundSpecialKey] ?? {},
    [roundSpecialKey, roundSpecialMaps],
  );

  return {
    roundSpecialMap,
    roundSpecial,
  };
}
