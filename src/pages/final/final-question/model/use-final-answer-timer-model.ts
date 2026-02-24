import { useAtom } from "jotai";
import { useCallback, useEffect, useRef } from "react";

import { finalAnswerTimerByPlayerIdAtom } from "@/features/game-session/store/finalAtom";

type UseFinalAnswerTimerModelArgs = {
  currentPlayerId: string | null;
  isAllPlayersAnswerDone: boolean;
  isLeaving: boolean;
};

const FINAL_ANSWER_TIMER_DURATION_MS = 60_000;

export function useFinalAnswerTimerModel({
  currentPlayerId,
  isAllPlayersAnswerDone,
  isLeaving,
}: UseFinalAnswerTimerModelArgs) {
  const [answerTimerByPlayerId, setAnswerTimerByPlayerId] = useAtom(finalAnswerTimerByPlayerIdAtom);
  const currentPlayerTimerState = currentPlayerId
    ? answerTimerByPlayerId[currentPlayerId]
    : undefined;
  const remainingMs = currentPlayerTimerState?.remainingMs ?? FINAL_ANSWER_TIMER_DURATION_MS;
  const isTimeoutModalOpen = currentPlayerTimerState?.isTimeoutModalOpen ?? false;

  const timerIntervalRef = useRef<number | null>(null);
  const timeoutTimerRef = useRef<number | null>(null);
  const timeoutAtRef = useRef<number | null>(window.performance.now() + remainingMs);
  const remainingMsRef = useRef(remainingMs);

  const clearCurrentPlayerTimerState = useCallback(() => {
    if (!currentPlayerId) return;

    setAnswerTimerByPlayerId(prev => {
      if (!(currentPlayerId in prev)) return prev;

      const next = { ...prev };
      delete next[currentPlayerId];
      return next;
    });
  }, [currentPlayerId, setAnswerTimerByPlayerId]);

  useEffect(() => {
    remainingMsRef.current = remainingMs;
  }, [remainingMs]);

  useEffect(() => {
    if (!currentPlayerId || isAllPlayersAnswerDone) {
      return;
    }

    setAnswerTimerByPlayerId(prev => {
      if (prev[currentPlayerId]) return prev;

      return {
        ...prev,
        [currentPlayerId]: {
          remainingMs: FINAL_ANSWER_TIMER_DURATION_MS,
          isTimeoutModalOpen: false,
        },
      };
    });
  }, [currentPlayerId, isAllPlayersAnswerDone, setAnswerTimerByPlayerId]);

  useEffect(() => {
    if (!currentPlayerId || isAllPlayersAnswerDone || isLeaving || isTimeoutModalOpen) {
      return;
    }

    const initialRemainingMs = Math.max(0, remainingMsRef.current);
    if (initialRemainingMs <= 0) {
      setAnswerTimerByPlayerId(prev => ({
        ...prev,
        [currentPlayerId]: {
          remainingMs: 0,
          isTimeoutModalOpen: true,
        },
      }));
      return;
    }

    timeoutAtRef.current = window.performance.now() + initialRemainingMs;

    timerIntervalRef.current = window.setInterval(() => {
      if (timeoutAtRef.current === null) return;

      const nextRemaining = Math.max(0, Math.round(timeoutAtRef.current - window.performance.now()));
      setAnswerTimerByPlayerId(prev => {
        const currentTimer = prev[currentPlayerId];
        if (
          currentTimer
          && currentTimer.remainingMs === nextRemaining
          && !currentTimer.isTimeoutModalOpen
        ) {
          return prev;
        }

        return {
          ...prev,
          [currentPlayerId]: {
            remainingMs: nextRemaining,
            isTimeoutModalOpen: false,
          },
        };
      });
    }, 100);

    timeoutTimerRef.current = window.setTimeout(() => {
      setAnswerTimerByPlayerId(prev => ({
        ...prev,
        [currentPlayerId]: {
          remainingMs: 0,
          isTimeoutModalOpen: true,
        },
      }));

      if (timerIntervalRef.current !== null) {
        window.clearInterval(timerIntervalRef.current);
        timerIntervalRef.current = null;
      }
    }, initialRemainingMs);

    return () => {
      if (timerIntervalRef.current !== null) {
        window.clearInterval(timerIntervalRef.current);
        timerIntervalRef.current = null;
      }

      if (timeoutTimerRef.current !== null) {
        window.clearTimeout(timeoutTimerRef.current);
        timeoutTimerRef.current = null;
      }

      timeoutAtRef.current = null;
    };
  }, [
    currentPlayerId,
    isAllPlayersAnswerDone,
    isLeaving,
    isTimeoutModalOpen,
    setAnswerTimerByPlayerId,
  ]);

  useEffect(() => {
    if (!isAllPlayersAnswerDone) return;
    if (Object.keys(answerTimerByPlayerId).length === 0) return;

    setAnswerTimerByPlayerId({});
  }, [answerTimerByPlayerId, isAllPlayersAnswerDone, setAnswerTimerByPlayerId]);

  useEffect(() => () => {
    if (timerIntervalRef.current !== null) {
      window.clearInterval(timerIntervalRef.current);
    }

    if (timeoutTimerRef.current !== null) {
      window.clearTimeout(timeoutTimerRef.current);
    }
  }, []);

  return {
    remainingMs,
    isTimeoutModalOpen,
    finalAnswerTimerDurationMs: FINAL_ANSWER_TIMER_DURATION_MS,
    clearCurrentPlayerTimerState,
  };
}
