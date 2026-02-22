import { ArrowRight } from "lucide-react";

import { PlayerAvatar, type SetupPlayer } from "@/entities/players";
import { Button } from "@/shared/components/ui/button";
import { Modal } from "@/shared/components/ui/modal";
import { cn } from "@/shared/lib/utils";

type ShopPlayerSelectModalProps = {
  isOpen: boolean;
  players: SetupPlayer[];
  onClose: () => void;
  onSelectPlayer: (playerId: string) => void;
};

export function ShopPlayerSelectModal({
  isOpen,
  players,
  onClose,
  onSelectPlayer,
}: ShopPlayerSelectModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Кто идет в магазин?">
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Выберите игрока. Покупки и применение будут выполнены от его имени.
        </p>

        {players.length > 0 ? (
          <div className="space-y-2">
            {players.map(player => {
              const isDefaultBanner = player.banner === "bg-white";
              const resolvedBannerClassName = isDefaultBanner
                ? `${player.banner} dark:bg-slate-800`
                : player.banner;
              const primaryTextClassName = isDefaultBanner
                ? "text-zinc-900 dark:text-slate-100"
                : "text-zinc-900";
              const secondaryTextClassName = isDefaultBanner
                ? "text-zinc-600 dark:text-slate-300"
                : "text-zinc-600";
              const arrowClassName = isDefaultBanner
                ? "text-zinc-600 dark:text-slate-300"
                : "text-zinc-600";

              return (
                <button
                  key={player.id}
                  type="button"
                  onClick={() => onSelectPlayer(player.id)}
                  className={cn(
                    "w-full rounded-xl border-2 p-3 transition-all flex items-center justify-between gap-3 text-left",
                    "border-border hover:border-primary hover:bg-muted/60",
                    resolvedBannerClassName,
                  )}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="h-10 w-10 rounded-lg overflow-hidden border border-border/70 shrink-0">
                      <PlayerAvatar value={player.avatarUrl} alt={player.name} />
                    </div>

                    <div className="min-w-0">
                      <p className={cn("font-semibold truncate", primaryTextClassName)}>{player.name}</p>
                      <p className={cn("text-xs", secondaryTextClassName)}>Открыть магазин</p>
                    </div>
                  </div>

                  <ArrowRight className={cn("h-4 w-4 shrink-0", arrowClassName)} />
                </button>
              );
            })}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-border p-4 text-sm text-muted-foreground">
            Добавьте хотя бы одного игрока, чтобы открыть магазин.
          </div>
        )}

        <Button type="button" variant="outline" className="w-full" onClick={onClose}>
          Отмена
        </Button>
      </div>
    </Modal>
  );
}
