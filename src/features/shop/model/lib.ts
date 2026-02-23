import type { ShopPlayerInventory, ShopPlayerInventories } from "@/shared/store/shopAtoms";
import { createDefaultShopPlayerInventory } from "@/shared/store/shopAtoms";
import type { ItemStateMeta, ShopPricedItem } from "./types";

export function toUniqueValues(values: string[]): string[] {
  return Array.from(new Set(values));
}

export function resolveActivePlayer<TPlayer extends { id: string }>(
  players: TPlayer[],
  activePlayerId: string | null,
): TPlayer | null {
  return players.find(player => player.id === activePlayerId) ?? null;
}

export function resolveActivePlayerInventory(
  playerInventories: ShopPlayerInventories,
  activePlayerId: string | null,
): ShopPlayerInventory {
  if (!activePlayerId) {
    return createDefaultShopPlayerInventory();
  }

  return playerInventories[activePlayerId] ?? createDefaultShopPlayerInventory();
}

export function resolveOwnedValues(
  values: string[],
  extraValues: Array<string | null | undefined>,
): string[] {
  return toUniqueValues([
    ...values,
    ...extraValues,
  ].filter(Boolean) as string[]);
}

export function mapItemsToState<TItem extends ShopPricedItem>(
  items: readonly TItem[],
  ownedSet: ReadonlySet<string>,
  equippedValue: string | null,
  activePlayerId: string | null,
  coins: number,
): Array<TItem & ItemStateMeta> {
  return items.map(item => {
    const isOwned = ownedSet.has(item.value);
    const canAfford = Boolean(activePlayerId) && coins >= item.price;

    return {
      ...item,
      isOwned,
      isEquipped: equippedValue === item.value,
      canAfford,
    };
  });
}
