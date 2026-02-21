import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { History } from "lucide-react";
import { AnimatePresence } from "motion/react";
import { SetupOnboardingOverlay } from "@/features/onboarding";
import { PlayersSetupScreen } from "@/features/players-setup";
import { PacksSetupScreen } from "@/features/packs-setup";
import { Button } from "@/shared/components/ui/button";
import { markOnboardingStartedGameAtom, onboardingStartedGameAtom } from "@/shared/store/onboardingAtom";
import { setupStepAtom } from "@/shared/store/setupAtoms";

type SetupPageProps = {
  onStartGame?: () => void;
  onOpenHistory?: () => void;
};

export function SetupPage({ onStartGame, onOpenHistory }: SetupPageProps) {
  const [step, setStep] = useAtom(setupStepAtom);
  const hasOnboardingFlag = useAtomValue(onboardingStartedGameAtom);
  const markOnboardingStartedGame = useSetAtom(markOnboardingStartedGameAtom);

  return (
    <>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={onOpenHistory}
        className="fixed left-4 top-4 z-30 border border-border bg-card/70 backdrop-blur hover:bg-card md:left-8 md:top-8"
      >
        <History className="w-4 h-4 mr-2" />
        История
      </Button>

      <AnimatePresence mode="wait">
        {step === "players" ? (
          <PlayersSetupScreen key="players-screen" onContinue={() => setStep("packs")} />
        ) : (
          <PacksSetupScreen
            key="packs-screen"
            onBack={() => setStep("players")}
            onStart={onStartGame}
          />
        )}
      </AnimatePresence>

      {!hasOnboardingFlag ? (
        <SetupOnboardingOverlay onClose={markOnboardingStartedGame} />
      ) : null}
    </>
  );
}
