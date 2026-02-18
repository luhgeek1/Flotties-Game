export type AppRoute = "setup" | "game" | "game2r" | "finalprepairing";

export const ROUTE_PATH = {
  setup: "/",
  game: "/game",
  game2r: "/game2r",
  finalprepairing: "/final-prepairing",
} satisfies Record<AppRoute, string>;

export function resolveRoute(pathname: string): AppRoute {
  if (pathname === ROUTE_PATH.game) {
    return "game";
  }

  if (pathname === ROUTE_PATH.game2r) {
    return "game2r";
  }

  if (pathname === ROUTE_PATH.finalprepairing) {
    return "finalprepairing";
  }

  return "setup";
}

type CoerceRouteArgs = {
  requestedRoute: AppRoute;
  currentRoute: AppRoute;
  isRound2Unlocked: boolean;
  canEnterGame: boolean;
};

export function coerceRoute({
  requestedRoute,
  currentRoute,
  isRound2Unlocked,
  canEnterGame,
}: CoerceRouteArgs): AppRoute {
  if (
    (requestedRoute === "game" || requestedRoute === "game2r" || requestedRoute === "finalprepairing")
    && !canEnterGame
  ) {
    return "setup";
  }

  if ((requestedRoute === "game2r" || requestedRoute === "finalprepairing") && !isRound2Unlocked) {
    return currentRoute;
  }

  if (requestedRoute === "game" && isRound2Unlocked) {
    return "game2r";
  }

  return requestedRoute;
}

export function getInitialRoute(
  pathname: string,
  isRound2Unlocked: boolean,
  canEnterGame: boolean,
): AppRoute {
  return coerceRoute({
    requestedRoute: resolveRoute(pathname),
    currentRoute: "setup",
    isRound2Unlocked,
    canEnterGame,
  });
}
