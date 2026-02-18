import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";

import { GreenRays } from "./green-rays";
import specialAuPngUrl from "@/shared/assets/specialAu.png";
import specialCatPngUrl from "@/shared/assets/specialCat.png";

type SpecialBannerType = "catInBag" | "auction";

const DEFAULT_CAT_IN_BAG_GIF_URL = "https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExYnR5dnZ6cG1reGpydmhwZHQ0MG1ib29rbzZlemMxdjk1N2g5ZDc4cyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/9KeOUp3sIqL6w/giphy.gif";
const DEFAULT_AUCTION_GIF_URL = "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExaGV3aHBmejBlc2FvM2ZqYjhtamtydHU0dDkxcmcxZzJpZGZsc2l3diZlcD12MV9naWZzX3NlYXJjaCZjdD1n/xT5LMESHbV1KLGMsq4/giphy.gif";

const GIF_URL_BY_TYPE: Record<SpecialBannerType, string> = {
  catInBag: DEFAULT_CAT_IN_BAG_GIF_URL,
  auction: DEFAULT_AUCTION_GIF_URL,
};

const TITLE_BY_TYPE: Record<SpecialBannerType, string> = {
  catInBag: "КОТ В МЕШКЕ",
  auction: "АУКЦИОН",
};

const INTRO_IMAGE_BY_TYPE: Record<SpecialBannerType, string> = {
  catInBag: specialCatPngUrl,
  auction: specialAuPngUrl,
};

const COLOR_BY_TYPE: Record<SpecialBannerType, { text: string; ray: string; gradient: string }> = {
  catInBag: {
    text: "text-green-950",
    ray: "#004225",
    gradient: "linear-gradient(to right, #166534, #16a34a)",
  },
  auction: {
    text: "text-yellow-950",
    ray: "#fde047",
    gradient: "linear-gradient(to right, #fbbf24, #fde047)",
  },
};

type RayGifBannerProps = {
  open: boolean;
  onClose: () => void;
  specialType?: SpecialBannerType;
  gifUrl?: string;
  autoCloseMs?: number;
};

const INTRO_MS = 1000;

export function RayGifBanner({
  open,
  onClose,
  specialType = "catInBag",
  gifUrl,
  autoCloseMs = 3000,
}: RayGifBannerProps) {
  return (
    <AnimatePresence>
      {open ? (
        <RayGifBannerOpen
          onClose={onClose}
          specialType={specialType}
          gifUrl={gifUrl}
          autoCloseMs={autoCloseMs}
        />
      ) : null}
    </AnimatePresence>
  );
}

type RayGifBannerOpenProps = {
  onClose: () => void;
  specialType: SpecialBannerType;
  gifUrl?: string;
  autoCloseMs: number;
};

function RayGifBannerOpen({
  onClose,
  specialType,
  gifUrl,
  autoCloseMs,
}: RayGifBannerOpenProps) {
  const title = TITLE_BY_TYPE[specialType];
  const colorTheme = COLOR_BY_TYPE[specialType];
  const introImageUrl = INTRO_IMAGE_BY_TYPE[specialType];
  const resolvedGifUrl = gifUrl ?? GIF_URL_BY_TYPE[specialType];
  const titleBorderClass = specialType === "auction"
    ? "border-2 border-yellow-200/90"
    : "";

  const [phase, setPhase] = useState<"intro" | "main">("intro");

  const prevOverflowRef = useRef<string | null>(null);
  const introTimerRef = useRef<number | null>(null);
  const closeTimerRef = useRef<number | null>(null);
  const isClosingRef = useRef(false);

  const handleClose = useCallback(() => {
    if (isClosingRef.current) return;
    isClosingRef.current = true;

    if (introTimerRef.current !== null) {
      window.clearTimeout(introTimerRef.current);
      introTimerRef.current = null;
    }

    if (closeTimerRef.current !== null) {
      window.clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }

    onClose();
  }, [onClose]);

  useEffect(() => {
    prevOverflowRef.current = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    introTimerRef.current = window.setTimeout(() => setPhase("main"), INTRO_MS);
    closeTimerRef.current = window.setTimeout(() => handleClose(), INTRO_MS + autoCloseMs);

    return () => {
      document.body.style.overflow = prevOverflowRef.current ?? "";

      if (introTimerRef.current !== null) {
        window.clearTimeout(introTimerRef.current);
        introTimerRef.current = null;
      }

      if (closeTimerRef.current !== null) {
        window.clearTimeout(closeTimerRef.current);
        closeTimerRef.current = null;
      }
    };
  }, [autoCloseMs, handleClose]);

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

      <GreenRays color={colorTheme.ray} />

      <motion.div
        className="relative z-10 p-4 flex flex-col items-center gap-8"
        initial={{ scale: 0.45, opacity: 0, y: 36, filter: "blur(10px)" }}
        animate={{ scale: 1, opacity: 1, y: 0, filter: "blur(0px)" }}
        exit={{ scale: 1.06, opacity: 0, y: -16, filter: "blur(6px)" }}
        transition={{ duration: 0.95, ease: [0.22, 1, 0.36, 1] }}
        onClick={event => event.stopPropagation()}
      >
        <AnimatePresence mode="wait" initial={false}>
          {phase === "intro" ? (
            <motion.img
              key="intro"
              src={introImageUrl}
              alt="Special reveal intro"
              className="w-auto object-contain select-none cursor-pointer"
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
              <h2 className={`text-4xl sm:text-5xl font-black tracking-wide ${colorTheme.text} text-center drop-shadow-lg bg-white px-6 py-3 rounded-xl ${titleBorderClass}`}>
                {title}
              </h2>

              <div className="cursor-pointer" onClick={handleClose}>
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
