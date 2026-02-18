import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";

import { catInBagBannerOpenAtom } from "./specialBannerAtom";

export type SpecialQuestionType = "catInBag" | "auction";

export type RoundSpecialCell = {
  type: SpecialQuestionType;
  specialQuestionId: string;
};

export type RoundSpecialMap = Record<string, RoundSpecialCell>;
export type RoundSpecialMapsState = Record<string, RoundSpecialMap>;
export type CatInBagBidByQuestionIdState = Record<string, number>;

const ROUND_SPECIAL_MAPS_STORAGE_KEY = "game-round-special-maps";
const CAT_IN_BAG_TRANSFER_MODAL_OPEN_STORAGE_KEY = "game-cat-in-bag-transfer-modal-open";
const CAT_IN_BAG_BID_MODAL_OPEN_STORAGE_KEY = "game-cat-in-bag-bid-modal-open";
const CAT_IN_BAG_PENDING_QUESTION_ID_STORAGE_KEY = "game-cat-in-bag-pending-question-id";
const CAT_IN_BAG_PICKER_PLAYER_ID_STORAGE_KEY = "game-cat-in-bag-picker-player-id";
const CAT_IN_BAG_SELECTED_ANSWERING_PLAYER_ID_STORAGE_KEY = "game-cat-in-bag-selected-answering-player-id";
const CAT_IN_BAG_BID_BY_QUESTION_ID_STORAGE_KEY = "game-cat-in-bag-bid-by-question-id";

export const roundSpecialMapsAtom = atomWithStorage<RoundSpecialMapsState>(
  ROUND_SPECIAL_MAPS_STORAGE_KEY,
  {},
  undefined,
  { getOnInit: true },
);

export const catInBagTransferModalOpenAtom = atomWithStorage<boolean>(
  CAT_IN_BAG_TRANSFER_MODAL_OPEN_STORAGE_KEY,
  false,
  undefined,
  { getOnInit: true },
);

export const catInBagBidModalOpenAtom = atomWithStorage<boolean>(
  CAT_IN_BAG_BID_MODAL_OPEN_STORAGE_KEY,
  false,
  undefined,
  { getOnInit: true },
);

export const catInBagPendingQuestionIdAtom = atomWithStorage<string | null>(
  CAT_IN_BAG_PENDING_QUESTION_ID_STORAGE_KEY,
  null,
  undefined,
  { getOnInit: true },
);

export const catInBagPickerPlayerIdAtom = atomWithStorage<string | null>(
  CAT_IN_BAG_PICKER_PLAYER_ID_STORAGE_KEY,
  null,
  undefined,
  { getOnInit: true },
);

export const catInBagSelectedAnsweringPlayerIdAtom = atomWithStorage<string | null>(
  CAT_IN_BAG_SELECTED_ANSWERING_PLAYER_ID_STORAGE_KEY,
  null,
  undefined,
  { getOnInit: true },
);

export const catInBagBidByQuestionIdAtom = atomWithStorage<CatInBagBidByQuestionIdState>(
  CAT_IN_BAG_BID_BY_QUESTION_ID_STORAGE_KEY,
  {},
  undefined,
  { getOnInit: true },
);

export const resetRoundSpecialMapsAtom = atom(
  null,
  (_get, set) => {
    set(roundSpecialMapsAtom, {});
    set(catInBagBannerOpenAtom, false);
    set(catInBagTransferModalOpenAtom, false);
    set(catInBagBidModalOpenAtom, false);
    set(catInBagPendingQuestionIdAtom, null);
    set(catInBagPickerPlayerIdAtom, null);
    set(catInBagSelectedAnsweringPlayerIdAtom, null);
    set(catInBagBidByQuestionIdAtom, {});
  },
);
