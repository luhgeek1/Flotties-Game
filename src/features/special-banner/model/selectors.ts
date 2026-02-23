import { SPECIAL_BANNER_THEME_BY_TYPE } from "./constants";
import type { SpecialBannerType } from "./types";

export function resolveSpecialBannerViewModel(
  specialType: SpecialBannerType,
  gifUrl?: string,
) {
  const theme = SPECIAL_BANNER_THEME_BY_TYPE[specialType];

  return {
    ...theme,
    resolvedGifUrl: gifUrl ?? theme.defaultGifUrl,
  };
}
