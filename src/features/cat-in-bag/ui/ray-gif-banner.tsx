import { useEffect } from "react";
import { AnimatePresence, motion } from "motion/react";

import { GreenRays } from "./green-rays";

type RayGifBannerProps = {
  open: boolean;
  onClose: () => void;
  gifUrl: string;
  autoCloseMs?: number;
};

export function RayGifBanner({
  open,
  onClose,
  gifUrl,
  autoCloseMs = 3000,
}: RayGifBannerProps) {
  useEffect(() => {
    if (!open) return;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const timer = window.setTimeout(() => onClose(), autoCloseMs);

    return () => {
      document.body.style.overflow = prevOverflow;
      window.clearTimeout(timer);
    };
  }, [open, autoCloseMs, onClose]);

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          onClick={onClose}
        >
          <motion.div
            className="absolute inset-0 bg-white/40 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />

          <GreenRays />

          <motion.div
            className="relative z-10 p-4 flex flex-col items-center gap-8"
            initial={{ scale: 0.45, opacity: 0, y: 36, filter: "blur(10px)" }}
            animate={{ scale: 1, opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ scale: 1.06, opacity: 0, y: -16, filter: "blur(6px)" }}
            transition={{ duration: 0.95, ease: [0.22, 1, 0.36, 1] }}
            onClick={event => event.stopPropagation()}
          >
            <div className="relative group cursor-pointer" onClick={onClose}>
              <div
                className="absolute -inset-1 rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"
                style={{ backgroundImage: "linear-gradient(to right, #166534, #16a34a)" }}
              />

              <img
                src={gifUrl}
                alt="Reveal GIF"
                className="relative rounded-lg shadow-2xl w-auto object-contain border-4 border-white/20"
                style={{ maxWidth: "90vw", maxHeight: 500 }}
              />
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
