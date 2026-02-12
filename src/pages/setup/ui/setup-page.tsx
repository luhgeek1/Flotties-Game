import { useState } from "react";
import { AnimatePresence } from "motion/react";
import { PlayersSetupScreen } from "@/features/players-setup";
import { PacksSetupScreen } from "@/features/packs-setup";

type SetupStep = "players" | "packs";

export function SetupPage() {
  const [step, setStep] = useState<SetupStep>("players");

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
