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
import type {
  AvatarCatalogItem,
  AvatarOption,
  BannerCatalogItem,
  BannerOption,
  ShopAvatarItem,
  ShopBannerItem,
  ShopWearableItem,
  TryOnItem,
  WearableCatalogItem,
} from "./types";

const DEFAULT_AVATAR_VALUE = defaultAva;
const DEFAULT_BANNER_VALUE = "bg-white";
const DEFAULT_WEARABLE_VALUE = "none";

export const COSMETICS_AVATAR_CATALOG: readonly AvatarCatalogItem[] = [
  {
    id: "avatar-1",
    addPlayerLabel: "Базовый",
    shopName: "Базовый",
    value: DEFAULT_AVATAR_VALUE,
    price: 0,
  },
  {
    id: "avatar-2",
    addPlayerLabel: "Flotti",
    shopName: "Flotti",
    value: avaFlotti,
    price: 120,
  },
  {
    id: "avatar-3",
    addPlayerLabel: "Prod",
    shopName: "Prod",
    value: avaProd,
    price: 180,
  },
  {
    id: "avatar-4",
    addPlayerLabel: "Golden",
    shopName: "Golden",
    value: avaGolden,
    price: 240,
  },
];

export const COSMETICS_BANNER_CATALOG: readonly BannerCatalogItem[] = [
  {
    id: "banner-1",
    addPlayerLabel: "Белый",
    shopName: "Ivory Pulse",
    value: DEFAULT_BANNER_VALUE,
    price: 0,
  },
  { id: "banner-2", addPlayerLabel: "Голубой", shopName: "Sky Mist", value: "bg-sky-50", price: 35 },
  { id: "banner-3", addPlayerLabel: "Синий", shopName: "Blue Echo", value: "bg-blue-50", price: 45 },
  { id: "banner-4", addPlayerLabel: "Зеленый", shopName: "Mint Orbit", value: "bg-emerald-50", price: 55 },
  { id: "banner-5", addPlayerLabel: "Лайм", shopName: "Lime Spark", value: "bg-lime-50", price: 65 },
  { id: "banner-6", addPlayerLabel: "Желтый", shopName: "Amber Glow", value: "bg-amber-50", price: 75 },
  { id: "banner-7", addPlayerLabel: "Оранжевый", shopName: "Sunset Drift", value: "bg-orange-50", price: 85 },
  { id: "banner-8", addPlayerLabel: "Розовый", shopName: "Rose Cloud", value: "bg-rose-50", price: 95 },
  { id: "banner-9", addPlayerLabel: "Фиолетовый", shopName: "Violet Nova", value: "bg-violet-50", price: 105 },
];

export const COSMETICS_WEARABLE_CATALOG: readonly WearableCatalogItem[] = [
  {
    id: "wearable-none",
    value: DEFAULT_WEARABLE_VALUE,
    tryOnTitle: "Без предмета",
    shopName: "Без предмета",
    price: 0,
    cardSrc: shopLotti,
    overlaySrc: null,
  },
  {
    id: "wearable-cap",
    value: "cap",
    tryOnTitle: "Кепка",
    shopName: "Кепка",
    price: 45,
    cardSrc: capCardImage,
    overlaySrc: capImage,
  },
  {
    id: "wearable-cilindr",
    value: "cilindr",
    tryOnTitle: "Цилиндр",
    shopName: "Цилиндр",
    price: 65,
    cardSrc: cilindrCardImage,
    overlaySrc: cilindrImage,
  },
  {
    id: "wearable-corona",
    value: "corona",
    tryOnTitle: "Корона",
    shopName: "Корона",
    price: 80,
    cardSrc: coronaCardImage,
    overlaySrc: coronaImage,
  },
  {
    id: "wearable-garland",
    value: "garland",
    tryOnTitle: "Гирлянда",
    shopName: "Гирлянда",
    price: 55,
    cardSrc: garlandCardImage,
    overlaySrc: garlandImage,
  },
  {
    id: "wearable-sungl",
    value: "sungl",
    tryOnTitle: "Очки",
    shopName: "Очки",
    price: 50,
    cardSrc: sunglCardImage,
    overlaySrc: sunglImage,
  },
  {
    id: "wearable-green",
    value: "green",
    tryOnTitle: "Зеленая",
    shopName: "Футболка Green",
    price: 60,
    cardSrc: greenCardImage,
    overlaySrc: tshirtGreenImage,
  },
  {
    id: "wearable-yellow",
    value: "yellow",
    tryOnTitle: "Оранжевая",
    shopName: "Футболка Yellow",
    price: 60,
    cardSrc: yellowCardImage,
    overlaySrc: tshirtOrangeImage,
  },
];

export const DEFAULT_PLAYER_AVATAR = DEFAULT_AVATAR_VALUE;

export const ADD_PLAYER_PRESET_AVATARS: AvatarOption[] = COSMETICS_AVATAR_CATALOG.map(item => ({
  value: item.value,
}));

export const ADD_PLAYER_BANNER_OPTIONS: BannerOption[] = COSMETICS_BANNER_CATALOG.map(item => ({
  id: item.id,
  label: item.addPlayerLabel,
  value: item.value,
}));

export const TRY_ON_ITEMS: TryOnItem[] = COSMETICS_WEARABLE_CATALOG.map(item => ({
  id: item.value,
  title: item.tryOnTitle,
  cardSrc: item.cardSrc,
  overlaySrc: item.overlaySrc,
}));

export const SHOP_AVATAR_ITEMS: ShopAvatarItem[] = COSMETICS_AVATAR_CATALOG.map(item => ({
  id: item.id,
  name: item.shopName,
  value: item.value,
  price: item.price,
}));

export const SHOP_BANNER_ITEMS: ShopBannerItem[] = COSMETICS_BANNER_CATALOG.map(item => ({
  id: item.id,
  name: item.shopName,
  value: item.value,
  price: item.price,
}));

export const SHOP_WEARABLE_ITEMS: ShopWearableItem[] = COSMETICS_WEARABLE_CATALOG
  .filter(item => item.value !== DEFAULT_WEARABLE_VALUE)
  .map(item => ({
    id: item.id,
    name: item.shopName,
    value: item.value,
    price: item.price,
    cardSrc: item.cardSrc,
  }));

export const SHOP_DEFAULT_OWNED_AVATAR_VALUE = DEFAULT_AVATAR_VALUE;
export const SHOP_DEFAULT_OWNED_BANNER_VALUES = [DEFAULT_BANNER_VALUE];
export const SHOP_DEFAULT_OWNED_WEARABLE_VALUES: string[] = [];
export const SHOP_DEFAULT_EQUIPPED_WEARABLE_VALUE = DEFAULT_WEARABLE_VALUE;
export const SHOP_DEFAULT_EQUIPPED_AVATAR_VALUE = SHOP_DEFAULT_OWNED_AVATAR_VALUE;
export const SHOP_DEFAULT_EQUIPPED_BANNER_VALUE = SHOP_DEFAULT_OWNED_BANNER_VALUES[0];
