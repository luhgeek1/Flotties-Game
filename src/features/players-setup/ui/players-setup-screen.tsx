import { useAtom, useSetAtom } from "jotai";
import { ChevronRight, Plus } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";

import {
  ADD_PLAYER_BANNER_OPTIONS,
  ADD_PLAYER_PRESET_AVATARS,
  type AddPlayerValues,
} from "@/entities/cosmetics";
import {
  PLAYER_SELECTION_KEY_CODES,
  PlayerSetupCard,
  type PlayerId,
} from "@/entities/players";
import { AddPlayerModal } from "@/features/add-player-modal";
import { ExitGameModal } from "@/features/exit-game";
import { Button } from "@/shared/components/ui/button";
import { cn } from "@/shared/lib/utils";
import {
  INITIAL_SETUP_ADD_PLAYER_MODAL_STATE,
  PLAYERS_TO_START_GAME,
  setupAddPlayerModalIsOpenAtom,
  setupAddPlayerModalStateAtom,
  setupPlayersAtom,
  setupSelectedPlayerIdsAtom,
} from "@/shared/store/setupAtoms";
import { SetupShell } from "@/widgets/setup-shell";

type PlayersSetupScreenProps = {
  onContinue?: () => void;
};

export function PlayersSetupScreen({ onContinue }: PlayersSetupScreenProps) {
  const [players, setPlayers] = useAtom(setupPlayersAtom);
  const [selectedPlayerIds, setSelectedPlayerIds] = useAtom(setupSelectedPlayerIdsAtom);
  const [isAddPlayerModalOpen, setIsAddPlayerModalOpen] = useAtom(setupAddPlayerModalIsOpenAtom);
  const setAddPlayerModalState = useSetAtom(setupAddPlayerModalStateAtom);
  const [deleteCandidateId, setDeleteCandidateId] = useState<PlayerId | null>(null);

  const togglePlayerSelection = (playerId: PlayerId) => {
    setSelectedPlayerIds(prevSelected => {
      if (prevSelected.includes(playerId)) {
        return prevSelected.filter(id => id !== playerId);
      }

      if (prevSelected.length >= PLAYERS_TO_START_GAME) {
        return prevSelected;
      }

      return [...prevSelected, playerId];
    });
  };

  const handleOpenAddPlayerModal = () => {
    setAddPlayerModalState({
      ...INITIAL_SETUP_ADD_PLAYER_MODAL_STATE,
      isOpen: true,
    });
  };

  const handleOpenEditPlayerModal = (playerId: PlayerId) => {
    setAddPlayerModalState(prev => ({
      ...prev,
      isOpen: true,
      editingPlayerId: playerId,
    }));
  };

  const handleSavePlayer = (values: AddPlayerValues, editingPlayerId: PlayerId | null) => {
    if (editingPlayerId) {
      setPlayers(prevPlayers => prevPlayers.map(player => (player.id === editingPlayerId ? {
        ...player,
        name: values.nickname,
        avatarUrl: values.avatar,
        banner: values.banner,
      } : player)));
      return;
    }

    setPlayers(prevPlayers => [
      ...prevPlayers,
      {
        id: window.crypto.randomUUID(),
        name: values.nickname,
        avatarUrl: values.avatar,
        banner: values.banner,
      },
    ]);
  };

  const handleRequestDeletePlayer = (playerId: PlayerId) => {
    setDeleteCandidateId(playerId);
  };

  const handleCancelDeletePlayer = () => {
    setDeleteCandidateId(null);
  };

  const handleConfirmDeletePlayer = () => {
    if (!deleteCandidateId) return;

    setPlayers(prevPlayers => prevPlayers.filter(player => player.id !== deleteCandidateId));
    setSelectedPlayerIds(prevSelected => prevSelected.filter(playerId => playerId !== deleteCandidateId));
    setDeleteCandidateId(null);
  };

  const deleteCandidate = players.find(player => player.id === deleteCandidateId) ?? null;

  const selectedPlayersCount = selectedPlayerIds.length;
  const canContinue = selectedPlayersCount === PLAYERS_TO_START_GAME;

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
            onClick={handleOpenAddPlayerModal}
          >
            <Plus className="h-4 w-4" /> Добавить
          </Button>
        </div>

        <div className="space-y-3">
          {players.map(player => {
            const selectedIndex = selectedPlayerIds.indexOf(player.id);
            const isSelected = selectedIndex !== -1;
            const isDisabled = selectedPlayersCount === PLAYERS_TO_START_GAME && !isSelected;

            return (
              <PlayerSetupCard
                key={player.id}
                layoutId={`player-${player.id}`}
                name={player.name}
                avatarUrl={player.avatarUrl}
                banner={player.banner}
                keyCode={isSelected ? PLAYER_SELECTION_KEY_CODES[selectedIndex] : undefined}
                isSelected={isSelected}
                isDisabled={isDisabled}
                onToggle={() => togglePlayerSelection(player.id)}
                onEdit={() => handleOpenEditPlayerModal(player.id)}
                onDelete={() => handleRequestDeletePlayer(player.id)}
              />
            );
          })}
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
            Продолжить {selectedPlayersCount}/{PLAYERS_TO_START_GAME}
            <ChevronRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </motion.div>

      <AddPlayerModal
        isOpen={isAddPlayerModalOpen}
        onClose={() => setIsAddPlayerModalOpen(false)}
        onSave={handleSavePlayer}
        presetAvatars={ADD_PLAYER_PRESET_AVATARS}
        bannerOptions={ADD_PLAYER_BANNER_OPTIONS}
      />

      <ExitGameModal
        isOpen={deleteCandidate !== null}
        title="Удалить игрока?"
        description={`Игрок «${deleteCandidate?.name ?? ""}» будет удален из списка.`}
        cancelLabel="Отмена"
        confirmLabel="Удалить"
        onCancel={handleCancelDeletePlayer}
        onConfirm={handleConfirmDeletePlayer}
      />
    </SetupShell>
  );
}
