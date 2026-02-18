import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";

export type AuctionBidByPlayerIdState = Record<string, number>;
export type AuctionBidByQuestionIdState = Record<string, number>;
export type AuctionWinnerByQuestionIdState = Record<string, string>;

const AUCTION_MODAL_OPEN_STORAGE_KEY = "game-auction-modal-open";
const AUCTION_PENDING_QUESTION_ID_STORAGE_KEY = "game-auction-pending-question-id";
const AUCTION_OPENER_PLAYER_ID_STORAGE_KEY = "game-auction-opener-player-id";
const AUCTION_TURN_CURSOR_STORAGE_KEY = "game-auction-turn-cursor";
const AUCTION_BID_INPUT_STORAGE_KEY = "game-auction-bid-input";
const AUCTION_BIDS_BY_PLAYER_ID_STORAGE_KEY = "game-auction-bids-by-player-id";
const AUCTION_PASSED_PLAYER_IDS_STORAGE_KEY = "game-auction-passed-player-ids";
const AUCTION_WINNING_BID_BY_QUESTION_ID_STORAGE_KEY = "game-auction-winning-bid-by-question-id";
const AUCTION_WINNING_PLAYER_BY_QUESTION_ID_STORAGE_KEY = "game-auction-winning-player-by-question-id";

export const auctionModalOpenAtom = atomWithStorage<boolean>(
  AUCTION_MODAL_OPEN_STORAGE_KEY,
  false,
  undefined,
  { getOnInit: true },
);

export const auctionPendingQuestionIdAtom = atomWithStorage<string | null>(
  AUCTION_PENDING_QUESTION_ID_STORAGE_KEY,
  null,
  undefined,
  { getOnInit: true },
);

export const auctionOpenerPlayerIdAtom = atomWithStorage<string | null>(
  AUCTION_OPENER_PLAYER_ID_STORAGE_KEY,
  null,
  undefined,
  { getOnInit: true },
);

export const auctionTurnCursorAtom = atomWithStorage<number>(
  AUCTION_TURN_CURSOR_STORAGE_KEY,
  0,
  undefined,
  { getOnInit: true },
);

export const auctionBidInputAtom = atomWithStorage<string>(
  AUCTION_BID_INPUT_STORAGE_KEY,
  "",
  undefined,
  { getOnInit: true },
);

export const auctionBidsByPlayerIdAtom = atomWithStorage<AuctionBidByPlayerIdState>(
  AUCTION_BIDS_BY_PLAYER_ID_STORAGE_KEY,
  {},
  undefined,
  { getOnInit: true },
);

export const auctionPassedPlayerIdsAtom = atomWithStorage<string[]>(
  AUCTION_PASSED_PLAYER_IDS_STORAGE_KEY,
  [],
  undefined,
  { getOnInit: true },
);

export const auctionWinningBidByQuestionIdAtom = atomWithStorage<AuctionBidByQuestionIdState>(
  AUCTION_WINNING_BID_BY_QUESTION_ID_STORAGE_KEY,
  {},
  undefined,
  { getOnInit: true },
);

export const auctionWinningPlayerByQuestionIdAtom = atomWithStorage<AuctionWinnerByQuestionIdState>(
  AUCTION_WINNING_PLAYER_BY_QUESTION_ID_STORAGE_KEY,
  {},
  undefined,
  { getOnInit: true },
);

export const resetAuctionFlowAtom = atom(
  null,
  (_get, set) => {
    set(auctionModalOpenAtom, false);
    set(auctionPendingQuestionIdAtom, null);
    set(auctionOpenerPlayerIdAtom, null);
    set(auctionTurnCursorAtom, 0);
    set(auctionBidInputAtom, "");
    set(auctionBidsByPlayerIdAtom, {});
    set(auctionPassedPlayerIdsAtom, []);
  },
);

export const resetAuctionStateAtom = atom(
  null,
  (_get, set) => {
    set(resetAuctionFlowAtom);
    set(auctionWinningBidByQuestionIdAtom, {});
    set(auctionWinningPlayerByQuestionIdAtom, {});
  },
);
