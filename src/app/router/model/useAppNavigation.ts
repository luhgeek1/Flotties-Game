import { useCallback, useEffect, useState } from "react";
import { useAtom, useAtomValue, useSetAtom } from "jotai";

import { useGameHistory } from "@/features/history";
import { prepareFinalAnswersStageAtom } from "@/shared/store/finalAtom";
import { gameRound2UnlockedAtom } from "@/shared/store/gameAtoms";
import { resetGameRoundStateAtom, resetGameSessionAtom } from "@/shared/store/reset-game-session";
import {
  PLAYERS_TO_START_GAME,
  setupSelectedPackIdAtom,
  setupSelectedPlayerIdsAtom,
} from "@/shared/store/setupAtoms";
import {
  ROUTE_PATH,
  coerceRoute,
  getInitialRoute,
  resolveRoute,
  type AppRoute,
} from "../lib/route-guard";
import { readRouteLockRoute, writeRouteLockRoute } from "./routeLockStorage";

export type NavigateOptions = {
  replace?: boolean;
  resetState?: "none" | "round" | "session";
  round2Access?: "lock" | "unlock" | "keep";
};

function resolveRound2Access(current: boolean, mode: NavigateOptions["round2Access"] = "keep"): boolean {
  if (mode === "unlock") return true;
  if (mode === "lock") return false;
  return current;
}

function isGameFlowRoute(route: AppRoute): boolean {
  return route !== "setup";
}

export function useAppNavigation() {
  const [isRound2Unlocked, setIsRound2Unlocked] = useAtom(gameRound2UnlockedAtom);
  const selectedPlayerIds = useAtomValue(setupSelectedPlayerIdsAtom);
  const selectedPackId = useAtomValue(setupSelectedPackIdAtom);
  const canEnterGame = selectedPlayerIds.length === PLAYERS_TO_START_GAME && selectedPackId !== null;
  const [route, setRoute] = useState<AppRoute>(() => {
    const routeLockRoute = readRouteLockRoute();

    if (routeLockRoute && canEnterGame) {
      return routeLockRoute;
    }

    return getInitialRoute(window.location.pathname, isRound2Unlocked, canEnterGame);
  });
  const resetGameRoundState = useSetAtom(resetGameRoundStateAtom);
  const resetGameSession = useSetAtom(resetGameSessionAtom);
  const { appendCurrentGameToHistory, markGameStarted, resetRoundMvps } = useGameHistory();
  const prepareFinalAnswersStage = useSetAtom(prepareFinalAnswersStageAtom);
  const [isHistoryExitModalOpen, setIsHistoryExitModalOpen] = useState(false);

  useEffect(() => {
    if (canEnterGame) return;

    writeRouteLockRoute(null);
  }, [canEnterGame]);

  useEffect(() => {
    const handlePopState = () => {
      const requestedRoute = resolveRoute(window.location.pathname);

      if (isGameFlowRoute(route) && requestedRoute !== route) {
        const currentPath = ROUTE_PATH[route];
        if (window.location.pathname !== currentPath) {
          window.history.pushState(null, "", currentPath);
        }

        setIsHistoryExitModalOpen(true);
        return;
      }

      const nextRoute = coerceRoute({
        requestedRoute,
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
    setIsHistoryExitModalOpen(false);

    const nextIsRound2Unlocked = resolveRound2Access(isRound2Unlocked, options?.round2Access);
    const guardedRoute = coerceRoute({
      requestedRoute: nextRoute,
      currentRoute: route,
      isRound2Unlocked: nextIsRound2Unlocked,
      canEnterGame,
    });

    if (options?.resetState === "session") {
      resetRoundMvps();
      resetGameSession();
    } else if (options?.resetState === "round") {
      resetGameRoundState();
    }

    if (nextIsRound2Unlocked !== isRound2Unlocked) {
      setIsRound2Unlocked(nextIsRound2Unlocked);
    }

    if (guardedRoute === "setup") {
      writeRouteLockRoute(null);
    } else if (isGameFlowRoute(guardedRoute)) {
      writeRouteLockRoute(guardedRoute);
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
  }, [canEnterGame, isRound2Unlocked, resetGameRoundState, resetGameSession, resetRoundMvps, route, setIsRound2Unlocked]);

  const handleExitToSetup = useCallback(() => {
    appendCurrentGameToHistory();
    navigateTo("setup", {
      replace: true,
      round2Access: "lock",
      resetState: "session",
    });
  }, [appendCurrentGameToHistory, navigateTo]);

  const handleHistoryExitCancel = useCallback(() => {
    setIsHistoryExitModalOpen(false);
  }, []);

  const handleHistoryExitConfirm = useCallback(() => {
    handleExitToSetup();
  }, [handleExitToSetup]);

  const handleStartGame = useCallback(() => {
    const startedAt = new Date().toISOString();

    navigateTo("game", {
      round2Access: "lock",
      resetState: "session",
    });
    markGameStarted(startedAt);
  }, [markGameStarted, navigateTo]);

  return {
    route,
    navigateTo,
    prepareFinalAnswersStage,
    handleStartGame,
    handleExitToSetup,
    isHistoryExitModalOpen,
    handleHistoryExitCancel,
    handleHistoryExitConfirm,
  };
}
