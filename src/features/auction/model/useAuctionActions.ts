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
  getQuestionNominal: (questionId: string) => number;
  onNonAuctionQuestionSelect: (questionId: string) => void;
  onAuctionComplete: (payload: AuctionBidCompletePayload) => void;
  isBlocked: boolean;
  isBannerOpen: boolean;
  isEntryGuardModalOpen: boolean;
  setIsBannerOpen: (open: boolean) => void;
  setIsEntryGuardModalOpen: (open: boolean) => void;
  entryGuard: {
    mode: "unavailable" | "limited";
    questionId: string;
    nominal: number;
    eligiblePlayersCount: number;
    excludedPlayersCount: number;
  } | null;
  setEntryGuard: (value: {
    mode: "unavailable" | "limited";
    questionId: string;
    nominal: number;
    eligiblePlayersCount: number;
    excludedPlayersCount: number;
  } | null) => void;
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
    const questionId = state.pendingQuestionId;
    if (!turnPlayerId) return;
    if (!questionId) return;

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

    const nextBidsByPlayerId = {
      ...state.bidsByPlayerId,
      [turnPlayerId]: bid,
    };
    state.setBidsByPlayerId(nextBidsByPlayerId);
    state.setBidInput("");

    if (derived.orderPlayerIds.length <= 1) {
      finalizeAuction({
        questionId,
        bidsByPlayerId: nextBidsByPlayerId,
        passedPlayerIds: state.passedPlayerIds,
      });
      return;
    }

    advanceTurn(state.passedPlayerIds);
  };

  const handlePass = () => {
    if (derived.orderPlayerIds.length <= 1) return;

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
    if (isBannerOpen || isModalOpen || isEntryGuardModalOpen) return;

    if (specialTypeByQuestionId[questionId] === "auction") {
      const nominal = getQuestionNominal(questionId);
      const eligiblePlayers = players.filter(player => player.score >= nominal);
      const excludedPlayersCount = Math.max(0, players.length - eligiblePlayers.length);
      const eligiblePlayersCount = eligiblePlayers.length;

      state.setPendingQuestionId(questionId);
      state.setOpenerPlayerId(currentPickerId);
      state.setTurnCursor(0);
      state.setBidInput("");
      state.setBidsByPlayerId({});
      state.setPassedPlayerIds([]);
      state.setIsModalOpen(false);
      setIsEntryGuardModalOpen(false);

      if (eligiblePlayersCount === 0) {
        setEntryGuard({
          mode: "unavailable",
          questionId,
          nominal,
          eligiblePlayersCount,
          excludedPlayersCount,
        });
      } else if (eligiblePlayersCount <= 2 && excludedPlayersCount > 0) {
        setEntryGuard({
          mode: "limited",
          questionId,
          nominal,
          eligiblePlayersCount,
          excludedPlayersCount,
        });
      } else {
        setEntryGuard(null);
      }

      const auctionOpenerPlayerId = eligiblePlayersCount > 0 && !eligiblePlayers.some(player => player.id === currentPickerId)
        ? eligiblePlayers[0].id
        : currentPickerId;
      state.setOpenerPlayerId(auctionOpenerPlayerId);

      setIsBannerOpen(true);
      return;
    }

    setEntryGuard(null);
    setIsEntryGuardModalOpen(false);
    onNonAuctionQuestionSelect(questionId);
  };

  const handleBannerClose = useCallback(() => {
    setIsBannerOpen(false);
    if (!pendingQuestionId) return;

    if (entryGuard?.questionId === pendingQuestionId) {
      setIsEntryGuardModalOpen(true);
      return;
    }

    setIsModalOpen(true);
    setTurnCursor(0);
  }, [
    entryGuard,
    pendingQuestionId,
    setIsBannerOpen,
    setIsEntryGuardModalOpen,
    setIsModalOpen,
    setTurnCursor,
  ]);

  const handleEntryGuardContinue = useCallback(() => {
    if (!entryGuard) return;

    setIsEntryGuardModalOpen(false);

    if (entryGuard.mode === "unavailable") {
      state.setWinningBidByQuestionId(prev => ({ ...prev, [entryGuard.questionId]: entryGuard.nominal }));
      state.setWinningPlayerByQuestionId(prev => {
        const next = { ...prev };
        delete next[entryGuard.questionId];
        return next;
      });
      setEntryGuard(null);
      state.resetFlow();
      onNonAuctionQuestionSelect(entryGuard.questionId);
      return;
    }

    setEntryGuard(null);
    setIsModalOpen(true);
    setTurnCursor(0);
  }, [
    entryGuard,
    onNonAuctionQuestionSelect,
    setEntryGuard,
    setIsEntryGuardModalOpen,
    setIsModalOpen,
    setTurnCursor,
    state,
  ]);

  return {
    placeBid,
    handlePass,
    handleSubmitBid,
    handleMinBid,
    handleAllIn,
    handleBidInputChange,
    handleBoardQuestionSelect,
    handleBannerClose,
    handleEntryGuardContinue,
  };
}
