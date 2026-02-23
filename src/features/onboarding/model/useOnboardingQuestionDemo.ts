import { useCallback, useEffect, useMemo, useState } from "react";
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
  useQuestionAnswerActions,
  useQuestionAutoCloseEffect,
  useQuestionBuzzingEffect,
  useQuestionTimerEffect,
} from "@/features/question-flow";
import { DEMO_PLAYERS, DEMO_QUESTION } from "./constants";

function createRestoredQuestionFlowState(
  questionPhase: GameQuestionFlowState["phase"] | null,
  answerInput: string,
): GameQuestionFlowState | null {
  if (!questionPhase) return null;

  const baseState = createQuestionFlowState(DEMO_QUESTION.id);

  if (questionPhase === "answering") {
    return {
      ...baseState,
      phase: questionPhase,
      activePlayerId: DEMO_PLAYERS[0]?.id ?? null,
      answerInput,
    };
  }

  return {
    ...baseState,
    phase: questionPhase,
    answerInput,
  };
}

export function useOnboardingQuestionDemo() {
  const [demoState, setDemoState] = useAtom(onboardingDemoStateAtom);
  const resetOnboardingDemoState = useSetAtom(resetOnboardingDemoStateAtom);
  const [activeQuestionId, setActiveQuestionId] = useState<string | null>(
    demoState.questionPhase ? DEMO_QUESTION.id : null,
  );
  const [questionFlowState, setQuestionFlowStateState] = useState<GameQuestionFlowState | null>(
    () => createRestoredQuestionFlowState(demoState.questionPhase, demoState.answerInput),
  );
  const [isDemoQuestionCompleted, setIsDemoQuestionCompleted] = useState(false);

  const setQuestionFlowState = useCallback((
    next:
      | GameQuestionFlowState
      | null
      | ((prev: GameQuestionFlowState | null) => GameQuestionFlowState | null),
  ) => {
    setQuestionFlowStateState(prev => (typeof next === "function" ? next(prev) : next));
  }, []);

  const persistedQuestionPhase = questionFlowState?.phase ?? null;
  const persistedAnswerInput = questionFlowState?.answerInput ?? "";

  useEffect(() => {
    setDemoState(prev => {
      if (
        prev.questionPhase === persistedQuestionPhase
        && prev.answerInput === persistedAnswerInput
      ) {
        return prev;
      }

      return {
        ...prev,
        questionPhase: persistedQuestionPhase,
        answerInput: persistedAnswerInput,
      };
    });
  }, [persistedAnswerInput, persistedQuestionPhase, setDemoState]);

  const closeQuestionModal = useCallback(() => {
    if (!activeQuestionId) return;

    setIsDemoQuestionCompleted(true);
    setActiveQuestionId(null);
    setQuestionFlowStateState(null);
  }, [activeQuestionId]);

  const handleQuestionSelect = useCallback((questionId: string) => {
    if (questionId !== DEMO_QUESTION.id) return;
    if (isDemoQuestionCompleted) return;

    setActiveQuestionId(questionId);
    setQuestionFlowStateState(createQuestionFlowState(questionId));
  }, [isDemoQuestionCompleted]);

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

  const { setAnswerInput, submitAnswer, continueAfterWrong } = useQuestionAnswerActions({
    activeQuestionId,
    activeQuestion,
    questionFlowState,
    players: DEMO_PLAYERS,
    onPlayerScoreDelta: () => {},
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
    setIsDemoQuestionCompleted(false);
    setActiveQuestionId(null);
    setQuestionFlowStateState(null);
  }, [resetOnboardingDemoState]);

  const canPickPlayerByClick = flowPhase === "reading" && activeQuestionId === DEMO_QUESTION.id;

  return {
    demoQuestionId: DEMO_QUESTION.id,
    demoQuestionValue: DEMO_QUESTION.value,
    handleQuestionSelect,
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
