import { useAtom } from "jotai";
import { AnimatePresence } from "motion/react";
import { PlayersSetupScreen } from "@/features/players-setup";
import { PacksSetupScreen } from "@/features/packs-setup";
import { setupStepAtom } from "@/shared/store/setupAtoms";

export function SetupPage() {
  const [step, setStep] = useAtom(setupStepAtom);

  return (
    <AnimatePresence mode="wait">
      {step === "players" ? (
        <PlayersSetupScreen key="players-screen" onContinue={() => setStep("packs")} />
      ) : (
        <PacksSetupScreen key="packs-screen" onBack={() => setStep("players")} />
      )}
    </AnimatePresence>
  );
}
