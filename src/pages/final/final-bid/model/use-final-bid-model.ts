import { useAtom, useAtomValue } from "jotai";
import { useCallback, useMemo } from "react";

import { gamePlayerScoresAtom } from "@/features/game-session/store/gameAtoms";
import { finalBidByPlayerIdAtom, finalBidInputByPlayerIdAtom } from "@/features/game-session/store/finalAtom";
import { useFinalPlayerQueue } from "@/pages/final/model/useFinalPlayerQueue";
import { selectedQuestionPackAtom } from "@/features/game-session/store/questionAtom";

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
  const { playersQueue, currentPlayer, setActivePlayerId, advancePlayerIndex } = useFinalPlayerQueue({
    preferActivePlayer: true,
  });

  const currentScore = currentPlayer ? playerScores[currentPlayer.id] ?? 0 : 0;
  const bidInput = currentPlayer ? bidInputByPlayerId[currentPlayer.id] ?? "" : "";
  const parsedBid = Number(bidInput);
  const isBidValid = Number.isFinite(parsedBid) && parsedBid >= 1 && parsedBid <= currentScore;
  const submittedBidsCount = useMemo(
    () => playersQueue.reduce((count, player) => (bidByPlayerId[player.id] ? count + 1 : count), 0),
    [bidByPlayerId, playersQueue],
  );
  const isAllPlayersBidDone = playersQueue.length > 0 && submittedBidsCount >= playersQueue.length;

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
    const isCurrentPlayerAlreadySubmitted = Boolean(bidByPlayerId[currentPlayer.id]);
    const nextSubmittedBidsCount = submittedBidsCount + (isCurrentPlayerAlreadySubmitted ? 0 : 1);
    const willCompleteAllBids = playersQueue.length > 0 && nextSubmittedBidsCount >= playersQueue.length;

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

    if (!willCompleteAllBids) {
      onConfirmBid?.();
    }
  }, [
    advancePlayerIndex,
    bidByPlayerId,
    currentPlayer,
    currentScore,
    isBidValid,
    onConfirmBid,
    parsedBid,
    playersQueue.length,
    setActivePlayerId,
    setBidByPlayerId,
    setBidInputByPlayerId,
    submittedBidsCount,
  ]);

  return {
    packTitle: selectedPack.title,
    currentPlayerName: currentPlayer?.name ?? "Игрок",
    currentScore,
    bidInput,
    isConfirmDisabled: !isBidValid,
    isAllPlayersBidDone,
    savedBid: currentPlayer ? bidByPlayerId[currentPlayer.id] ?? null : null,
    submittedBidsCount,
    totalPlayersCount: playersQueue.length,
    onBidInputChange: handleBidInputChange,
    onConfirmBid: handleConfirmBid,
  };
}
