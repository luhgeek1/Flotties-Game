import { useAtom } from "jotai";
import { useCallback, useMemo, useState } from "react";

import type { GameBoardSpecialTypeByQuestionId } from "@/entities/game-board";
import {
  catInBagSelectedAnsweringPlayerIdAtom,
  catInBagTransferModalOpenAtom,
} from "@/shared/store/specialAtom";

import type { CatInBagTransferCompletePayload, CatInBagTransferPlayer } from "./types";

type UseCatInBagTransferArgs = {
  players: CatInBagTransferPlayer[];
  currentPickerId: string | null;
  specialTypeByQuestionId: GameBoardSpecialTypeByQuestionId;
  onRegularQuestionSelect: (questionId: string) => void;
  onTransferComplete: (payload: CatInBagTransferCompletePayload) => void;
};

export function useCatInBagTransfer({
  players,
  currentPickerId,
  specialTypeByQuestionId,
  onRegularQuestionSelect,
  onTransferComplete,
}: UseCatInBagTransferArgs) {
  const [isBannerOpen, setIsBannerOpen] = useState(false);
  const [isTransferOpen, setIsTransferOpen] = useAtom(catInBagTransferModalOpenAtom);
  const [, setSelectedAnsweringPlayerId] = useAtom(catInBagSelectedAnsweringPlayerIdAtom);
  const [pendingQuestionId, setPendingQuestionId] = useState<string | null>(null);
  const [pickerId, setPickerId] = useState<string | null>(null);

  const chooser = useMemo(() => {
    if (!pickerId) return null;

    return players.find(player => player.id === pickerId) ?? null;
  }, [pickerId, players]);

  const transferPlayers = useMemo(
    () => players.filter(player => player.id !== pickerId),
    [pickerId, players],
  );

  const handleBannerClose = useCallback(() => {
    setIsBannerOpen(false);
    if (!pendingQuestionId) return;

    setIsTransferOpen(true);
  }, [pendingQuestionId, setIsTransferOpen]);

  const handleTransferPlayerSelect = useCallback((playerId: string) => {
    if (!pendingQuestionId) return;

    setSelectedAnsweringPlayerId(playerId);
    onTransferComplete({
      questionId: pendingQuestionId,
      targetPlayerId: playerId,
    });
    setIsTransferOpen(false);
    setPendingQuestionId(null);
    setPickerId(null);
  }, [onTransferComplete, pendingQuestionId, setIsTransferOpen, setSelectedAnsweringPlayerId]);

  const handleBoardQuestionSelect = useCallback((questionId: string) => {
    if (isBannerOpen || isTransferOpen) return;

    if (specialTypeByQuestionId[questionId] === "catInBag") {
      setSelectedAnsweringPlayerId(null);
      setPendingQuestionId(questionId);
      setPickerId(currentPickerId);
      setIsBannerOpen(true);
      return;
    }

    onRegularQuestionSelect(questionId);
  }, [
    currentPickerId,
    isBannerOpen,
    isTransferOpen,
    onRegularQuestionSelect,
    setSelectedAnsweringPlayerId,
    specialTypeByQuestionId,
  ]);

  return {
    isBannerOpen,
    isTransferOpen,
    chooserName: chooser?.name ?? null,
    transferPlayers,
    handleBoardQuestionSelect,
    handleBannerClose,
    handleTransferPlayerSelect,
  };
}
