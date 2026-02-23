import { motion } from "motion/react";

import { Button } from "@/shared/components/ui/button";
import demoLottiImage from "@/shared/assets/lottipryamoi.png";
import readingLottiImage from "@/shared/assets/izuglalotti.png";
import { OnboardingTextCard } from "./onboarding-text-card";

type SetupOnboardingDemoIntroOverlayProps = {
  onClose?: () => void;
};

export function SetupOnboardingDemoIntroOverlay({ onClose }: SetupOnboardingDemoIntroOverlayProps) {
  return (
    <motion.button
      type="button"
      onClick={onClose}
      className="absolute inset-0 z-20 block h-full w-full cursor-pointer bg-white/25 p-0 backdrop-blur-md"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="absolute bottom-0 right-[clamp(0.5rem,2vw,2rem)] flex items-center gap-3 sm:gap-5 md:gap-7">
        <motion.div
          className="pointer-events-none w-[min(38vw,520px)]"
          initial={{ x: -16, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
        >
          <OnboardingTextCard className="p-4 sm:p-6 md:p-8">
            <p className="text-sm font-semibold leading-relaxed text-slate-900 sm:text-base md:text-xl">
              Попробуем с Вами демо версию игры! Сейчас нужно определить кто какой игрок. На выбор: Игрок 1, Игрок 2,
              Игрок 3. У каждого свои клавиши для ответа. Готовьтесь нажать их как можно скорее!
            </p>
          </OnboardingTextCard>
        </motion.div>

        <motion.img
          src={demoLottiImage}
          alt="Demo Lotti"
          className="pointer-events-none select-none h-auto w-[min(46vw,640px)] sm:w-[min(50vw,700px)] md:w-[min(54vw,780px)]"
          initial={{ y: 26, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.32, delay: 0.06, ease: [0.22, 1, 0.36, 1] }}
          draggable={false}
        />
      </div>
    </motion.button>
  );
}

type SetupOnboardingDemoPostOverlayProps = {
  onContinue?: () => void;
  onRepeat?: () => void;
};

export function SetupOnboardingDemoPostOverlay({
  onContinue,
  onRepeat,
}: SetupOnboardingDemoPostOverlayProps) {
  return (
    <motion.div
      className="fixed inset-0 z-30 bg-white/40 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
      onClick={onContinue}
    >
      <motion.div
        className="pointer-events-auto absolute left-4 top-[70%] z-10 w-[min(60vw,720px)] -translate-y-1/2 sm:left-6 md:left-10"
        initial={{ x: -24, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.35, delay: 0.06, ease: [0.22, 1, 0.36, 1] }}
      >
        <OnboardingTextCard className="p-6 sm:p-8 md:p-10">
          <p className="text-lg font-semibold leading-relaxed text-slate-900 sm:text-xl md:text-2xl">
            Отлично! Нажмите в любую часть экрана, чтобы продолжить. Если хотите повторить демо - нажмите на кнопкку
            ниже.
          </p>
          <Button
            type="button"
            variant="outline"
            className="mt-5 border-black bg-black text-white hover:bg-black/90 hover:text-white"
            onClick={(event) => {
              event.stopPropagation();
              onRepeat?.();
            }}
          >
            Повторить демо
          </Button>
        </OnboardingTextCard>
      </motion.div>

      <motion.img
        src={demoLottiImage}
        alt="Лотти"
        className="pointer-events-none select-none absolute bottom-0 right-0 h-auto w-[min(50vw,700px)] sm:w-[min(50vw,700px)] md:w-[min(60vw,850px)]"
        initial={{ x: 120, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        draggable={false}
      />
    </motion.div>
  );
}

export function SetupOnboardingDemoReadingOverlay() {
  return (
    <div className="pointer-events-none fixed bottom-0 right-0 z-60">
      <motion.img
        src={readingLottiImage}
        alt="Reading Lotti"
        className="pointer-events-none select-none h-auto w-[min(34vw,460px)] sm:w-[min(36vw,520px)] md:w-[min(40vw,620px)]"
        initial={{ y: 24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
        draggable={false}
      />

      <motion.div
        className="absolute right-[8%] top-[66%] w-[min(26vw,360px)]"
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.24, delay: 0.06, ease: [0.22, 1, 0.36, 1] }}
      >
        <OnboardingTextCard
          className="rounded-2xl p-3 sm:p-4 md:p-5"
          textClassName="text-center text-sm leading-snug sm:text-base md:text-lg"
          text="Если знаешь ответ - скорее жми свою клавишу!"
        />
      </motion.div>
    </div>
  );
}
