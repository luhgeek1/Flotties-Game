import { useEffect } from "react";

import { RESULT_CORRECT_AUTO_CLOSE_MS } from "./questionFlow";

type UseQuestionAutoCloseEffectArgs = {
  flowPhase: string | null;
  closeQuestionModal: () => void;
};

export function useQuestionAutoCloseEffect({
  flowPhase,
  closeQuestionModal,
}: UseQuestionAutoCloseEffectArgs) {
  useEffect(() => {
    if (flowPhase !== "result-correct") return;

    const timeoutId = window.setTimeout(() => {
      closeQuestionModal();
    }, RESULT_CORRECT_AUTO_CLOSE_MS);

    return () => window.clearTimeout(timeoutId);
  }, [closeQuestionModal, flowPhase]);
}
