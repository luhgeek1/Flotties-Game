import defaultAva from "@/shared/assets/default-user-avatar.svg";
import avaProd from "@/shared/assets/avaProd.jpg";
import avaFlotti from "@/shared/assets/avaFlotti.jpg";
import avaGolden from "@/shared/assets/avaGolden.jpg";
import shopLotti from "@/shared/assets/variants/lottiprof.png";
import capImage from "@/shared/assets/variants/cap.png";
import cilindrImage from "@/shared/assets/variants/cilindr.png";
import coronaImage from "@/shared/assets/variants/corona.png";
import garlandImage from "@/shared/assets/variants/garland.png";
import sunglImage from "@/shared/assets/variants/sungl.png";
import tshirtGreenImage from "@/shared/assets/variants/tshirt-green.png";
import tshirtOrangeImage from "@/shared/assets/variants/tshirt-orange.png";
import capCardImage from "@/shared/assets/variants/card/capVb.png";
import cilindrCardImage from "@/shared/assets/variants/card/cilindrVb.png";
import coronaCardImage from "@/shared/assets/variants/card/coronaVb.png";
import garlandCardImage from "@/shared/assets/variants/card/garlandVb.png";
import sunglCardImage from "@/shared/assets/variants/card/sunglVb.png";
import greenCardImage from "@/shared/assets/variants/card/greenVb.png";
import yellowCardImage from "@/shared/assets/variants/card/yellowVb.png";

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

export const DEFAULT_PLAYER_AVATAR = defaultAva;

export const ADD_PLAYER_PRESET_AVATARS: AvatarOption[] = [
  { value: DEFAULT_PLAYER_AVATAR },
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

export const TRY_ON_ITEMS = [
  { id: "none", title: "Без предмета", cardSrc: shopLotti, overlaySrc: null },
  { id: "cap", title: "Кепка", cardSrc: capCardImage, overlaySrc: capImage },
  { id: "cilindr", title: "Цилиндр", cardSrc: cilindrCardImage, overlaySrc: cilindrImage },
  { id: "corona", title: "Корона", cardSrc: coronaCardImage, overlaySrc: coronaImage },
  { id: "garland", title: "Гирлянда", cardSrc: garlandCardImage, overlaySrc: garlandImage },
  { id: "sungl", title: "Очки", cardSrc: sunglCardImage, overlaySrc: sunglImage },
  { id: "green", title: "Зеленая", cardSrc: greenCardImage, overlaySrc: tshirtGreenImage },
  { id: "yellow", title: "Оранжевая", cardSrc: yellowCardImage, overlaySrc: tshirtOrangeImage },
] as const;
