import { AnimatePresence, motion } from "motion/react";

import { QuestionModalAnsweringState, QuestionModalResultTimeoutState } from "@/features/question-modal";
import smileLottiImage from "@/shared/assets/smileLotti.png";
import { QuestionTimer } from "@/shared/ui";
import { Header } from "@/widgets/header";
import { useFinalQuestionPageModel } from "../model/use-final-question-page-model";

type FinalQuestionPageProps = {
  onExitToSetup?: () => void;
  onConfirmAnswer?: () => void;
  onAllAnswersDone?: () => void;
};

export function FinalQuestionPage({ onExitToSetup, onConfirmAnswer, onAllAnswersDone }: FinalQuestionPageProps) {
  const model = useFinalQuestionPageModel({
    onConfirmAnswer,
    onAllAnswersDone,
  });

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans selection:bg-primary/30 transition-colors duration-300">
      <Header
        title={model.packTitle}
        subtitle={`Ответ игрока: ${model.currentPlayerName}`}
        onExitToSetup={onExitToSetup}
      />

      <main className="relative flex flex-1 items-center justify-center overflow-hidden px-4 py-8">
        <AnimatePresence mode="wait" initial={false}>
          {model.isAllPlayersAnswerDone ? (
            <motion.div
              key="final-answer-complete"
              className="relative flex h-full w-full items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            >
              <motion.section
                className="relative z-10 flex w-full max-w-2xl -translate-x-14 translate-y-20 flex-col items-center gap-4 rounded-2xl border border-neutral-200 bg-white/90 px-12 py-10 text-center shadow-md backdrop-blur-sm md:-translate-x-70 md:translate-y-50"
                initial={{ x: -160, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 80, y: 20, opacity: 0 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1], delay: 0.08 }}
              >
                <p className="absolute left-4 top-3 text-xs font-semibold uppercase tracking-[0.08em] text-slate-400 md:left-6 md:top-4">
                  Флотти
                </p>
                <h2 className="text-3xl font-bold text-black md:text-4xl">Ответы приняты</h2>
                <p className="text-base text-neutral-500">
                  Все игроки ответили на финальный вопрос.
                </p>
              </motion.section>

              <motion.img
                src={smileLottiImage}
                alt="Smile Lotti"
                className="pointer-events-none select-none fixed bottom-0 right-0 z-0 h-auto w-[min(46vw,560px)] origin-bottom-right scale-[1.9]"
                initial={{ y: 240, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 240, opacity: 0 }}
                transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1], delay: 0.14 }}
                draggable={false}
                loading="lazy"
                decoding="async"
              />
            </motion.div>
          ) : (
            <motion.div
              key={`final-question-form-${model.currentPlayerName}`}
              className="w-full max-w-5xl"
              initial={{ opacity: 0, y: 24, scale: 0.98 }}
              animate={model.isLeaving
                ? { opacity: 0, y: 30, scale: 0.98 }
                : { opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -16, scale: 0.98 }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            >
              {model.isTimeoutModalOpen ? (
                <section className="flex w-full justify-center bg-card border rounded-2xl shadow-2xl px-6 py-8 md:px-12 md:py-12 text-center">
                  <QuestionModalResultTimeoutState
                    answerText={model.finalAnswerText}
                    isTimeoutByClock
                    showCorrectAnswer={false}
                    onContinue={model.handleTimeoutContinue}
                  />
                </section>
              ) : (
                <>
                  <div className="mb-4 flex w-full justify-end">
                    <QuestionTimer
                      durationMs={model.finalAnswerTimerDurationMs}
                      remainingMs={model.remainingMs}
                    />
                  </div>

                  <section className="flex w-full justify-center bg-card border rounded-2xl shadow-2xl px-6 py-8 md:px-12 md:py-12 text-center">
                    <QuestionModalAnsweringState
                      playerName={model.currentPlayerName}
                      playerAvatarUrl={model.currentPlayerAvatarUrl}
                      questionText={model.finalQuestionText}
                      answerInput={model.answerInput}
                      prefilledAnswerText={model.isAdminMode ? model.finalAnswerText : ""}
                      onAnswerInputChange={model.onAnswerInputChange}
                      onSubmitAnswer={model.handleSubmit}
                    />
                  </section>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
