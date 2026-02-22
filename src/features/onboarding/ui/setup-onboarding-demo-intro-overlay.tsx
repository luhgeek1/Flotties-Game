import { motion } from "motion/react";

import cornerLottiImage from "@/shared/assets/lottipryamoi.png";

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
      <span className="sr-only">Закрыть оверлей демо</span>

      <div className="absolute bottom-0 right-[clamp(0.5rem,2vw,2rem)] flex items-center gap-3 sm:gap-5 md:gap-7">
        <motion.div
          className="pointer-events-none w-[min(38vw,520px)] rounded-[2rem] border border-slate-200 bg-white/95 p-4 shadow-lg sm:p-6 md:p-8"
          initial={{ x: -16, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="text-sm font-semibold leading-relaxed text-slate-900 sm:text-base md:text-xl">
            Попробуем с тобой демо версию игры! Вам нужно определить кто какой игрок. На выбор: Игрок 1, Игрок 2,
            Игрок 3. У каждого свои клавиши для ответа
          </p>
        </motion.div>

        <motion.img
          src={cornerLottiImage}
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
