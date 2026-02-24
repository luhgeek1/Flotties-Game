import { ChevronRight, Plus } from "lucide-react";
import { motion } from "motion/react";
import {
  PLAYER_SELECTION_KEY_CODES,
  PlayerSetupCard,
} from "@/entities/players";
import { AddPlayerModal } from "@/features/add-player-modal";
import { ExitGameModal } from "@/features/exit-game";
import { Button } from "@/shared/components/ui/button";
import { cn } from "@/shared/lib/utils";
import { SetupShell } from "@/shared/ui";
import { usePlayersSetupScreen } from "../model";

type PlayersSetupScreenProps = {
  onContinue?: () => void;
};

export function PlayersSetupScreen({ onContinue }: PlayersSetupScreenProps) {
  const model = usePlayersSetupScreen({ onContinue });

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
            <p className="text-xs text-muted-foreground">(нужно выбрать ровно 3 игрока)</p>
          </div>

          <Button
            type="button"
            variant="ghost"
            className="h-10 gap-2 px-4 text-primary hover:bg-primary/10 hover:text-primary/80"
            onClick={model.handleOpenAddPlayerModal}
          >
            <Plus className="h-4 w-4" /> Добавить
          </Button>
        </div>

        <div className="space-y-3">
          {model.players.map(player => {
            const selection = model.getSelectionMeta(player.id);

            return (
              <PlayerSetupCard
                key={player.id}
                layoutId={`player-${player.id}`}
                name={player.name}
                avatarUrl={player.avatarUrl}
                banner={player.banner}
                keyCode={selection.isSelected ? PLAYER_SELECTION_KEY_CODES[selection.selectedIndex] : undefined}
                isSelected={selection.isSelected}
                isDisabled={selection.isDisabled}
                onToggle={() => model.togglePlayerSelection(player.id)}
                onEdit={() => model.handleOpenEditPlayerModal(player.id)}
                onDelete={() => model.handleRequestDeletePlayer(player.id)}
              />
            );
          })}
        </div>

        <div className="pt-6">
          <Button
            disabled={!model.canContinue}
            type="button"
            onClick={model.handleContinue}
            className={cn(
              "h-14 w-full rounded-xl text-base font-bold",
              model.canContinue ? "shadow-lg shadow-primary/10" : "shadow-none"
            )}
          >
            Продолжить {model.selectedPlayersCount}/{model.playersToStartGame}
            <ChevronRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </motion.div>

      <AddPlayerModal
        isOpen={model.isAddPlayerModalOpen}
        onClose={model.closeAddPlayerModal}
        onSave={model.handleSavePlayer}
        presetAvatars={model.availablePresetAvatars}
        bannerOptions={model.availableBannerOptions}
      />

      <ExitGameModal
        isOpen={model.deleteCandidate !== null}
        title="Удалить игрока?"
        description={`Игрок «${model.deleteCandidate?.name ?? ""}» будет удален из списка.`}
        cancelLabel="Отмена"
        confirmLabel="Удалить"
        onCancel={model.handleCancelDeletePlayer}
        onConfirm={model.handleConfirmDeletePlayer}
      />
    </SetupShell>
  );
}
