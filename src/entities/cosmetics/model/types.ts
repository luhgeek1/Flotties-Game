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

export type TryOnItem = {
  id: string;
  title: string;
  cardSrc: string;
  overlaySrc: string | null;
};

export type ShopAvatarItem = {
  id: string;
  name: string;
  value: string;
  price: number;
};

export type ShopBannerItem = {
  id: string;
  name: string;
  value: string;
  price: number;
};

export type ShopWearableItem = {
  id: string;
  name: string;
  value: string;
  price: number;
  cardSrc: string;
};

export type AvatarCatalogItem = {
  id: string;
  addPlayerLabel: string;
  shopName: string;
  value: string;
  price: number;
};

export type BannerCatalogItem = {
  id: string;
  addPlayerLabel: string;
  shopName: string;
  value: string;
  price: number;
};

export type WearableCatalogItem = {
  id: string;
  value: string;
  tryOnTitle: string;
  shopName: string;
  price: number;
  cardSrc: string;
  overlaySrc: string | null;
};
