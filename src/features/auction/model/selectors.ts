import type { AuctionBidByPlayerIdState } from "@/features/auction/store/specialAuctionAtom";

import type { AuctionPlayer } from "./types";

type AuctionLeader = {
  playerId: string;
  bid: number;
};

export function resolveAuctionOrderPlayerIds(
  players: readonly AuctionPlayer[],
  openerPlayerId: string,
): string[] {
  const ids = players.map(player => player.id);
  if (ids.length === 0) return [];

  const openerIndex = ids.indexOf(openerPlayerId);
  if (openerIndex < 0) return ids;

  return [...ids.slice(openerIndex), ...ids.slice(0, openerIndex)];
}

export function resolveAuctionLeader(
  players: readonly AuctionPlayer[],
  bidsByPlayerId: AuctionBidByPlayerIdState,
): AuctionLeader | null {
  let leader: AuctionLeader | null = null;

  players.forEach(player => {
    const bid = bidsByPlayerId[player.id] ?? 0;
    if (bid <= 0) return;

    if (!leader || bid > leader.bid) {
      leader = { playerId: player.id, bid };
    }
  });

  return leader;
}

export function resolveAuctionTurnPlayerId(
  orderPlayerIds: readonly string[],
  cursor: number,
  passedPlayerIdSet: ReadonlySet<string>,
): string | null {
  if (orderPlayerIds.length === 0) return null;

  let index = cursor % orderPlayerIds.length;

  for (let attempt = 0; attempt < orderPlayerIds.length; attempt += 1) {
    const id = orderPlayerIds[index];
    if (!passedPlayerIdSet.has(id)) return id;
    index = (index + 1) % orderPlayerIds.length;
  }

  return null;
}

export function resolveNextAuctionCursor(
  orderPlayerIds: readonly string[],
  cursor: number,
  passedPlayerIdSet: ReadonlySet<string>,
): number {
  if (orderPlayerIds.length === 0) return 0;

  let index = (cursor + 1) % orderPlayerIds.length;

  for (let attempt = 0; attempt < orderPlayerIds.length; attempt += 1) {
    if (!passedPlayerIdSet.has(orderPlayerIds[index])) return index;
    index = (index + 1) % orderPlayerIds.length;
  }

  return cursor % orderPlayerIds.length;
}
