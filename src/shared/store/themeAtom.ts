import { atomWithStorage } from "jotai/utils";

export type ThemeMode = "light" | "dark";

const THEME_STORAGE_KEY = "app-theme";

export const themeAtom = atomWithStorage<ThemeMode>(
  THEME_STORAGE_KEY,
  "light",
  undefined,
  { getOnInit: true },
);
