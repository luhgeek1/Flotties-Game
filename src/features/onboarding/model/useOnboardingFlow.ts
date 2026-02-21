import { useCallback, useState } from "react";

export type OnboardingFlowStep = "intro" | "question-demo";

export function useOnboardingFlow() {
  const [step, setStep] = useState<OnboardingFlowStep>("intro");

  const showQuestionDemo = useCallback(() => {
    setStep("question-demo");
  }, []);

  return {
    step,
    showQuestionDemo,
  };
}
