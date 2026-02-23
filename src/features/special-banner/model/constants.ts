import specialAuPngUrl from "@/shared/assets/specialAu.png";
import specialCatPngUrl from "@/shared/assets/specialCat.png";

import type { SpecialBannerTheme, SpecialBannerType } from "./types";

const DEFAULT_CAT_IN_BAG_GIF_URL = "https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExYnR5dnZ6cG1reGpydmhwZHQ0MG1ib29rbzZlemMxdjk1N2g5ZDc4cyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/9KeOUp3sIqL6w/giphy.gif";
const DEFAULT_AUCTION_GIF_URL = "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExaGV3aHBmejBlc2FvM2ZqYjhtamtydHU0dDkxcmcxZzJpZGZsc2l3diZlcD12MV9naWZzX3NlYXJjaCZjdD1n/xT5LMESHbV1KLGMsq4/giphy.gif";

export const INTRO_MS = 1000;

export const SPECIAL_BANNER_THEME_BY_TYPE: Record<SpecialBannerType, SpecialBannerTheme> = {
  catInBag: {
    title: "КОТ В МЕШКЕ",
    textClassName: "text-green-950",
    rayColor: "#004225",
    titleBorderClassName: "border-2 border-green-200/90",
    introImageUrl: specialCatPngUrl,
    defaultGifUrl: DEFAULT_CAT_IN_BAG_GIF_URL,
  },
  auction: {
    title: "АУКЦИОН",
    textClassName: "text-yellow-950",
    rayColor: "#fde047",
    titleBorderClassName: "border-2 border-yellow-200/90",
    introImageUrl: specialAuPngUrl,
    defaultGifUrl: DEFAULT_AUCTION_GIF_URL,
  },
};
