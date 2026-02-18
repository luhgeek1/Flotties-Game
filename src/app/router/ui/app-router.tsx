import { useCallback, useEffect, useState } from "react";
import { useAtom, useAtomValue, useSetAtom } from "jotai";

import { GamePage, GamePage2R } from "@/pages/game";
import { FinalPrepairingPage } from "@/pages/final-prepairing";
import { FinalCloseEyesPage, FinalStartThemePage } from "@/pages/final";
import { SetupPage } from "@/pages/setup";
import {
  MIN_PLAYERS_TO_START_GAME,
  setupSelectedPackIdAtom,
  setupSelectedPlayerIdsAtom,
} from "@/shared/store/setupAtoms";
import { gameRound2UnlockedAtom } from "@/shared/store/gameAtoms";
import { resetGameRoundStateAtom, resetGameSessionAtom } from "@/shared/store/reset-game-session";
import {
  ROUTE_PATH,
  coerceRoute,
  getInitialRoute,
  resolveRoute,
  type AppRoute,
} from "../lib/route-guard";

type NavigateOptions = {
  replace?: boolean;
  resetState?: "none" | "round" | "session";
  round2Access?: "lock" | "unlock" | "keep";
};

function resolveRound2Access(current: boolean, mode: NavigateOptions["round2Access"] = "keep"): boolean {
  if (mode === "unlock") return true;
  if (mode === "lock") return false;
  return current;
}

export function AppRouter() {
  const [isRound2Unlocked, setIsRound2Unlocked] = useAtom(gameRound2UnlockedAtom);
  const selectedPlayerIds = useAtomValue(setupSelectedPlayerIdsAtom);
  const selectedPackId = useAtomValue(setupSelectedPackIdAtom);
  const canEnterGame = selectedPlayerIds.length >= MIN_PLAYERS_TO_START_GAME && selectedPackId !== null;
  const [route, setRoute] = useState<AppRoute>(
    () => getInitialRoute(window.location.pathname, isRound2Unlocked, canEnterGame),
  );
  const resetGameRoundState = useSetAtom(resetGameRoundStateAtom);
  const resetGameSession = useSetAtom(resetGameSessionAtom);

  useEffect(() => {
    const handlePopState = () => {
      const nextRoute = coerceRoute({
        requestedRoute: resolveRoute(window.location.pathname),
        currentRoute: route,
        isRound2Unlocked,
        canEnterGame,
      });
      const nextPath = ROUTE_PATH[nextRoute];

      if (window.location.pathname !== nextPath) {
        window.history.replaceState(null, "", nextPath);
      }

      setRoute(nextRoute);
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [canEnterGame, isRound2Unlocked, route]);

  useEffect(() => {
    const expectedPath = ROUTE_PATH[route];
    if (window.location.pathname === expectedPath) return;

    window.history.replaceState(null, "", expectedPath);
  }, [route]);

  const navigateTo = useCallback((
    nextRoute: AppRoute,
    options?: NavigateOptions,
  ) => {
    const nextIsRound2Unlocked = resolveRound2Access(isRound2Unlocked, options?.round2Access);
    const guardedRoute = coerceRoute({
      requestedRoute: nextRoute,
      currentRoute: route,
      isRound2Unlocked: nextIsRound2Unlocked,
      canEnterGame,
    });

    if (options?.resetState === "session") {
      resetGameSession();
    } else if (options?.resetState === "round") {
      resetGameRoundState();
    }

    if (nextIsRound2Unlocked !== isRound2Unlocked) {
      setIsRound2Unlocked(nextIsRound2Unlocked);
    }

    const nextPath = ROUTE_PATH[guardedRoute];

    if (window.location.pathname !== nextPath) {
      if (options?.replace) {
        window.history.replaceState(null, "", nextPath);
      } else {
        window.history.pushState(null, "", nextPath);
      }
    }

    setRoute(guardedRoute);
  }, [canEnterGame, isRound2Unlocked, resetGameRoundState, resetGameSession, route, setIsRound2Unlocked]);

  if (route === "game") {
    return (
      <GamePage
        onExitToSetup={() => navigateTo("setup", {
          round2Access: "lock",
          resetState: "session",
        })}
        onRoundTransitionConfirm={() => navigateTo("game2r", {
          replace: true,
          resetState: "round",
          round2Access: "unlock",
        })}
      />
    );
  }

  if (route === "game2r") {
    return (
      <GamePage2R
        onExitToSetup={() => navigateTo("setup", {
          round2Access: "lock",
          resetState: "session",
        })}
        onRoundTransitionConfirm={() => navigateTo("finalprepairing", {
          replace: true,
          resetState: "round",
          round2Access: "unlock",
        })}
      />
    );
  }

  if (route === "finalprepairing") {
    return (
      <FinalPrepairingPage
        onConfirmFinalQuestion={() => navigateTo("finalstarttheme", {
          replace: true,
          round2Access: "unlock",
        })}
        onExitToSetup={() => navigateTo("setup", {
          round2Access: "lock",
          resetState: "session",
        })}
      />
    );
  }

  if (route === "finalstarttheme") {
    return (
      <FinalStartThemePage
        onNext={() => navigateTo("finalcloseeyes", {
          replace: true,
          round2Access: "unlock",
        })}
        onExitToSetup={() => navigateTo("setup", {
          round2Access: "lock",
          resetState: "session",
        })}
      />
    );
  }

  if (route === "finalcloseeyes") {
    return (
      <FinalCloseEyesPage
        onExitToSetup={() => navigateTo("setup", {
          round2Access: "lock",
          resetState: "session",
        })}
      />
    );
  }

  return <SetupPage onStartGame={() => navigateTo("game", {
    round2Access: "lock",
    resetState: "session",
  })} />;
}
