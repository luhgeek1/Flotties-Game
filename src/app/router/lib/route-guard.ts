export type AppRoute = "setup" | "game" | "game2r";

export const ROUTE_PATH = {
  setup: "/",
  game: "/game",
  game2r: "/game2r",
} satisfies Record<AppRoute, string>;

export function resolveRoute(pathname: string): AppRoute {
  if (pathname === ROUTE_PATH.game) {
    return "game";
  }

  if (pathname === ROUTE_PATH.game2r) {
    return "game2r";
  }

  return "setup";
}

type CoerceRouteArgs = {
  requestedRoute: AppRoute;
  currentRoute: AppRoute;
  isRound2Unlocked: boolean;
};

export function coerceRoute({
  requestedRoute,
  currentRoute,
  isRound2Unlocked,
}: CoerceRouteArgs): AppRoute {
  if (requestedRoute === "game2r" && !isRound2Unlocked) {
    return currentRoute;
  }

  if (requestedRoute === "game" && isRound2Unlocked) {
    return "game2r";
  }

  return requestedRoute;
}

export function getInitialRoute(pathname: string, isRound2Unlocked: boolean): AppRoute {
  return coerceRoute({
    requestedRoute: resolveRoute(pathname),
    currentRoute: "setup",
    isRound2Unlocked,
  });
}
