import { useEffect } from "react";

import { ROUTE_PATH, coerceRoute, resolveRoute, type AppRoute } from "../lib/route-guard";
import { getLocationPath, pushHashPath, replaceHashPath } from "./routeLocation";

type UseRouteHistorySyncArgs = {
  route: AppRoute;
  isRound2Unlocked: boolean;
  canEnterGame: boolean;
  canEnterShop: boolean;
  canEnterFinal: boolean;
  setRoute: (nextRoute: AppRoute) => void;
  onHistoryExitRequested: () => void;
};

function isGameFlowRoute(route: AppRoute): boolean {
  return route !== "setup" && route !== "shop" && route !== "history";
}

export function useRouteHistorySync({
  route,
  isRound2Unlocked,
  canEnterGame,
  canEnterShop,
  canEnterFinal,
  setRoute,
  onHistoryExitRequested,
}: UseRouteHistorySyncArgs) {
  useEffect(() => {
    const handleLocationChange = () => {
      const requestedRoute = resolveRoute(getLocationPath());

      if (isGameFlowRoute(route) && requestedRoute !== route) {
        const currentPath = ROUTE_PATH[route];
        if (getLocationPath() !== currentPath) {
          pushHashPath(currentPath);
        }

        onHistoryExitRequested();
        return;
      }

      const nextRoute = coerceRoute({
        requestedRoute,
        currentRoute: route,
        isRound2Unlocked,
        canEnterGame,
        canEnterShop,
        canEnterFinal,
      });
      const nextPath = ROUTE_PATH[nextRoute];

      if (getLocationPath() !== nextPath) {
        replaceHashPath(nextPath);
      }

      setRoute(nextRoute);
    };

    window.addEventListener("popstate", handleLocationChange);
    window.addEventListener("hashchange", handleLocationChange);

    return () => {
      window.removeEventListener("popstate", handleLocationChange);
      window.removeEventListener("hashchange", handleLocationChange);
    };
  }, [
    canEnterFinal,
    canEnterGame,
    canEnterShop,
    isRound2Unlocked,
    onHistoryExitRequested,
    route,
    setRoute,
  ]);

  useEffect(() => {
    const expectedPath = ROUTE_PATH[route];
    if (getLocationPath() === expectedPath) return;

    replaceHashPath(expectedPath);
  }, [route]);
}
