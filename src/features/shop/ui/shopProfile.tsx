import { TRY_ON_ITEMS } from "@/entities/cosmetics";
import { cn } from "@/shared/lib/utils";

type ShopProfileProps = {
  playerName: string;
  coins: number;
  inventoryCount: number;
  equippedAvatarName: string;
  equippedThemeName: string;
  equippedThemeValue: string;
  ownedWearableValues: string[];
  equippedWearableValue: string;
  onSelectWearable: (value: string) => void;
  onOpenWearablesSection: () => void;
};

export function ShopProfile({
  playerName,
  coins,
  inventoryCount,
  equippedAvatarName,
  equippedThemeName,
  equippedThemeValue,
  ownedWearableValues,
  equippedWearableValue,
  onSelectWearable,
  onOpenWearablesSection,
}: ShopProfileProps) {
  const baseLottiImage = TRY_ON_ITEMS.find(item => item.id === "none")?.cardSrc ?? TRY_ON_ITEMS[0]?.cardSrc ?? "";
  const ownedWearableSet = new Set(ownedWearableValues);
  const selectedItem = TRY_ON_ITEMS.find(item => item.id === equippedWearableValue) ?? TRY_ON_ITEMS[0];
  const arenaBackgroundClassName = equippedThemeValue === "bg-white"
    ? "bg-white dark:bg-slate-800"
    : equippedThemeValue;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
      <div className="bg-white dark:bg-slate-900 border-4 border-black dark:border-slate-200 shadow-[8px_8px_0_#000] dark:shadow-[8px_8px_0_#0f172a] p-3 text-black dark:text-slate-100">
        <div className={cn("relative", arenaBackgroundClassName)}>
          <img
            src={baseLottiImage}
            alt="Battle Arena"
            className="block w-full h-auto object-cover"
          />
          {selectedItem.overlaySrc ? (
            <img
              src={selectedItem.overlaySrc}
              alt=""
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 h-full w-full -translate-x-1 object-cover"
            />
          ) : null}
        </div>

        <div className="mt-4 border-t-2 border-zinc-300 dark:border-slate-700 pt-4">
          <button
            type="button"
            onClick={onOpenWearablesSection}
            className="font-mono font-bold text-zinc-600 dark:text-slate-400 uppercase hover:text-zinc-800 dark:hover:text-slate-200"
          >
            Вещи
          </button>
          <div
            className="mt-3 flex gap-3 overflow-x-auto pb-1 [&::-webkit-scrollbar]:hidden"
            style={{ scrollbarWidth: "none" }}
          >
            {TRY_ON_ITEMS.map(item => {
              const isActive = item.id === selectedItem.id;
              const isOwned = ownedWearableSet.has(item.id);

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    if (isOwned) {
                      onSelectWearable(item.id);
                      return;
                    }

                    onOpenWearablesSection();
                  }}
                  className={`shrink-0 rounded-xl border-2 p-2 transition-colors ${
                    isActive
                      ? "border-black bg-zinc-100 dark:border-slate-100 dark:bg-slate-800"
                      : isOwned
                        ? "border-zinc-300 bg-white hover:bg-zinc-100 dark:border-slate-700 dark:bg-slate-900 dark:hover:bg-slate-800"
                        : "border-zinc-300 bg-zinc-100/70 opacity-55 dark:border-slate-700 dark:bg-slate-900/70"
                  }`}
                  aria-disabled={!isOwned}
                  aria-pressed={isActive}
                >
                  <img
                    src={item.cardSrc}
                    alt={item.title}
                    className="h-16 w-16 md:h-20 md:w-20 object-cover rounded-md"
                  />
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 border-4 border-black dark:border-slate-200 shadow-[8px_8px_0_#000] dark:shadow-[8px_8px_0_#0f172a] p-6 md:p-7 text-black dark:text-slate-100">
        <h2 className="text-2xl md:text-3xl font-extrabold uppercase">Статистика игрока</h2>
        <div className="mt-4 border-t-4 border-black dark:border-slate-200/80" />

        <div className="mt-6 space-y-4">
          <div className="flex items-center justify-between text-base md:text-lg gap-4">
            <span className="font-mono font-bold text-zinc-600 dark:text-slate-400 uppercase">Имя</span>
            <span className="font-extrabold truncate">{playerName}</span>
          </div>

          <div className="flex items-center justify-between text-base md:text-lg gap-4">
            <span className="font-mono font-bold text-zinc-600 dark:text-slate-400 uppercase">lottcoins</span>
            <span className="font-extrabold">{coins}</span>
          </div>

          <div className="flex items-center justify-between text-base md:text-lg gap-4">
            <span className="font-mono font-bold text-zinc-600 dark:text-slate-400 uppercase">
              Инвентарь
            </span>
            <span className="font-extrabold">{inventoryCount}</span>
          </div>
        </div>

        <div className="mt-6 border-t-2 border-zinc-300 dark:border-slate-700" />

        <div className="mt-6">
          <h3 className="text-base md:text-lg font-mono font-bold text-zinc-600 dark:text-slate-400 uppercase">
            Выбрано
          </h3>

          <div className="mt-4 space-y-4 text-base md:text-lg">
            <div className="flex items-center justify-between gap-4">
              <span className="font-mono text-zinc-600 dark:text-slate-400">Аватар:</span>
              <span className="px-3 md:px-4 py-1.5 md:py-2 rounded-lg border-2 border-zinc-200 bg-zinc-50 dark:border-slate-700 dark:bg-slate-800 font-bold truncate">
                {equippedAvatarName}
              </span>
            </div>

            <div className="flex items-center justify-between gap-4">
              <span className="font-mono text-zinc-600 dark:text-slate-400">Тема:</span>
              <span className="px-3 md:px-4 py-1.5 md:py-2 rounded-lg border-2 border-zinc-200 bg-zinc-50 dark:border-slate-700 dark:bg-slate-800 font-bold truncate">
                {equippedThemeName}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
