import { motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";

import { Header } from "@/widgets/header";
import { useFinalBidModel } from "../model/use-final-bid-model";

type FinalBidPageProps = {
  onExitToSetup?: () => void;
  onConfirmBid?: () => void;
};

export function FinalBidPage({ onExitToSetup, onConfirmBid }: FinalBidPageProps) {
  const model = useFinalBidModel({ onConfirmBid });
  const [isLeaving, setIsLeaving] = useState(false);
  const leaveTimerRef = useRef<number | null>(null);

  const handleConfirm = useCallback(() => {
    if (model.isConfirmDisabled || isLeaving) return;

    setIsLeaving(true);
    leaveTimerRef.current = window.setTimeout(() => {
      model.onConfirmBid();
    }, 260);
  }, [isLeaving, model]);

  useEffect(() => () => {
    if (leaveTimerRef.current !== null) {
      window.clearTimeout(leaveTimerRef.current);
    }
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans selection:bg-primary/30 transition-colors duration-300">
      <Header
        title={model.packTitle}
        subtitle={`Ставка игрока: ${model.currentPlayerName}`}
        onExitToSetup={onExitToSetup}
        isThemeToggleDisabled
      />

      <main className="flex flex-1 items-center justify-center px-4 py-8">
        <motion.div
          className="flex w-full max-w-3xl flex-col items-center justify-center text-center"
          initial={{ opacity: 0, y: 24, scale: 0.98 }}
          animate={isLeaving
            ? { opacity: 0, y: 30, scale: 0.98 }
            : { opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="mb-12 space-y-2">
            <h1 className="text-3xl font-bold md:text-4xl">Сделайте вашу ставку</h1>
            <p className="text-lg text-neutral-500">
              Текущий счет: <span className="font-bold text-black">{model.currentScore}</span>
            </p>
          </div>

          <div className="w-full max-w-2xl space-y-3 text-left">
            <div className="text-lg font-semibold text-neutral-700">Сумма ставки</div>

            <input
              type="number"
              value={model.bidInput}
              onChange={event => model.onBidInputChange(event.target.value)}
              placeholder={`Введите сумму (1 - ${model.currentScore})`}
              className="h-14 w-full rounded-xl border border-neutral-300 px-5 text-lg text-neutral-700 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          <button
            type="button"
            onClick={handleConfirm}
            disabled={model.isConfirmDisabled || isLeaving}
            className="mt-9 h-16 w-full max-w-xl rounded-2xl bg-black text-xl font-bold text-white shadow-lg transition active:scale-95 hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-55"
          >
            Подтвердить ставку
          </button>

          <p className="mt-8 text-base text-neutral-400">
            Ставка будет скрыта после подтверждения.
          </p>
        </motion.div>
      </main>
    </div>
  );
}
