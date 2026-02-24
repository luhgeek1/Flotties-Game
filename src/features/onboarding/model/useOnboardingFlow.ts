import { useCallback } from "react";
import { useAtom } from "jotai";
import { onboardingStageAtom } from "@/features/onboarding/store/onboardingAtom";

export type OnboardingFlowStep = "intro" | "question-demo";

export function useOnboardingFlow() {
  const [onboardingStage, setOnboardingStage] = useAtom(onboardingStageAtom);

  const showQuestionDemo = useCallback(() => {
    setOnboardingStage("demo");
  }, [setOnboardingStage]);

  const step: OnboardingFlowStep = onboardingStage === "intro"
    ? "intro"
    : "question-demo";

  return {
    step,
    showQuestionDemo,
  };
}
