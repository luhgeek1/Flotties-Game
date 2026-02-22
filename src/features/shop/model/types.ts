import type {
  ShopAvatarItem,
  ShopBannerItem,
  ShopWearableItem,
} from "@/entities/cosmetics";

export type ShopPricedItem = {
  value: string;
  price: number;
};

type ShopItemStateMeta = {
  isOwned: boolean;
  isEquipped: boolean;
  canAfford: boolean;
};

export type ShopAvatarState = ShopAvatarItem & ShopItemStateMeta;
export type ShopBannerState = ShopBannerItem & ShopItemStateMeta;
export type ShopWearableState = ShopWearableItem & ShopItemStateMeta;
