import { AnimatePresence, motion } from "motion/react";
import { DEFAULT_PLAYER_AVATAR_URL } from "@/entities/players";

import type { GameQuestionPhase } from "@/shared/store/gameAtoms";
import { QuestionTimer } from "@/shared/ui";

import type { QuestionModalPlayer } from "../model/types";
import {
  QuestionModalAnsweringState,
  QuestionModalReadingState,
  QuestionModalResultCorrectState,
  QuestionModalResultTimeoutState,
  QuestionModalResultWrongState,
} from "./states";

type QuestionModalProps = {
  isOpen: boolean;
  questionId: string | null;
  questionValue: number | string;
  questionText: string;
  answerText: string;
  prefilledAnswerText?: string;
  players: QuestionModalPlayer[];
  isSingleAttemptMode?: boolean;
  phase: GameQuestionPhase | null;
  remainingMs: number;
  timerDurationMs: number;
  attemptedPlayerIds: string[];
  activePlayerId: string | null;
  answerInput: string;
  onAnswerInputChange: (value: string) => void;
  onSubmitAnswer: () => void;
  onContinue: () => void;
};

export function QuestionModal({
  isOpen,
  questionId,
  questionValue,
  questionText,
  answerText,
  prefilledAnswerText = "",
  players,
  isSingleAttemptMode = false,
  phase,
  remainingMs,
  timerDurationMs,
  attemptedPlayerIds,
  activePlayerId,
  answerInput,
  onAnswerInputChange,
  onSubmitAnswer,
  onContinue,
}: QuestionModalProps) {
  const activePlayer = players.find(player => player.id === activePlayerId) ?? null;
  const isTimeoutByClock = remainingMs <= 0;

  const currentPhase = phase ?? "reading";

  return (
    <AnimatePresence initial={false}>
      {isOpen ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-background/90 backdrop-blur-sm p-4"
        >
          <div className="w-full max-w-5xl flex flex-col items-center justify-center min-h-[60vh] max-h-[90vh]">
            <div className="w-full flex justify-between items-center mb-8 px-8">
              <div className="flex items-center gap-4">
                <div className="bg-primary text-primary-foreground px-4 py-2 rounded-lg font-bold text-xl">
                  {questionValue}
                </div>
              </div>

              {currentPhase === "reading" ? (
                <QuestionTimer durationMs={timerDurationMs} remainingMs={remainingMs} />
              ) : null}
            </div>

            <motion.div
              key={`${questionId ?? "placeholder-question"}-${currentPhase}`}
              initial={{ opacity: 0, y: 24, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -16, scale: 0.98 }}
              transition={{ duration: 0.2 }}
              layoutId={`question-${questionId ?? "placeholder-question-id"}`}
              className="flex-1 w-full bg-card border rounded-2xl shadow-2xl p-8 md:p-12 flex flex-col items-center justify-center text-center relative overflow-hidden"
            >
              {currentPhase === "reading" ? (
                <QuestionModalReadingState
                  questionText={questionText}
                  players={players}
                  attemptedPlayerIds={attemptedPlayerIds}
                />
              ) : null}

              {currentPhase === "answering" ? (
                <QuestionModalAnsweringState
                  playerName={activePlayer?.name ?? "Игрок"}
                  playerAvatarUrl={activePlayer?.avatarUrl ?? DEFAULT_PLAYER_AVATAR_URL}
                  questionText={questionText}
                  answerInput={answerInput}
                  prefilledAnswerText={prefilledAnswerText}
                  onAnswerInputChange={onAnswerInputChange}
                  onSubmitAnswer={onSubmitAnswer}
                />
              ) : null}

              {currentPhase === "result-correct" ? (
                <QuestionModalResultCorrectState answerText={answerText} />
              ) : null}

              {currentPhase === "result-wrong" ? (
                <QuestionModalResultWrongState
                  answerText={answerText}
                  showCorrectAnswer={isSingleAttemptMode}
                  onContinue={onContinue}
                />
              ) : null}

              {currentPhase === "result-timeout" ? (
                <QuestionModalResultTimeoutState
                  answerText={answerText}
                  isTimeoutByClock={isTimeoutByClock}
                  onContinue={onContinue}
                />
              ) : null}
            </motion.div>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
