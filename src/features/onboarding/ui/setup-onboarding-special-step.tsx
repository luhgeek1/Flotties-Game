import { motion } from "motion/react";

import { RayGifBanner } from "@/features/special-banner";
import smileLottiImage from "@/shared/assets/smileLotti.png";
import { OnboardingTextCard } from "./onboarding-text-card";

type SetupOnboardingSpecialStepProps = {
  onContinue?: () => void;
};

export function SetupOnboardingSpecialStep({ onContinue }: SetupOnboardingSpecialStepProps) {
  return (
    <motion.button
      type="button"
      onClick={onContinue}
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
          loading="lazy"
          decoding="async"
        />
      </div>
    </motion.button>
  );
}
