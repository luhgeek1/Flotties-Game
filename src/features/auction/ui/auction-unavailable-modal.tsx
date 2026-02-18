import { AlertCircle } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

import { Button } from "@/shared/components/ui/button";

type AuctionUnavailableModalProps = {
  open: boolean;
  mode: "unavailable" | "limited";
  nominal: number;
  eligiblePlayersCount: number;
  excludedPlayersCount: number;
  onContinue: () => void;
};

export function AuctionUnavailableModal({
  open,
  mode,
  nominal,
  eligiblePlayersCount,
  excludedPlayersCount,
  onContinue,
}: AuctionUnavailableModalProps) {
  const title = mode === "unavailable" ? "Аукцион недоступен" : "Ограниченный аукцион";
  const summaryText = mode === "unavailable"
    ? "Ни у одного игрока нет достаточного счёта для старта аукциона."
    : (
      eligiblePlayersCount === 1
        ? `К торгам допущен только этот игрок. Остальные (${excludedPlayersCount}) не допущены.`
        : `К торгам допущены только ${eligiblePlayersCount} игрока. Остальные (${excludedPlayersCount}) не допущены.`
    );
  const detailText = mode === "unavailable"
    ? `Вопрос будет разыгран в обычном режиме на номинал ${nominal}.`
    : `Недопущенные игроки имеют счёт ниже номинала ${nominal}.`;

  return (
    <AnimatePresence mode="wait">
      {open ? (
        <motion.div
          key="auction-unavailable"
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{
            opacity: 1,
            y: 0,
            scale: 1,
            transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] as const },
          }}
          exit={{ opacity: 0, y: -20, scale: 0.95, transition: { duration: 0.25 } }}
          className="fixed inset-0 z-60 flex items-center justify-center p-4"
        >
          <div className="absolute inset-0 bg-slate-200/80 backdrop-blur-md z-[-1]" />

          <div className="w-full max-w-2xl rounded-3xl border border-slate-200 bg-white px-8 py-10 text-center shadow-2xl shadow-slate-200/50">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-amber-100 text-amber-700">
              <AlertCircle size={34} />
            </div>

            <h3 className="text-3xl font-black uppercase tracking-tight text-slate-900">{title}</h3>

            <p className="mt-4 text-base leading-relaxed text-slate-600">{summaryText}</p>
            <p className="mt-2 text-base leading-relaxed text-slate-600">{detailText}</p>

            <Button
              type="button"
              size="lg"
              className="mt-8 px-10"
              onClick={onContinue}
            >
              Продолжить
            </Button>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
