import { useState } from "react";
import { motion } from "motion/react";

import { QuestionModal } from "@/features/question-modal";
import { Button } from "@/shared/components/ui/button";
import {
  SetupOnboardingDemoIntroOverlay,
  SetupOnboardingDemoPostOverlay,
  SetupOnboardingDemoReadingOverlay,
} from "./setup-onboarding-demo-intro-overlay";

type SetupOnboardingQuestionDemoStepProps = {
  demoQuestionId: string;
  demoQuestionValue: number;
  isDemoQuestionCompleted: boolean;
  questionModal: React.ComponentProps<typeof QuestionModal>;
  onQuestionSelect: (questionId: string) => void;
  onSkip?: () => void;
  isPostDemoOverlayVisible: boolean;
  onPostDemoContinue?: () => void;
  onPostDemoRepeat?: () => void;
};

export function SetupOnboardingQuestionDemoStep({
  demoQuestionId,
  demoQuestionValue,
  isDemoQuestionCompleted,
  questionModal,
  onQuestionSelect,
  onSkip,
  isPostDemoOverlayVisible,
  onPostDemoContinue,
  onPostDemoRepeat,
}: SetupOnboardingQuestionDemoStepProps) {
  const [isDemoIntroOverlayDismissed, setIsDemoIntroOverlayDismissed] = useState(false);

  const isDemoIntroOverlayVisible =
    !questionModal.isOpen &&
    !isDemoQuestionCompleted &&
    !isDemoIntroOverlayDismissed;
  const isQuestionReadingPhaseVisible =
    questionModal.isOpen &&
    questionModal.phase === "reading";

  return (
    <motion.div
      className="fixed inset-0 z-50 bg-white text-slate-900"
      initial={false}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
    >
      {isDemoIntroOverlayVisible ? (
        <SetupOnboardingDemoIntroOverlay onClose={() => setIsDemoIntroOverlayDismissed(true)} />
      ) : null}

      <Button
        type="button"
        className="absolute right-4 top-4 z-10 md:right-8 md:top-8"
        onClick={onSkip}
      >
        SKIP
      </Button>

      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="flex w-full max-w-xl flex-col items-center gap-5 text-center md:gap-7">
          <h2 className="text-2xl font-black leading-tight md:text-3xl">Нажми на кнопку чтобы открыть вопрос</h2>

          <motion.button
            type="button"
            onClick={() => onQuestionSelect(demoQuestionId)}
            disabled={isDemoQuestionCompleted}
            className="flex h-34 w-34 items-center justify-center rounded-2xl border-2 border-primary bg-card text-5xl font-black font-mono text-primary shadow-md transition-colors hover:bg-primary/5 disabled:cursor-not-allowed disabled:opacity-50 md:h-42 md:w-42 md:text-6xl"
            whileHover={{ scale: isDemoQuestionCompleted ? 1 : 1.03 }}
            whileTap={{ scale: isDemoQuestionCompleted ? 1 : 0.98 }}
          >
            {demoQuestionValue}
          </motion.button>

          {!isDemoQuestionCompleted ? (
            <p className="text-sm font-medium text-slate-600 md:text-base">
              Дальше следуйте указаниям.
            </p>
          ) : null}
        </div>
      </div>

      {isPostDemoOverlayVisible ? (
        <SetupOnboardingDemoPostOverlay
          onContinue={onPostDemoContinue}
          onRepeat={onPostDemoRepeat}
        />
      ) : null}

      {isQuestionReadingPhaseVisible ? <SetupOnboardingDemoReadingOverlay /> : null}

      <QuestionModal {...questionModal} />
    </motion.div>
  );
}
