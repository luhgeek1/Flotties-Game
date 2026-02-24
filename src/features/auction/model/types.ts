import type { GameBoardSpecialTypeByQuestionId } from "@/entities/game-board";
import type { AuctionBidByPlayerIdState } from "@/features/auction/store/specialAuctionAtom";

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

export type AuctionEntryGuard = {
  mode: "unavailable" | "limited";
  questionId: string;
  nominal: number;
  eligiblePlayersCount: number;
  excludedPlayersCount: number;
};

export type AuctionStateSlice = {
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

export type AuctionDerivedSlice = {
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

export type UseAuctionActionsArgs = {
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
  entryGuard: AuctionEntryGuard | null;
  setEntryGuard: (value: AuctionEntryGuard | null) => void;
  state: AuctionStateSlice;
  derived: AuctionDerivedSlice;
};
