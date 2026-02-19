import { GamePage, GamePage2R } from "@/pages/game";
import { FinalPrepairingPage } from "@/pages/final-prepairing";
import { FinalBidPage, FinalCloseEyesPage, FinalQuestionPage, FinalResultsPage, FinalStartThemePage } from "@/pages/final";
import { SetupPage } from "@/pages/setup";
import type { AppRoute } from "../lib/route-guard";
import type { NavigateOptions } from "../model/useAppNavigation";

type RouteViewProps = {
  route: AppRoute;
  onExitToSetup: () => void;
  onPrepareFinalAnswersStage: () => void;
  navigateTo: (nextRoute: AppRoute, options?: NavigateOptions) => void;
};

export function RouteView({
  route,
  onExitToSetup,
  onPrepareFinalAnswersStage,
  navigateTo,
}: RouteViewProps) {
  if (route === "game") {
    return (
      <GamePage
        onExitToSetup={onExitToSetup}
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
        onExitToSetup={onExitToSetup}
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
        onExitToSetup={onExitToSetup}
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
        onExitToSetup={onExitToSetup}
      />
    );
  }

  if (route === "finalcloseeyes") {
    return (
      <FinalCloseEyesPage
        mode="WAGER"
        onReady={() => navigateTo("finalbid", {
          replace: true,
          round2Access: "unlock",
        })}
        onExitToSetup={onExitToSetup}
      />
    );
  }

  if (route === "finalbid") {
    return (
      <FinalBidPage
        onConfirmBid={() => navigateTo("finalcloseeyes", {
          replace: true,
          round2Access: "unlock",
        })}
        onAllBidsDone={() => {
          onPrepareFinalAnswersStage();
          navigateTo("finalcloseeyesquestion", {
            replace: true,
            round2Access: "unlock",
          });
        }}
        onExitToSetup={onExitToSetup}
      />
    );
  }

  if (route === "finalcloseeyesquestion") {
    return (
      <FinalCloseEyesPage
        mode="ANSWER"
        onReady={() => navigateTo("finalquestion", {
          replace: true,
          round2Access: "unlock",
        })}
        onExitToSetup={onExitToSetup}
      />
    );
  }

  if (route === "finalquestion") {
    return (
      <FinalQuestionPage
        onConfirmAnswer={() => navigateTo("finalcloseeyesquestion", {
          replace: true,
          round2Access: "unlock",
        })}
        onAllAnswersDone={() => navigateTo("finalresults", {
          replace: true,
          round2Access: "unlock",
        })}
        onExitToSetup={onExitToSetup}
      />
    );
  }

  if (route === "finalresults") {
    return (
      <FinalResultsPage
        onReset={onExitToSetup}
        onExitToSetup={onExitToSetup}
      />
    );
  }

  return (
    <SetupPage
      onStartGame={() => navigateTo("game", {
        round2Access: "lock",
        resetState: "session",
      })}
    />
  );
}
