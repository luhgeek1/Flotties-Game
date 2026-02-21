import { useSetAtom } from "jotai";

import { markOnboardingStartedGameAtom } from "@/shared/store/onboardingAtom";

export function useOnboarding() {
  const markOnboardingStartedGame = useSetAtom(markOnboardingStartedGameAtom);

  return {
    markOnboardingStartedGame,
  };
}
