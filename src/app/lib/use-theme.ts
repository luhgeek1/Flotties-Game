import { useAtomValue, useSetAtom } from "jotai";
import { useLayoutEffect } from "react";

import { themeAtom, type ThemeMode } from "@/app/store/themeAtom";

export function useTheme() {
  const theme = useAtomValue(themeAtom);
  const setTheme = useSetAtom(themeAtom);

  const setThemeMode = (nextTheme: ThemeMode) => {
    setTheme(nextTheme);
  };

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === "dark" ? "light" : "dark"));
  };

  return {
    theme,
    isDark: theme === "dark",
    setTheme: setThemeMode,
    toggleTheme,
  };
}

export function useSyncThemeClass() {
  const theme = useAtomValue(themeAtom);

  useLayoutEffect(() => {
    const rootElement = document.documentElement;
    const isDarkTheme = theme === "dark";

    rootElement.classList.toggle("dark", isDarkTheme);
    rootElement.style.colorScheme = isDarkTheme ? "dark" : "light";
  }, [theme]);
}
