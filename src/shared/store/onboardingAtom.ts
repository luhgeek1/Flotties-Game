import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import type { GamePlayerScores, GameQuestionFlowState } from "./gameAtoms";

const ONBOARDING_STARTED_GAME_STORAGE_KEY = "onboarding-started-game-v1";
const ONBOARDING_SESSION_STORAGE_KEY = "onboarding-session-v1";

export const ONBOARDING_DEMO_QUESTION_ID = "r1-langs-100";
const ONBOARDING_DEMO_PLAYER_IDS = [
  "onboarding-p1",
  "onboarding-p2",
  "onboarding-p3",
];

export type OnboardingStage = "intro" | "demo" | "post-demo" | "special" | "final";

export type OnboardingDemoState = {
  activeQuestionId: string | null;
  openedQuestionIds: string[];
  questionFlowState: GameQuestionFlowState | null;
  playerScores: GamePlayerScores;
};

export type OnboardingSessionState = {
  stage: OnboardingStage;
  demo: OnboardingDemoState;
};

function buildInitialOnboardingDemoScores(): GamePlayerScores {
  return ONBOARDING_DEMO_PLAYER_IDS.reduce<GamePlayerScores>((acc, playerId) => {
    acc[playerId] = 0;
    return acc;
  }, {});
}

export function createInitialOnboardingDemoState(): OnboardingDemoState {
  return {
    activeQuestionId: null,
    openedQuestionIds: [],
    questionFlowState: null,
    playerScores: buildInitialOnboardingDemoScores(),
  };
}

export function createInitialOnboardingSessionState(): OnboardingSessionState {
  return {
    stage: "intro",
    demo: createInitialOnboardingDemoState(),
  };
}

const INITIAL_ONBOARDING_SESSION_STATE = createInitialOnboardingSessionState();

export const onboardingStartedGameAtom = atomWithStorage<boolean>(
  ONBOARDING_STARTED_GAME_STORAGE_KEY,
  false,
  undefined,
  { getOnInit: true },
);

export const onboardingSessionAtom = atomWithStorage<OnboardingSessionState>(
  ONBOARDING_SESSION_STORAGE_KEY,
  INITIAL_ONBOARDING_SESSION_STATE,
  undefined,
  { getOnInit: true },
);

export const onboardingStageAtom = atom(
  get => get(onboardingSessionAtom).stage,
  (get, set, stage: OnboardingStage) => {
    set(onboardingSessionAtom, {
      ...get(onboardingSessionAtom),
      stage,
    });
  },
);

export const onboardingDemoStateAtom = atom(
  get => get(onboardingSessionAtom).demo,
  (get, set, nextDemoState: OnboardingDemoState | ((prev: OnboardingDemoState) => OnboardingDemoState)) => {
    const prevSessionState = get(onboardingSessionAtom);
    const resolvedDemoState = typeof nextDemoState === "function"
      ? nextDemoState(prevSessionState.demo)
      : nextDemoState;

    set(onboardingSessionAtom, {
      ...prevSessionState,
      demo: resolvedDemoState,
    });
  },
);

export const resetOnboardingDemoStateAtom = atom(
  null,
  (get, set) => {
    set(onboardingSessionAtom, {
      ...get(onboardingSessionAtom),
      demo: createInitialOnboardingDemoState(),
    });
  },
);

export const resetOnboardingSessionStateAtom = atom(
  null,
  (_get, set) => {
    set(onboardingSessionAtom, createInitialOnboardingSessionState());
  },
);

export const markOnboardingStartedGameAtom = atom(
  null,
  (_get, set) => {
    set(onboardingStartedGameAtom, true);
    set(resetOnboardingSessionStateAtom);
  },
);
