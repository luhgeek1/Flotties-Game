export type AppRoute =
  | "setup"
  | "shop"
  | "history"
  | "game"
  | "game2r"
  | "finalprepairing"
  | "finalstarttheme"
  | "finalcloseeyes"
  | "finalbid"
  | "finalcloseeyesquestion"
  | "finalquestion"
  | "finalresults";

export const ROUTE_PATH = {
  setup: "/",
  shop: "/shop",
  history: "/history",
  game: "/game",
  game2r: "/game2r",
  finalprepairing: "/final-prepairing",
  finalstarttheme: "/final-start-theme",
  finalcloseeyes: "/final-close-eyes",
  finalbid: "/final-bid",
  finalcloseeyesquestion: "/final-close-eyes-question",
  finalquestion: "/final-question",
  finalresults: "/final-results",
} satisfies Record<AppRoute, string>;

export function resolveRoute(pathname: string): AppRoute {
  if (pathname === ROUTE_PATH.shop) {
    return "shop";
  }

  if (pathname === ROUTE_PATH.history) {
    return "history";
  }

  if (pathname === ROUTE_PATH.game) {
    return "game";
  }

  if (pathname === ROUTE_PATH.game2r) {
    return "game2r";
  }

  if (pathname === ROUTE_PATH.finalprepairing) {
    return "finalprepairing";
  }

  if (pathname === ROUTE_PATH.finalstarttheme) {
    return "finalstarttheme";
  }

  if (pathname === ROUTE_PATH.finalcloseeyes) {
    return "finalcloseeyes";
  }

  if (pathname === ROUTE_PATH.finalbid) {
    return "finalbid";
  }

  if (pathname === ROUTE_PATH.finalcloseeyesquestion) {
    return "finalcloseeyesquestion";
  }

  if (pathname === ROUTE_PATH.finalquestion) {
    return "finalquestion";
  }

  if (pathname === ROUTE_PATH.finalresults) {
    return "finalresults";
  }

  return "setup";
}

type CoerceRouteArgs = {
  requestedRoute: AppRoute;
  currentRoute: AppRoute;
  isRound2Unlocked: boolean;
  canEnterGame: boolean;
  canEnterShop: boolean;
  canEnterFinal: boolean;
};

export function coerceRoute({
  requestedRoute,
  currentRoute,
  isRound2Unlocked,
  canEnterGame,
  canEnterShop,
  canEnterFinal,
}: CoerceRouteArgs): AppRoute {
  if (requestedRoute === "shop" && !canEnterShop) {
    return "setup";
  }

  if (
    (requestedRoute === "game"
      || requestedRoute === "game2r"
      || requestedRoute === "finalprepairing"
      || requestedRoute === "finalstarttheme"
      || requestedRoute === "finalcloseeyes"
      || requestedRoute === "finalbid"
      || requestedRoute === "finalcloseeyesquestion"
      || requestedRoute === "finalquestion"
      || requestedRoute === "finalresults")
    && !canEnterGame
  ) {
    return "setup";
  }

  if (
    (requestedRoute === "game2r"
      || requestedRoute === "finalprepairing"
      || requestedRoute === "finalstarttheme"
      || requestedRoute === "finalcloseeyes"
      || requestedRoute === "finalbid"
      || requestedRoute === "finalcloseeyesquestion"
      || requestedRoute === "finalquestion"
      || requestedRoute === "finalresults")
    && !isRound2Unlocked
  ) {
    return currentRoute;
  }

  if (requestedRoute === "game" && isRound2Unlocked) {
    return "game2r";
  }

  if (
    (requestedRoute === "finalstarttheme"
      || requestedRoute === "finalcloseeyes"
      || requestedRoute === "finalbid"
      || requestedRoute === "finalcloseeyesquestion"
      || requestedRoute === "finalquestion"
      || requestedRoute === "finalresults")
    && !canEnterFinal
  ) {
    return "finalprepairing";
  }

  return requestedRoute;
}

export function getInitialRoute(
  pathname: string,
  isRound2Unlocked: boolean,
  canEnterGame: boolean,
  canEnterShop: boolean,
  canEnterFinal: boolean,
): AppRoute {
  return coerceRoute({
    requestedRoute: resolveRoute(pathname),
    currentRoute: "setup",
    isRound2Unlocked,
    canEnterGame,
    canEnterShop,
    canEnterFinal,
  });
}
