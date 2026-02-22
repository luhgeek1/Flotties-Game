import {
  ADD_PLAYER_BANNER_OPTIONS,
  ADD_PLAYER_PRESET_AVATARS,
} from "./defaults";
import capCardImage from "@/shared/assets/variants/card/capVb.png";
import cilindrCardImage from "@/shared/assets/variants/card/cilindrVb.png";
import coronaCardImage from "@/shared/assets/variants/card/coronaVb.png";
import garlandCardImage from "@/shared/assets/variants/card/garlandVb.png";
import greenCardImage from "@/shared/assets/variants/card/greenVb.png";
import sunglCardImage from "@/shared/assets/variants/card/sunglVb.png";
import yellowCardImage from "@/shared/assets/variants/card/yellowVb.png";

export type ShopAvatarItem = {
  id: string;
  name: string;
  value: string;
  price: number;
};

export type ShopBannerItem = {
  id: string;
  name: string;
  value: string;
  price: number;
};

export type ShopWearableItem = {
  id: string;
  name: string;
  value: string;
  price: number;
  cardSrc: string;
};

const AVATAR_NAMES = ["Базовый", "Flotti", "Prod", "Golden"] as const;
const AVATAR_PRICES = [0, 120, 180, 240] as const;
const BANNER_PRICES = [0, 35, 45, 55, 65, 75, 85, 95, 105] as const;
const BANNER_NAMES = [
  "Ivory Pulse",
  "Sky Mist",
  "Blue Echo",
  "Mint Orbit",
  "Lime Spark",
  "Amber Glow",
  "Sunset Drift",
  "Rose Cloud",
  "Violet Nova",
] as const;

function resolveAvatarName(index: number): string {
  return AVATAR_NAMES[index] ?? `Avatar ${index + 1}`;
}

function resolveAvatarPrice(index: number): number {
  return AVATAR_PRICES[index] ?? (index + 1) * 80;
}

function resolveBannerPrice(index: number): number {
  return BANNER_PRICES[index] ?? (index + 1) * 25;
}

function resolveBannerName(index: number): string {
  return BANNER_NAMES[index] ?? `Theme ${index + 1}`;
}

export const SHOP_STARTING_COINS = 300;

export const SHOP_AVATAR_ITEMS: ShopAvatarItem[] = ADD_PLAYER_PRESET_AVATARS.map((option, index) => ({
  id: `avatar-${index + 1}`,
  name: resolveAvatarName(index),
  value: option.value,
  price: resolveAvatarPrice(index),
}));

export const SHOP_BANNER_ITEMS: ShopBannerItem[] = ADD_PLAYER_BANNER_OPTIONS.map((option, index) => ({
  id: option.id,
  name: resolveBannerName(index),
  value: option.value,
  price: resolveBannerPrice(index),
}));

export const SHOP_WEARABLE_ITEMS: ShopWearableItem[] = [
  {
    id: "wearable-cap",
    name: "Кепка",
    value: "cap",
    price: 45,
    cardSrc: capCardImage,
  },
  {
    id: "wearable-cilindr",
    name: "Цилиндр",
    value: "cilindr",
    price: 65,
    cardSrc: cilindrCardImage,
  },
  {
    id: "wearable-corona",
    name: "Корона",
    value: "corona",
    price: 80,
    cardSrc: coronaCardImage,
  },
  {
    id: "wearable-garland",
    name: "Гирлянда",
    value: "garland",
    price: 55,
    cardSrc: garlandCardImage,
  },
  {
    id: "wearable-sungl",
    name: "Очки",
    value: "sungl",
    price: 50,
    cardSrc: sunglCardImage,
  },
  {
    id: "wearable-green",
    name: "Футболка Green",
    value: "green",
    price: 60,
    cardSrc: greenCardImage,
  },
  {
    id: "wearable-yellow",
    name: "Футболка Yellow",
    value: "yellow",
    price: 60,
    cardSrc: yellowCardImage,
  },
];

export const SHOP_DEFAULT_OWNED_AVATAR_VALUES = SHOP_AVATAR_ITEMS
  .filter(item => item.price === 0)
  .map(item => item.value);
export const SHOP_DEFAULT_OWNED_BANNER_VALUES = SHOP_BANNER_ITEMS
  .filter(item => item.price === 0)
  .map(item => item.value);
export const SHOP_DEFAULT_OWNED_WEARABLE_VALUES: string[] = [];
export const SHOP_DEFAULT_EQUIPPED_WEARABLE_VALUE = "none";
export const SHOP_DEFAULT_EQUIPPED_AVATAR_VALUE = SHOP_DEFAULT_OWNED_AVATAR_VALUES[0] ?? "";
export const SHOP_DEFAULT_EQUIPPED_BANNER_VALUE = SHOP_DEFAULT_OWNED_BANNER_VALUES[0] ?? "bg-white";
