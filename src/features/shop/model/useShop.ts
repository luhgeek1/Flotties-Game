import { useAtom, useAtomValue } from "jotai";
import { useMemo } from "react";

import {
  SHOP_AVATAR_ITEMS,
  SHOP_BANNER_ITEMS,
  SHOP_DEFAULT_EQUIPPED_WEARABLE_VALUE,
  SHOP_WEARABLE_ITEMS,
} from "@/entities/cosmetics";
import { adminModeEnabledAtom } from "@/shared/store/adminModeAtom";
import { setupPlayersAtom } from "@/shared/store/setupAtoms";
import { type ShopPlayerInventory, shopActivePlayerIdAtom, shopPlayerInventoriesAtom } from "@/shared/store/shopAtoms";
import {
  mapItemsToState,
  resolveActivePlayer,
  resolveActivePlayerInventory,
  resolveOwnedValues,
  toUniqueValues,
} from "./lib";
import type { ShopAvatarState, ShopBannerState, ShopPricedItem, ShopWearableState } from "./types";

type OwnedInventoryField =
  | "ownedAvatarValues"
  | "ownedBannerValues"
  | "ownedWearableValues";

export function useShop() {
  const [setupPlayers, setSetupPlayers] = useAtom(setupPlayersAtom);
  const activePlayerId = useAtomValue(shopActivePlayerIdAtom);
  const [playerInventories, setPlayerInventories] = useAtom(shopPlayerInventoriesAtom);
  const isAdminMode = useAtomValue(adminModeEnabledAtom);

  const activePlayer = useMemo(
    () => resolveActivePlayer(setupPlayers, activePlayerId),
    [activePlayerId, setupPlayers],
  );
  const coins = isAdminMode ? 1000 : activePlayer.balance;
  const activePlayerInventory = useMemo(
    () => resolveActivePlayerInventory(playerInventories, activePlayerId),
    [activePlayerId, playerInventories],
  );

  const resolvedOwnedAvatarValues = useMemo(
    () => resolveOwnedValues(activePlayerInventory.ownedAvatarValues, [activePlayer.avatarUrl]),
    [activePlayer.avatarUrl, activePlayerInventory.ownedAvatarValues],
  );
  const resolvedOwnedBannerValues = useMemo(
    () => resolveOwnedValues(activePlayerInventory.ownedBannerValues, [activePlayer.banner]),
    [activePlayer.banner, activePlayerInventory.ownedBannerValues],
  );
  const resolvedOwnedWearableValues = useMemo(
    () => resolveOwnedValues(activePlayerInventory.ownedWearableValues, [SHOP_DEFAULT_EQUIPPED_WEARABLE_VALUE]),
    [activePlayerInventory.ownedWearableValues],
  );

  const ownedAvatarSet = useMemo(() => new Set(resolvedOwnedAvatarValues), [resolvedOwnedAvatarValues]);
  const ownedBannerSet = useMemo(() => new Set(resolvedOwnedBannerValues), [resolvedOwnedBannerValues]);
  const ownedWearableSet = useMemo(() => new Set(resolvedOwnedWearableValues), [resolvedOwnedWearableValues]);

  const resolvedEquippedAvatarValue =
    activePlayer.avatarUrl && ownedAvatarSet.has(activePlayer.avatarUrl)
      ? activePlayer.avatarUrl
      : null;
  const resolvedEquippedBannerValue =
    activePlayer.banner && ownedBannerSet.has(activePlayer.banner)
      ? activePlayer.banner
      : null;
  const resolvedEquippedWearableValue = ownedWearableSet.has(activePlayerInventory.equippedWearableValue)
    ? activePlayerInventory.equippedWearableValue
    : SHOP_DEFAULT_EQUIPPED_WEARABLE_VALUE;

  const avatarItems = useMemo<ShopAvatarState[]>(
    () => mapItemsToState(SHOP_AVATAR_ITEMS, ownedAvatarSet, resolvedEquippedAvatarValue, coins),
    [coins, ownedAvatarSet, resolvedEquippedAvatarValue],
  );
  const bannerItems = useMemo<ShopBannerState[]>(
    () => mapItemsToState(SHOP_BANNER_ITEMS, ownedBannerSet, resolvedEquippedBannerValue, coins),
    [coins, ownedBannerSet, resolvedEquippedBannerValue],
  );
  const wearableItems = useMemo<ShopWearableState[]>(
    () => mapItemsToState(SHOP_WEARABLE_ITEMS, ownedWearableSet, resolvedEquippedWearableValue, coins),
    [coins, ownedWearableSet, resolvedEquippedWearableValue],
  );

  const updateActivePlayerInventory = (updater: (inventory: ShopPlayerInventory) => ShopPlayerInventory) => {
    setPlayerInventories(prevInventories => {
      const currentInventory = resolveActivePlayerInventory(prevInventories, activePlayerId);
      const nextInventory = updater(currentInventory);

      return {
        ...prevInventories,
        [activePlayerId]: nextInventory,
      };
    });
  };

  const decreaseActivePlayerBalance = (amount: number) => {
    if (isAdminMode) return;

    setSetupPlayers(prevPlayers =>
      prevPlayers.map(player =>
        player.id === activePlayerId
          ? { ...player, balance: Math.max(0, player.balance - amount) }
          : player,
      ),
    );
  };

  const buyInventoryItem = (
    items: readonly ShopPricedItem[],
    value: string,
    ownedSet: ReadonlySet<string>,
    inventoryField: OwnedInventoryField,
  ): boolean => {
    const item = items.find(candidate => candidate.value === value);

    if (!item) return false;
    if (ownedSet.has(value)) return true;
    if (coins < item.price) return false;

    decreaseActivePlayerBalance(item.price);
    updateActivePlayerInventory(inventory => ({
      ...inventory,
      [inventoryField]: toUniqueValues([...inventory[inventoryField], value]),
    }));

    return true;
  };

  const buyAvatar = (value: string): boolean => {
    return buyInventoryItem(
      SHOP_AVATAR_ITEMS,
      value,
      ownedAvatarSet,
      "ownedAvatarValues",
    );
  };

  const buyBanner = (value: string): boolean => {
    return buyInventoryItem(
      SHOP_BANNER_ITEMS,
      value,
      ownedBannerSet,
      "ownedBannerValues",
    );
  };

  const buyWearable = (value: string): boolean => {
    return buyInventoryItem(
      SHOP_WEARABLE_ITEMS,
      value,
      ownedWearableSet,
      "ownedWearableValues",
    );
  };

  const equipAvatar = (value: string) => {
    if (!ownedAvatarSet.has(value)) return;

    setSetupPlayers(prevPlayers =>
      prevPlayers.map(player =>
        player.id === activePlayerId ? { ...player, avatarUrl: value } : player,
      ),
    );
  };

  const equipBanner = (value: string) => {
    if (!ownedBannerSet.has(value)) return;

    setSetupPlayers(prevPlayers =>
      prevPlayers.map(player =>
        player.id === activePlayerId ? { ...player, banner: value } : player,
      ),
    );
  };

  const equipWearable = (value: string) => {
    if (!ownedWearableSet.has(value)) return;

    updateActivePlayerInventory(inventory => ({
      ...inventory,
      equippedWearableValue: value,
    }));
  };

  const buyOrEquipBanner = (value: string) => {
    if (ownedBannerSet.has(value)) {
      equipBanner(value);
      return;
    }

    const didBuy = buyBanner(value);

    if (didBuy) {
      equipBanner(value);
    }
  };

  return {
    coins,
    avatarItems,
    bannerItems,
    wearableItems,
    ownedWearableValues: resolvedOwnedWearableValues,
    equippedWearableValue: resolvedEquippedWearableValue,
    buyAvatar,
    buyBanner,
    buyWearable,
    equipAvatar,
    equipWearable,
    buyOrEquipBanner,
  };
}
