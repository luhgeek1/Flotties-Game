import { useAtomValue } from "jotai";
import { useCallback } from "react";

import { adminModeEnabledAtom } from "@/features/admin/store/adminModeAtom";
import { useFinalAllAnswersDoneEffect } from "./use-final-all-answers-done-effect";
import { useFinalAnswerTimerModel } from "./use-final-answer-timer-model";
import { useFinalLeaveTransition } from "./use-final-leave-transition";
import { useFinalQuestionModel } from "./use-final-question-model";

type UseFinalQuestionPageModelArgs = {
  onConfirmAnswer?: () => void;
  onAllAnswersDone?: () => void;
};

export function useFinalQuestionPageModel({
  onConfirmAnswer,
  onAllAnswersDone,
}: UseFinalQuestionPageModelArgs) {
  const questionModel = useFinalQuestionModel({ onConfirmAnswer });
  const isAdminMode = useAtomValue(adminModeEnabledAtom);
  const { isLeaving, runWithLeaveTransition } = useFinalLeaveTransition();
  const timerModel = useFinalAnswerTimerModel({
    currentPlayerId: questionModel.currentPlayerId,
    isAllPlayersAnswerDone: questionModel.isAllPlayersAnswerDone,
    isLeaving,
  });

  const handleSubmit = useCallback(() => {
    if (questionModel.isSubmitDisabled || isLeaving || timerModel.isTimeoutModalOpen) return;
    runWithLeaveTransition(questionModel.onSubmitAnswer, timerModel.clearCurrentPlayerTimerState);
  }, [
    isLeaving,
    questionModel.isSubmitDisabled,
    questionModel.onSubmitAnswer,
    runWithLeaveTransition,
    timerModel.clearCurrentPlayerTimerState,
    timerModel.isTimeoutModalOpen,
  ]);

  const handleTimeoutContinue = useCallback(() => {
    if (isLeaving) return;
    runWithLeaveTransition(questionModel.onTimeoutAnswer, timerModel.clearCurrentPlayerTimerState);
  }, [
    isLeaving,
    questionModel.onTimeoutAnswer,
    runWithLeaveTransition,
    timerModel.clearCurrentPlayerTimerState,
  ]);

  useFinalAllAnswersDoneEffect({
    isAllPlayersAnswerDone: questionModel.isAllPlayersAnswerDone,
    onAllAnswersDone,
  });

  return {
    ...questionModel,
    isAdminMode,
    isLeaving,
    remainingMs: timerModel.remainingMs,
    isTimeoutModalOpen: timerModel.isTimeoutModalOpen,
    finalAnswerTimerDurationMs: timerModel.finalAnswerTimerDurationMs,
    handleSubmit,
    handleTimeoutContinue,
  };
}
