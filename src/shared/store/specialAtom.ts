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

export const roundSpecialMapsAtom = atomWithStorage<RoundSpecialMapsState>(
  ROUND_SPECIAL_MAPS_STORAGE_KEY,
  {},
  undefined,
  { getOnInit: true },
);

export const resetRoundSpecialMapsAtom = atom(
  null,
  (_get, set) => {
    set(roundSpecialMapsAtom, {});
  },
);
