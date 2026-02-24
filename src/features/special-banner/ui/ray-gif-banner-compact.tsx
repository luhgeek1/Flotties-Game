import { AnimatePresence, motion } from "motion/react";

import { resolveSpecialBannerViewModel, useIntroPhase, type SpecialBannerType } from "../model";
import { cn } from "@/shared/lib/utils";
import { GreenRays } from "./green-rays";
import { RayGifBannerTitle } from "./ray-gif-banner-title";

type RayGifBannerCompactProps = {
  specialType: SpecialBannerType;
  gifUrl?: string;
  className?: string;
};

export function RayGifBannerCompact({
  specialType,
  gifUrl,
  className,
}: RayGifBannerCompactProps) {
  const phase = useIntroPhase();
  const {
    title,
    textClassName,
    rayColor,
    titleBorderClassName,
    introImageUrl,
    resolvedGifUrl,
  } = resolveSpecialBannerViewModel(specialType, gifUrl);

  return (
    <motion.div
      className={cn(
        "pointer-events-none z-40 flex w-[min(28vw,320px)] flex-col items-center gap-2",
        className,
      )}
      initial={{ opacity: 0, y: -10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -8, scale: 0.97 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
    >
      <RayGifBannerTitle
        title={title}
        textClassName={textClassName}
        borderClassName={titleBorderClassName}
        size="compact"
        element="div"
      />

      <div className="relative w-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-md">
        <AnimatePresence mode="wait" initial={false}>
          {phase === "intro" ? (
            <motion.img
              key="compact-intro"
              src={introImageUrl}
              alt={`${title} intro`}
              className="h-auto w-full object-contain select-none"
              initial={{ opacity: 0, y: 8, filter: "blur(4px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -6, filter: "blur(4px)" }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              draggable={false}
              loading="eager"
              decoding="async"
            />
          ) : (
            <motion.div
              key="compact-main"
              className="relative aspect-4/3 w-full overflow-hidden"
              initial={{ opacity: 0, y: 8, filter: "blur(4px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -6, filter: "blur(4px)" }}
              transition={{ duration: 0.25, ease: "easeOut" }}
            >
              <GreenRays color={rayColor} />
              <img
                src={resolvedGifUrl}
                alt={`${title} gif`}
                className="relative z-10 h-full w-full object-cover select-none"
                draggable={false}
                loading="eager"
                decoding="async"
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
