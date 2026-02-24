import { atomWithStorage } from "jotai/utils";
import { DEFAULT_SETUP_PLAYERS, type PlayerId } from "@/entities/players";

import {
  SHOP_DEFAULT_EQUIPPED_WEARABLE_VALUE,
  SHOP_DEFAULT_OWNED_AVATAR_VALUE,
  SHOP_DEFAULT_OWNED_BANNER_VALUES,
  SHOP_DEFAULT_OWNED_WEARABLE_VALUES,
} from "@/entities/cosmetics";

const SHOP_PLAYER_INVENTORIES_STORAGE_KEY = "shop-player-inventories";
const SHOP_ACTIVE_PLAYER_ID_STORAGE_KEY = "shop-active-player-id";
const SHOP_DEFAULT_ACTIVE_PLAYER_ID: PlayerId = DEFAULT_SETUP_PLAYERS[0]?.id ?? "p1";

export type ShopPlayerInventory = {
  ownedAvatarValues: string[];
  ownedBannerValues: string[];
  ownedWearableValues: string[];
  equippedWearableValue: string;
};

export type ShopPlayerInventories = Record<PlayerId, ShopPlayerInventory>;

export function createDefaultShopPlayerInventory(): ShopPlayerInventory {
  return {
    ownedAvatarValues: [SHOP_DEFAULT_OWNED_AVATAR_VALUE],
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

export const shopActivePlayerIdAtom = atomWithStorage<PlayerId>(
  SHOP_ACTIVE_PLAYER_ID_STORAGE_KEY,
  SHOP_DEFAULT_ACTIVE_PLAYER_ID,
  undefined,
  { getOnInit: true },
);
