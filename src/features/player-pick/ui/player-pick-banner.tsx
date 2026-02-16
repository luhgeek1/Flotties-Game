import { AnimatePresence, motion } from "motion/react";

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
          initial={{ opacity: 0, backdropFilter: "blur(0px)", backgroundColor: "rgba(0,0,0,0)" }}
          animate={{
            opacity: [0, 1, 1, 0],
            backdropFilter: ["blur(0px)", "blur(12px)", "blur(12px)", "blur(0px)"],

            backgroundColor: [
              "rgba(0,0,0,0)",
              "rgba(0,0,0,0.12)",
              "rgba(0,0,0,0.12)",
              "rgba(0,0,0,0)",
            ],
            transition: {
              duration: 1.7,
              times: [0, 0.2353, 0.8235, 1],
              ease: ["easeOut", "linear", "easeIn"],
            },
          }}
          exit={{ opacity: 0, transition: { duration: 0.3, ease: "easeIn" } }}
          className={cn(
            "fixed inset-0 z-70 flex items-center justify-center pointer-events-none",
            className,
          )}
        >
          <motion.div
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{
              opacity: [0, 0.65, 0.65, 0],
              transition: {
                duration: 1.7,
                times: [0, 0.2353, 0.8235, 1],
                ease: ["easeOut", "linear", "easeIn"],
              },
            }}
            style={{ backgroundColor: "white" }}
          />

          <motion.h1
            initial={{ opacity: 0, scale: 0.85, filter: "blur(10px)" }}
            animate={{
              opacity: [0, 1, 1, 0],
              scale: [0.85, 1, 1, 1.08],
              filter: ["blur(10px)", "blur(0px)", "blur(0px)", "blur(16px)"],
              transition: {
                duration: 1.7,
                times: [0, 0.2353, 0.8235, 1],
                ease: ["easeOut", "linear", "easeIn"],
              },
            }}
            className="relative z-10 px-8 text-center text-6xl md:text-8xl font-black text-black tracking-tighter leading-none"
          >
            Выбирает {playerName}
          </motion.h1>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
