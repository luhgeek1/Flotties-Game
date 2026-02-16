import { atom } from "jotai"
import { atomWithStorage } from "jotai/utils"

export type RoundTransitionStep = "score" | "next-round"

const ROUND_TRANSITION_STEP_STORAGE_KEY = "round-transition-step"
const ROUND_TRANSITION_CAROUSEL_INDEX_STORAGE_KEY = "round-transition-carousel-index"

export const roundTransitionStepAtom = atomWithStorage<RoundTransitionStep>(
  ROUND_TRANSITION_STEP_STORAGE_KEY,
  "score",
  undefined,
  { getOnInit: true },
)

export const roundTransitionCarouselIndexAtom = atomWithStorage<number>(
  ROUND_TRANSITION_CAROUSEL_INDEX_STORAGE_KEY,
  0,
  undefined,
  { getOnInit: true },
)

export const resetRoundTransitionStorageAtom = atom(
  null,
  (_get, set) => {
    set(roundTransitionStepAtom, "score")
    set(roundTransitionCarouselIndexAtom, 0)
  },
)
