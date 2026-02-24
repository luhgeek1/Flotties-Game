import { useCallback } from "react";

import { createQuestionFlowAnsweringState, createQuestionFlowState, type SetQuestionFlowState } from "./questionFlow";

type UseQuestionLifecycleActionsArgs = {
  activeQuestionId: string | null;
  isOpened: (questionId: string) => boolean;
  setActiveQuestionId: (next: string | null) => void;
  setOpenedQuestionIds: (updater: (prev: string[]) => string[]) => void;
  setQuestionFlowState: SetQuestionFlowState;
};

export function useQuestionLifecycleActions({
  activeQuestionId,
  isOpened,
  setActiveQuestionId,
  setOpenedQuestionIds,
  setQuestionFlowState,
}: UseQuestionLifecycleActionsArgs) {
  //добавить айди в массив айди открытых вопросов если его там нет
  const markOpened = useCallback((id: string) => {
    setOpenedQuestionIds(prev => (prev.includes(id) ? prev : [...prev, id]));
  }, [setOpenedQuestionIds]);

  const closeQuestionModal = useCallback(() => {
    if (!activeQuestionId) return;

    markOpened(activeQuestionId);
    setActiveQuestionId(null);
    setQuestionFlowState(null);
  }, [activeQuestionId, markOpened, setActiveQuestionId, setQuestionFlowState]);

  const handleQuestionSelect = useCallback((id: string) => {
    if (isOpened(id)) return;

    setActiveQuestionId(id);
    setQuestionFlowState(createQuestionFlowState(id));
  }, [isOpened, setActiveQuestionId, setQuestionFlowState]);

  const startQuestionAnswering = useCallback((questionId: string, playerId: string) => {
    if (isOpened(questionId)) return;

    setActiveQuestionId(questionId);
    setQuestionFlowState(createQuestionFlowAnsweringState(questionId, playerId));
  }, [isOpened, setActiveQuestionId, setQuestionFlowState]);

  return {
    closeQuestionModal,
    handleQuestionSelect,
    startQuestionAnswering,
  };
}
