import type { AuctionBidByPlayerIdState } from "@/shared/store/specialAuctionAtom";

import { resolveAuctionLeader } from "./selectors";
import type { AuctionPlayer } from "./types";

type FinalizeAuctionArgs = {
  players: readonly AuctionPlayer[];
  orderPlayerIds: readonly string[];
  openerPlayerId: string;
  nominal: number;
  bidsByPlayerId: AuctionBidByPlayerIdState;
  passedPlayerIds: readonly string[];
};

type FinalizeAuctionResult = {
  winnerId: string;
  winningBid: number;
};

export function finalizeAuctionPure({
  players,
  orderPlayerIds,
  openerPlayerId,
  nominal,
  bidsByPlayerId,
  passedPlayerIds,
}: FinalizeAuctionArgs): FinalizeAuctionResult {
  const passedSet = new Set(passedPlayerIds);
  const eligiblePlayers = players.filter(player => !passedSet.has(player.id));
  const leader = resolveAuctionLeader(eligiblePlayers, bidsByPlayerId);
  const activeIds = orderPlayerIds.filter(id => !passedSet.has(id));

  const winnerId = leader?.playerId ?? activeIds[0] ?? openerPlayerId;

  return {
    winnerId,
    winningBid: leader?.bid ?? nominal,
  };
}
