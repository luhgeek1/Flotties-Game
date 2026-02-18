import { useMemo } from "react";

import { resolveAuctionLeader, resolveAuctionOrderPlayerIds, resolveAuctionTurnPlayerId } from "./selectors";
import type { AuctionPlayer } from "./types";
import { parseBidInput, resolveIsAllInBid, resolveMinBid } from "./utils";

type UseAuctionDerivedArgs = {
  players: readonly AuctionPlayer[];
  pendingQuestionId: string | null;
  getQuestionNominal: (questionId: string) => number;
  openerPlayerId: string;
  turnCursor: number;
  bidInput: string;
  bidsByPlayerId: Record<string, number>;
  passedPlayerIds: readonly string[];
};

export function useAuctionDerived({
  players,
  pendingQuestionId,
  getQuestionNominal,
  openerPlayerId,
  turnCursor,
  bidInput,
  bidsByPlayerId,
  passedPlayerIds,
}: UseAuctionDerivedArgs) {
  const nominal = useMemo(
    () => (pendingQuestionId ? getQuestionNominal(pendingQuestionId) : 0),
    [getQuestionNominal, pendingQuestionId],
  );

  const orderPlayerIds = useMemo(
    () => resolveAuctionOrderPlayerIds(players, openerPlayerId),
    [openerPlayerId, players],
  );

  const passedPlayerIdSet = useMemo(
    () => new Set(passedPlayerIds),
    [passedPlayerIds],
  );

  const turnPlayerId = useMemo(
    () => resolveAuctionTurnPlayerId(orderPlayerIds, turnCursor, passedPlayerIdSet),
    [orderPlayerIds, passedPlayerIdSet, turnCursor],
  );

  const turnPlayer = useMemo(
    () => players.find(player => player.id === turnPlayerId) ?? null,
    [players, turnPlayerId],
  );

  const turnPlayerBalance = Math.max(0, turnPlayer?.score ?? 0);

  const leader = useMemo(
    () => resolveAuctionLeader(players, bidsByPlayerId),
    [bidsByPlayerId, players],
  );

  const leaderPlayerId = leader?.playerId ?? null;
  const leaderBid = leader?.bid ?? 0;

  const leaderPlayer = useMemo(
    () => (leaderPlayerId ? players.find(player => player.id === leaderPlayerId) ?? null : null),
    [leaderPlayerId, players],
  );

  const leaderBalance = leaderPlayer ? Math.max(0, leaderPlayer.score) : null;

  const isLeaderAllIn = useMemo(
    () => resolveIsAllInBid(leaderBid, leaderBalance),
    [leaderBalance, leaderBid],
  );

  const minBid = useMemo(
    () => (pendingQuestionId ? resolveMinBid({
      nominal,
      leaderBid,
      leaderBalance,
      currentPlayerBalance: turnPlayerBalance,
    }) : null),
    [leaderBalance, leaderBid, nominal, pendingQuestionId, turnPlayerBalance],
  );

  const parsedBidInput = useMemo(
    () => parseBidInput(bidInput),
    [bidInput],
  );

  const isInputBidValid = useMemo(() => {
    if (!pendingQuestionId) return false;
    if (!turnPlayerId) return false;
    if (minBid === null) return false;
    if (parsedBidInput === null) return false;
    if (parsedBidInput < minBid) return false;
    if (parsedBidInput > turnPlayerBalance) return false;
    if (isLeaderAllIn && parsedBidInput !== turnPlayerBalance) return false;
    return true;
  }, [isLeaderAllIn, minBid, parsedBidInput, pendingQuestionId, turnPlayerBalance, turnPlayerId]);

  return {
    nominal,
    orderPlayerIds,
    passedPlayerIdSet,
    turnPlayerId,
    turnPlayerName: turnPlayer?.name ?? null,
    turnPlayerBalance,
    leaderPlayerId,
    leaderBid,
    leaderBalance,
    currentBid: leaderBid > 0 ? leaderBid : null,
    minBid,
    parsedBidInput,
    isLeaderAllIn,
    isInputBidValid,
  };
}
