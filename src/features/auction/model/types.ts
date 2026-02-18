export type AuctionPlayer = {
  id: string;
  name: string;
  score: number;
  avatarUrl: string;
};

export type AuctionBidCompletePayload = {
  questionId: string;
  targetPlayerId: string;
  bid: number;
};

