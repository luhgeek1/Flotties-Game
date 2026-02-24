import { AnimatePresence, motion } from "motion/react";
import { CheckCircle2, Coins, Trophy, XCircle } from "lucide-react";

import { Button } from "@/shared/components/ui/button";
import { Header } from "@/widgets/header";
import { useFinalResultsModel } from "../model/use-final-results-model";
import { AnimatedCounter } from "./animated-counter";

type FinalResultsPageProps = {
  onExitToSetup?: () => void;
  onReset?: () => void;
};

export function FinalResultsPage({ onExitToSetup, onReset }: FinalResultsPageProps) {
  const model = useFinalResultsModel({ onReset });

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans selection:bg-primary/30 transition-colors duration-300">
      <Header
        title={model.packTitle}
        subtitle="Финальные результаты"
        onExitToSetup={onExitToSetup}
        isThemeToggleDisabled
      />

      <main className="flex flex-1 justify-center px-4 py-8 md:px-8 md:py-10 overflow-y-auto">
        <section className="w-full max-w-4xl pb-12">
          <div className="mb-12 space-y-4 text-center">
            <h2 className="text-4xl font-black tracking-tighter uppercase md:text-6xl">
              Финальные результаты
            </h2>
            {model.isSinglePositiveScoreWinner ? (
              <p className="text-base font-medium text-neutral-500 dark:text-slate-300">
                Финальный раунд не проводился: только один игрок завершил второй раунд с положительным счётом.
              </p>
            ) : null}
          </div>

          <motion.ul className="space-y-4" layout>
            <AnimatePresence initial={false}>
              {model.displayPlayers.map(player => {
                const isWinner = model.isSorting && player.finalScore === model.winnerScore;
                const hasPlayerFinalData = player.wager > 0 || player.answer.trim().length > 0;
                const showFinalRoundData = !model.isSinglePositiveScoreWinner && hasPlayerFinalData;
                const sideColumnWidth = model.isSinglePositiveScoreWinner || !hasPlayerFinalData
                  ? "md:w-2/4"
                  : "md:w-1/4";

                return (
                  <motion.li
                    key={player.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      layout: { duration: 0.5, ease: "easeInOut" },
                      opacity: { duration: 0.5 },
                    }}
                    className={`relative overflow-hidden rounded-xl border bg-white shadow-sm transition-colors duration-500 dark:bg-slate-900/95 dark:shadow-black/30 ${
                      isWinner ? "border-yellow-500 ring-1 ring-yellow-500" : "border-neutral-200 dark:border-slate-700"
                    }`}
                  >
                    <AnimatePresence initial={false}>
                      {isWinner ? (
                        <motion.div
                          initial={{ y: -20, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          className="absolute top-0 right-0 z-10 flex items-center gap-2 rounded-bl-xl bg-yellow-500 px-3 py-1 text-[10px] font-bold tracking-widest text-white uppercase"
                        >
                          <span className="flex items-center gap-1">
                            <Trophy size={12} />
                            Победитель
                          </span>

                          {player.winnerBonus > 0 ? (
                            <span className="flex items-center gap-1 border-l border-white/50 pl-2">
                              <Coins size={12} />
                              +{player.winnerBonus}
                            </span>
                          ) : null}
                        </motion.div>
                      ) : null}
                    </AnimatePresence>

                    <div className="flex flex-col items-center gap-6 p-6 md:flex-row">
                      <div className={`w-full text-center ${sideColumnWidth} md:text-left`}>
                        <h3 className="text-xl font-bold text-neutral-900 dark:text-slate-100">{player.name}</h3>
                        {showFinalRoundData ? (
                          <div className="mt-1 text-xs font-mono text-neutral-400 dark:text-slate-400">
                            Ставка: <span className="text-neutral-600 dark:text-slate-200">{player.wager}</span>
                          </div>
                        ) : null}
                      </div>

                      {showFinalRoundData ? (
                        <div className="relative flex min-h-16 w-full flex-col items-center justify-center text-center md:w-2/4">
                          <AnimatePresence mode="wait" initial={false}>
                            {!player.isRevealed ? (
                              <motion.div
                                key="hidden"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="text-lg font-serif italic text-neutral-300 dark:text-slate-500"
                              >
                                Ожидание...
                              </motion.div>
                            ) : (
                              <motion.div
                                key="revealed"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="flex flex-col items-center"
                              >
                                <p className="mb-2 text-xl font-serif italic text-neutral-700 dark:text-slate-200">"{player.answer || "—"}"</p>

                                <motion.div
                                  initial={{ opacity: 0, y: 10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ delay: 0.2 }}
                                  className={`flex items-center gap-2 rounded-full px-3 py-1 text-sm font-bold tracking-wider uppercase ${
                                    player.isCorrect
                                      ? "bg-green-100 text-green-700 dark:bg-green-950/50 dark:text-green-300"
                                      : "bg-red-100 text-red-700 dark:bg-red-950/50 dark:text-red-300"
                                  }`}
                                >
                                  {player.isCorrect ? <CheckCircle2 size={16} /> : <XCircle size={16} />}
                                  {player.isCorrect ? "Верно" : "Неверно"}
                                </motion.div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      ) : null}

                      <div className={`flex w-full flex-col items-center justify-end ${sideColumnWidth} md:items-end`}>
                        <div className="text-right">
                          <p className="mb-1 text-[10px] tracking-widest text-neutral-400 uppercase dark:text-slate-400">
                            Итоговый счет
                          </p>
                          <div className="text-4xl font-mono font-bold text-neutral-900 dark:text-slate-100">
                            <AnimatedCounter
                              from={player.initialScore}
                              to={player.isRevealed ? player.finalScore : player.initialScore}
                              play={player.isRevealed && !model.isRestoredResults}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.li>
                );
              })}
            </AnimatePresence>
          </motion.ul>

          <AnimatePresence initial={false}>
            {model.showControls ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-16 text-center"
              >
                <Button onClick={model.onReset} size="lg" variant="outline" className="min-w-50">
                  Новая игра
                </Button>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </section>
      </main>
    </div>
  );
}
