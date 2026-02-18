import { LogOut, Sun } from "lucide-react";
import { motion } from "motion/react";

import doFinalImage from "@/shared/assets/dofinal.png";
import { Button } from "@/shared/components/ui/button";

type FinalPrepairingPageProps = {
  onExitToSetup?: () => void;
  onConfirmFinalQuestion?: () => void;
};

export function FinalPrepairingPage({
  onExitToSetup,
  onConfirmFinalQuestion,
}: FinalPrepairingPageProps) {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans selection:bg-primary/30 transition-colors duration-300">
      <header className="h-16 border-b bg-card/80 backdrop-blur px-6 flex items-center justify-between shrink-0 z-30">
        <div className="flex items-center gap-4">
          <Button type="button" variant="ghost" size="icon" title="Exit to setup" onClick={onExitToSetup}>
            <LogOut className="w-5 h-5 text-muted-foreground hover:text-destructive transition-colors" />
          </Button>

          <div>
            <h1 className="font-bold text-xl leading-none">FinalPrepairing</h1>
            <span className="text-xs text-muted-foreground">Подготовка к финалу</span>
          </div>
        </div>

        <Button type="button" variant="ghost" size="icon" title="Toggle theme" disabled>
          <Sun className="w-5 h-5 opacity-45" />
        </Button>
      </header>

      <main className="relative flex-1 overflow-hidden">
        <motion.section
          className="absolute z-20 left-12 top-[46%] flex min-h-260px w-[min(92vw,640px)] -translate-y-1/2 flex-col items-center justify-center gap-8 rounded-3xl border border-border/80 bg-card/95 p-8 text-center shadow-xl backdrop-blur-sm md:left-24 md:p-10"
          initial={{ x: -220, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.08 }}
        >
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
        />
      </main>
    </div>
  );
}
