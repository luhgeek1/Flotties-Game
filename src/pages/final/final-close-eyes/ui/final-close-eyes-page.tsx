import { LogOut, Sun } from "lucide-react";
import { motion } from "motion/react";

import closeEyesRuImage from "@/shared/assets/closeEyesRu.png";
import { Button } from "@/shared/components/ui/button";

type FinalCloseEyesPageProps = {
  onExitToSetup?: () => void;
};

export function FinalCloseEyesPage({ onExitToSetup }: FinalCloseEyesPageProps) {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans selection:bg-primary/30 transition-colors duration-300">
      <header className="h-16 border-b bg-card/80 backdrop-blur px-6 flex items-center justify-between shrink-0 z-30">
        <div className="flex items-center gap-4">
          <Button type="button" variant="ghost" size="icon" title="Exit to setup" onClick={onExitToSetup}>
            <LogOut className="w-5 h-5 text-muted-foreground hover:text-destructive transition-colors" />
          </Button>

          <div>
            <h1 className="font-bold text-xl leading-none">фвы</h1>
            <span className="text-xs text-muted-foreground">Секретные ставки</span>
          </div>
        </div>

        <Button type="button" variant="ghost" size="icon" title="Toggle theme" disabled>
          <Sun className="w-5 h-5 opacity-45" />
        </Button>
      </header>

      <main className="relative flex-1 overflow-hidden">
        <motion.img
          src={closeEyesRuImage}
          alt="Close eyes instruction"
          className="pointer-events-none select-none absolute bottom-0 left-1/2 h-auto w-[min(88vw,700px)] -translate-x-1/2"
          initial={{ y: 140, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1], delay: 0.08 }}
          draggable={false}
        />
      </main>
    </div>
  );
}
