import { useCallback } from "react";

import type { QuestionPackQuestion } from "@/shared/api/questionPack";
import type { GameQuestionFlowState } from "@/shared/store/gameAtoms";

import {
  checkAnswer,
  setReadingReplay,
  setTimeoutResult,
  setWrongAnswerResult,
  type QuestionStatePlayer,
  type SetQuestionFlowState,
} from "./questionFlow";

type UseQuestionAnswerActionsArgs = {
  activeQuestionId: string | null;
  activeQuestion: QuestionPackQuestion | null;
  questionFlowState: GameQuestionFlowState | null;
  players: QuestionStatePlayer[];
  onPlayerScoreDelta: (playerId: string, delta: number) => void;
  closeQuestionModal: () => void;
  setQuestionFlowState: SetQuestionFlowState;
};

export function useQuestionAnswerActions({
  activeQuestionId,
  activeQuestion,
  questionFlowState,
  players,
  onPlayerScoreDelta,
  closeQuestionModal,
  setQuestionFlowState,
}: UseQuestionAnswerActionsArgs) {
  const setAnswerInput = useCallback((value: string) => {
    setQuestionFlowState(prev => {
      if (!prev || prev.phase !== "answering") return prev;
      return { ...prev, answerInput: value };
    });
  }, [setQuestionFlowState]);

  const submitAnswer = useCallback(() => {
    if (!activeQuestionId || !activeQuestion || !questionFlowState) return;
    if (questionFlowState.phase !== "answering") return;
    if (!questionFlowState.activePlayerId) return;

    const isCorrect = checkAnswer(questionFlowState.answerInput, activeQuestion.answers);

    if (isCorrect) {
      onPlayerScoreDelta(questionFlowState.activePlayerId, activeQuestion.value);
      setQuestionFlowState(prev => {
        if (!prev || prev.questionId !== activeQuestionId) return prev;
        return {
          ...prev,
          phase: "result-correct",
        };
      });
      return;
    }

    setQuestionFlowState(prev => {
      if (!prev || prev.questionId !== activeQuestionId || prev.phase !== "answering") return prev;
      return setWrongAnswerResult(prev);
    });
  }, [
    activeQuestion,
    activeQuestionId,
    onPlayerScoreDelta,
    questionFlowState,
    setQuestionFlowState,
  ]);

  const markAnswerWrong = useCallback(() => {
    if (!activeQuestionId) return;

    setQuestionFlowState(prev => {
      if (!prev || prev.questionId !== activeQuestionId || prev.phase !== "answering") return prev;
      return setWrongAnswerResult(prev);
    });
  }, [activeQuestionId, setQuestionFlowState]);

  const continueAfterWrong = useCallback(() => {
    if (!questionFlowState) return;

    if (questionFlowState.phase === "result-timeout") {
      closeQuestionModal();
      return;
    }

    if (questionFlowState.phase !== "result-wrong") return;

    const hasPlayersForReplay = players.some(
      player => !questionFlowState.attemptedPlayerIds.includes(player.id),
    );

    setQuestionFlowState(prev => {
      if (!prev || prev.phase !== "result-wrong") return prev;

      if (!hasPlayersForReplay || prev.remainingMs <= 0) {
        return setTimeoutResult(prev);
      }

      return setReadingReplay(prev);
    });
  }, [closeQuestionModal, players, questionFlowState, setQuestionFlowState]);

  return {
    setAnswerInput,
    submitAnswer,
    markAnswerWrong,
    continueAfterWrong,
  };
}
