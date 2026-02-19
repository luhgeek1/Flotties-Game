import defaultAva from "@/shared/assets/default-user-avatar.svg";
import avaProd from "@/shared/assets/avaProd.jpg";
import avaFlotti from "@/shared/assets/avaFlotti.jpg";
import avaGolden from "@/shared/assets/avaGolden.jpg";

export type AvatarOption = {
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
  { value: DEFAULT_ADD_PLAYER_AVATAR },
  { value: avaFlotti },
  { value: avaProd },
  { value: avaGolden },
];

export const ADD_PLAYER_BANNER_OPTIONS: BannerOption[] = [
  { id: "banner-1", label: "Белый", value: "bg-white" },
  { id: "banner-2", label: "Голубой", value: "bg-sky-50" },
  { id: "banner-3", label: "Синий", value: "bg-blue-50" },
  { id: "banner-4", label: "Зеленый", value: "bg-emerald-50" },
  { id: "banner-5", label: "Лайм", value: "bg-lime-50" },
  { id: "banner-6", label: "Желтый", value: "bg-amber-50" },
  { id: "banner-7", label: "Оранжевый", value: "bg-orange-50" },
  { id: "banner-8", label: "Розовый", value: "bg-rose-50" },
  { id: "banner-9", label: "Фиолетовый", value: "bg-violet-50" },
];
