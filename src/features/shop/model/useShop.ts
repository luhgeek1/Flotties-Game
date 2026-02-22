import { useAtom, useAtomValue } from "jotai";
import { useMemo } from "react";

import { SHOP_AVATAR_ITEMS, SHOP_BANNER_ITEMS } from "@/entities/cosmetics";
import { setupPlayersAtom } from "@/shared/store/setupAtoms";
import {
  createDefaultShopPlayerInventory,
  normalizeShopPlayerInventory,
  shopActivePlayerIdAtom,
  shopPlayerInventoriesAtom,
} from "@/shared/store/shopAtoms";

type ShopAvatarState = {
  id: string;
  name: string;
  value: string;
  price: number;
  isOwned: boolean;
  isEquipped: boolean;
  canAfford: boolean;
};

type ShopBannerState = {
  id: string;
  name: string;
  value: string;
  price: number;
  isOwned: boolean;
  isEquipped: boolean;
  canAfford: boolean;
};

function toUniqueValues(values: string[]): string[] {
  return Array.from(new Set(values));
}

export function useShop() {
  const [setupPlayers, setSetupPlayers] = useAtom(setupPlayersAtom);
  const activePlayerId = useAtomValue(shopActivePlayerIdAtom);
  const [playerInventories, setPlayerInventories] = useAtom(shopPlayerInventoriesAtom);

  const activePlayer = useMemo(
    () => setupPlayers.find(player => player.id === activePlayerId) ?? null,
    [activePlayerId, setupPlayers],
  );
  const coins = activePlayer?.balance ?? 0;
  const activePlayerInventory = useMemo(() => {
    if (!activePlayerId) {
      return createDefaultShopPlayerInventory();
    }

    return normalizeShopPlayerInventory(playerInventories[activePlayerId]);
  }, [activePlayerId, playerInventories]);

  const resolvedOwnedAvatarValues = useMemo(() => {
    return toUniqueValues([
      ...activePlayerInventory.ownedAvatarValues,
      activePlayer?.avatarUrl ?? "",
    ].filter(Boolean));
  }, [activePlayer?.avatarUrl, activePlayerInventory.ownedAvatarValues]);
  const resolvedOwnedBannerValues = useMemo(() => {
    return toUniqueValues([
      ...activePlayerInventory.ownedBannerValues,
      activePlayer?.banner ?? "",
    ].filter(Boolean));
  }, [activePlayer?.banner, activePlayerInventory.ownedBannerValues]);
  const ownedAvatarSet = useMemo(() => new Set(resolvedOwnedAvatarValues), [resolvedOwnedAvatarValues]);
  const ownedBannerSet = useMemo(() => new Set(resolvedOwnedBannerValues), [resolvedOwnedBannerValues]);

  const resolvedEquippedAvatarValue = activePlayer?.avatarUrl && ownedAvatarSet.has(activePlayer.avatarUrl)
    ? activePlayer.avatarUrl
    : null;
  const resolvedEquippedBannerValue = activePlayer?.banner && ownedBannerSet.has(activePlayer.banner)
    ? activePlayer.banner
    : null;

  const avatarItems = useMemo<ShopAvatarState[]>(() => {
    return SHOP_AVATAR_ITEMS.map(item => {
      const isOwned = ownedAvatarSet.has(item.value);
      const canAfford = Boolean(activePlayerId) && coins >= item.price;

      return {
        ...item,
        isOwned,
        isEquipped: resolvedEquippedAvatarValue === item.value,
        canAfford,
      };
    });
  }, [activePlayerId, coins, ownedAvatarSet, resolvedEquippedAvatarValue]);

  const bannerItems = useMemo<ShopBannerState[]>(() => {
    return SHOP_BANNER_ITEMS.map(item => {
      const isOwned = ownedBannerSet.has(item.value);
      const canAfford = Boolean(activePlayerId) && coins >= item.price;

      return {
        ...item,
        isOwned,
        isEquipped: resolvedEquippedBannerValue === item.value,
        canAfford,
      };
    });
  }, [activePlayerId, coins, ownedBannerSet, resolvedEquippedBannerValue]);

  const updateActivePlayerInventory = (updater: (inventory: ReturnType<typeof normalizeShopPlayerInventory>) => ReturnType<typeof normalizeShopPlayerInventory>) => {
    if (!activePlayerId) return;

    setPlayerInventories(prevInventories => {
      const currentInventory = normalizeShopPlayerInventory(prevInventories[activePlayerId]);
      const nextInventory = updater(currentInventory);

      return {
        ...prevInventories,
        [activePlayerId]: normalizeShopPlayerInventory(nextInventory),
      };
    });
  };

  const buyAvatar = (value: string): boolean => {
    const item = SHOP_AVATAR_ITEMS.find(avatarItem => avatarItem.value === value);

    if (!item) return false;
    if (!activePlayerId) return false;
    if (ownedAvatarSet.has(value)) return true;
    if (coins < item.price) return false;

    setSetupPlayers(prevPlayers => prevPlayers.map(player => (
      player.id === activePlayerId
        ? { ...player, balance: Math.max(0, player.balance - item.price) }
        : player
    )));
    updateActivePlayerInventory(inventory => ({
      ...inventory,
      ownedAvatarValues: toUniqueValues([...inventory.ownedAvatarValues, value]),
    }));

    return true;
  };

  const buyBanner = (value: string): boolean => {
    const item = SHOP_BANNER_ITEMS.find(bannerItem => bannerItem.value === value);

    if (!item) return false;
    if (!activePlayerId) return false;
    if (ownedBannerSet.has(value)) return true;
    if (coins < item.price) return false;

    setSetupPlayers(prevPlayers => prevPlayers.map(player => (
      player.id === activePlayerId
        ? { ...player, balance: Math.max(0, player.balance - item.price) }
        : player
    )));
    updateActivePlayerInventory(inventory => ({
      ...inventory,
      ownedBannerValues: toUniqueValues([...inventory.ownedBannerValues, value]),
    }));

    return true;
  };

  const equipAvatar = (value: string) => {
    if (!ownedAvatarSet.has(value)) return;
    if (!activePlayerId) return;

    setSetupPlayers(prevPlayers => prevPlayers.map(player => (
      player.id === activePlayerId
        ? { ...player, avatarUrl: value }
        : player
    )));
  };

  const equipBanner = (value: string) => {
    if (!ownedBannerSet.has(value)) return;
    if (!activePlayerId) return;

    setSetupPlayers(prevPlayers => prevPlayers.map(player => (
      player.id === activePlayerId
        ? { ...player, banner: value }
        : player
      )));
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
    buyAvatar,
    buyBanner,
    equipAvatar,
    buyOrEquipBanner,
  };
}
