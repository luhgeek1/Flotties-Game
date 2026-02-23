import { useOnboardingQuestionDemo } from "../model/useOnboardingQuestionDemo";
import { useOnboardingQuestionDemoStage } from "../model/useOnboardingQuestionDemoStage";
import { SetupOnboardingFinalStep } from "./setup-onboarding-final-step";
import { SetupOnboardingQuestionDemoStep } from "./setup-onboarding-question-demo-step";
import { SetupOnboardingSpecialStep } from "./setup-onboarding-special-step";

type SetupOnboardingQuestionDemoProps = {
  onFinish?: () => void;
};

export function SetupOnboardingQuestionDemo({ onFinish }: SetupOnboardingQuestionDemoProps) {
  const model = useOnboardingQuestionDemo();
  const {
    isSpecialStepVisible,
    isFinalStepVisible,
    isPostDemoOverlayVisible,
    openSpecialStep,
    openFinalStep,
    skipDemo,
    repeatDemo,
  } = useOnboardingQuestionDemoStage({
    isDemoQuestionCompleted: model.isDemoQuestionCompleted,
    resetDemo: model.resetDemo,
  });

  if (isFinalStepVisible) {
    return <SetupOnboardingFinalStep onFinish={onFinish} />;
  }

  if (isSpecialStepVisible) {
    return <SetupOnboardingSpecialStep onContinue={openFinalStep} />;
  }

  return (
    <SetupOnboardingQuestionDemoStep
      demoQuestionId={model.demoQuestionId}
      demoQuestionValue={model.demoQuestionValue}
      isDemoQuestionCompleted={model.isDemoQuestionCompleted}
      questionModal={model.questionModal}
      onQuestionSelect={model.handleQuestionSelect}
      onSkip={skipDemo}
      isPostDemoOverlayVisible={isPostDemoOverlayVisible}
      onPostDemoContinue={openSpecialStep}
      onPostDemoRepeat={repeatDemo}
    />
  );
}
