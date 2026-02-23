import type {
  ShopAvatarItem,
  ShopBannerItem,
  ShopWearableItem,
} from "@/entities/cosmetics";

export type ShopPricedItem = {
  value: string;
  price: number;
};

export type ItemStateMeta = {
  isOwned: boolean;
  isEquipped: boolean;
  canAfford: boolean;
};

export type ShopAvatarState = ShopAvatarItem & ItemStateMeta;
export type ShopBannerState = ShopBannerItem & ItemStateMeta;
export type ShopWearableState = ShopWearableItem & ItemStateMeta;
