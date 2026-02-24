import { COSMETICS_AVATAR_CATALOG, COSMETICS_WEARABLE_CATALOG } from "@/entities/cosmetics/model/shop";
import readingLottiImage from "@/shared/assets/izuglalotti.png";
import lottiCongrImage from "@/shared/assets/lotti_congr.png";
import demoLottiImage from "@/shared/assets/lottipryamoi.png";
import mainImage from "@/shared/assets/main.png";
import leftLottiImage from "@/shared/assets/slevalotti.png";
import smileLottiImage from "@/shared/assets/smileLotti.png";
import specialAuImage from "@/shared/assets/specialAu.png";
import specialCatImage from "@/shared/assets/specialCat.png";
import doFinalImage from "@/shared/assets/dofinal.png";
import { FINAL_FLOW_IMAGE_URLS, getFinalStagePreloadPlan } from "@/pages/final/model/preloadFinalAssets";

import type { AppRoute } from "../lib/route-guard";

type RouteImagePreloadPlan = {
  immediate: string[];
  idle: string[];
};

function uniqueUrls(urls: readonly string[]): string[] {
  return Array.from(new Set(urls.filter(Boolean)));
}

const AVATAR_IMAGE_URLS = uniqueUrls(
  COSMETICS_AVATAR_CATALOG.map(item => item.value),
);

const SHOP_WEARABLE_IMAGE_URLS = uniqueUrls(
  COSMETICS_WEARABLE_CATALOG.flatMap(item => (
    item.overlaySrc ? [item.cardSrc, item.overlaySrc] : [item.cardSrc]
  )),
);

const SHOP_IMAGE_URLS = uniqueUrls([
  ...AVATAR_IMAGE_URLS,
  ...SHOP_WEARABLE_IMAGE_URLS,
]);

const SETUP_ONBOARDING_IMAGE_URLS = uniqueUrls([
  doFinalImage,
  demoLottiImage,
  leftLottiImage,
  readingLottiImage,
  smileLottiImage,
]);

const GAME_CORE_IMAGE_URLS = uniqueUrls([
  mainImage,
  readingLottiImage,
  lottiCongrImage,
]);

const GAME_SPECIAL_IMAGE_URLS = uniqueUrls([
  specialAuImage,
  specialCatImage,
]);

const ROUTE_IMAGE_PRELOAD: Record<AppRoute, RouteImagePreloadPlan> = {
  setup: {
    immediate: AVATAR_IMAGE_URLS,
    idle: uniqueUrls([
      ...SETUP_ONBOARDING_IMAGE_URLS,
      ...GAME_CORE_IMAGE_URLS,
    ]),
  },
  shop: {
    immediate: SHOP_IMAGE_URLS,
    idle: [],
  },
  history: {
    immediate: [],
    idle: [],
  },
  game: {
    immediate: GAME_CORE_IMAGE_URLS,
    idle: GAME_SPECIAL_IMAGE_URLS,
  },
  game2r: {
    immediate: GAME_CORE_IMAGE_URLS,
    idle: uniqueUrls([
      ...GAME_SPECIAL_IMAGE_URLS,
      ...FINAL_FLOW_IMAGE_URLS,
    ]),
  },
  finalprepairing: getFinalStagePreloadPlan("finalprepairing"),
  finalstarttheme: getFinalStagePreloadPlan("finalstarttheme"),
  finalcloseeyes: getFinalStagePreloadPlan("finalcloseeyes"),
  finalbid: getFinalStagePreloadPlan("finalbid"),
  finalcloseeyesquestion: getFinalStagePreloadPlan("finalcloseeyesquestion"),
  finalquestion: getFinalStagePreloadPlan("finalquestion"),
  finalresults: {
    immediate: [],
    idle: [],
  },
};

export function getRouteImagePreloadPlan(route: AppRoute): RouteImagePreloadPlan {
  return ROUTE_IMAGE_PRELOAD[route];
}
