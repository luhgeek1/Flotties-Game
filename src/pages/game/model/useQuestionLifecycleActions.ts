import { useCallback } from "react";

import type { GameQuestionFlowState } from "@/shared/store/gameAtoms";

import { createQuestionFlowState, type SetQuestionFlowState } from "./questionFlow";

type UseQuestionLifecycleActionsArgs = {
  activeQuestionId: string | null;
  activeQuestionValue: number | null;
  questionFlowState: GameQuestionFlowState | null;
  isOpened: (questionId: string) => boolean;
  onPlayerScoreDelta: (playerId: string, delta: number) => void;
  setActiveQuestionId: (next: string | null) => void;
  setOpenedQuestionIds: (updater: (prev: string[]) => string[]) => void;
  setQuestionFlowState: SetQuestionFlowState;
};

export function useQuestionLifecycleActions({
  activeQuestionId,
  activeQuestionValue,
  questionFlowState,
  isOpened,
  onPlayerScoreDelta,
  setActiveQuestionId,
  setOpenedQuestionIds,
  setQuestionFlowState,
}: UseQuestionLifecycleActionsArgs) {
  const markOpened = useCallback((id: string) => {
    setOpenedQuestionIds(prev => (prev.includes(id) ? prev : [...prev, id]));
  }, [setOpenedQuestionIds]);

  const applyWrongAnswerPenalties = useCallback(() => {
    if (activeQuestionValue === null || !questionFlowState) return;
    if (questionFlowState.phase === "result-correct") return;

    questionFlowState.attemptedPlayerIds.forEach(playerId => {
      onPlayerScoreDelta(playerId, -activeQuestionValue);
    });
  }, [activeQuestionValue, onPlayerScoreDelta, questionFlowState]);

  const closeQuestionModal = useCallback(() => {
    if (!activeQuestionId) return;

    markOpened(activeQuestionId);
    applyWrongAnswerPenalties();
    setActiveQuestionId(null);
    setQuestionFlowState(null);
  }, [
    activeQuestionId,
    applyWrongAnswerPenalties,
    markOpened,
    setActiveQuestionId,
    setQuestionFlowState,
  ]);

  const handleQuestionSelect = useCallback((id: string) => {
    if (isOpened(id)) return;

    setActiveQuestionId(id);
    setQuestionFlowState(createQuestionFlowState(id));
  }, [isOpened, setActiveQuestionId, setQuestionFlowState]);

  const resetQuestionState = useCallback(() => {
    setActiveQuestionId(null);
    setOpenedQuestionIds(() => []);
    setQuestionFlowState(null);
  }, [setActiveQuestionId, setOpenedQuestionIds, setQuestionFlowState]);

  return {
    closeQuestionModal,
    handleQuestionSelect,
    resetQuestionState,
  };
}
