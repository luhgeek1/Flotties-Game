import { Coins } from "@/shared/ui/icons";

import { Button } from "@/shared/components/ui/button";
import { cn } from "@/shared/lib/utils";

type CosmeticsWearableCardProps = {
  name: string;
  value: string;
  price: number;
  cardSrc: string;
  isOwned: boolean;
  canAfford: boolean;
  onBuy: (value: string) => void;
};

export function CosmeticsWearableCard({
  name,
  value,
  price,
  cardSrc,
  isOwned,
  canAfford,
  onBuy,
}: CosmeticsWearableCardProps) {
  return (
    <div>
      <div className="relative">
        <div
          className={cn(
            "w-full aspect-square rounded-2xl border-2 flex items-center justify-center relative overflow-hidden bg-zinc-50 dark:bg-slate-900",
            isOwned
              ? "border-black ring-2 ring-black ring-offset-2 dark:border-slate-100 dark:ring-slate-100 dark:ring-offset-slate-950"
              : "border-zinc-200 dark:border-slate-700",
          )}
        >
          <img
            src={cardSrc}
            alt={name}
            className="h-full w-full object-cover"
            loading="lazy"
            decoding="async"
          />

          {!isOwned ? (
            <span className="absolute top-2 right-2 inline-flex min-w-19 items-center justify-center gap-1 whitespace-nowrap text-white font-bold text-xs leading-none bg-black px-3 py-1 rounded-full">
              {price}
              <Coins className="h-3.5 w-3.5" />
            </span>
          ) : (
            <div className="absolute top-2 right-2 rounded-full bg-black px-3 py-1 text-xs font-bold text-white dark:bg-slate-100 dark:text-slate-900">
              КУПЛЕНО
            </div>
          )}

          <span className="absolute left-2 right-2 bottom-2 px-2 py-1.5 text-center text-[11px] font-semibold tracking-wide truncate bg-white/90 text-zinc-900 rounded-md dark:bg-slate-900/85 dark:text-zinc-100">
            {name}
          </span>
        </div>
      </div>

      {!isOwned ? (
        <Button
          type="button"
          className="mt-2 h-8 w-full rounded-full bg-white! text-black! shadow-[0_2px_8px_rgba(0,0,0,0.2)] hover:bg-zinc-100!"
          disabled={!canAfford}
          onClick={() => onBuy(value)}
        >
          КУПИТЬ
        </Button>
      ) : null}
    </div>
  );
}
