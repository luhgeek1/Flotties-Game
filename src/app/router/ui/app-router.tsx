import { useCallback, useEffect, useState } from "react";
import { useAtom, useAtomValue, useSetAtom } from "jotai";

import { GamePage, GamePage2R } from "@/pages/game";
import { FinalPrepairingPage } from "@/pages/final-prepairing";
import { FinalStartThemePage } from "@/pages/final";
import { SetupPage } from "@/pages/setup";
import {
  MIN_PLAYERS_TO_START_GAME,
  setupSelectedPackIdAtom,
  setupSelectedPlayerIdsAtom,
  setupStepAtom,
} from "@/shared/store/setupAtoms";
import {
  gameActiveQuestionIdAtom,
  gameIsExitModalOpenAtom,
  gameOpenedQuestionIdsAtom,
  gameRound2UnlockedAtom,
  gameRound2StartPickerIdAtom,
  gameQuestionFlowStateAtom,
} from "@/shared/store/gameAtoms";
import { resetRoundSpecialMapsAtom } from "@/shared/store/specialCIBAtom";
import { resetAuctionStateAtom } from "@/shared/store/specialAuctionAtom";
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
  resetSetupStep?: boolean;
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
  const setActiveQuestionId = useSetAtom(gameActiveQuestionIdAtom);
  const setOpenedQuestionIds = useSetAtom(gameOpenedQuestionIdsAtom);
  const setQuestionFlowState = useSetAtom(gameQuestionFlowStateAtom);
  const setIsExitModalOpen = useSetAtom(gameIsExitModalOpenAtom);
  const setRound2StartPickerId = useSetAtom(gameRound2StartPickerIdAtom);
  const resetRoundSpecialMaps = useSetAtom(resetRoundSpecialMapsAtom);
  const resetAuctionState = useSetAtom(resetAuctionStateAtom);
  const setSetupStep = useSetAtom(setupStepAtom);

  const resetQuestionRoundState = useCallback(() => {
    setActiveQuestionId(null);
    setOpenedQuestionIds([]);
    setQuestionFlowState(null);
    setIsExitModalOpen(false);
    setRound2StartPickerId(null);
    resetRoundSpecialMaps();
    resetAuctionState();
  }, [
    resetAuctionState,
    resetRoundSpecialMaps,
    setActiveQuestionId,
    setIsExitModalOpen,
    setOpenedQuestionIds,
    setQuestionFlowState,
    setRound2StartPickerId,
  ]);

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

    if (options?.resetQuestionState) {
      resetQuestionRoundState();
    }

    if (options?.resetSetupStep) {
      setSetupStep("players");
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
  }, [canEnterGame, isRound2Unlocked, resetQuestionRoundState, route, setIsRound2Unlocked, setSetupStep]);

  if (route === "game") {
    return (
      <GamePage
        onExitToSetup={() => navigateTo("setup", {
          round2Access: "lock",
          resetQuestionState: true,
          resetSetupStep: true,
        })}
        onRoundTransitionConfirm={() => navigateTo("game2r", {
          replace: true,
          resetQuestionState: true,
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
          resetQuestionState: true,
          resetSetupStep: true,
        })}
        onRoundTransitionConfirm={() => navigateTo("finalprepairing", {
          replace: true,
          resetQuestionState: true,
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
          resetQuestionState: true,
          resetSetupStep: true,
        })}
      />
    );
  }

  if (route === "finalstarttheme") {
    return (
      <FinalStartThemePage
        onExitToSetup={() => navigateTo("setup", {
          round2Access: "lock",
          resetQuestionState: true,
          resetSetupStep: true,
        })}
      />
    );
  }

  return <SetupPage onStartGame={() => navigateTo("game", {
    round2Access: "lock",
    resetQuestionState: true,
  })} />;
}
