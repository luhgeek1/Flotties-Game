import { atomWithStorage } from "jotai/utils";

const AUCTION_BANNER_OPEN_STORAGE_KEY = "game-auction-banner-open";
const CAT_IN_BAG_BANNER_OPEN_STORAGE_KEY = "game-cat-in-bag-banner-open";

export const auctionBannerOpenAtom = atomWithStorage<boolean>(
  AUCTION_BANNER_OPEN_STORAGE_KEY,
  false,
  undefined,
  { getOnInit: true },
);

export const catInBagBannerOpenAtom = atomWithStorage<boolean>(
  CAT_IN_BAG_BANNER_OPEN_STORAGE_KEY,
  false,
  undefined,
  { getOnInit: true },
);

