import { useSetAtom } from "jotai";

import { markOnboardingStartedGameAtom } from "@/features/onboarding/store/onboardingAtom";

export function useOnboarding() {
  const markOnboardingStartedGame = useSetAtom(markOnboardingStartedGameAtom);

  return {
    markOnboardingStartedGame,
  };
}
