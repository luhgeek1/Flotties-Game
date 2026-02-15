import { useEffect } from "react";

import { applyTimerTick, QUESTION_TIMER_TICK_MS, type SetQuestionFlowState } from "./questionFlow";

type UseQuestionTimerEffectArgs = {
  activeQuestionId: string | null;
  flowPhase: string | null;
  setQuestionFlowState: SetQuestionFlowState;
};

export function useQuestionTimerEffect({
  activeQuestionId,
  flowPhase,
  setQuestionFlowState,
}: UseQuestionTimerEffectArgs) {
  useEffect(() => {
    if (!activeQuestionId || flowPhase !== "reading") return;

    const intervalId = window.setInterval(() => {
      setQuestionFlowState(prev => applyTimerTick(prev, activeQuestionId));
    }, QUESTION_TIMER_TICK_MS);

    return () => window.clearInterval(intervalId);
  }, [activeQuestionId, flowPhase, setQuestionFlowState]);
}
