import { useAtom } from "jotai";
import { useMemo, useState } from "react";

import type { GameBoardSpecialTypeByQuestionId } from "@/entities/game-board";
import { auctionBannerOpenAtom } from "@/features/special-banner/store/specialBannerAtom";

import { useAuctionActions } from "./useAuctionActions";
import { useAuctionDerived } from "./useAuctionDerived";
import { useAuctionState } from "./useAuctionState";
import type { AuctionBidCompletePayload, AuctionEntryGuard, AuctionPlayer } from "./types";

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
  const [isBannerOpen, setIsBannerOpen] = useAtom(auctionBannerOpenAtom);
  const [isEntryGuardModalOpen, setIsEntryGuardModalOpen] = useState(false);
  const [entryGuard, setEntryGuard] = useState<AuctionEntryGuard | null>(null);

  const state = useAuctionState();
  const pendingNominal = useMemo(
    () => (state.pendingQuestionId ? getQuestionNominal(state.pendingQuestionId) : 0),
    [getQuestionNominal, state.pendingQuestionId],
  );
  const eligiblePlayers = useMemo(() => (
    state.pendingQuestionId
      ? players.filter(player => player.score >= pendingNominal)
      : players
  ), [pendingNominal, players, state.pendingQuestionId]);
  const openerPlayerId = state.openerPlayerId ?? currentPickerId;
  const isSinglePlayerMode = state.isModalOpen && eligiblePlayers.length === 1;
  const excludedPlayersCount = state.pendingQuestionId
    ? Math.max(0, players.length - eligiblePlayers.length)
    : 0;

  const derived = useAuctionDerived({
    players: eligiblePlayers,
    pendingQuestionId: state.pendingQuestionId,
    getQuestionNominal,
    openerPlayerId,
    turnCursor: state.turnCursor,
    bidInput: state.bidInput,
    bidsByPlayerId: state.bidsByPlayerId,
    passedPlayerIds: state.passedPlayerIds,
  });

  const actions = useAuctionActions({
    players: eligiblePlayers,
    currentPickerId,
    openerPlayerId,
    specialTypeByQuestionId,
    getQuestionNominal,
    onNonAuctionQuestionSelect,
    onAuctionComplete,
    isBlocked,
    isBannerOpen,
    isEntryGuardModalOpen,
    setIsBannerOpen,
    setIsEntryGuardModalOpen,
    entryGuard,
    setEntryGuard,
    state,
    derived,
  });

  return {
    isBannerOpen,
    isModalOpen: state.isModalOpen,
    isEntryGuardModalOpen,
    entryGuardMode: entryGuard?.mode ?? null,
    entryGuardNominal: entryGuard?.nominal ?? null,
    entryGuardEligiblePlayersCount: entryGuard?.eligiblePlayersCount ?? 0,
    entryGuardExcludedPlayersCount: entryGuard?.excludedPlayersCount ?? 0,
    nominal: derived.nominal,
    currentBid: derived.currentBid,
    leaderPlayerId: derived.leaderPlayerId,
    players: eligiblePlayers,
    isSinglePlayerMode,
    excludedPlayersCount,
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
    handleEntryGuardContinue: actions.handleEntryGuardContinue,
  };
}
