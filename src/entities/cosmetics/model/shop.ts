import {
  ADD_PLAYER_BANNER_OPTIONS,
  ADD_PLAYER_PRESET_AVATARS,
} from "./defaults";

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

export const SHOP_DEFAULT_OWNED_AVATAR_VALUES = SHOP_AVATAR_ITEMS
  .filter(item => item.price === 0)
  .map(item => item.value);
export const SHOP_DEFAULT_OWNED_BANNER_VALUES = SHOP_BANNER_ITEMS
  .filter(item => item.price === 0)
  .map(item => item.value);
export const SHOP_DEFAULT_EQUIPPED_AVATAR_VALUE = SHOP_DEFAULT_OWNED_AVATAR_VALUES[0] ?? "";
export const SHOP_DEFAULT_EQUIPPED_BANNER_VALUE = SHOP_DEFAULT_OWNED_BANNER_VALUES[0] ?? "bg-white";
