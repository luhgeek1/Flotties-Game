import { ExitGameModal } from "@/features/exit-game";
import { useAppNavigation } from "../model/useAppNavigation";
import { RouteView } from "./RouteView";

export function AppRouter() {
  const navigation = useAppNavigation();

  return (
    <>
      <RouteView
        route={navigation.route}
        navigateTo={navigation.navigateTo}
        onStartGame={navigation.handleStartGame}
        onPrepareFinalAnswersStage={navigation.prepareFinalAnswersStage}
        onExitToSetup={navigation.handleExitToSetup}
      />

      <ExitGameModal
        isOpen={navigation.isHistoryExitModalOpen}
        onCancel={navigation.handleHistoryExitCancel}
        onConfirm={navigation.handleHistoryExitConfirm}
      />
    </>
  );
}
