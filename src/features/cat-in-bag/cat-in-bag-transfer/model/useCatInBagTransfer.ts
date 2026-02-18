import { useAtom } from "jotai";
import { useCallback, useMemo } from "react";

import type { GameBoardSpecialTypeByQuestionId } from "@/entities/game-board";
import { catInBagBannerOpenAtom } from "@/shared/store/specialBannerAtom";
import {
  catInBagBidByQuestionIdAtom,
  catInBagBidModalOpenAtom,
  catInBagPendingQuestionIdAtom,
  catInBagPickerPlayerIdAtom,
  catInBagSelectedAnsweringPlayerIdAtom,
  catInBagTransferModalOpenAtom,
} from "@/shared/store/specialCIBAtom";

import type { CatInBagBidCompletePayload, CatInBagTransferModalMode, CatInBagTransferPlayer } from "./types";

type UseCatInBagTransferArgs = {
  players: CatInBagTransferPlayer[];
  roundIndex: number;
  currentPickerId: string | null;
  specialTypeByQuestionId: GameBoardSpecialTypeByQuestionId;
  catInBagThemeByQuestionId: Record<string, string>;
  onRegularQuestionSelect: (questionId: string) => void;
  onBidComplete: (payload: CatInBagBidCompletePayload) => void;
};

export function useCatInBagTransfer({
  players,
  roundIndex,
  currentPickerId,
  specialTypeByQuestionId,
  catInBagThemeByQuestionId,
  onRegularQuestionSelect,
  onBidComplete,
}: UseCatInBagTransferArgs) {
  const [isBannerOpen, setIsBannerOpen] = useAtom(catInBagBannerOpenAtom);
  const [isTransferOpen, setIsTransferOpen] = useAtom(catInBagTransferModalOpenAtom);
  const [isBidOpen, setIsBidOpen] = useAtom(catInBagBidModalOpenAtom);
  const [pendingQuestionId, setPendingQuestionId] = useAtom(catInBagPendingQuestionIdAtom);
  const [pickerId, setPickerId] = useAtom(catInBagPickerPlayerIdAtom);
  const [selectedAnsweringPlayerId, setSelectedAnsweringPlayerId] = useAtom(catInBagSelectedAnsweringPlayerIdAtom);
  const [, setBidByQuestionId] = useAtom(catInBagBidByQuestionIdAtom);

  const isTransferModalOpen = isTransferOpen || isBidOpen;

  const chooser = useMemo(() => {
    if (!pickerId) return null;

    return players.find(player => player.id === pickerId) ?? null;
  }, [pickerId, players]);

  const answeringPlayer = useMemo(() => {
    if (!selectedAnsweringPlayerId) return null;

    return players.find(player => player.id === selectedAnsweringPlayerId) ?? null;
  }, [players, selectedAnsweringPlayerId]);

  const transferPlayers = useMemo(
    () => players.filter(player => player.id !== pickerId),
    [pickerId, players],
  );

  const bidOptions = useMemo(
    () => (roundIndex === 0 ? [100, 500] : [200, 1000]),
    [roundIndex],
  );
  const bidQuestionTheme = useMemo(
    () => (pendingQuestionId ? catInBagThemeByQuestionId[pendingQuestionId] ?? null : null),
    [catInBagThemeByQuestionId, pendingQuestionId],
  );

  const modalMode = useMemo<CatInBagTransferModalMode | null>(() => {
    if (isTransferOpen) return "transfer";
    if (isBidOpen) return "bid";
    return null;
  }, [isBidOpen, isTransferOpen]);

  const handleBannerClose = useCallback(() => {
    setIsBannerOpen(false);
    if (!pendingQuestionId) return;

    setIsTransferOpen(true);
  }, [pendingQuestionId, setIsTransferOpen]);

  const handleTransferPlayerSelect = useCallback((playerId: string) => {
    if (!pendingQuestionId) return;
    setSelectedAnsweringPlayerId(playerId);
    setIsTransferOpen(false);
    setIsBidOpen(true);
  }, [pendingQuestionId, setIsBidOpen, setIsTransferOpen, setSelectedAnsweringPlayerId]);

  const handleBidSelect = useCallback((bid: number) => {
    if (!pendingQuestionId || !selectedAnsweringPlayerId) return;

    setBidByQuestionId(prev => ({
      ...prev,
      [pendingQuestionId]: bid,
    }));
    onBidComplete({
      questionId: pendingQuestionId,
      targetPlayerId: selectedAnsweringPlayerId,
      bid,
    });
    setIsTransferOpen(false);
    setIsBidOpen(false);
    setPendingQuestionId(null);
    setPickerId(null);
  }, [
    onBidComplete,
    pendingQuestionId,
    selectedAnsweringPlayerId,
    setBidByQuestionId,
    setIsBidOpen,
    setIsTransferOpen,
    setPendingQuestionId,
    setPickerId,
  ]);

  const handleBoardQuestionSelect = useCallback((questionId: string) => {
    if (isBannerOpen || isTransferModalOpen) return;

    if (specialTypeByQuestionId[questionId] === "catInBag") {
      setIsTransferOpen(false);
      setIsBidOpen(false);
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
    isTransferModalOpen,
    onRegularQuestionSelect,
    setIsBidOpen,
    setIsTransferOpen,
    setPendingQuestionId,
    setPickerId,
    setSelectedAnsweringPlayerId,
    specialTypeByQuestionId,
  ]);

  return {
    isBannerOpen,
    isTransferModalOpen,
    modalMode,
    chooserName: chooser?.name ?? null,
    answeringPlayerName: answeringPlayer?.name ?? null,
    bidQuestionTheme,
    transferPlayers,
    bidOptions,
    handleBoardQuestionSelect,
    handleBannerClose,
    handleTransferPlayerSelect,
    handleBidSelect,
  };
}
