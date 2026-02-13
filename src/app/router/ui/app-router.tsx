import { useEffect, useState } from "react";

import { GamePage } from "@/pages/game";
import { SetupPage } from "@/pages/setup";

type AppRoute = "setup" | "game";

const ROUTE_PATH = {
  setup: "/",
  game: "/game",
} satisfies Record<AppRoute, string>;

function resolveRoute(pathname: string): AppRoute {
  if (pathname === ROUTE_PATH.game) {
    return "game";
  }

  return "setup";
}

export function AppRouter() {
  const [route, setRoute] = useState<AppRoute>(() => resolveRoute(window.location.pathname));

  useEffect(() => {
    const handlePopState = () => {
      setRoute(resolveRoute(window.location.pathname));
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  const navigateTo = (nextRoute: AppRoute) => {
    const nextPath = ROUTE_PATH[nextRoute];

    if (window.location.pathname !== nextPath) {
      window.history.pushState(null, "", nextPath);
    }

    setRoute(nextRoute);
  };

  if (route === "game") {
    return <GamePage onExitToSetup={() => navigateTo("setup")} />;
  }

  return <SetupPage onStartGame={() => navigateTo("game")} />;
}
