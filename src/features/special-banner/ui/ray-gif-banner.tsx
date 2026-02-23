import { AnimatePresence } from "motion/react";

import type { RayGifBannerVariant, SpecialBannerType } from "../model";
import { RayGifBannerCompact } from "./ray-gif-banner-compact";
import { RayGifBannerFullscreen } from "./ray-gif-banner-fullscreen";

export type RayGifBannerProps = {
  open: boolean;
  onClose: () => void;
  specialType?: SpecialBannerType;
  gifUrl?: string;
  autoCloseMs?: number;
  variant?: RayGifBannerVariant;
  className?: string;
};

export function RayGifBanner({
  open,
  onClose,
  specialType = "catInBag",
  gifUrl,
  autoCloseMs = 3000,
  variant = "fullscreen",
  className,
}: RayGifBannerProps) {
  return (
    <AnimatePresence>
      {open ? (
        variant === "compact" ? (
          <RayGifBannerCompact
            specialType={specialType}
            gifUrl={gifUrl}
            className={className}
          />
        ) : (
          <RayGifBannerFullscreen
            onClose={onClose}
            specialType={specialType}
            gifUrl={gifUrl}
            autoCloseMs={autoCloseMs}
          />
        )
      ) : null}
    </AnimatePresence>
  );
}
