import { useAtomValue, useSetAtom } from "jotai";
import { useCallback } from "react";

import { finalActivePlayerIdAtom } from "@/shared/store/finalAtom";
import { selectedQuestionPackAtom } from "@/shared/store/questionAtom";
import { useFinalPlayerQueue } from "@/pages/final/model/use-final-player-queue";

type UseFinalCloseEyesModelArgs = {
  onReadyToBid?: () => void;
};

export function useFinalCloseEyesModel({ onReadyToBid }: UseFinalCloseEyesModelArgs = {}) {
  const selectedPack = useAtomValue(selectedQuestionPackAtom);
  const { currentPlayer } = useFinalPlayerQueue();
  const setActivePlayerId = useSetAtom(finalActivePlayerIdAtom);
  const currentAnswererName = currentPlayer?.name ?? "Игрок";

  const handleReadyClick = useCallback(() => {
    if (!currentPlayer) return;

    setActivePlayerId(currentPlayer.id);
    onReadyToBid?.();
  }, [currentPlayer, onReadyToBid, setActivePlayerId]);

  return {
    packTitle: selectedPack.title,
    currentAnswererName,
    onReadyClick: handleReadyClick,
  };
}
