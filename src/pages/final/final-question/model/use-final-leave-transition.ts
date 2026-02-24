import { useCallback, useEffect, useRef, useState } from "react";

const LEAVE_TRANSITION_DURATION_MS = 260;

export function useFinalLeaveTransition() {
  const [isLeaving, setIsLeaving] = useState(false);
  const leaveTimerRef = useRef<number | null>(null);

  const runWithLeaveTransition = useCallback((
    onLeave: () => void,
    onBeforeLeave?: () => void,
  ) => {
    if (isLeaving) return;

    onBeforeLeave?.();
    setIsLeaving(true);
    leaveTimerRef.current = window.setTimeout(() => {
      onLeave();
    }, LEAVE_TRANSITION_DURATION_MS);
  }, [isLeaving]);

  useEffect(() => () => {
    if (leaveTimerRef.current !== null) {
      window.clearTimeout(leaveTimerRef.current);
    }
  }, []);

  return {
    isLeaving,
    runWithLeaveTransition,
  };
}
