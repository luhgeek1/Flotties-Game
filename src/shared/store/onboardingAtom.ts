import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";

const ONBOARDING_STARTED_GAME_STORAGE_KEY = "onboarding-started-game-v1";

export const onboardingStartedGameAtom = atomWithStorage<boolean>(
  ONBOARDING_STARTED_GAME_STORAGE_KEY,
  false,
  undefined,
  { getOnInit: true },
);

export const markOnboardingStartedGameAtom = atom(
  null,
  (_get, set) => {
    set(onboardingStartedGameAtom, true);
  },
);
