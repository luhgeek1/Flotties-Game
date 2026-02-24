import { useCallback, useEffect, useMemo } from "react";

import type { GameBoardSpecialTypeByQuestionId } from "@/entities/game-board";
import type { CatInBagBidCompletePayload, CatInBagTransferPlayer } from "./types";
import { useCatInBagTransfer } from "./useCatInBagTransfer";

type UseCatInBagInteractionArgs = {
  players: CatInBagTransferPlayer[];
  roundIndex: number;
  currentPickerId: string | null;
  specialTypeByQuestionId: GameBoardSpecialTypeByQuestionId;
  catInBagThemeByQuestionId: Record<string, string>;
  onRegularQuestionSelect: (questionId: string) => void;
  onStartQuestionAnswering: (questionId: string, playerId: string) => void;
  selectedAnsweringPlayerId: string | null;
  setSelectedAnsweringPlayerId: (playerId: string | null) => void;
  isQuestionModalOpen: boolean;
  modalQuestionId: string | null;
};

export function useCatInBagInteraction({
  players,
  roundIndex,
  currentPickerId,
  specialTypeByQuestionId,
  catInBagThemeByQuestionId,
  onRegularQuestionSelect,
  onStartQuestionAnswering,
  selectedAnsweringPlayerId,
  setSelectedAnsweringPlayerId,
  isQuestionModalOpen,
  modalQuestionId,
}: UseCatInBagInteractionArgs) {
  const isCatInBagQuestionActive = useMemo(
    () => Boolean(modalQuestionId && specialTypeByQuestionId[modalQuestionId] === "catInBag"),
    [modalQuestionId, specialTypeByQuestionId],
  );

  const handleBidComplete = useCallback(
    ({ questionId, targetPlayerId }: CatInBagBidCompletePayload) => {
      onStartQuestionAnswering(questionId, targetPlayerId);
    },
    [onStartQuestionAnswering],
  );

  const {
    isBannerOpen,
    isTransferModalOpen,
    modalMode,
    chooserName,
    answeringPlayerName,
    bidQuestionTheme,
    transferPlayers,
    bidOptions,
    handleBoardQuestionSelect,
    handleBannerClose,
    handleTransferPlayerSelect,
    handleBidSelect,
  } = useCatInBagTransfer({
    players,
    roundIndex,
    currentPickerId,
    specialTypeByQuestionId,
    catInBagThemeByQuestionId,
    onRegularQuestionSelect,
    onBidComplete: handleBidComplete,
  });

  useEffect(() => {
    if (!selectedAnsweringPlayerId) return;
    if (isBannerOpen || isTransferModalOpen) return;
    if (isQuestionModalOpen && isCatInBagQuestionActive) return;

    setSelectedAnsweringPlayerId(null);
  }, [
    isBannerOpen,
    isCatInBagQuestionActive,
    isQuestionModalOpen,
    isTransferModalOpen,
    selectedAnsweringPlayerId,
    setSelectedAnsweringPlayerId,
  ]);

  return {
    isCatInBagQuestionActive,
    isBannerOpen,
    isTransferModalOpen,
    modalMode,
    chooserName,
    answeringPlayerName,
    bidQuestionTheme,
    transferPlayers,
    bidOptions,
    handleBoardQuestionSelect,
    handleBannerClose,
    handleTransferPlayerSelect,
    handleBidSelect,
  };
}
