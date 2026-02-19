import { useAtom } from "jotai";
import { ChevronRight, Plus } from "lucide-react";
import { motion } from "motion/react";

import { DEFAULT_PLAYERS, PlayerSetupCard, type PlayerId } from "@/entities/players";
import { Button } from "@/shared/components/ui/button";
import { cn } from "@/shared/lib/utils";
import { MIN_PLAYERS_TO_START_GAME, setupSelectedPlayerIdsAtom } from "@/shared/store/setupAtoms";
import { SetupShell } from "@/widgets/setup-shell";

type PlayersSetupScreenProps = {
  onContinue?: () => void;
};

export function PlayersSetupScreen({ onContinue }: PlayersSetupScreenProps) {
  const [selectedPlayerIds, setSelectedPlayerIds] = useAtom(setupSelectedPlayerIdsAtom);

  const togglePlayerSelection = (playerId: PlayerId) => {
    setSelectedPlayerIds(prevSelected => {
      if (prevSelected.includes(playerId)) {
        return prevSelected.filter(id => id !== playerId);
      }
      return [...prevSelected, playerId];
    });
  };

  const selectedPlayersCount = selectedPlayerIds.length;
  const canContinue = selectedPlayersCount >= MIN_PLAYERS_TO_START_GAME;

  return (
    <SetupShell>
      <motion.div
        key="players-step"
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: -20, opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="space-y-6"
      >
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <h2 className="text-2xl font-bold tracking-tight">Выберите игроков</h2>
            <p className="text-xs text-muted-foreground">(минимум 3 игрока)</p>
          </div>

          <Button
            type="button"
            variant="ghost"
            className="h-10 gap-2 px-4 text-primary hover:bg-primary/10 hover:text-primary/80"
          >
            <Plus className="h-4 w-4" /> Добавить
          </Button>
        </div>

        <div className="space-y-3">
          {DEFAULT_PLAYERS.map(player => (
            <PlayerSetupCard
              key={player.id}
              layoutId={`player-${player.id}`}
              name={player.name}
              avatarUrl={player.avatarUrl}
              keyCode={player.keyCode}
              isSelected={selectedPlayerIds.includes(player.id)}
              onToggle={() => togglePlayerSelection(player.id)}
            />
          ))}
        </div>

        <div className="pt-6">
          <Button
            disabled={!canContinue}
            type="button"
            onClick={() => {
              if (!canContinue) return;
              onContinue?.();
            }}
            className={cn(
              "h-14 w-full rounded-xl text-base font-bold",
              canContinue ? "shadow-lg shadow-primary/10" : "shadow-none"
            )}
          >
            Продолжить {selectedPlayersCount}
            <ChevronRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </motion.div>
    </SetupShell>
  );
}
