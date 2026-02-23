import { useCallback, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "motion/react";

import { GreenRays } from "./green-rays";
import { RayGifBannerTitle } from "./ray-gif-banner-title";
import { INTRO_MS, resolveSpecialBannerViewModel, useIntroPhase, type SpecialBannerType } from "../model";

type RayGifBannerFullscreenProps = {
  onClose: () => void;
  specialType: SpecialBannerType;
  gifUrl?: string;
  autoCloseMs: number;
};

export function RayGifBannerFullscreen({
  onClose,
  specialType,
  gifUrl,
  autoCloseMs,
}: RayGifBannerFullscreenProps) {
  const phase = useIntroPhase();
  const {
    title,
    textClassName,
    rayColor,
    titleBorderClassName,
    introImageUrl,
    resolvedGifUrl,
  } = resolveSpecialBannerViewModel(specialType, gifUrl);

  const prevOverflowRef = useRef<string | null>(null);
  const closeTimerRef = useRef<number | null>(null);
  const isClosingRef = useRef(false);

  const clearCloseTimer = useCallback(() => {
    if (closeTimerRef.current === null) return;

    window.clearTimeout(closeTimerRef.current);
    closeTimerRef.current = null;
  }, []);

  const handleClose = useCallback(() => {
    if (isClosingRef.current) return;
    isClosingRef.current = true;

    clearCloseTimer();
    onClose();
  }, [clearCloseTimer, onClose]);

  useEffect(() => {
    isClosingRef.current = false;

    prevOverflowRef.current = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    closeTimerRef.current = window.setTimeout(() => {
      handleClose();
    }, INTRO_MS + autoCloseMs);

    return () => {
      document.body.style.overflow = prevOverflowRef.current ?? "";
      clearCloseTimer();
    };
  }, [autoCloseMs, clearCloseTimer, handleClose]);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      onClick={handleClose}
    >
      <motion.div
        className="absolute inset-0 bg-white/40 backdrop-blur-md"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      />

      <GreenRays color={rayColor} />

      <motion.div
        className="relative z-10 flex flex-col items-center gap-8 p-4"
        initial={{ scale: 0.45, opacity: 0, y: 36, filter: "blur(10px)" }}
        animate={{ scale: 1, opacity: 1, y: 0, filter: "blur(0px)" }}
        exit={{ scale: 1.06, opacity: 0, y: -16, filter: "blur(6px)" }}
        transition={{ duration: 0.95, ease: [0.22, 1, 0.36, 1] }}
        onClick={event => {
          event.stopPropagation();
        }}
      >
        <AnimatePresence mode="wait" initial={false}>
          {phase === "intro" ? (
            <motion.img
              key="intro"
              src={introImageUrl}
              alt="Special reveal intro"
              className="w-auto cursor-pointer object-contain select-none"
              style={{ maxWidth: "90vw", maxHeight: 520 }}
              initial={{ opacity: 0, y: 10, filter: "blur(6px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -6, filter: "blur(6px)" }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              draggable={false}
              onClick={handleClose}
            />
          ) : (
            <motion.div
              key="main"
              className="flex flex-col items-center gap-8"
              initial={{ opacity: 0, y: 10, filter: "blur(6px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -6, filter: "blur(6px)" }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            >
              <RayGifBannerTitle
                title={title}
                textClassName={textClassName}
                borderClassName={titleBorderClassName}
                size="fullscreen"
              />

              <div
                className="cursor-pointer"
                onClick={handleClose}
              >
                <img
                  src={resolvedGifUrl}
                  alt="Reveal GIF"
                  className="w-auto object-contain select-none"
                  style={{ maxWidth: "90vw", maxHeight: 500 }}
                  draggable={false}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}
