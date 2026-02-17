import { AnimatePresence, motion } from "motion/react";
import { useMemo } from "react";

import { cn } from "@/shared/lib/utils";
import type { CatInBagTransferPlayer } from "../model";

type CatInBagTransferModalProps = {
  open: boolean;
  chooserName: string | null;
  players: CatInBagTransferPlayer[];
  onSelectPlayer: (playerId: string) => void;
};

export function CatInBagTransferModal({
  open,
  chooserName,
  players,
  onSelectPlayer,
}: CatInBagTransferModalProps) {
  const title = useMemo(() => {
    if (!chooserName) return "Игрок выбирает, кому передать вопрос";

    return (
      <>
        Игрок <span className="font-extrabold text-slate-900">{chooserName}</span> выбирает, кому передать вопрос
      </>
    );
  }, [chooserName]);

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-60 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <motion.div
            className="absolute inset-0 bg-slate-200/70 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.96, filter: "blur(6px)" }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: 20, scale: 0.98, filter: "blur(4px)" }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-10 w-full max-w-5xl rounded-[34px] border border-slate-200 bg-white px-6 pb-12 pt-9 shadow-[0_28px_85px_rgba(15,23,42,0.18)] sm:px-10 md:px-14"
          >
            <div className="mx-auto mt-8 flex max-w-3xl flex-col items-center text-center">
              <h2 className="text-4xl font-black uppercase tracking-tight text-slate-900 sm:text-5xl">
                Кот в мешке
              </h2>
              <p className="mt-3 text-xl font-medium text-slate-500 sm:text-2xl">{title}</p>
            </div>

            {players.length > 0 ? (
              <div className="mx-auto mt-14 grid max-w-3xl gap-4 sm:grid-cols-2">
                {players.map((player, index) => (
                  <motion.button
                    key={player.id}
                    type="button"
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.22, delay: 0.08 + index * 0.06 }}
                    whileHover={{ y: -3, scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => onSelectPlayer(player.id)}
                    className={cn(
                      "group rounded-3xl border-2 border-slate-200 bg-slate-50 px-4 py-8 text-center transition-colors hover:border-slate-300 hover:bg-white",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-300 focus-visible:ring-offset-2",
                    )}
                  >
                    <div className="mx-auto h-20 w-20 overflow-hidden rounded-full border border-slate-300 bg-slate-200">
                      <img
                        src={player.avatarUrl}
                        alt={player.name}
                        className="h-full w-full object-cover grayscale"
                      />
                    </div>

                    <div className="mt-5 text-[38px] font-black leading-none tracking-tight text-slate-900">
                      {player.name}
                    </div>

                    <div className="mt-2 text-3xl font-mono font-semibold tracking-tight text-slate-400">
                      {player.score}
                    </div>
                  </motion.button>
                ))}
              </div>
            ) : (
              <div className="mx-auto mt-14 flex max-w-xl flex-col items-center rounded-2xl border border-slate-200 bg-slate-50 px-6 py-10 text-center">
                <p className="text-2xl font-semibold text-slate-700">
                  Нет доступных игроков для передачи вопроса
                </p>
              </div>
            )}
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
