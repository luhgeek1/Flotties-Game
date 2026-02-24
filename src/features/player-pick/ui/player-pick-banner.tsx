import { AnimatePresence, motion } from "motion/react";

import mainImage from "@/shared/assets/main.png";
import { cn } from "@/shared/lib/utils";

type PlayerPickBannerProps = {
  playerName: string | null;
  isOpen: boolean;
  className?: string;
};

export function PlayerPickBanner({
  playerName,
  isOpen,
  className,
}: PlayerPickBannerProps) {
  const shouldRender = isOpen && Boolean(playerName);

  return (
    <AnimatePresence mode="wait">
      {shouldRender ? (
        <motion.div
          key={`intro-overlay-${playerName}`}
          initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
          animate={{
            opacity: [0, 1, 1, 0],
            backdropFilter: ["blur(0px)", "blur(12px)", "blur(12px)", "blur(0px)"],
            transition: {
              duration: 1.7,
              times: [0, 0.2353, 0.8235, 1],
              ease: ["easeOut", "linear", "easeIn"],
            },
          }}
          exit={{ opacity: 0, transition: { duration: 0.3, ease: "easeIn" } }}
          className={cn(
            "fixed inset-0 z-70 overflow-hidden pointer-events-none",
            className,
          )}
        >
          <motion.img
            src={mainImage}
            alt=""
            aria-hidden="true"
            draggable={false}
            loading="eager"
            decoding="async"
            initial={{ opacity: 0, x: 120, y: 36, scale: 0.96 }}
            animate={{
              opacity: [0, 1, 1, 0],
              x: [120, 0, 0, 60],
              y: [36, 0, 0, 20],
              scale: [0.96, 1, 1, 1.02],
              transition: {
                duration: 1.7,
                times: [0, 0.2353, 0.8235, 1],
                ease: ["easeOut", "linear", "easeIn"],
              },
            }}
            className="absolute bottom-0 right-0 z-0 h-auto w-[min(72vw,420px)] sm:w-[min(62vw,520px)] lg:w-[min(46vw,700px)] pointer-events-none select-none"
          />

          <div className="absolute inset-0 z-10 flex items-center justify-start pl-10 pr-4 md:pl-20 md:pr-10 -translate-y-8 md:-translate-y-12">
            <motion.div
              initial={{ opacity: 0, x: -50, scale: 0.94, filter: "blur(10px)" }}
              animate={{
                opacity: [0, 1, 1, 0],
                x: [-50, 0, 0, -24],
                scale: [0.94, 1, 1, 1.02],
                filter: ["blur(10px)", "blur(0px)", "blur(0px)", "blur(14px)"],
                transition: {
                  duration: 1.7,
                  times: [0, 0.2353, 0.8235, 1],
                  ease: ["easeOut", "linear", "easeIn"],
                },
              }}
              className="relative w-[min(68vw,760px)] rounded-3xl border border-black/10 bg-white px-6 py-8 md:px-10 md:py-11"
            >
              <p className="absolute left-4 top-3 text-left text-xs font-semibold uppercase tracking-[0.08em] text-slate-400 md:left-6 md:top-4">
                Флотти
              </p>
              <div className="flex min-h-16 items-center justify-center md:min-h-20">
                <h1 className="text-center text-lg font-black leading-none tracking-tighter text-black md:text-4xl xl:text-5xl">
                  Выбирает {playerName}
                </h1>
              </div>
            </motion.div>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
