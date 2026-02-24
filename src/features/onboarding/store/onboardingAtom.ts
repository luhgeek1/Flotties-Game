import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import type { GameQuestionPhase } from "@/features/game-session/store/gameAtoms";

const ONBOARDING_STARTED_GAME_STORAGE_KEY = "onboarding-started-game-v1";
const ONBOARDING_STAGE_STORAGE_KEY = "onboarding-stage-v1";
const ONBOARDING_DEMO_STATE_STORAGE_KEY = "onboarding-demo-state-v1";

export const ONBOARDING_DEMO_QUESTION_ID = "demo-1";

export type OnboardingStage = "intro" | "demo" | "post-demo" | "special" | "final";

export type OnboardingDemoState = {
  questionPhase: GameQuestionPhase | null;
  answerInput: string;
};

export function createInitialOnboardingDemoState(): OnboardingDemoState {
  return {
    questionPhase: null,
    answerInput: "",
  };
}

const INITIAL_ONBOARDING_STAGE: OnboardingStage = "intro";
const INITIAL_ONBOARDING_DEMO_STATE = createInitialOnboardingDemoState();

export const onboardingStartedGameAtom = atomWithStorage<boolean>(
  ONBOARDING_STARTED_GAME_STORAGE_KEY,
  false,
  undefined,
  { getOnInit: true },
);

export const onboardingStageAtom = atomWithStorage<OnboardingStage>(
  ONBOARDING_STAGE_STORAGE_KEY,
  INITIAL_ONBOARDING_STAGE,
  undefined,
  { getOnInit: true },
);

export const onboardingDemoStateAtom = atomWithStorage<OnboardingDemoState>(
  ONBOARDING_DEMO_STATE_STORAGE_KEY,
  INITIAL_ONBOARDING_DEMO_STATE,
  undefined,
  { getOnInit: true },
);

export const resetOnboardingDemoStateAtom = atom(
  null,
  (_get, set) => {
    set(onboardingDemoStateAtom, INITIAL_ONBOARDING_DEMO_STATE);
  },
);

export const resetOnboardingSessionStateAtom = atom(
  null,
  (_get, set) => {
    set(onboardingStageAtom, INITIAL_ONBOARDING_STAGE);
    set(onboardingDemoStateAtom, INITIAL_ONBOARDING_DEMO_STATE);
  },
);

export const markOnboardingStartedGameAtom = atom(
  null,
  (_get, set) => {
    set(onboardingStartedGameAtom, true);
    set(resetOnboardingSessionStateAtom);
  },
);
