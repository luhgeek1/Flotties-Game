export type CatInBagTransferPlayer = {
  id: string;
  name: string;
  score: number;
  avatarUrl: string;
};

export type CatInBagTransferCompletePayload = {
  questionId: string;
  targetPlayerId: string;
};
