import { useAtom, useSetAtom } from "jotai";
import { useEffect, useRef, useState, type ChangeEvent } from "react";

import type { PlayerId } from "@/entities/players";
import {
  setupPlayersAtom,
  resetSetupAddPlayerModalStateAtom,
  setupAddPlayerModalStateAtom,
} from "@/shared/store/setupAtoms";
import type { AddPlayerValues } from "@/entities/cosmetics";

type UseAddPlayerModalArgs = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (values: AddPlayerValues, editingPlayerId: PlayerId | null) => void;
};

export function useAddPlayerModal({
  isOpen,
  onClose,
  onSave,
}: UseAddPlayerModalArgs) {
  const [players] = useAtom(setupPlayersAtom);
  const [modalState, setModalState] = useAtom(setupAddPlayerModalStateAtom);
  const resetModalState = useSetAtom(resetSetupAddPlayerModalStateAtom);
  const [error, setError] = useState("");
  const nickname = modalState.nickname;
  const avatar = modalState.avatar;
  const banner = modalState.banner;
  const editingPlayerId = modalState.editingPlayerId;

  const fileRef = useRef<HTMLInputElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const timeoutId = window.setTimeout(() => {
      inputRef.current?.focus();
    }, 50);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || !editingPlayerId) return;

    const editingPlayer = players.find(player => player.id === editingPlayerId);
    if (!editingPlayer) return;

    setModalState(prev => ({
      ...prev,
      nickname: editingPlayer.name,
      avatar: editingPlayer.avatarUrl,
      banner: editingPlayer.banner,
    }));
  }, [isOpen, editingPlayerId, players, setModalState]);

  const setAvatar = (value: string) => {
    setModalState(prev => ({ ...prev, avatar: value }));
  };

  const setBanner = (value: string) => {
    setModalState(prev => ({ ...prev, banner: value }));
  };

  const reset = () => {
    resetModalState();
    setError("");
    const fileInput = fileRef.current;
    if (fileInput) {
      fileInput.value = "";
    }
  };

  const close = () => {
    reset();
    onClose();
  };

  const triggerUpload = () => {
    fileRef.current?.click();
  };

  const onFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setError("Файл слишком большой (макс. 5 МБ)");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatar(reader.result as string);
      setError("");
    };
    reader.readAsDataURL(file);
  };

  const submit = () => {
    const trimmedNickname = nickname.trim();
    if (!trimmedNickname) {
      setError("Пожалуйста, введите никнейм");
      return;
    }

    const normalizedNickname = trimmedNickname.toLowerCase();
    const hasDuplicateNickname = players.some(player => (
      player.id !== editingPlayerId
      && player.name.trim().toLowerCase() === normalizedNickname
    ));

    if (hasDuplicateNickname) {
      setError("Игрок с таким никнеймом уже существует");
      return;
    }

    onSave({ nickname: trimmedNickname, avatar, banner }, editingPlayerId);
    close();
  };

  const onNicknameChange = (value: string) => {
    setModalState(prev => ({ ...prev, nickname: value }));
    if (error) {
      setError("");
    }
  };

  return {
    nickname,
    avatar,
    banner,
    editingPlayerId,
    error,
    fileRef,
    inputRef,
    setAvatar,
    setBanner,
    close,
    triggerUpload,
    onFileChange,
    submit,
    onNicknameChange,
  };
}
