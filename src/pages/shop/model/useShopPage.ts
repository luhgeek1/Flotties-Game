import { useAtomValue, useSetAtom } from "jotai";
import { useCallback, useMemo, useState } from "react";

import {
  SHOP_AVATAR_ITEMS,
  SHOP_BANNER_ITEMS,
  SHOP_DEFAULT_OWNED_AVATAR_VALUE,
  SHOP_DEFAULT_OWNED_BANNER_VALUES,
} from "@/entities/cosmetics";
import { useTheme } from "@/shared/lib/use-theme";
import { setupPlayersAtom } from "@/features/game-session/store/setupAtoms";
import {
  createDefaultShopPlayerInventory,
  shopActivePlayerIdAtom,
  shopPlayerInventoriesAtom,
} from "@/features/shop/store/shopAtoms";

const DEFAULT_BANNER_VALUE = SHOP_DEFAULT_OWNED_BANNER_VALUES[0] ?? "";

export function useShopPage() {
  const { isDark, toggleTheme } = useTheme();
  const players = useAtomValue(setupPlayersAtom);
  const activePlayerId = useAtomValue(shopActivePlayerIdAtom);
  const setShopActivePlayerId = useSetAtom(shopActivePlayerIdAtom);
  const playerInventories = useAtomValue(shopPlayerInventoriesAtom);
  const [isPlayerSelectOpen, setIsPlayerSelectOpen] = useState(false);

  const activePlayer = useMemo(() => {
    const resolvedPlayer = players.find(player => player.id === activePlayerId);
    if (!resolvedPlayer) {
      throw new Error(`Active shop player not found: ${activePlayerId}`);
    }

    return resolvedPlayer;
  }, [activePlayerId, players]);

  const activePlayerInventory = useMemo(() => {
    return playerInventories[activePlayerId] ?? createDefaultShopPlayerInventory();
  }, [activePlayerId, playerInventories]);

  const inventoryCount = useMemo(() => {
    const avatarsCount = new Set([
      ...activePlayerInventory.ownedAvatarValues,
      activePlayer.avatarUrl,
    ].filter((value): value is string => (
      Boolean(value) && value !== SHOP_DEFAULT_OWNED_AVATAR_VALUE
    ))).size;
    const bannersCount = new Set([
      ...activePlayerInventory.ownedBannerValues,
      activePlayer.banner,
    ].filter((value): value is string => (
      Boolean(value) && value !== DEFAULT_BANNER_VALUE
    ))).size;
    const wearablesCount = new Set(activePlayerInventory.ownedWearableValues.filter(Boolean)).size;

    return avatarsCount + bannersCount + wearablesCount;
  }, [activePlayer.avatarUrl, activePlayer.banner, activePlayerInventory]);

  const equippedAvatarName = useMemo(() => {
    const equippedAvatarValue = activePlayer.avatarUrl;
    return SHOP_AVATAR_ITEMS.find(item => item.value === equippedAvatarValue)?.name ?? "Default";
  }, [activePlayer.avatarUrl]);

  const equippedThemeName = useMemo(() => {
    const equippedThemeValue = activePlayer.banner;
    return SHOP_BANNER_ITEMS.find(item => item.value === equippedThemeValue)?.name ?? "Classic White";
  }, [activePlayer.banner]);
  const equippedThemeValue = activePlayer.banner;

  const resolvedPlayerName = activePlayer.name;

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
