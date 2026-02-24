import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { useCallback, useMemo, useState } from "react";

import {
  ADD_PLAYER_BANNER_OPTIONS,
  ADD_PLAYER_PRESET_AVATARS,
  SHOP_DEFAULT_OWNED_AVATAR_VALUE,
  SHOP_DEFAULT_OWNED_BANNER_VALUES,
  type AddPlayerValues,
} from "@/entities/cosmetics";
import type { PlayerId } from "@/entities/players";
import {
  INITIAL_SETUP_ADD_PLAYER_MODAL_STATE,
  PLAYERS_TO_START_GAME,
  setupAddPlayerModalIsOpenAtom,
  setupAddPlayerModalStateAtom,
  setupPlayersAtom,
  setupSelectedPlayerIdsAtom,
} from "@/features/game-session/store/setupAtoms";
import {
  createDefaultShopPlayerInventory,
  shopPlayerInventoriesAtom,
} from "@/features/shop/store/shopAtoms";

type UsePlayersSetupScreenArgs = {
  onContinue?: () => void;
};

function toUniqueValues(values: string[]): string[] {
  return Array.from(new Set(values));
}

export function usePlayersSetupScreen({ onContinue }: UsePlayersSetupScreenArgs = {}) {
  const [players, setPlayers] = useAtom(setupPlayersAtom);
  const [selectedPlayerIds, setSelectedPlayerIds] = useAtom(setupSelectedPlayerIdsAtom);
  const [isAddPlayerModalOpen, setIsAddPlayerModalOpen] = useAtom(setupAddPlayerModalIsOpenAtom);
  const addPlayerModalState = useAtomValue(setupAddPlayerModalStateAtom);
  const setAddPlayerModalState = useSetAtom(setupAddPlayerModalStateAtom);
  const [playerInventories, setPlayerInventories] = useAtom(shopPlayerInventoriesAtom);
  const [deleteCandidateId, setDeleteCandidateId] = useState<PlayerId | null>(null);

  const editingPlayer = useMemo(() => {
    if (!addPlayerModalState.editingPlayerId) {
      return null;
    }

    return players.find(player => player.id === addPlayerModalState.editingPlayerId) ?? null;
  }, [addPlayerModalState.editingPlayerId, players]);

  const availablePresetAvatars = useMemo(() => {
    const editingInventory = editingPlayer
      ? playerInventories[editingPlayer.id] ?? createDefaultShopPlayerInventory()
      : createDefaultShopPlayerInventory();
    const ownedValues = new Set([
      ...editingInventory.ownedAvatarValues,
      editingPlayer?.avatarUrl ?? "",
    ]);
    const filteredAvatars = ADD_PLAYER_PRESET_AVATARS.filter(avatar => ownedValues.has(avatar.value));

    return filteredAvatars.length > 0 ? filteredAvatars : ADD_PLAYER_PRESET_AVATARS.slice(0, 1);
  }, [editingPlayer, playerInventories]);

  const availableBannerOptions = useMemo(() => {
    const editingInventory = editingPlayer
      ? playerInventories[editingPlayer.id] ?? createDefaultShopPlayerInventory()
      : createDefaultShopPlayerInventory();
    const ownedValues = new Set([
      ...editingInventory.ownedBannerValues,
      editingPlayer?.banner ?? "",
    ]);
    const filteredBanners = ADD_PLAYER_BANNER_OPTIONS.filter(banner => ownedValues.has(banner.value));

    return filteredBanners.length > 0 ? filteredBanners : ADD_PLAYER_BANNER_OPTIONS.slice(0, 1);
  }, [editingPlayer, playerInventories]);

  const defaultAvatarForNewPlayer = useMemo(() => {
    return SHOP_DEFAULT_OWNED_AVATAR_VALUE || availablePresetAvatars[0]?.value || ADD_PLAYER_PRESET_AVATARS[0]?.value || "";
  }, [availablePresetAvatars]);

  const defaultBannerForNewPlayer = useMemo(() => {
    return SHOP_DEFAULT_OWNED_BANNER_VALUES[0] ?? availableBannerOptions[0]?.value ?? ADD_PLAYER_BANNER_OPTIONS[0]?.value ?? "bg-white";
  }, [availableBannerOptions]);

  const selectedPlayersCount = selectedPlayerIds.length;
  const canContinue = selectedPlayersCount === PLAYERS_TO_START_GAME;
  const deleteCandidate = players.find(player => player.id === deleteCandidateId) ?? null;

  const getSelectionMeta = useCallback((playerId: PlayerId) => {
    const selectedIndex = selectedPlayerIds.indexOf(playerId);
    const isSelected = selectedIndex !== -1;
    const isDisabled = selectedPlayersCount === PLAYERS_TO_START_GAME && !isSelected;

    return {
      selectedIndex,
      isSelected,
      isDisabled,
    };
  }, [selectedPlayerIds, selectedPlayersCount]);

  const togglePlayerSelection = useCallback((playerId: PlayerId) => {
    setSelectedPlayerIds(prevSelected => {
      if (prevSelected.includes(playerId)) {
        return prevSelected.filter(id => id !== playerId);
      }

      if (prevSelected.length >= PLAYERS_TO_START_GAME) {
        return prevSelected;
      }

      return [...prevSelected, playerId];
    });
  }, [setSelectedPlayerIds]);

  const handleOpenAddPlayerModal = useCallback(() => {
    setAddPlayerModalState({
      ...INITIAL_SETUP_ADD_PLAYER_MODAL_STATE,
      isOpen: true,
      avatar: defaultAvatarForNewPlayer,
      banner: defaultBannerForNewPlayer,
    });
  }, [defaultAvatarForNewPlayer, defaultBannerForNewPlayer, setAddPlayerModalState]);

  const handleOpenEditPlayerModal = useCallback((playerId: PlayerId) => {
    setAddPlayerModalState(prev => ({
      ...prev,
      isOpen: true,
      editingPlayerId: playerId,
    }));
  }, [setAddPlayerModalState]);

  const closeAddPlayerModal = useCallback(() => {
    setIsAddPlayerModalOpen(false);
  }, [setIsAddPlayerModalOpen]);

  const handleSavePlayer = useCallback((values: AddPlayerValues, editingPlayerId: PlayerId | null) => {
    if (editingPlayerId) {
      setPlayers(prevPlayers => prevPlayers.map(player => (player.id === editingPlayerId ? {
        ...player,
        name: values.nickname,
        avatarUrl: values.avatar,
        banner: values.banner,
      } : player)));

      setPlayerInventories(prevInventories => {
        const currentInventory = prevInventories[editingPlayerId] ?? createDefaultShopPlayerInventory();

        return {
          ...prevInventories,
          [editingPlayerId]: {
            ...currentInventory,
            ownedAvatarValues: toUniqueValues([
              ...currentInventory.ownedAvatarValues,
              values.avatar,
            ]),
            ownedBannerValues: toUniqueValues([
              ...currentInventory.ownedBannerValues,
              values.banner,
            ]),
          },
        };
      });

      return;
    }

    const newPlayerId = window.crypto.randomUUID();

    setPlayers(prevPlayers => [
      ...prevPlayers,
      {
        id: newPlayerId,
        name: values.nickname,
        avatarUrl: values.avatar,
        banner: values.banner,
        balance: 0,
      },
    ]);

    setPlayerInventories(prevInventories => ({
      ...prevInventories,
      [newPlayerId]: {
        ...createDefaultShopPlayerInventory(),
        ownedAvatarValues: toUniqueValues([
          SHOP_DEFAULT_OWNED_AVATAR_VALUE,
          values.avatar,
        ]),
        ownedBannerValues: toUniqueValues([
          ...SHOP_DEFAULT_OWNED_BANNER_VALUES,
          values.banner,
        ]),
      },
    }));
  }, [setPlayerInventories, setPlayers]);

  const handleRequestDeletePlayer = useCallback((playerId: PlayerId) => {
    setDeleteCandidateId(playerId);
  }, []);

  const handleCancelDeletePlayer = useCallback(() => {
    setDeleteCandidateId(null);
  }, []);

  const handleConfirmDeletePlayer = useCallback(() => {
    if (!deleteCandidateId) return;

    setPlayers(prevPlayers => prevPlayers.filter(player => player.id !== deleteCandidateId));
    setSelectedPlayerIds(prevSelected => prevSelected.filter(playerId => playerId !== deleteCandidateId));

    setPlayerInventories(prevInventories => {
      if (!(deleteCandidateId in prevInventories)) {
        return prevInventories;
      }

      const nextInventories = { ...prevInventories };
      delete nextInventories[deleteCandidateId];

      return nextInventories;
    });

    setDeleteCandidateId(null);
  }, [deleteCandidateId, setPlayerInventories, setPlayers, setSelectedPlayerIds]);

  const handleContinue = useCallback(() => {
    if (!canContinue) return;
    onContinue?.();
  }, [canContinue, onContinue]);

  return {
    players,
    playersToStartGame: PLAYERS_TO_START_GAME,
    selectedPlayersCount,
    canContinue,
    isAddPlayerModalOpen,
    availablePresetAvatars,
    availableBannerOptions,
    deleteCandidate,
    getSelectionMeta,
    togglePlayerSelection,
    handleOpenAddPlayerModal,
    handleOpenEditPlayerModal,
    closeAddPlayerModal,
    handleSavePlayer,
    handleRequestDeletePlayer,
    handleCancelDeletePlayer,
    handleConfirmDeletePlayer,
    handleContinue,
  };
}
