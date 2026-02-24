import { Check, Coins, Palette, User } from "lucide-react";
import { useCallback, useRef } from "react";

import { CosmeticsWearableCard } from "@/entities/cosmetics";
import { Button } from "@/shared/components/ui/button";
import { cn } from "@/shared/lib/utils";

import { useShop } from "../model";
import { ShopProfile } from "./shopProfile";

function formatPrice(price: number): string {
  return `${price} lottcoins`;
}

type ShopSectionProps = {
  playerName: string;
  inventoryCount: number;
  equippedAvatarName: string;
  equippedThemeName: string;
  equippedThemeValue: string;
};

export function ShopSection({
  playerName,
  inventoryCount,
  equippedAvatarName,
  equippedThemeName,
  equippedThemeValue,
}: ShopSectionProps) {
  const wearablesSectionRef = useRef<HTMLDivElement | null>(null);
  const {
    coins,
    avatarItems,
    bannerItems,
    wearableItems,
    ownedWearableValues,
    equippedWearableValue,
    buyAvatar,
    equipAvatar,
    buyBanner,
    buyWearable,
    equipWearable,
    buyOrEquipBanner,
  } = useShop();
  const handleOpenWearablesSection = useCallback(() => {
    wearablesSectionRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }, []);

  return (
    <section className="bg-white/50 dark:bg-slate-900/60 p-8 rounded-3xl border-2 border-black/5 dark:border-slate-700/70 backdrop-blur-sm">
      <div className="space-y-12">
        <h2 className="text-3xl font-bold tracking-tight uppercase">Профиль</h2>

        <ShopProfile
          playerName={playerName}
          coins={coins}
          inventoryCount={inventoryCount}
          equippedAvatarName={equippedAvatarName}
          equippedThemeName={equippedThemeName}
          equippedThemeValue={equippedThemeValue}
          ownedWearableValues={ownedWearableValues}
          equippedWearableValue={equippedWearableValue}
          onSelectWearable={equipWearable}
          onOpenWearablesSection={handleOpenWearablesSection}
        />

        <div className="flex items-center justify-between border-b border-black pb-4 dark:border-slate-200/30">
          <h2 className="text-3xl font-bold tracking-tight uppercase">Магазин</h2>

          <div className="flex items-center space-x-2 bg-black text-white px-4 py-2 rounded-full dark:bg-slate-100 dark:text-slate-900">
            <Coins className="h-5 w-5" />
            <span className="font-mono text-lg font-bold">{coins}</span>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-xl font-bold uppercase flex items-center gap-2">
            <User className="h-5 w-5" /> Аватары
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {avatarItems.map(item => (
              <div
                key={item.id}
                className={cn(
                  "border-2 rounded-xl shadow-sm hover:shadow-md transition-all",
                  item.isEquipped
                    ? "border-black bg-zinc-100 dark:border-slate-100 dark:bg-slate-800/80"
                    : "border-zinc-200 bg-white/80 dark:border-slate-700 dark:bg-slate-900/70",
                )}
              >
                <div className="p-6 flex flex-col items-center gap-4">
                  <div
                    className={cn(
                      "p-1 rounded-full border-2",
                      item.isEquipped
                        ? "border-black bg-white dark:border-slate-100 dark:bg-slate-700"
                        : "border-zinc-200 bg-zinc-50 dark:border-slate-700 dark:bg-slate-800",
                    )}
                  >
                    <img
                      src={item.value}
                      alt={item.name}
                      className="size-14 rounded-full object-cover"
                      loading="lazy"
                      decoding="async"
                    />
                  </div>

                  <div className="text-center">
                    <h4 className="font-bold">{item.name}</h4>
                    <p className="text-xs text-zinc-500 dark:text-slate-300">
                      {item.isOwned ? "Куплено" : formatPrice(item.price)}
                    </p>
                  </div>

                  {item.isOwned ? (
                    <Button
                      variant={item.isEquipped ? "default" : "outline"}
                      className={cn(
                        "w-full",
                        item.isEquipped
                          ? "bg-black text-white hover:bg-zinc-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200"
                          : "border border-black text-black bg-transparent hover:bg-zinc-100 dark:border-slate-100 dark:text-slate-100 dark:hover:bg-slate-800",
                      )}
                      disabled={item.isEquipped}
                      onClick={() => equipAvatar(item.value)}
                      type="button"
                    >
                      {item.isEquipped ? <Check className="h-4 w-4" /> : null}
                      {item.isEquipped ? "ВЫБРАНО" : "ВЫБРАТЬ"}
                    </Button>
                  ) : (
                    <Button
                      className="w-full bg-zinc-900 text-white hover:bg-zinc-700 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200"
                      disabled={!item.canAfford}
                      onClick={() => buyAvatar(item.value)}
                      type="button"
                    >
                      <span>КУПИТЬ · {item.price}</span>
                      <Coins className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-xl font-bold uppercase flex items-center gap-2">
            <Palette className="h-5 w-5" /> Темы
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-4">
            {bannerItems.map(item => {
              const isDefaultTheme = item.value === "bg-white";
              const itemColorClassName = isDefaultTheme ? `${item.value} dark:bg-slate-800` : item.value;
              const themeNameClassName = isDefaultTheme
                ? "text-zinc-900 dark:text-zinc-100"
                : "text-zinc-900";

              return (
                <div key={item.id}>
                  <div className="relative">
                    <button
                      className={cn(
                        "w-full aspect-square rounded-2xl border-2 flex items-center justify-center relative overflow-hidden",
                        itemColorClassName,
                        item.isEquipped
                          ? "border-black ring-2 ring-black ring-offset-2 dark:border-slate-100 dark:ring-slate-100 dark:ring-offset-slate-950"
                          : "border-zinc-200 dark:border-slate-700",
                      )}
                      onClick={() => {
                        if (!item.isOwned) return;
                        buyOrEquipBanner(item.value);
                      }}
                      type="button"
                    >
                      {item.isEquipped ? (
                        <div className="bg-black/10 dark:bg-white/20 rounded-full p-1">
                          <Check className="h-6 w-6 text-black dark:text-white" />
                        </div>
                      ) : null}

                      {!item.isOwned ? (
                        <span className="absolute top-2 right-2 inline-flex min-w-19 items-center justify-center gap-1 whitespace-nowrap text-white font-bold text-xs leading-none bg-black px-3 py-1 rounded-full">
                          {item.price}
                          <Coins className="h-3.5 w-3.5" />
                        </span>
                      ) : null}

                      <span className={cn(
                        "absolute left-2 right-2 bottom-2 px-2 py-1.5 text-center text-[11px] font-semibold tracking-wide truncate",
                        themeNameClassName,
                      )}
                      >
                        {item.name}
                      </span>
                    </button>
                  </div>

                  {!item.isOwned ? (
                    <Button
                      type="button"
                      className="mt-2 h-8 w-full rounded-full bg-white! text-black! shadow-[0_2px_8px_rgba(0,0,0,0.2)] hover:bg-zinc-100!"
                      disabled={!item.canAfford}
                      onClick={() => {
                        buyBanner(item.value);
                      }}
                    >
                      КУПИТЬ
                    </Button>
                  ) : null}
                </div>
              );
            })}
          </div>
        </div>

        <div ref={wearablesSectionRef} className="space-y-4">
          <h3 className="text-xl font-bold uppercase flex items-center gap-2">
            <Palette className="h-5 w-5" /> Предметы
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-4">
            {wearableItems.map(item => (
              <CosmeticsWearableCard
                key={item.id}
                name={item.name}
                value={item.value}
                price={item.price}
                cardSrc={item.cardSrc}
                isOwned={item.isOwned}
                canAfford={item.canAfford}
                onBuy={buyWearable}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
