import { AnimatePresence, motion } from "motion/react";
import { EyeOff, User } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import closeEyesRuImage from "@/shared/assets/closeEyesRu.png";
import { Button } from "@/shared/components/ui/button";
import { Header } from "@/widgets/header";
import { useFinalCloseEyesModel } from "../model/use-final-close-eyes-model";

type FinalCloseEyesPageProps = {
  onExitToSetup?: () => void;
  onReady?: () => void;
  mode?: "WAGER" | "ANSWER";
};

export function FinalCloseEyesPage({
  onExitToSetup,
  onReady,
  mode = "WAGER",
}: FinalCloseEyesPageProps) {
  const model = useFinalCloseEyesModel({ onReady });
  const [isCardVisible, setIsCardVisible] = useState(true);
  const [isOutroImageVisible, setIsOutroImageVisible] = useState(false);
  const outroTimerRef = useRef<number | null>(null);

  useEffect(() => () => {
    if (outroTimerRef.current !== null) {
      window.clearTimeout(outroTimerRef.current);
    }
  }, []);

  const handleReadyClick = () => {
    if (isOutroImageVisible) return;

    setIsCardVisible(false);
    setIsOutroImageVisible(true);

    outroTimerRef.current = window.setTimeout(() => {
      setIsOutroImageVisible(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans selection:bg-primary/30 transition-colors duration-300">
      <Header
        title={model.packTitle}
        subtitle={mode === "WAGER" ? "Секретные ставки" : "Секретные ответы"}
        onExitToSetup={onExitToSetup}
        isThemeToggleDisabled
      />

      <main className="relative flex-1 overflow-hidden">
        <AnimatePresence onExitComplete={() => model.onReadyClick()}>
          {isOutroImageVisible ? (
            <motion.img
              key="close-eyes-outro"
              src={closeEyesRuImage}
              alt="Close eyes instruction"
              className="pointer-events-none select-none absolute bottom-0 left-1/2 h-auto w-[min(94vw,920px)] -translate-x-1/2"
              initial={{ y: 180, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 180, opacity: 0 }}
              transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
              draggable={false}
            />
          ) : null}
        </AnimatePresence>

        <AnimatePresence>
          {isCardVisible ? (
            <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center px-4">
              <motion.section
                key={model.currentAnswererName}
                className="pointer-events-auto w-full max-w-md rounded-xl border border-neutral-200 bg-neutral-50 p-8 text-center shadow-lg"
                initial={{ y: -80, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 20, opacity: 0 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="mx-auto mb-6 flex h-26 w-26 items-center justify-center overflow-hidden rounded-full bg-black text-white">
                  {model.currentAnswererAvatarUrl ? (
                    <img
                      src={model.currentAnswererAvatarUrl}
                      alt={model.currentAnswererName}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <User size={32} />
                  )}
                </div>

                <h2 className="mb-2 text-2xl font-bold text-black">
                  Ход игрока: {model.currentAnswererName}
                </h2>

                <p className="mb-8 text-neutral-500">
                  {mode === "WAGER" ? "Сделайте вашу ставку секретно." : "Ответьте на вопрос секретно."}
                </p>

                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-center gap-2 rounded-md bg-rose-50 p-3 text-sm font-medium text-rose-600">
                    <EyeOff size={16} />
                    Остальные игроки должны отвернуться.
                  </div>

                  <Button type="button" size="lg" onClick={handleReadyClick} className="w-full">
                    Я готов
                  </Button>
                </div>
              </motion.section>
            </div>
          ) : null}
        </AnimatePresence>
      </main>
    </div>
  );
}
