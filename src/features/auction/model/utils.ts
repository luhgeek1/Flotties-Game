type ResolveMinBidArgs = {
  nominal: number;
  leaderBid: number;
  leaderBalance: number | null;
  currentPlayerBalance: number;
};

export function resolveIsAllInBid(leaderBid: number, leaderBalance: number | null): boolean {
  return leaderBalance !== null && leaderBalance > 0 && leaderBid >= leaderBalance;
}

export function resolveMinBid({
  nominal,
  leaderBid,
  leaderBalance,
  currentPlayerBalance,
}: ResolveMinBidArgs): number | null {
  if (currentPlayerBalance < nominal) return null;
  if (leaderBid <= 0) return nominal;

  if (resolveIsAllInBid(leaderBid, leaderBalance)) {
    return currentPlayerBalance > leaderBid ? currentPlayerBalance : null;
  }

  const minBid = Math.max(nominal, leaderBid + 1);
  if (minBid > currentPlayerBalance) return null;
  return minBid;
}

export function parseBidInput(value: string): number | null {
  const normalized = value.replace(/[^\d]/g, "");
  if (!normalized) return null;

  const parsed = Number.parseInt(normalized, 10);
  if (!Number.isFinite(parsed)) return null;
  return parsed;
}
