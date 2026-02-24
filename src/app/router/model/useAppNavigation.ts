import { useCallback, useEffect, useState } from "react";
import { useAtom, useAtomValue, useSetAtom } from "jotai";

import { useGameHistory } from "@/features/history";
import { useOnboarding } from "@/features/onboarding";
import { prepareFinalAnswersStageAtom } from "@/features/game-session/store/finalAtom";
import { gamePlayerScoresAtom, gameRound2UnlockedAtom } from "@/features/game-session/store/gameAtoms";
import { resetGameRoundStateAtom, resetGameSessionAtom } from "@/features/game-session/store/reset-game-session";
import {
  PLAYERS_TO_START_GAME,
  setupPlayersAtom,
  setupSelectedPackIdAtom,
  setupSelectedPlayerIdsAtom,
} from "@/features/game-session/store/setupAtoms";
import { shopActivePlayerIdAtom } from "@/features/shop/store/shopAtoms";
import {
  ROUTE_PATH,
  coerceRoute,
  getInitialRoute,
  type AppRoute,
} from "../lib/route-guard";
import { readRouteLockRoute, writeRouteLockRoute } from "./routeLockStorage";
import { getLocationPath, pushHashPath, replaceHashPath } from "./routeLocation";
import { useRouteImagePreload } from "./useRouteImagePreload";
import { useRouteHistorySync } from "./useRouteHistorySync";

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
  return route !== "setup" && route !== "shop" && route !== "history";
}

export function useAppNavigation() {
  const [isRound2Unlocked, setIsRound2Unlocked] = useAtom(gameRound2UnlockedAtom);
  const setupPlayers = useAtomValue(setupPlayersAtom);
  const activeShopPlayerId = useAtomValue(shopActivePlayerIdAtom);
  const selectedPlayerIds = useAtomValue(setupSelectedPlayerIdsAtom);
  const selectedPackId = useAtomValue(setupSelectedPackIdAtom);
  const playerScores = useAtomValue(gamePlayerScoresAtom);
  const canEnterGame = selectedPlayerIds.length === PLAYERS_TO_START_GAME && selectedPackId !== null;
  const canEnterShop = setupPlayers.some(player => player.id === activeShopPlayerId);
  const canEnterFinal = selectedPlayerIds.some(playerId => (playerScores[playerId] ?? 0) > 0);
  const [route, setRoute] = useState<AppRoute>(() => {
    const routeLockRoute = readRouteLockRoute();

    if (routeLockRoute && canEnterGame) {
      return coerceRoute({
        requestedRoute: routeLockRoute,
        currentRoute: "setup",
        isRound2Unlocked,
        canEnterGame,
        canEnterShop,
        canEnterFinal,
      });
    }

    return getInitialRoute(
      getLocationPath(),
      isRound2Unlocked,
      canEnterGame,
      canEnterShop,
      canEnterFinal,
    );
  });
  const resetGameRoundState = useSetAtom(resetGameRoundStateAtom);
  const resetGameSession = useSetAtom(resetGameSessionAtom);
  const { appendCurrentGameToHistory, markGameStarted, resetRoundMvps } = useGameHistory();
  const { markOnboardingStartedGame } = useOnboarding();
  const prepareFinalAnswersStage = useSetAtom(prepareFinalAnswersStageAtom);
  const [isHistoryExitModalOpen, setIsHistoryExitModalOpen] = useState(false);

  const openHistoryExitModal = useCallback(() => {
    setIsHistoryExitModalOpen(true);
  }, []);

  useRouteImagePreload(route);
  useRouteHistorySync({
    route,
    isRound2Unlocked,
    canEnterGame,
    canEnterShop,
    canEnterFinal,
    setRoute,
    onHistoryExitRequested: openHistoryExitModal,
  });

  useEffect(() => {
    if (canEnterGame) return;

    writeRouteLockRoute(null);
  }, [canEnterGame]);

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
      canEnterShop,
      canEnterFinal,
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

    if (getLocationPath() !== nextPath) {
      if (options?.replace) {
        replaceHashPath(nextPath);
      } else {
        pushHashPath(nextPath);
      }
    }

    setRoute(guardedRoute);
  }, [canEnterFinal, canEnterGame, canEnterShop, isRound2Unlocked, resetGameRoundState, resetGameSession, resetRoundMvps, route, setIsRound2Unlocked]);

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
    markOnboardingStartedGame();
  }, [markGameStarted, markOnboardingStartedGame, navigateTo]);

  const handleOpenHistory = useCallback(() => {
    navigateTo("history", { replace: true, resetState: "none" });
  }, [navigateTo]);

  const handleOpenShop = useCallback(() => {
    navigateTo("shop", { replace: true, resetState: "none" });
  }, [navigateTo]);

  const handleCloseToSetup = useCallback(() => {
    navigateTo("setup", { replace: true, resetState: "none" });
  }, [navigateTo]);

  return {
    route,
    navigateTo,
    prepareFinalAnswersStage,
    handleStartGame,
    handleOpenHistory,
    handleOpenShop,
    handleCloseHistory: handleCloseToSetup,
    handleCloseShop: handleCloseToSetup,
    handleExitToSetup,
    isHistoryExitModalOpen,
    handleHistoryExitCancel,
    handleHistoryExitConfirm,
  };
}
