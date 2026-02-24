import { useEffect, useRef } from "react";

const FINAL_COMPLETE_SCREEN_DURATION_MS = 3000;

type UseFinalAllAnswersDoneEffectArgs = {
  isAllPlayersAnswerDone: boolean;
  onAllAnswersDone?: () => void;
};

export function useFinalAllAnswersDoneEffect({
  isAllPlayersAnswerDone,
  onAllAnswersDone,
}: UseFinalAllAnswersDoneEffectArgs) {
  const allAnswersDoneTimerRef = useRef<number | null>(null);

  useEffect(() => {
    if (!isAllPlayersAnswerDone || !onAllAnswersDone || allAnswersDoneTimerRef.current !== null) {
      return;
    }

    allAnswersDoneTimerRef.current = window.setTimeout(() => {
      onAllAnswersDone();
    }, FINAL_COMPLETE_SCREEN_DURATION_MS);
  }, [isAllPlayersAnswerDone, onAllAnswersDone]);

  useEffect(() => () => {
    if (allAnswersDoneTimerRef.current !== null) {
      window.clearTimeout(allAnswersDoneTimerRef.current);
    }
  }, []);
}
