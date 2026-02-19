import defaultAva from "@/shared/assets/default-user-avatar.svg";

export type AvatarOption = {
  type: "emoji" | "image";
  value: string;
};

export type BannerOption = {
  id: string;
  label: string;
  value: string;
};

export type AddPlayerValues = {
  nickname: string;
  avatar: string;
  banner: string;
};

export const DEFAULT_ADD_PLAYER_AVATAR = defaultAva;

export const ADD_PLAYER_PRESET_AVATARS: AvatarOption[] = [
  { type: "image", value: DEFAULT_ADD_PLAYER_AVATAR },
  { type: "emoji", value: "😎" },
  { type: "emoji", value: "🤖" },
  { type: "emoji", value: "🦊" },
];

export const ADD_PLAYER_BANNER_OPTIONS: BannerOption[] = [
  { id: "banner-1", label: "Белый", value: "bg-white" },
  { id: "banner-2", label: "Серый", value: "bg-slate-50" },
  { id: "banner-3", label: "Голубой", value: "bg-sky-50" },
  { id: "banner-4", label: "Синий", value: "bg-blue-50" },
  { id: "banner-5", label: "Зеленый", value: "bg-emerald-50" },
  { id: "banner-6", label: "Лайм", value: "bg-lime-50" },
  { id: "banner-7", label: "Желтый", value: "bg-amber-50" },
  { id: "banner-8", label: "Оранжевый", value: "bg-orange-50" },
  { id: "banner-9", label: "Розовый", value: "bg-rose-50" },
  { id: "banner-10", label: "Фиолетовый", value: "bg-violet-50" },
];
