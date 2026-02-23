import { useState } from "react";
import { motion } from "motion/react";

import { QuestionModal } from "@/features/question-modal";
import { RayGifBanner } from "@/features/special-banner";
import { Button } from "@/shared/components/ui/button";
import leftLottiImage from "@/shared/assets/slevalotti.png";
import smileLottiImage from "@/shared/assets/smileLotti.png";
import { useOnboardingQuestionDemo } from "../model/useOnboardingQuestionDemo";
import { useOnboardingQuestionDemoStage } from "../model/useOnboardingQuestionDemoStage";
import {
  SetupOnboardingDemoIntroOverlay,
  SetupOnboardingDemoPostOverlay,
  SetupOnboardingDemoReadingOverlay,
} from "./setup-onboarding-demo-intro-overlay";
import { OnboardingTextCard } from "./onboarding-text-card";

type SetupOnboardingQuestionDemoProps = {
  onFinish?: () => void;
};

export function SetupOnboardingQuestionDemo({ onFinish }: SetupOnboardingQuestionDemoProps) {
  const model = useOnboardingQuestionDemo();
  const [isDemoIntroOverlayDismissed, setIsDemoIntroOverlayDismissed] = useState(false);
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
  const isDemoStepVisible =
    !isFinalStepVisible &&
    !isSpecialStepVisible &&
    !isPostDemoOverlayVisible;

  const isDemoIntroOverlayVisible =
    isDemoStepVisible &&
    !model.questionModal.isOpen &&
    !model.isDemoQuestionCompleted &&
    !isDemoIntroOverlayDismissed;
  const isQuestionReadingPhaseVisible =
    model.questionModal.isOpen &&
    model.questionModal.phase === "reading";

  if (isFinalStepVisible) {
    return (
      <motion.div
        className="fixed inset-0 z-50 bg-white"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="pointer-events-none absolute bottom-0 left-0 z-20">
          <motion.img
            src={leftLottiImage}
            alt="Left Lotti"
            className="h-auto w-[min(52vw,760px)] sm:w-[min(56vw,840px)] md:w-[min(60vw,920px)]"
            initial={{ x: -42, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            draggable={false}
          />
        </div>

        <motion.div
          className="absolute left-[50%] top-1/2 z-30 w-[min(48vw,680px)] -translate-y-1/2"
          initial={{ x: 24, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
        >
          <OnboardingTextCard className="p-5 sm:p-7 md:p-9">
            <p className="text-base font-semibold leading-relaxed text-slate-900 sm:text-lg md:text-2xl">
              На этом все! С остальным я буду помогать во время игры! Вы готовы?
            </p>
            <Button type="button" className="mt-5 sm:mt-6" onClick={onFinish}>
              Продолжить -&gt;
            </Button>
          </OnboardingTextCard>
        </motion.div>
      </motion.div>
    );
  }

  if (isSpecialStepVisible) {
    return (
      <motion.button
        type="button"
        onClick={openFinalStep}
        className="fixed inset-0 z-50 block h-full w-full cursor-pointer bg-white p-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
      >
        <RayGifBanner
          open
          onClose={() => {}}
          specialType="catInBag"
          variant="compact"
          className="absolute left-3 top-[34%] -rotate-8 origin-top-left sm:left-6 sm:top-[36%]"
        />

        <RayGifBanner
          open
          onClose={() => {}}
          specialType="auction"
          variant="compact"
          className="absolute right-3 top-[34%] rotate-8 origin-top-right sm:right-6 sm:top-[36%]"
        />

        <div className="pointer-events-none absolute bottom-0 left-1/2 z-20 flex -translate-x-1/2 flex-col items-center">
          <motion.div
            className="mb-3 w-[min(84vw,860px)] sm:mb-4"
            initial={{ y: 18, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.28, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
          >
            <OnboardingTextCard className="p-4 sm:p-6 md:p-8">
              <p className="text-center text-base font-semibold leading-relaxed text-slate-900 sm:text-lg md:text-2xl">
                В игре есть специальные вопросы: "Кот в мешке" и "Аукцион". Вы сразу поймете когда они выпадут)))
              </p>
            </OnboardingTextCard>
          </motion.div>

          <motion.img
            src={smileLottiImage}
            alt="Smile Lotti"
            className="pointer-events-none select-none h-auto w-[min(72vw,760px)]"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            draggable={false}
          />
        </div>
      </motion.button>
    );
  }

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
        onClick={skipDemo}
      >
        SKIP
      </Button>

      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="flex w-full max-w-xl flex-col items-center gap-5 text-center md:gap-7">
          <h2 className="text-2xl font-black leading-tight md:text-3xl">Нажми на кнопку чтобы открыть вопрос</h2>

          <motion.button
            type="button"
            onClick={() => model.handleQuestionSelect(model.demoQuestionId)}
            disabled={model.isDemoQuestionCompleted}
            className="flex h-34 w-34 items-center justify-center rounded-2xl border-2 border-primary bg-card text-5xl font-black font-mono text-primary shadow-md transition-colors hover:bg-primary/5 disabled:cursor-not-allowed disabled:opacity-50 md:h-42 md:w-42 md:text-6xl"
            whileHover={{ scale: model.isDemoQuestionCompleted ? 1 : 1.03 }}
            whileTap={{ scale: model.isDemoQuestionCompleted ? 1 : 0.98 }}
          >
            {model.demoQuestionValue}
          </motion.button>

          {!model.isDemoQuestionCompleted ? (
            <p className="text-sm font-medium text-slate-600 md:text-base">
              Дальше следуйте указаниям. 
            </p>
          ) : null}
        </div>
      </div>

      {isPostDemoOverlayVisible ? (
        <SetupOnboardingDemoPostOverlay
          onContinue={openSpecialStep}
          onRepeat={repeatDemo}
        />
      ) : null}

      {isQuestionReadingPhaseVisible ? <SetupOnboardingDemoReadingOverlay /> : null}

      <QuestionModal {...model.questionModal} />
    </motion.div>
  );
}
