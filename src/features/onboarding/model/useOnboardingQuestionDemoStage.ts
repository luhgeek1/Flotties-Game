import { useCallback, useEffect } from "react";
import { useAtom } from "jotai";

import { onboardingStageAtom } from "@/features/onboarding/store/onboardingAtom";

type UseOnboardingQuestionDemoStageArgs = {
  isDemoQuestionCompleted: boolean;
  resetDemo: () => void;
};

export function useOnboardingQuestionDemoStage({
  isDemoQuestionCompleted,
  resetDemo,
}: UseOnboardingQuestionDemoStageArgs) {
  const [onboardingStage, setOnboardingStage] = useAtom(onboardingStageAtom);

  useEffect(() => {
    if (!isDemoQuestionCompleted) return;
    if (onboardingStage !== "demo") return;

    setOnboardingStage("post-demo");
  }, [isDemoQuestionCompleted, onboardingStage, setOnboardingStage]);

  const openSpecialStep = useCallback(() => {
    setOnboardingStage("special");
  }, [setOnboardingStage]);

  const openFinalStep = useCallback(() => {
    setOnboardingStage("final");
  }, [setOnboardingStage]);

  const skipDemo = useCallback(() => {
    resetDemo();
    setOnboardingStage("post-demo");
  }, [resetDemo, setOnboardingStage]);

  const repeatDemo = useCallback(() => {
    resetDemo();
    setOnboardingStage("demo");
  }, [resetDemo, setOnboardingStage]);

  return {
    isSpecialStepVisible: onboardingStage === "special",
    isFinalStepVisible: onboardingStage === "final",
    isPostDemoOverlayVisible: onboardingStage === "post-demo",
    openSpecialStep,
    openFinalStep,
    skipDemo,
    repeatDemo,
  };
}
