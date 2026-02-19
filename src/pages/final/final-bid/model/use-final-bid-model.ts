import { useAtom, useAtomValue } from "jotai";
import { useCallback } from "react";

import { gamePlayerScoresAtom } from "@/shared/store/gameAtoms";
import { finalBidByPlayerIdAtom, finalBidInputByPlayerIdAtom } from "@/shared/store/finalAtom";
import { useFinalPlayerQueue } from "@/pages/final/model/use-final-player-queue";
import { selectedQuestionPackAtom } from "@/shared/store/questionAtom";

type UseFinalBidModelArgs = {
  onConfirmBid?: () => void;
};

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export function useFinalBidModel({ onConfirmBid }: UseFinalBidModelArgs = {}) {
  const selectedPack = useAtomValue(selectedQuestionPackAtom);
  const playerScores = useAtomValue(gamePlayerScoresAtom);
  const [bidInputByPlayerId, setBidInputByPlayerId] = useAtom(finalBidInputByPlayerIdAtom);
  const [bidByPlayerId, setBidByPlayerId] = useAtom(finalBidByPlayerIdAtom);
  const { currentPlayer, setActivePlayerId, advancePlayerIndex } = useFinalPlayerQueue({
    preferActivePlayer: true,
  });

  const currentScore = currentPlayer ? playerScores[currentPlayer.id] ?? 0 : 0;
  const bidInput = currentPlayer ? bidInputByPlayerId[currentPlayer.id] ?? "" : "";
  const parsedBid = Number(bidInput);
  const isBidValid = Number.isFinite(parsedBid) && parsedBid >= 1 && parsedBid <= currentScore;

  const handleBidInputChange = useCallback((nextValue: string) => {
    if (!currentPlayer) return;

    const digitsOnly = nextValue.replace(/[^\d]/g, "");

    setBidInputByPlayerId(prev => ({
      ...prev,
      [currentPlayer.id]: digitsOnly,
    }));
  }, [currentPlayer, setBidInputByPlayerId]);

  const handleConfirmBid = useCallback(() => {
    if (!currentPlayer || !isBidValid) return;

    const normalizedBid = clamp(parsedBid, 1, currentScore);

    setBidByPlayerId(prev => ({
      ...prev,
      [currentPlayer.id]: normalizedBid,
    }));

    setBidInputByPlayerId(prev => ({
      ...prev,
      [currentPlayer.id]: String(normalizedBid),
    }));

    setActivePlayerId(null);
    advancePlayerIndex();

    onConfirmBid?.();
  }, [
    advancePlayerIndex,
    currentPlayer,
    currentScore,
    isBidValid,
    onConfirmBid,
    parsedBid,
    setActivePlayerId,
    setBidByPlayerId,
    setBidInputByPlayerId,
  ]);

  return {
    packTitle: selectedPack.title,
    currentPlayerName: currentPlayer?.name ?? "Игрок",
    currentScore,
    bidInput,
    isConfirmDisabled: !isBidValid,
    savedBid: currentPlayer ? bidByPlayerId[currentPlayer.id] ?? null : null,
    onBidInputChange: handleBidInputChange,
    onConfirmBid: handleConfirmBid,
  };
}
