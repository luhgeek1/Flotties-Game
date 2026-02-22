import { useAtomValue, useSetAtom } from "jotai";
import { useCallback, useMemo, useState } from "react";

import { SHOP_AVATAR_ITEMS, SHOP_BANNER_ITEMS } from "@/entities/cosmetics";
import { useTheme } from "@/shared/lib/use-theme";
import { setupPlayersAtom } from "@/shared/store/setupAtoms";
import {
  createDefaultShopPlayerInventory,
  shopActivePlayerIdAtom,
  shopPlayerInventoriesAtom,
} from "@/shared/store/shopAtoms";

export function useShopPage() {
  const { isDark, toggleTheme } = useTheme();
  const players = useAtomValue(setupPlayersAtom);
  const activePlayerId = useAtomValue(shopActivePlayerIdAtom);
  const setShopActivePlayerId = useSetAtom(shopActivePlayerIdAtom);
  const playerInventories = useAtomValue(shopPlayerInventoriesAtom);
  const [isPlayerSelectOpen, setIsPlayerSelectOpen] = useState(false);

  const activePlayer = useMemo(
    () => players.find(player => player.id === activePlayerId) ?? null,
    [activePlayerId, players],
  );

  const activePlayerInventory = useMemo(() => {
    if (!activePlayerId) {
      return createDefaultShopPlayerInventory();
    }

    return playerInventories[activePlayerId] ?? createDefaultShopPlayerInventory();
  }, [activePlayerId, playerInventories]);

  const inventoryCount = useMemo(() => {
    const avatarsCount = new Set([
      ...activePlayerInventory.ownedAvatarValues,
      activePlayer?.avatarUrl ?? "",
    ].filter(Boolean)).size;
    const bannersCount = new Set([
      ...activePlayerInventory.ownedBannerValues,
      activePlayer?.banner ?? "",
    ].filter(Boolean)).size;
    const wearablesCount = new Set(activePlayerInventory.ownedWearableValues.filter(Boolean)).size;

    return avatarsCount + bannersCount + wearablesCount;
  }, [activePlayer?.avatarUrl, activePlayer?.banner, activePlayerInventory]);

  const equippedAvatarName = useMemo(() => {
    const equippedAvatarValue = activePlayer?.avatarUrl ?? "";
    return SHOP_AVATAR_ITEMS.find(item => item.value === equippedAvatarValue)?.name ?? "Default";
  }, [activePlayer?.avatarUrl]);

  const equippedThemeName = useMemo(() => {
    const equippedThemeValue = activePlayer?.banner ?? "";
    return SHOP_BANNER_ITEMS.find(item => item.value === equippedThemeValue)?.name ?? "Classic White";
  }, [activePlayer?.banner]);
  const equippedThemeValue = useMemo(() => {
    const activeBannerValue = activePlayer?.banner ?? "";
    return SHOP_BANNER_ITEMS.find(item => item.value === activeBannerValue)?.value ?? "bg-white";
  }, [activePlayer?.banner]);

  const resolvedPlayerName = activePlayer?.name ?? "Player";

  const openPlayerSelect = useCallback(() => {
    setIsPlayerSelectOpen(true);
  }, []);

  const closePlayerSelect = useCallback(() => {
    setIsPlayerSelectOpen(false);
  }, []);

  const selectPlayer = useCallback((playerId: string) => {
    setShopActivePlayerId(playerId);
    setIsPlayerSelectOpen(false);
  }, [setShopActivePlayerId]);

  return {
    isDark,
    toggleTheme,
    players,
    activePlayer,
    resolvedPlayerName,
    inventoryCount,
    equippedAvatarName,
    equippedThemeName,
    equippedThemeValue,
    isPlayerSelectOpen,
    openPlayerSelect,
    closePlayerSelect,
    selectPlayer,
  };
}
