import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";

import type { PlayerId } from "@/entities/players";

export type FinalBidInputByPlayerIdState = Partial<Record<PlayerId, string>>;
export type FinalBidByPlayerIdState = Partial<Record<PlayerId, number>>;
export type FinalAnswerInputByPlayerIdState = Partial<Record<PlayerId, string>>;
export type FinalAnswerByPlayerIdState = Partial<Record<PlayerId, string>>;
export type FinalAnswerTimerState = {
  remainingMs: number;
  isTimeoutModalOpen: boolean;
};
export type FinalAnswerTimerByPlayerIdState = Partial<Record<PlayerId, FinalAnswerTimerState>>;

const FINAL_CURRENT_PLAYER_INDEX_STORAGE_KEY = "final-current-player-index";
const FINAL_ACTIVE_PLAYER_ID_STORAGE_KEY = "final-active-player-id";
const FINAL_BID_INPUT_BY_PLAYER_ID_STORAGE_KEY = "final-bid-input-by-player-id";
const FINAL_BID_BY_PLAYER_ID_STORAGE_KEY = "final-bid-by-player-id";
const FINAL_ANSWER_INPUT_BY_PLAYER_ID_STORAGE_KEY = "final-answer-input-by-player-id";
const FINAL_ANSWER_BY_PLAYER_ID_STORAGE_KEY = "final-answer-by-player-id";
const FINAL_ANSWER_TIMER_BY_PLAYER_ID_STORAGE_KEY = "final-answer-timer-by-player-id";

export const finalCurrentPlayerIndexAtom = atomWithStorage<number>(
  FINAL_CURRENT_PLAYER_INDEX_STORAGE_KEY,
  0,
  undefined,
  { getOnInit: true },
);

export const finalActivePlayerIdAtom = atomWithStorage<PlayerId | null>(
  FINAL_ACTIVE_PLAYER_ID_STORAGE_KEY,
  null,
  undefined,
  { getOnInit: true },
);

export const finalBidInputByPlayerIdAtom = atomWithStorage<FinalBidInputByPlayerIdState>(
  FINAL_BID_INPUT_BY_PLAYER_ID_STORAGE_KEY,
  {},
  undefined,
  { getOnInit: true },
);

export const finalBidByPlayerIdAtom = atomWithStorage<FinalBidByPlayerIdState>(
  FINAL_BID_BY_PLAYER_ID_STORAGE_KEY,
  {},
  undefined,
  { getOnInit: true },
);

export const finalAnswerInputByPlayerIdAtom = atomWithStorage<FinalAnswerInputByPlayerIdState>(
  FINAL_ANSWER_INPUT_BY_PLAYER_ID_STORAGE_KEY,
  {},
  undefined,
  { getOnInit: true },
);

export const finalAnswerByPlayerIdAtom = atomWithStorage<FinalAnswerByPlayerIdState>(
  FINAL_ANSWER_BY_PLAYER_ID_STORAGE_KEY,
  {},
  undefined,
  { getOnInit: true },
);

export const finalAnswerTimerByPlayerIdAtom = atomWithStorage<FinalAnswerTimerByPlayerIdState>(
  FINAL_ANSWER_TIMER_BY_PLAYER_ID_STORAGE_KEY,
  {},
  undefined,
  { getOnInit: true },
);

export const prepareFinalAnswersStageAtom = atom(
  null,
  (_get, set) => {
    set(finalCurrentPlayerIndexAtom, 0);
    set(finalActivePlayerIdAtom, null);
    set(finalAnswerInputByPlayerIdAtom, {});
    set(finalAnswerByPlayerIdAtom, {});
    set(finalAnswerTimerByPlayerIdAtom, {});
  },
);

export const resetFinalStateAtom = atom(
  null,
  (_get, set) => {
    set(finalCurrentPlayerIndexAtom, 0);
    set(finalActivePlayerIdAtom, null);
    set(finalBidInputByPlayerIdAtom, {});
    set(finalBidByPlayerIdAtom, {});
    set(finalAnswerInputByPlayerIdAtom, {});
    set(finalAnswerByPlayerIdAtom, {});
    set(finalAnswerTimerByPlayerIdAtom, {});
  },
);
