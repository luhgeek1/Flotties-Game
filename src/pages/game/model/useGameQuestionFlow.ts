import { useQuestionState } from "@/features/question-flow";
import type { QuestionModalPlayer } from "@/features/question-modal";
import type { QuestionPackQuestion } from "@/shared/api/questionPack";

type UseGameQuestionFlowArgs = {
  questionsById: Map<string, QuestionPackQuestion>;
  questionPlayers: QuestionModalPlayer[];
  isSingleAttemptQuestion?: (questionId: string) => boolean;
  onPlayerScoreDelta: (playerId: string, delta: number) => void;
  isAdminMode: boolean;
};

export function useGameQuestionFlow({
  questionsById,
  questionPlayers,
  isSingleAttemptQuestion,
  onPlayerScoreDelta,
  isAdminMode,
}: UseGameQuestionFlowArgs) {
  const {
    activeQuestion,
    activeQuestionId,
    handleQuestionSelect,
    startQuestionAnswering,
    modalState,
    questionTimerDurationMs,
    setAnswerInput,
    submitAnswer,
    continueAfterWrong,
    openedQuestionIds,
    openAllQuestions,
  } = useQuestionState({
    questionsById,
    players: questionPlayers,
    isSingleAttemptQuestion,
    onPlayerScoreDelta,
  });

  const modalQuestionId = activeQuestionId ?? modalState?.questionId ?? null;
  const modalQuestion = modalQuestionId ? questionsById.get(modalQuestionId) ?? null : null;
  const isQuestionModalOpen = modalQuestionId !== null;
  const answerText = (modalQuestion?.answers[0] ?? activeQuestion?.answers[0])!;
  const prefilledAnswerText = isAdminMode
    ? (modalQuestion?.answers[0] ?? activeQuestion?.answers[0] ?? "")
    : "";

  return {
    openedQuestionIds,
    handleQuestionSelect,
    startQuestionAnswering,
    openAllQuestions,
    modalQuestionId,
    isQuestionModalOpen,
    questionModalBase: {
      isOpen: isQuestionModalOpen,
      questionId: modalQuestionId,
      questionValue: modalQuestion?.value ?? activeQuestion?.value ?? "",
      questionText: modalQuestion?.question ?? activeQuestion?.question ?? "",
      answerText,
      prefilledAnswerText,
      players: questionPlayers,
      phase: modalState?.phase ?? null,
      remainingMs: modalState?.remainingMs ?? questionTimerDurationMs,
      timerDurationMs: questionTimerDurationMs,
      attemptedPlayerIds: modalState?.attemptedPlayerIds ?? [],
      activePlayerId: modalState?.activePlayerId ?? null,
      answerInput: modalState?.answerInput ?? "",
      onAnswerInputChange: setAnswerInput,
      onSubmitAnswer: submitAnswer,
      onContinue: continueAfterWrong,
    },
  };
}
