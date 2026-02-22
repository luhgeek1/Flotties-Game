import { useCallback, useMemo } from "react";
import { useAtom, useSetAtom } from "jotai";

import type { GameQuestionFlowState } from "@/shared/store/gameAtoms";
import {
  onboardingDemoStateAtom,
  resetOnboardingDemoStateAtom,
} from "@/shared/store/onboardingAtom";
import {
  applyPlayerBuzz,
  createQuestionFlowState,
  QUESTION_TIMER_DURATION_MS,
} from "@/pages/game/model/questionFlow";
import { useQuestionAnswerActions } from "@/pages/game/model/useQuestionAnswerActions";
import { useQuestionAutoCloseEffect } from "@/pages/game/model/useQuestionAutoCloseEffect";
import { useQuestionBuzzingEffect } from "@/pages/game/model/useQuestionBuzzingEffect";
import { useQuestionTimerEffect } from "@/pages/game/model/useQuestionTimerEffect";
import { DEMO_PLAYERS, DEMO_QUESTION, DEMO_THEME } from "./constants";

export function useOnboardingQuestionDemo() {
  const [demoState, setDemoState] = useAtom(onboardingDemoStateAtom);
  const resetOnboardingDemoState = useSetAtom(resetOnboardingDemoStateAtom);
  const {
    activeQuestionId,
    openedQuestionIds,
    questionFlowState,
    playerScores,
  } = demoState;

  const setQuestionFlowState = useCallback((
    next:
      | GameQuestionFlowState
      | null
      | ((prev: GameQuestionFlowState | null) => GameQuestionFlowState | null),
  ) => {
    setDemoState(prev => ({
      ...prev,
      questionFlowState: typeof next === "function" ? next(prev.questionFlowState) : next,
    }));
  }, [setDemoState]);

  const isOpened = useCallback(
    (questionId: string) => openedQuestionIds.includes(questionId),
    [openedQuestionIds],
  );

  const closeQuestionModal = useCallback(() => {
    setDemoState(prev => {
      const currentQuestionId = prev.activeQuestionId;
      if (!currentQuestionId) return prev;

      const nextOpenedQuestionIds = prev.openedQuestionIds.includes(currentQuestionId)
        ? prev.openedQuestionIds
        : [...prev.openedQuestionIds, currentQuestionId];

      return {
        ...prev,
        openedQuestionIds: nextOpenedQuestionIds,
        activeQuestionId: null,
        questionFlowState: null,
      };
    });
  }, [setDemoState]);

  const handleQuestionSelect = useCallback((questionId: string) => {
    if (questionId !== DEMO_QUESTION.id) return;
    if (isOpened(questionId)) return;

    setDemoState(prev => ({
      ...prev,
      activeQuestionId: questionId,
      questionFlowState: createQuestionFlowState(questionId),
    }));
  }, [isOpened, setDemoState]);

  const activeQuestion = activeQuestionId === DEMO_QUESTION.id ? DEMO_QUESTION : null;
  const flowPhase = questionFlowState?.phase ?? (activeQuestionId ? "reading" : null);

  useQuestionTimerEffect({
    activeQuestionId,
    flowPhase,
    setQuestionFlowState,
  });

  useQuestionBuzzingEffect({
    activeQuestionId,
    flowPhase,
    players: DEMO_PLAYERS,
    setQuestionFlowState,
  });

  useQuestionAutoCloseEffect({
    flowPhase,
    closeQuestionModal,
  });

  const onPlayerScoreDelta = useCallback((playerId: string, delta: number) => {
    setDemoState(prev => ({
      ...prev,
      playerScores: {
        ...prev.playerScores,
        [playerId]: (prev.playerScores[playerId] ?? 0) + delta,
      },
    }));
  }, [setDemoState]);

  const { setAnswerInput, submitAnswer, continueAfterWrong } = useQuestionAnswerActions({
    activeQuestionId,
    activeQuestion,
    questionFlowState,
    players: DEMO_PLAYERS,
    onPlayerScoreDelta,
    closeQuestionModal,
    setQuestionFlowState,
  });

  const modalState = useMemo(() => {
    if (questionFlowState) return questionFlowState;
    if (!activeQuestionId) return null;
    return createQuestionFlowState(activeQuestionId);
  }, [activeQuestionId, questionFlowState]);

  const modalQuestionId = activeQuestionId ?? modalState?.questionId ?? null;
  const isQuestionModalOpen = modalQuestionId !== null;

  const pickPlayerByClick = useCallback((playerId: string) => {
    if (!activeQuestionId) return;
    setQuestionFlowState(prev => applyPlayerBuzz(prev, activeQuestionId, playerId));
  }, [activeQuestionId, setQuestionFlowState]);

  const resetDemo = useCallback(() => {
    resetOnboardingDemoState();
  }, [resetOnboardingDemoState]);

  const playersWithScore = useMemo(
    () => DEMO_PLAYERS.map(player => ({
      ...player,
      score: playerScores[player.id] ?? 0,
    })),
    [playerScores],
  );

  const isDemoQuestionCompleted = openedQuestionIds.includes(DEMO_QUESTION.id);
  const canPickPlayerByClick = flowPhase === "reading" && activeQuestionId === DEMO_QUESTION.id;

  return {
    boardThemes: [DEMO_THEME],
    openedQuestionIds,
    handleQuestionSelect,
    playersWithScore,
    canPickPlayerByClick,
    pickPlayerByClick,
    isDemoQuestionCompleted,
    resetDemo,
    questionModal: {
      isOpen: isQuestionModalOpen,
      questionId: modalQuestionId,
      questionValue: DEMO_QUESTION.value,
      questionText: DEMO_QUESTION.question,
      answerText: DEMO_QUESTION.answers[0] ?? "Ответ не указан",
      players: DEMO_PLAYERS,
      phase: modalState?.phase ?? null,
      remainingMs: modalState?.remainingMs ?? QUESTION_TIMER_DURATION_MS,
      timerDurationMs: QUESTION_TIMER_DURATION_MS,
      attemptedPlayerIds: modalState?.attemptedPlayerIds ?? [],
      activePlayerId: modalState?.activePlayerId ?? null,
      answerInput: modalState?.answerInput ?? "",
      onAnswerInputChange: setAnswerInput,
      onSubmitAnswer: submitAnswer,
      onContinue: continueAfterWrong,
    },
  };
}
