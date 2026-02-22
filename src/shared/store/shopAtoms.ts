import { atomWithStorage } from "jotai/utils";
import type { PlayerId } from "@/entities/players";

import {
  SHOP_DEFAULT_EQUIPPED_WEARABLE_VALUE,
  SHOP_DEFAULT_OWNED_AVATAR_VALUES,
  SHOP_DEFAULT_OWNED_BANNER_VALUES,
  SHOP_DEFAULT_OWNED_WEARABLE_VALUES,
} from "@/entities/cosmetics";

const SHOP_PLAYER_INVENTORIES_STORAGE_KEY = "shop-player-inventories";
const SHOP_ACTIVE_PLAYER_ID_STORAGE_KEY = "shop-active-player-id";

export type ShopPlayerInventory = {
  ownedAvatarValues: string[];
  ownedBannerValues: string[];
  ownedWearableValues: string[];
  equippedWearableValue: string;
};

export type ShopPlayerInventories = Record<PlayerId, ShopPlayerInventory>;

export function createDefaultShopPlayerInventory(): ShopPlayerInventory {
  return {
    ownedAvatarValues: [...SHOP_DEFAULT_OWNED_AVATAR_VALUES],
    ownedBannerValues: [...SHOP_DEFAULT_OWNED_BANNER_VALUES],
    ownedWearableValues: [...SHOP_DEFAULT_OWNED_WEARABLE_VALUES],
    equippedWearableValue: SHOP_DEFAULT_EQUIPPED_WEARABLE_VALUE,
  };
}

export const shopPlayerInventoriesAtom = atomWithStorage<ShopPlayerInventories>(
  SHOP_PLAYER_INVENTORIES_STORAGE_KEY,
  {},
  undefined,
  { getOnInit: true },
);

export const shopActivePlayerIdAtom = atomWithStorage<PlayerId | null>(
  SHOP_ACTIVE_PLAYER_ID_STORAGE_KEY,
  null,
  undefined,
  { getOnInit: true },
);
