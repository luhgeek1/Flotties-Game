import { atom } from "jotai";

import {
  gameActiveQuestionIdAtom,
  gameIsExitModalOpenAtom,
  gameOpenedQuestionIdsAtom,
  gamePlayerScoresAtom,
  gameQuestionFlowStateAtom,
  gameRoundFirstPickDoneAtom,
  gameRound2StartPickerIdAtom,
  gameRound2UnlockedAtom,
} from "./gameAtoms";
import { resetFinalStateAtom } from "./finalAtom";
import { resetFinalResultsStateAtom } from "./finalResultsAtom";
import { resetRoundTransitionStorageAtom } from "@/features/round-transition/store/round-transition-storage";
import { setupStepAtom } from "./setupAtoms";
import { resetAuctionStateAtom } from "@/features/auction/store/specialAuctionAtom";
import { resetRoundSpecialMapsAtom } from "@/features/cat-in-bag/store/specialCIBAtom";

export const resetGameRoundStateAtom = atom(
  null,
  (_get, set) => {
    set(gameActiveQuestionIdAtom, null);
    set(gameIsExitModalOpenAtom, false);
    set(gameOpenedQuestionIdsAtom, []);
    set(gameQuestionFlowStateAtom, null);
    set(gameRound2StartPickerIdAtom, null);
    set(gameRoundFirstPickDoneAtom, false);
    set(resetRoundSpecialMapsAtom);
    set(resetAuctionStateAtom);
    set(resetFinalStateAtom);
    set(resetFinalResultsStateAtom);
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
