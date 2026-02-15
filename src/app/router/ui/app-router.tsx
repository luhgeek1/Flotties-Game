import { useCallback, useEffect, useState } from "react";
import { useAtom, useSetAtom } from "jotai";

import { GamePage, GamePage2R } from "@/pages/game";
import { SetupPage } from "@/pages/setup";
import {
  gameActiveQuestionIdAtom,
  gameIsExitModalOpenAtom,
  gameOpenedQuestionIdsAtom,
  gameRound2UnlockedAtom,
  gameQuestionFlowStateAtom,
} from "@/shared/store/gameAtoms";
import {
  ROUTE_PATH,
  coerceRoute,
  getInitialRoute,
  resolveRoute,
  type AppRoute,
} from "../lib/route-guard";

type NavigateOptions = {
  replace?: boolean;
  resetQuestionState?: boolean;
  round2Access?: "lock" | "unlock" | "keep";
};

function resolveRound2Access(current: boolean, mode: NavigateOptions["round2Access"] = "keep"): boolean {
  if (mode === "unlock") return true;
  if (mode === "lock") return false;
  return current;
}

export function AppRouter() {
  const [isRound2Unlocked, setIsRound2Unlocked] = useAtom(gameRound2UnlockedAtom);
  const [route, setRoute] = useState<AppRoute>(() => getInitialRoute(window.location.pathname, isRound2Unlocked));
  const setActiveQuestionId = useSetAtom(gameActiveQuestionIdAtom);
  const setOpenedQuestionIds = useSetAtom(gameOpenedQuestionIdsAtom);
  const setQuestionFlowState = useSetAtom(gameQuestionFlowStateAtom);
  const setIsExitModalOpen = useSetAtom(gameIsExitModalOpenAtom);

  const resetQuestionRoundState = useCallback(() => {
    setActiveQuestionId(null);
    setOpenedQuestionIds([]);
    setQuestionFlowState(null);
    setIsExitModalOpen(false);
  }, [setActiveQuestionId, setIsExitModalOpen, setOpenedQuestionIds, setQuestionFlowState]);

  useEffect(() => {
    const handlePopState = () => {
      const nextRoute = coerceRoute({
        requestedRoute: resolveRoute(window.location.pathname),
        currentRoute: route,
        isRound2Unlocked,
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
  }, [isRound2Unlocked, route]);

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
    });

    if (options?.resetQuestionState) {
      resetQuestionRoundState();
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
  }, [isRound2Unlocked, resetQuestionRoundState, route, setIsRound2Unlocked]);

  if (route === "game") {
    return (
      <GamePage
        onExitToSetup={() => navigateTo("setup", { round2Access: "lock" })}
        onRoundTransitionConfirm={() => navigateTo("game2r", {
          replace: true,
          resetQuestionState: true,
          round2Access: "unlock",
        })}
      />
    );
  }

  if (route === "game2r") {
    return <GamePage2R onExitToSetup={() => navigateTo("setup", { round2Access: "lock" })} />;
  }

  return <SetupPage onStartGame={() => navigateTo("game", {
    round2Access: "lock",
    resetQuestionState: true,
  })} />;
}
