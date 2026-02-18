import { useState } from "react";

import type { GameBoardSpecialTypeByQuestionId } from "@/entities/game-board";

import { useAuctionActions } from "./useAuctionActions";
import { useAuctionDerived } from "./useAuctionDerived";
import { useAuctionState } from "./useAuctionState";
import type { AuctionBidCompletePayload, AuctionPlayer } from "./types";

type UseAuctionInteractionArgs = {
  players: AuctionPlayer[];
  currentPickerId: string;
  specialTypeByQuestionId: GameBoardSpecialTypeByQuestionId;
  getQuestionNominal: (questionId: string) => number;
  onNonAuctionQuestionSelect: (questionId: string) => void;
  onAuctionComplete: (payload: AuctionBidCompletePayload) => void;
  isBlocked?: boolean;
};

export function useAuctionInteraction({
  players,
  currentPickerId,
  specialTypeByQuestionId,
  getQuestionNominal,
  onNonAuctionQuestionSelect,
  onAuctionComplete,
  isBlocked = false,
}: UseAuctionInteractionArgs) {
  const [isBannerOpen, setIsBannerOpen] = useState(false);

  const state = useAuctionState();
  const openerPlayerId = state.openerPlayerId ?? currentPickerId;

  const derived = useAuctionDerived({
    players,
    pendingQuestionId: state.pendingQuestionId,
    getQuestionNominal,
    openerPlayerId,
    turnCursor: state.turnCursor,
    bidInput: state.bidInput,
    bidsByPlayerId: state.bidsByPlayerId,
    passedPlayerIds: state.passedPlayerIds,
  });

  const actions = useAuctionActions({
    players,
    currentPickerId,
    openerPlayerId,
    specialTypeByQuestionId,
    onNonAuctionQuestionSelect,
    onAuctionComplete,
    isBlocked,
    isBannerOpen,
    setIsBannerOpen,
    state,
    derived,
  });

  return {
    isBannerOpen,
    isModalOpen: state.isModalOpen,
    nominal: derived.nominal,
    currentBid: derived.currentBid,
    leaderPlayerId: derived.leaderPlayerId,
    players,
    turnPlayerId: derived.turnPlayerId,
    turnPlayerName: derived.turnPlayerName,
    turnPlayerBalance: derived.turnPlayerBalance,
    bidInput: state.bidInput,
    minBid: derived.minBid,
    passedPlayerIds: state.passedPlayerIds,
    isInputBidValid: derived.isInputBidValid,
    handleBoardQuestionSelect: actions.handleBoardQuestionSelect,
    handleBannerClose: actions.handleBannerClose,
    handleBidInputChange: actions.handleBidInputChange,
    handleSubmitBid: actions.handleSubmitBid,
    handleMinBid: actions.handleMinBid,
    handleAllIn: actions.handleAllIn,
    handlePass: actions.handlePass,
  };
}
