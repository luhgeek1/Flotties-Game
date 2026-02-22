import { ROUTE_PATH, type AppRoute } from "../lib/route-guard";

const GAME_ROUTE_LOCK_STORAGE_KEY = "game-route-lock";

function isAppRoute(value: unknown): value is AppRoute {
  return typeof value === "string" && value in ROUTE_PATH;
}

export function readRouteLockRoute(): AppRoute | null {
  if (typeof window === "undefined") return null;

  const raw = window.localStorage.getItem(GAME_ROUTE_LOCK_STORAGE_KEY);
  if (!isAppRoute(raw)) return null;
  if (raw === "setup" || raw === "shop" || raw === "history") return null;

  return raw;
}

export function writeRouteLockRoute(route: AppRoute | null) {
  if (typeof window === "undefined") return;

  if (!route || route === "setup" || route === "shop" || route === "history") {
    window.localStorage.removeItem(GAME_ROUTE_LOCK_STORAGE_KEY);
    return;
  }

  window.localStorage.setItem(GAME_ROUTE_LOCK_STORAGE_KEY, route);
}
