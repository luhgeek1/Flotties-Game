import { useEffect } from "react";

import { applyTimerTick, QUESTION_TIMER_TICK_MS, type SetQuestionFlowState } from "./questionFlow";

type UseQuestionTimerEffectArgs = {
  activeQuestionId: string | null;
  flowPhase: string | null;
  questionValue: number | null;
  onPlayerScoreDelta: (playerId: string, delta: number) => void;
  setQuestionFlowState: SetQuestionFlowState;
};

export function useQuestionTimerEffect({
  activeQuestionId,
  flowPhase,
  questionValue,
  onPlayerScoreDelta,
  setQuestionFlowState,
}: UseQuestionTimerEffectArgs) {
  useEffect(() => {
    if (!activeQuestionId) return;
    if (flowPhase !== "reading" && flowPhase !== "answering") return;

    const intervalId = window.setInterval(() => {
      let timedOutAnsweringPlayerId: string | null = null;

      setQuestionFlowState(prev => {
        const next = applyTimerTick(prev, activeQuestionId);

        if (
          prev
          && prev.questionId === activeQuestionId
          && prev.phase === "answering"
          && prev.activePlayerId
          && next
          && next.phase === "result-wrong"
        ) {
          timedOutAnsweringPlayerId = prev.activePlayerId;
        }

        return next;
      });

      if (timedOutAnsweringPlayerId && questionValue !== null) {
        onPlayerScoreDelta(timedOutAnsweringPlayerId, -questionValue);
      }
    }, QUESTION_TIMER_TICK_MS);

    return () => window.clearInterval(intervalId);
  }, [activeQuestionId, flowPhase, onPlayerScoreDelta, questionValue, setQuestionFlowState]);
}
