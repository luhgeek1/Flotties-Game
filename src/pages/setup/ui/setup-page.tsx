import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { History, ShoppingBag } from "lucide-react";
import { AnimatePresence } from "motion/react";
import { useState } from "react";
import { SetupOnboardingOverlay } from "@/features/onboarding";
import { ShopPlayerSelectModal } from "@/features/shop";
import { PlayersSetupScreen } from "@/features/players-setup";
import { PacksSetupScreen } from "@/features/packs-setup";
import { Button } from "@/shared/components/ui/button";
import { markOnboardingStartedGameAtom, onboardingStartedGameAtom } from "@/shared/store/onboardingAtom";
import { setupStepAtom, setupPlayersAtom } from "@/shared/store/setupAtoms";
import { shopActivePlayerIdAtom } from "@/shared/store/shopAtoms";

type SetupPageProps = {
  onStartGame?: () => void;
  onOpenShop?: () => void;
  onOpenHistory?: () => void;
};

export function SetupPage({ onStartGame, onOpenShop, onOpenHistory }: SetupPageProps) {
  const [step, setStep] = useAtom(setupStepAtom);
  const players = useAtomValue(setupPlayersAtom);
  const hasOnboardingFlag = useAtomValue(onboardingStartedGameAtom);
  const markOnboardingStartedGame = useSetAtom(markOnboardingStartedGameAtom);
  const setShopActivePlayerId = useSetAtom(shopActivePlayerIdAtom);
  const [isShopModalOpen, setIsShopModalOpen] = useState(false);

  const handleOpenShopPlayerSelect = () => {
    setIsShopModalOpen(true);
  };

  const handleCloseShopPlayerSelect = () => {
    setIsShopModalOpen(false);
  };

  const handleSelectShopPlayer = (playerId: string) => {
    setShopActivePlayerId(playerId);
    setIsShopModalOpen(false);
    onOpenShop?.();
  };

  return (
    <>
      <div className="fixed left-4 top-4 z-30 flex items-center gap-2 md:left-8 md:top-8">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleOpenShopPlayerSelect}
          className="border border-border bg-card/70 backdrop-blur hover:bg-card"
        >
          <ShoppingBag className="w-4 h-4 mr-2" />
          Магазин
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onOpenHistory}
          className="border border-border bg-card/70 backdrop-blur hover:bg-card"
        >
          <History className="w-4 h-4 mr-2" />
          История
        </Button>
      </div>

      <AnimatePresence mode="wait" initial={false}>
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

      <ShopPlayerSelectModal
        isOpen={isShopModalOpen}
        players={players}
        onClose={handleCloseShopPlayerSelect}
        onSelectPlayer={handleSelectShopPlayer}
      />

      {!hasOnboardingFlag ? (
        <SetupOnboardingOverlay onClose={markOnboardingStartedGame} />
      ) : null}
    </>
  );
}
