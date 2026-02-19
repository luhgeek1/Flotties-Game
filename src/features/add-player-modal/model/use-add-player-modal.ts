import { useAtom, useSetAtom } from "jotai";
import { useEffect, useRef, type ChangeEvent } from "react";

import { resetSetupAddPlayerModalStateAtom, setupAddPlayerModalStateAtom } from "@/shared/store/setupAtoms";
import {
  DEFAULT_ADD_PLAYER_AVATAR,
  type AddPlayerValues,
  type BannerOption,
} from "./defaults";

type UseAddPlayerModalArgs = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (values: AddPlayerValues) => void;
  bannerOptions: BannerOption[];
};

export function useAddPlayerModal({
  isOpen,
  onClose,
  onSave,
  bannerOptions,
}: UseAddPlayerModalArgs) {
  const defaultBanner = bannerOptions[0]?.value ?? "bg-white";

  const [modalState, setModalState] = useAtom(setupAddPlayerModalStateAtom);
  const resetModalState = useSetAtom(resetSetupAddPlayerModalStateAtom);
  const nickname = modalState.nickname;
  const avatar = modalState.avatar ?? DEFAULT_ADD_PLAYER_AVATAR;
  const banner = modalState.banner ?? defaultBanner;
  const error = modalState.error;

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

  const setAvatar = (value: string) => {
    setModalState(prev => ({ ...prev, avatar: value }));
  };

  const setBanner = (value: string) => {
    setModalState(prev => ({ ...prev, banner: value }));
  };

  const setError = (value: string) => {
    setModalState(prev => ({ ...prev, error: value }));
  };

  const reset = () => {
    resetModalState();
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

    onSave({ nickname: trimmedNickname, avatar, banner });
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
