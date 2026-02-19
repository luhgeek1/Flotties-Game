import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";

import type { PlayerId } from "@/entities/players";

export type FinalResultsPlayerState = {
  id: PlayerId;
  name: string;
  wager: number;
  answer: string;
  isCorrect: boolean;
  initialScore: number;
  finalScore: number;
  isRevealed: boolean;
};

export type FinalResultsState = {
  sourceKey: string | null;
  players: FinalResultsPlayerState[];
  isSorting: boolean;
  showControls: boolean;
  isCompleted: boolean;
};

const FINAL_RESULTS_STORAGE_KEY = "final-results-state";

function createInitialFinalResultsState(): FinalResultsState {
  return {
    sourceKey: null,
    players: [],
    isSorting: false,
    showControls: false,
    isCompleted: false,
  };
}

export const finalResultsStateAtom = atomWithStorage<FinalResultsState>(
  FINAL_RESULTS_STORAGE_KEY,
  createInitialFinalResultsState(),
  undefined,
  { getOnInit: true },
);

export const resetFinalResultsStateAtom = atom(
  null,
  (_get, set) => {
    set(finalResultsStateAtom, createInitialFinalResultsState());
  },
);
