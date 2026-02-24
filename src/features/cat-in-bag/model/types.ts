export type CatInBagTransferPlayer = {
  id: string;
  name: string;
  score: number;
  avatarUrl: string;
};

export type CatInBagBidCompletePayload = {
  questionId: string;
  targetPlayerId: string;
};

export type CatInBagTransferModalMode = "transfer" | "bid";
