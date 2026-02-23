export type SpecialBannerType = "catInBag" | "auction";

export type RayGifBannerVariant = "fullscreen" | "compact";

export type SpecialBannerPhase = "intro" | "main";

export type SpecialBannerTheme = {
  title: string;
  textClassName: string;
  rayColor: string;
  titleBorderClassName: string;
  introImageUrl: string;
  defaultGifUrl: string;
};
