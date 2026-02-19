import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";

import { QuestionModalAnsweringState, QuestionModalResultTimeoutState } from "@/features/question-modal";
import smileLottiImage from "@/shared/assets/smileLotti.png";
import { QuestionTimer } from "@/shared/ui";
import { Header } from "@/widgets/header";
import { useFinalQuestionModel } from "../model/use-final-question-model";

type FinalQuestionPageProps = {
  onExitToSetup?: () => void;
  onConfirmAnswer?: () => void;
};

const FINAL_ANSWER_TIMER_DURATION_MS = 30_000;

export function FinalQuestionPage({ onExitToSetup, onConfirmAnswer }: FinalQuestionPageProps) {
  const model = useFinalQuestionModel({ onConfirmAnswer });
  const [isLeaving, setIsLeaving] = useState(false);
  const [remainingMs, setRemainingMs] = useState(FINAL_ANSWER_TIMER_DURATION_MS);
  const [isTimeoutModalOpen, setIsTimeoutModalOpen] = useState(false);
  const leaveTimerRef = useRef<number | null>(null);
  const timerIntervalRef = useRef<number | null>(null);
  const timeoutTimerRef = useRef<number | null>(null);
  const timeoutAtRef = useRef<number | null>(null);

  const handleSubmit = useCallback(() => {
    if (model.isSubmitDisabled || isLeaving || isTimeoutModalOpen) return;

    setIsLeaving(true);
    leaveTimerRef.current = window.setTimeout(() => {
      model.onSubmitAnswer();
    }, 260);
  }, [isLeaving, isTimeoutModalOpen, model]);

  const handleTimeoutContinue = useCallback(() => {
    if (isLeaving) return;

    setIsLeaving(true);
    leaveTimerRef.current = window.setTimeout(() => {
      model.onTimeoutAnswer();
    }, 260);
  }, [isLeaving, model]);

  useEffect(() => {
    if (!model.currentPlayerId || model.isAllPlayersAnswerDone || isLeaving) return;

    timeoutAtRef.current = window.performance.now() + FINAL_ANSWER_TIMER_DURATION_MS;

    timerIntervalRef.current = window.setInterval(() => {
      if (timeoutAtRef.current === null) return;

      const nextRemaining = Math.max(0, Math.round(timeoutAtRef.current - window.performance.now()));
      setRemainingMs(nextRemaining);
    }, 100);

    timeoutTimerRef.current = window.setTimeout(() => {
      setRemainingMs(0);
      setIsTimeoutModalOpen(true);

      if (timerIntervalRef.current !== null) {
        window.clearInterval(timerIntervalRef.current);
        timerIntervalRef.current = null;
      }
    }, FINAL_ANSWER_TIMER_DURATION_MS);

    return () => {
      if (timerIntervalRef.current !== null) {
        window.clearInterval(timerIntervalRef.current);
        timerIntervalRef.current = null;
      }

      if (timeoutTimerRef.current !== null) {
        window.clearTimeout(timeoutTimerRef.current);
        timeoutTimerRef.current = null;
      }

      timeoutAtRef.current = null;
    };
  }, [isLeaving, model.currentPlayerId, model.isAllPlayersAnswerDone]);

  useEffect(() => () => {
    if (leaveTimerRef.current !== null) {
      window.clearTimeout(leaveTimerRef.current);
    }

    if (timerIntervalRef.current !== null) {
      window.clearInterval(timerIntervalRef.current);
    }

    if (timeoutTimerRef.current !== null) {
      window.clearTimeout(timeoutTimerRef.current);
    }
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans selection:bg-primary/30 transition-colors duration-300">
      <Header
        title={model.packTitle}
        subtitle={`Ответ игрока: ${model.currentPlayerName}`}
        onExitToSetup={onExitToSetup}
        isThemeToggleDisabled
      />

      <main className="relative flex flex-1 items-center justify-center overflow-hidden px-4 py-8">
        <AnimatePresence mode="wait">
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
                className="z-10 flex w-full max-w-2xl -translate-x-14 translate-y-20 flex-col items-center gap-4 rounded-2xl border border-neutral-200 bg-white/90 px-12 py-10 text-center shadow-md backdrop-blur-sm md:-translate-x-70 md:translate-y-50"
                initial={{ x: -160, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1], delay: 0.08 }}
              >
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
                transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1], delay: 0.14 }}
                draggable={false}
              />
            </motion.div>
          ) : (
            <motion.div
              key={`final-question-form-${model.currentPlayerName}`}
              className="w-full max-w-5xl"
              initial={{ opacity: 0, y: 24, scale: 0.98 }}
              animate={isLeaving
                ? { opacity: 0, y: 30, scale: 0.98 }
                : { opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -16, scale: 0.98 }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            >
              {isTimeoutModalOpen ? (
                <section className="flex w-full justify-center bg-card border rounded-2xl shadow-2xl px-6 py-8 md:px-12 md:py-12 text-center">
                  <QuestionModalResultTimeoutState
                    answerText={model.finalAnswerText}
                    isTimeoutByClock
                    showCorrectAnswer={false}
                    onContinue={handleTimeoutContinue}
                  />
                </section>
              ) : (
                <>
                  <div className="mb-4 flex w-full justify-end">
                    <QuestionTimer
                      durationMs={FINAL_ANSWER_TIMER_DURATION_MS}
                      remainingMs={remainingMs}
                    />
                  </div>

                  <section className="flex w-full justify-center bg-card border rounded-2xl shadow-2xl px-6 py-8 md:px-12 md:py-12 text-center">
                    <QuestionModalAnsweringState
                      playerName={model.currentPlayerName}
                      playerAvatarUrl={model.currentPlayerAvatarUrl}
                      questionText={model.finalQuestionText}
                      answerInput={model.answerInput}
                      onAnswerInputChange={model.onAnswerInputChange}
                      onSubmitAnswer={handleSubmit}
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
