import { motion } from "motion/react";

import closeEyesRuImage from "@/shared/assets/closeEyesRu.png";
import { Header } from "@/widgets/header";

type FinalCloseEyesPageProps = {
  onExitToSetup?: () => void;
};

export function FinalCloseEyesPage({ onExitToSetup }: FinalCloseEyesPageProps) {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans selection:bg-primary/30 transition-colors duration-300">
      <Header
        title="FinalCloseEyes"
        subtitle="Секретные ставки"
        onExitToSetup={onExitToSetup}
        isThemeToggleDisabled
      />

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
