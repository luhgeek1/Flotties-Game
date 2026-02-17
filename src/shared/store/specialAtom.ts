import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";

export type SpecialQuestionType = "catInBag" | "auction";

export type RoundSpecialCell = {
  type: SpecialQuestionType;
  specialQuestionId: string;
};

export type RoundSpecialMap = Record<string, RoundSpecialCell>;
export type RoundSpecialMapsState = Record<string, RoundSpecialMap>;

const ROUND_SPECIAL_MAPS_STORAGE_KEY = "game-round-special-maps";
const CAT_IN_BAG_TRANSFER_MODAL_OPEN_STORAGE_KEY = "game-cat-in-bag-transfer-modal-open";
const CAT_IN_BAG_SELECTED_ANSWERING_PLAYER_ID_STORAGE_KEY = "game-cat-in-bag-selected-answering-player-id";

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

export const catInBagSelectedAnsweringPlayerIdAtom = atomWithStorage<string | null>(
  CAT_IN_BAG_SELECTED_ANSWERING_PLAYER_ID_STORAGE_KEY,
  null,
  undefined,
  { getOnInit: true },
);

export const resetRoundSpecialMapsAtom = atom(
  null,
  (_get, set) => {
    set(roundSpecialMapsAtom, {});
    set(catInBagTransferModalOpenAtom, false);
    set(catInBagSelectedAnsweringPlayerIdAtom, null);
  },
);
