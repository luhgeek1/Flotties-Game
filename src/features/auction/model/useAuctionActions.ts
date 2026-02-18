import { useCallback } from "react";

import type { GameBoardSpecialTypeByQuestionId } from "@/entities/game-board";
import type { AuctionBidByPlayerIdState } from "@/shared/store/specialAuctionAtom";

import { finalizeAuctionPure } from "./finalize";
import { resolveNextAuctionCursor } from "./selectors";
import type { AuctionBidCompletePayload, AuctionPlayer } from "./types";
import { resolveMinBid } from "./utils";

type UseAuctionActionsArgs = {
  players: readonly AuctionPlayer[];
  currentPickerId: string;
  openerPlayerId: string;
  specialTypeByQuestionId: GameBoardSpecialTypeByQuestionId;
  onNonAuctionQuestionSelect: (questionId: string) => void;
  onAuctionComplete: (payload: AuctionBidCompletePayload) => void;
  isBlocked: boolean;
  isBannerOpen: boolean;
  setIsBannerOpen: (open: boolean) => void;
  state: {
    isModalOpen: boolean;
    setIsModalOpen: (open: boolean) => void;
    pendingQuestionId: string | null;
    setPendingQuestionId: (next: string | null) => void;
    setOpenerPlayerId: (next: string | null) => void;
    setTurnCursor: (update: number | ((prev: number) => number)) => void;
    bidInput: string;
    setBidInput: (value: string) => void;
    bidsByPlayerId: AuctionBidByPlayerIdState;
    setBidsByPlayerId: (
      update:
        | AuctionBidByPlayerIdState
        | ((prev: AuctionBidByPlayerIdState) => AuctionBidByPlayerIdState),
    ) => void;
    passedPlayerIds: string[];
    setPassedPlayerIds: (update: string[] | ((prev: string[]) => string[])) => void;
    setWinningBidByQuestionId: (update: (prev: Record<string, number>) => Record<string, number>) => void;
    setWinningPlayerByQuestionId: (update: (prev: Record<string, string>) => Record<string, string>) => void;
    resetFlow: () => void;
  };
  derived: {
    nominal: number;
    orderPlayerIds: string[];
    passedPlayerIdSet: ReadonlySet<string>;
    turnPlayerId: string | null;
    turnPlayerBalance: number;
    leaderBid: number;
    leaderBalance: number | null;
    isLeaderAllIn: boolean;
    minBid: number | null;
    parsedBidInput: number | null;
    isInputBidValid: boolean;
  };
};

export function useAuctionActions({
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
}: UseAuctionActionsArgs) {
  const { isModalOpen, pendingQuestionId, setIsModalOpen, setTurnCursor } = state;

  const finalizeAuction = ({
    questionId,
    bidsByPlayerId,
    passedPlayerIds,
  }: {
    questionId: string;
    bidsByPlayerId: AuctionBidByPlayerIdState;
    passedPlayerIds: string[];
  }) => {
    const result = finalizeAuctionPure({
      players,
      orderPlayerIds: derived.orderPlayerIds,
      openerPlayerId,
      nominal: derived.nominal,
      bidsByPlayerId,
      passedPlayerIds,
    });

    state.setWinningBidByQuestionId(prev => ({ ...prev, [questionId]: result.winningBid }));
    state.setWinningPlayerByQuestionId(prev => ({ ...prev, [questionId]: result.winnerId }));

    state.resetFlow();
    onAuctionComplete({ questionId, targetPlayerId: result.winnerId, bid: result.winningBid });
  };

  const advanceTurn = (nextPassedIds: string[]) => {
    const nextPassedSet = new Set(nextPassedIds);
    state.setTurnCursor(prev => resolveNextAuctionCursor(derived.orderPlayerIds, prev, nextPassedSet));
  };

  const placeBid = (bid: number) => {
    const turnPlayerId = derived.turnPlayerId;
    if (!turnPlayerId) return;
    if (!state.pendingQuestionId) return;

    const minAllowed = resolveMinBid({
      nominal: derived.nominal,
      leaderBid: derived.leaderBid,
      leaderBalance: derived.leaderBalance,
      currentPlayerBalance: derived.turnPlayerBalance,
    });

    if (minAllowed === null) return;
    if (bid < minAllowed) return;
    if (bid > derived.turnPlayerBalance) return;
    if (derived.isLeaderAllIn && bid !== derived.turnPlayerBalance) return;

    state.setBidsByPlayerId(prev => ({
      ...prev,
      [turnPlayerId]: bid,
    }));

    state.setBidInput("");
    advanceTurn(state.passedPlayerIds);
  };

  const handlePass = () => {
    const turnPlayerId = derived.turnPlayerId;
    if (!turnPlayerId) return;
    if (!state.pendingQuestionId) return;

    const nextPassedIds = derived.passedPlayerIdSet.has(turnPlayerId)
      ? state.passedPlayerIds
      : [...state.passedPlayerIds, turnPlayerId];

    const bidsSnapshot = state.bidsByPlayerId[turnPlayerId]
      ? (() => {
        const next = { ...state.bidsByPlayerId };
        delete next[turnPlayerId];
        return next;
      })()
      : state.bidsByPlayerId;

    state.setPassedPlayerIds(nextPassedIds);
    state.setBidsByPlayerId(bidsSnapshot);
    state.setBidInput("");

    const nextPassedSet = new Set(nextPassedIds);
    const remainingIds = derived.orderPlayerIds.filter(id => !nextPassedSet.has(id));

    if (remainingIds.length <= 1) {
      finalizeAuction({
        questionId: state.pendingQuestionId,
        bidsByPlayerId: bidsSnapshot,
        passedPlayerIds: nextPassedIds,
      });
      return;
    }

    advanceTurn(nextPassedIds);
  };

  const handleSubmitBid = () => {
    if (!derived.isInputBidValid || derived.parsedBidInput === null) return;
    placeBid(derived.parsedBidInput);
  };

  const handleMinBid = () => {
    if (derived.minBid === null) return;
    placeBid(derived.minBid);
  };

  const handleAllIn = () => {
    if (!derived.turnPlayerId) return;
    if (derived.turnPlayerBalance <= 0) return;
    placeBid(derived.turnPlayerBalance);
  };

  const handleBidInputChange = (value: string) => {
    state.setBidInput(value);
  };

  const handleBoardQuestionSelect = (questionId: string) => {
    if (isBlocked) return;
    if (isBannerOpen || isModalOpen) return;

    if (specialTypeByQuestionId[questionId] === "auction") {
      state.setPendingQuestionId(questionId);
      state.setOpenerPlayerId(currentPickerId);
      state.setTurnCursor(0);
      state.setBidInput("");
      state.setBidsByPlayerId({});
      state.setPassedPlayerIds([]);
      state.setIsModalOpen(false);
      setIsBannerOpen(true);
      return;
    }

    onNonAuctionQuestionSelect(questionId);
  };

  const handleBannerClose = useCallback(() => {
    setIsBannerOpen(false);
    if (!pendingQuestionId) return;

    setIsModalOpen(true);
    setTurnCursor(0);
  }, [pendingQuestionId, setIsBannerOpen, setIsModalOpen, setTurnCursor]);

  return {
    placeBid,
    handlePass,
    handleSubmitBid,
    handleMinBid,
    handleAllIn,
    handleBidInputChange,
    handleBoardQuestionSelect,
    handleBannerClose,
  };
}
