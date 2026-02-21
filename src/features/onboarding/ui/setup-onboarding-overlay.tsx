import { AnimatePresence, motion } from "motion/react";

import doFinalImage from "@/shared/assets/dofinal.png";
import { useOnboardingFlow } from "../model/useOnboardingFlow";
import { SetupOnboardingQuestionDemo } from "./setup-onboarding-question-demo";

type SetupOnboardingOverlayProps = {
  onClose?: () => void;
};

export function SetupOnboardingOverlay({ onClose }: SetupOnboardingOverlayProps) {
  const { step, showQuestionDemo } = useOnboardingFlow();

  return (
    <div className="fixed inset-0 z-50 bg-white">
      <AnimatePresence initial={false} mode="sync">
        {step === "question-demo" ? (
          <motion.div
            key="onboarding-question-demo"
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
          >
            <SetupOnboardingQuestionDemo onFinish={onClose} />
          </motion.div>
        ) : (
          <motion.button
            key="onboarding-intro"
            type="button"
            onClick={showQuestionDemo}
            className="absolute inset-0 block h-full w-full cursor-pointer overflow-hidden bg-white p-0 text-left"
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="sr-only">Перейти к демо вопроса</span>

            <motion.div
              className="pointer-events-none absolute top-1/2 z-10 w-[min(64vw,760px)] -translate-y-1/2 rounded-[2rem] border border-slate-200 bg-white/95 p-6 shadow-lg right-[clamp(1rem,43vw,680px)] sm:p-8 md:p-10"
              initial={{ x: 52, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.55, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
            >
              <p className="text-lg font-semibold leading-relaxed text-slate-900 sm:text-xl md:text-2xl">
                Привет,меня зовут Флотти, и я ведущий этой игры. Вижу ты новенький. Давай проведу тебе небольной
                гайд по игре.
              </p>
            </motion.div>

            <motion.img
              src={doFinalImage}
              alt="Onboarding"
              className="pointer-events-none select-none absolute bottom-0 right-0 h-auto w-[min(42vw,560px)] sm:w-[min(46vw,620px)] md:w-[min(52vw,720px)]"
              initial={{ x: 160, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
              draggable={false}
            />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
