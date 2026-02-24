import { motion } from "motion/react";

import { Button } from "@/shared/components/ui/button";
import leftLottiImage from "@/shared/assets/slevalotti.png";
import { OnboardingTextCard } from "./onboarding-text-card";

type SetupOnboardingFinalStepProps = {
  onFinish?: () => void;
};

export function SetupOnboardingFinalStep({ onFinish }: SetupOnboardingFinalStepProps) {
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
          loading="eager"
          decoding="async"
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
