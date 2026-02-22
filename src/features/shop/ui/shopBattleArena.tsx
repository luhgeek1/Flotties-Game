import shopLotti from "@/shared/assets/shopLotti.png";

type ShopBattleArenaProps = {
  playerName: string;
  coins: number;
  inventoryCount: number;
  equippedAvatarName: string;
  equippedThemeName: string;
};

export function ShopBattleArena({
  playerName,
  coins,
  inventoryCount,
  equippedAvatarName,
  equippedThemeName,
}: ShopBattleArenaProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
      <div className="bg-white dark:bg-slate-900 border-4 border-black dark:border-slate-200 shadow-[8px_8px_0_#000] dark:shadow-[8px_8px_0_#0f172a] p-3 text-black dark:text-slate-100">
        <img
          src={shopLotti}
          alt="Battle Arena"
          className="w-full h-auto object-cover"
        />
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
