import { atom } from "jotai";

import {
  gameActiveQuestionIdAtom,
  gameIsExitModalOpenAtom,
  gameOpenedQuestionIdsAtom,
  gamePlayerScoresAtom,
  gameQuestionFlowStateAtom,
  gameRound2StartPickerIdAtom,
  gameRound2UnlockedAtom,
} from "./gameAtoms";
import { resetRoundTransitionStorageAtom } from "./round-transition-storage";
import { setupStepAtom } from "./setupAtoms";
import { resetAuctionStateAtom } from "./specialAuctionAtom";
import { resetRoundSpecialMapsAtom } from "./specialCIBAtom";

export const resetGameRoundStateAtom = atom(
  null,
  (_get, set) => {
    set(gameActiveQuestionIdAtom, null);
    set(gameIsExitModalOpenAtom, false);
    set(gameOpenedQuestionIdsAtom, []);
    set(gameQuestionFlowStateAtom, null);
    set(gameRound2StartPickerIdAtom, null);
    set(resetRoundSpecialMapsAtom);
    set(resetAuctionStateAtom);
  },
);

export const resetGameSessionAtom = atom(
  null,
  (_get, set) => {
    set(resetGameRoundStateAtom);
    set(gamePlayerScoresAtom, {});
    set(gameRound2UnlockedAtom, false);
    set(setupStepAtom, "players");
    set(resetRoundTransitionStorageAtom);
  },
);
