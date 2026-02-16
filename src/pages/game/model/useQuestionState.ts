import { useAtom } from "jotai";
import { useCallback, useMemo } from "react";

import type { QuestionPackQuestion } from "@/shared/api/questionPack";
import {
  gameActiveQuestionIdAtom,
  gameOpenedQuestionIdsAtom,
  gameQuestionFlowStateAtom,
} from "@/shared/store/gameAtoms";

import {
  createQuestionFlowState,
  QUESTION_TIMER_DURATION_MS,
  type QuestionStatePlayer,
} from "./questionFlow";
import { useQuestionAnswerActions } from "./useQuestionAnswerActions";
import { useQuestionAutoCloseEffect } from "./useQuestionAutoCloseEffect";
import { useQuestionBuzzingEffect } from "./useQuestionBuzzingEffect";
import { useQuestionLifecycleActions } from "./useQuestionLifecycleActions";
import { useQuestionTimerEffect } from "./useQuestionTimerEffect";

export type { QuestionStatePlayer } from "./questionFlow";

type UseQuestionStateArgs = {
  questionsById: Map<string, QuestionPackQuestion>;
  players: QuestionStatePlayer[];
  onPlayerScoreDelta: (playerId: string, delta: number) => void;
};

export function useQuestionState({
  questionsById,
  players,
  onPlayerScoreDelta,
}: UseQuestionStateArgs) {
  const [activeQuestionId, setActiveQuestionId] = useAtom(gameActiveQuestionIdAtom);
  const [openedQuestionIds, setOpenedQuestionIds] = useAtom(gameOpenedQuestionIdsAtom);
  const [questionFlowState, setQuestionFlowState] = useAtom(gameQuestionFlowStateAtom);

  const openedSet = useMemo(() => new Set(openedQuestionIds), [openedQuestionIds]);
  const isOpened = useCallback((id: string) => openedSet.has(id), [openedSet]);

  const activeQuestion = activeQuestionId ? questionsById.get(activeQuestionId) ?? null : null;
  const flowPhase = questionFlowState?.phase ?? (activeQuestionId ? "reading" : null);

  const setActiveQuestionIdValue = useCallback((next: string | null) => {
    setActiveQuestionId(next);
  }, [setActiveQuestionId]);

  const setOpenedQuestionIdsWithUpdater = useCallback((updater: (prev: string[]) => string[]) => {
    setOpenedQuestionIds(updater);
  }, [setOpenedQuestionIds]);

  const { closeQuestionModal, handleQuestionSelect, resetQuestionState } = useQuestionLifecycleActions({
    activeQuestionId,
    isOpened,
    setActiveQuestionId: setActiveQuestionIdValue,
    setOpenedQuestionIds: setOpenedQuestionIdsWithUpdater,
    setQuestionFlowState,
  });

  const { setAnswerInput, submitAnswer, markAnswerWrong, continueAfterWrong } = useQuestionAnswerActions({
    activeQuestionId,
    activeQuestion,
    questionFlowState,
    players,
    onPlayerScoreDelta,
    closeQuestionModal,
    setQuestionFlowState,
  });

  useQuestionTimerEffect({
    activeQuestionId,
    flowPhase,
    setQuestionFlowState,
  });

  useQuestionBuzzingEffect({
    activeQuestionId,
    flowPhase,
    players,
    setQuestionFlowState,
  });

  useQuestionAutoCloseEffect({
    flowPhase,
    closeQuestionModal,
  });

  const modalState = useMemo(() => {
    if (questionFlowState) return questionFlowState;
    if (!activeQuestionId) return null;
    return createQuestionFlowState(activeQuestionId);
  }, [activeQuestionId, questionFlowState]);

  const openAllQuestions = useCallback(() => {
    setOpenedQuestionIds(Array.from(questionsById.keys()));
  }, [questionsById, setOpenedQuestionIds]);

  return {
    activeQuestion,
    activeQuestionId,
    openedQuestionIds,
    modalState,
    questionTimerDurationMs: QUESTION_TIMER_DURATION_MS,
    handleQuestionSelect,
    closeQuestionModal,
    setAnswerInput,
    submitAnswer,
    markAnswerWrong,
    continueAfterWrong,
    openAllQuestions,
    resetQuestionState,
  };
}
