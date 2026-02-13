import { useAtom } from "jotai";
import { motion } from "motion/react";
import { Plus, ChevronRight } from "lucide-react";

import { DEFAULT_PLAYERS, PlayerSetupCard, type PlayerId } from "@/entities/players";
import { setupSelectedPlayerIdsAtom } from "@/shared/store/setupAtoms";
import { SetupShell } from "@/widgets/setup-shell";

type PlayersSetupScreenProps = {
  onContinue?: () => void;
};

const MIN_PLAYERS_TO_CONTINUE = 3;

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
  const canContinue = selectedPlayersCount >= MIN_PLAYERS_TO_CONTINUE;

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

          <button
            type="button"
            className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground gap-2 text-primary hover:text-primary/80 hover:bg-primary/10 h-10 px-4 py-2"
          >
            <Plus className="w-4 h-4" /> Добавить
          </button>
        </div>

        <div className="space-y-3">
          {DEFAULT_PLAYERS.map(player => (
            <PlayerSetupCard
              key={player.id}
              layoutId={`player-${player.id}`}
              name={player.name}
              isSelected={selectedPlayerIds.includes(player.id)}
              onToggle={() => togglePlayerSelection(player.id)}
            />
          ))}
        </div>

        <div className="pt-6">
          <button
            disabled={!canContinue}
            type="button"
            onClick={() => {
              if (!canContinue) return;
              onContinue?.();
            }}
            className="inline-flex items-center justify-center whitespace-nowrap ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 w-full text-base h-14 rounded-xl font-bold shadow-lg shadow-primary/10"
          >
            Продолжить {selectedPlayersCount}
            <ChevronRight className="w-5 h-5 ml-2" />
          </button>
        </div>
      </motion.div>
    </SetupShell>
  );
}
