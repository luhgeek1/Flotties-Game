import { motion } from "motion/react";
import { useAtomValue } from "jotai";

import doFinalImage from "@/shared/assets/dofinal.png";
import { Button } from "@/shared/components/ui/button";
import { gamePlayerScoresAtom } from "@/features/game-session/store/gameAtoms";
import { setupSelectedPlayerIdsAtom } from "@/features/game-session/store/setupAtoms";
import { Header } from "@/widgets/header";

type FinalPrepairingPageProps = {
  onExitToSetup?: () => void;
  onConfirmFinalQuestion?: () => void;
};

export function FinalPrepairingPage({
  onExitToSetup,
  onConfirmFinalQuestion,
}: FinalPrepairingPageProps) {
  const selectedPlayerIds = useAtomValue(setupSelectedPlayerIdsAtom);
  const playerScores = useAtomValue(gamePlayerScoresAtom);
  const hasFinalPlayers = selectedPlayerIds.some(playerId => (playerScores[playerId] ?? 0) > 0);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans selection:bg-primary/30 transition-colors duration-300">
      <Header
        title="FinalPrepairing"
        subtitle="Подготовка к финалу"
        onExitToSetup={onExitToSetup}
      />

      <main className="relative flex-1 overflow-hidden">
        {!hasFinalPlayers ? (
          <div className="absolute inset-0 flex items-center justify-center px-4">
            <div className="flex w-full max-w-xl flex-col items-center gap-8 rounded-3xl border border-border/80 bg-card/95 p-8 text-center shadow-xl backdrop-blur-sm md:p-10">
              <p className="text-4xl font-black leading-tight text-foreground md:text-5xl">
                Игра Окончена
              </p>
              <Button
                type="button"
                size="lg"
                className="w-full max-w-xs px-10"
                onClick={onExitToSetup}
              >
                Новая игра
              </Button>
            </div>
          </div>
        ) : (
          <>
            <motion.section
              className="absolute z-20 left-12 top-[46%] flex min-h-260px w-[min(92vw,640px)] -translate-y-1/2 flex-col items-center justify-center gap-8 rounded-3xl border border-border/80 bg-card/95 p-8 text-center shadow-xl backdrop-blur-sm md:left-24 md:p-10"
              initial={{ x: -220, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.08 }}
            >
              <p className="self-start text-xs font-semibold uppercase tracking-[0.08em] text-slate-400">
                Флотти
              </p>
              <div className="flex max-w-34rem flex-col items-center gap-3">
                <p className="text-2xl font-black leading-tight text-foreground md:text-3xl">
                  Вы проделали длинный путь и вот он Финал!
                </p>
                <p className="text-lg font-semibold leading-tight text-foreground md:text-xl">
                  Готовы ли вы перейти к Финальному вопросу?
                </p>
              </div>

              <Button
                type="button"
                size="lg"
                className="w-full max-w-xs px-10"
                onClick={onConfirmFinalQuestion}
              >
                Готовы
              </Button>
            </motion.section>

            <motion.img
              src={doFinalImage}
              alt="Final preparing"
              className="pointer-events-none select-none absolute bottom-0 right-0 h-auto w-[min(56vw,680px)]"
              initial={{ x: 260, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
              draggable={false}
              loading="eager"
              decoding="async"
              fetchPriority="high"
            />
          </>
        )}
      </main>
    </div>
  );
}
