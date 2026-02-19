import { useAtomValue, useSetAtom } from "jotai";
import { useCallback } from "react";

import { finalActivePlayerIdAtom } from "@/shared/store/finalAtom";
import { selectedQuestionPackAtom } from "@/shared/store/questionAtom";
import { useFinalPlayerQueue } from "@/pages/final/model/use-final-player-queue";

type UseFinalCloseEyesModelArgs = {
  onReady?: () => void;
};

export function useFinalCloseEyesModel({ onReady }: UseFinalCloseEyesModelArgs = {}) {
  const selectedPack = useAtomValue(selectedQuestionPackAtom);
  const { currentPlayer } = useFinalPlayerQueue();
  const setActivePlayerId = useSetAtom(finalActivePlayerIdAtom);
  const currentAnswererName = currentPlayer?.name ?? "Игрок";
  const currentAnswererAvatarUrl = currentPlayer?.avatarUrl ?? null;

  const handleReadyClick = useCallback(() => {
    if (!currentPlayer) return;

    setActivePlayerId(currentPlayer.id);
    onReady?.();
  }, [currentPlayer, onReady, setActivePlayerId]);

  return {
    packTitle: selectedPack.title,
    currentAnswererName,
    currentAnswererAvatarUrl,
    onReadyClick: handleReadyClick,
  };
}
