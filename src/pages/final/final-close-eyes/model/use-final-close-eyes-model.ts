import { useAtomValue } from "jotai";
import { useCallback, useMemo, useState } from "react";

import { resolveSelectedPlayers } from "@/entities/players";
import { resolveCurrentPickerId } from "@/features/player-pick";
import { selectedQuestionPackAtom } from "@/shared/store/questionAtom";
import { setupSelectedPlayerIdsAtom } from "@/shared/store/setupAtoms";

export function useFinalCloseEyesModel() {
  const selectedPack = useAtomValue(selectedQuestionPackAtom);
  const selectedPlayerIds = useAtomValue(setupSelectedPlayerIdsAtom);
  const [answererStep, setAnswererStep] = useState(0);

  const playersQueue = useMemo(
    () => resolveSelectedPlayers(selectedPlayerIds),
    [selectedPlayerIds],
  );

  const currentAnswererId = useMemo(
    () => resolveCurrentPickerId({
      players: playersQueue,
      roundStartPickerId: playersQueue[0]?.id ?? null,
      completedPicksCount: answererStep,
    }),
    [answererStep, playersQueue],
  );

  const currentAnswererName = useMemo(
    () => playersQueue.find(player => player.id === currentAnswererId)?.name ?? playersQueue[0]?.name ?? "Игрок",
    [currentAnswererId, playersQueue],
  );

  const handleReadyClick = useCallback(() => {
    setAnswererStep(prev => Math.min(prev + 1, playersQueue.length - 1));
  }, [playersQueue.length]);

  return {
    packTitle: selectedPack.title,
    currentAnswererName,
    onReadyClick: handleReadyClick,
  };
}
