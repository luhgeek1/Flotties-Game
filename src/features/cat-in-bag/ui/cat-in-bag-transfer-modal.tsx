import { AnimatePresence, motion } from "motion/react";
import { useMemo } from "react";

import { PlayerAvatar } from "@/entities/players";
import type { CatInBagTransferModalMode, CatInBagTransferPlayer } from "@/features/cat-in-bag/model";
import { cn } from "@/shared/lib/utils";

type CatInBagTransferModalProps = {
  open: boolean;
  mode: CatInBagTransferModalMode;
  chooserName: string | null;
  answeringPlayerName: string | null;
  questionTheme: string | null;
  players: CatInBagTransferPlayer[];
  bidOptions: number[];
  onSelectPlayer: (playerId: string) => void;
  onSelectBid: (bid: number) => void;
};

export function CatInBagTransferModal({
  open,
  mode,
  chooserName,
  answeringPlayerName,
  questionTheme,
  players,
  bidOptions,
  onSelectPlayer,
  onSelectBid,
}: CatInBagTransferModalProps) {
  const transferTitle = useMemo(() => {
    if (!chooserName) return "Игрок выбирает, кому передать вопрос";

    return (
      <>
        <span className="font-extrabold text-foreground">{chooserName}</span> выбирает, кому передать вопрос
      </>
    );
  }, [chooserName]);

  return (
    <AnimatePresence initial={false}>
      {open ? (
        <motion.div
          className="fixed inset-0 z-60 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <motion.div
            className="absolute inset-0 bg-background/75 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.96, filter: "blur(6px)" }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: 20, scale: 0.98, filter: "blur(4px)" }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-10 w-full max-w-5xl rounded-[34px] border border-border bg-card px-6 pb-12 pt-9 text-card-foreground shadow-[0_28px_85px_rgba(2,6,23,0.24)] sm:px-10 md:px-14"
          >
            {mode === "transfer" ? (
              <>
                <div className="mx-auto mt-8 flex max-w-3xl flex-col items-center text-center">
                  <h2 className="text-4xl font-black uppercase tracking-tight text-foreground sm:text-5xl">
                    Кот в мешке
                  </h2>
                  <p className="mt-3 text-xl font-medium text-muted-foreground sm:text-2xl">{transferTitle}</p>
                </div>

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
                        "group rounded-3xl border-2 border-border bg-card/70 px-4 py-8 text-center transition-colors hover:border-border hover:bg-card",
                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                      )}
                    >
                      <div className="mx-auto h-20 w-20 overflow-hidden rounded-full border border-border bg-muted">
                        <PlayerAvatar value={player.avatarUrl} alt={player.name} className="grayscale" />
                      </div>

                      <div className="mt-5 text-[38px] font-black leading-none tracking-tight text-foreground">
                        {player.name}
                      </div>

                      <div className="mt-2 text-3xl font-mono font-semibold tracking-tight text-muted-foreground">
                        {player.score}
                      </div>
                    </motion.button>
                  ))}
                </div>
              </>
            ) : (
              <div className="mx-auto mt-8 flex max-w-3xl flex-col items-center text-center">
                <div className="inline-flex items-center rounded-full bg-muted px-4 py-2 text-sm font-semibold text-muted-foreground">
                  Отвечает&nbsp;
                  <span className="font-black text-foreground">{answeringPlayerName ?? "Игрок"}</span>
                </div>

                <h2 className="mt-7 text-5xl font-black tracking-tight text-foreground sm:text-6xl">
                  Тема: <span className="font-black text-foreground">{questionTheme}</span>
                </h2>

                {questionTheme ? (
                  <p className="mt-4 text-lg font-semibold text-muted-foreground">
                      Выберите ставку
                  </p>
                ) : null}

                <div className="mt-8 grid w-full gap-4 sm:grid-cols-2">
                  {bidOptions.map((bid, index) => (
                    <motion.button
                      key={bid}
                      type="button"
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.22, delay: 0.08 + index * 0.06 }}
                      whileHover={{ y: -3, scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      onClick={() => onSelectBid(bid)}
                      className={cn(
                        "group rounded-3xl border-2 border-border bg-card/70 px-4 py-12 text-center transition-colors hover:border-border hover:bg-card",
                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                      )}
                    >
                      <span className="text-8xl font-black tracking-tight text-foreground">
                        {bid}
                      </span>
                    </motion.button>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
