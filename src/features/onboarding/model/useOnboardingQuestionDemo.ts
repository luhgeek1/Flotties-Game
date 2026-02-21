import { useCallback, useMemo, useState } from "react";

import type { GameBoardTheme } from "@/entities/game-board/model";
import { PLAYER_SELECTION_KEY_CODES } from "@/entities/players";
import type { QuestionModalPlayer } from "@/features/question-modal";
import defaultPlayerAvatar from "@/shared/assets/default-user-avatar.svg";
import type { QuestionPackQuestion } from "@/shared/api/questionPack";
import type { GameQuestionFlowState } from "@/shared/store/gameAtoms";
import {
  applyPlayerBuzz,
  createQuestionFlowState,
  QUESTION_TIMER_DURATION_MS,
} from "@/pages/game/model/questionFlow";
import { useQuestionAnswerActions } from "@/pages/game/model/useQuestionAnswerActions";
import { useQuestionAutoCloseEffect } from "@/pages/game/model/useQuestionAutoCloseEffect";
import { useQuestionBuzzingEffect } from "@/pages/game/model/useQuestionBuzzingEffect";
import { useQuestionTimerEffect } from "@/pages/game/model/useQuestionTimerEffect";

const DEMO_QUESTION: QuestionPackQuestion = {
  id: "r1-langs-100",
  value: 100,
  type: "normal",
  question: "Какой язык программирования создал Гвидо ван Россум?",
  answers: ["python"],
};

const DEMO_THEME: GameBoardTheme = {
  id: "r1-langs",
  title: "Языки программирования",
  questions: [
    { id: "r1-langs-100", value: 100 },
    { id: "r1-langs-200", value: 200 },
    { id: "r1-langs-300", value: 300 },
    { id: "r1-langs-400", value: 400 },
    { id: "r1-langs-500", value: 500 },
  ],
};

const DEMO_LOCKED_QUESTION_IDS = [
  "r1-langs-200",
  "r1-langs-300",
  "r1-langs-400",
  "r1-langs-500",
];

const DEMO_PLAYERS: QuestionModalPlayer[] = [
  {
    id: "onboarding-p1",
    name: "Игрок 1",
    keyCode: PLAYER_SELECTION_KEY_CODES[0],
    avatarUrl: defaultPlayerAvatar,
  },
  {
    id: "onboarding-p2",
    name: "Игрок 2",
    keyCode: PLAYER_SELECTION_KEY_CODES[1],
    avatarUrl: defaultPlayerAvatar,
  },
  {
    id: "onboarding-p3",
    name: "Игрок 3",
    keyCode: PLAYER_SELECTION_KEY_CODES[2],
    avatarUrl: defaultPlayerAvatar,
  },
];

function buildInitialScores(): Record<string, number> {
  return DEMO_PLAYERS.reduce<Record<string, number>>((acc, player) => {
    acc[player.id] = 0;
    return acc;
  }, {});
}

export function useOnboardingQuestionDemo() {
  const [activeQuestionId, setActiveQuestionId] = useState<string | null>(null);
  const [openedQuestionIds, setOpenedQuestionIds] = useState<string[]>(() => [...DEMO_LOCKED_QUESTION_IDS]);
  const [questionFlowState, setQuestionFlowState] = useState<GameQuestionFlowState | null>(null);
  const [playerScores, setPlayerScores] = useState<Record<string, number>>(() => buildInitialScores());

  const isOpened = useCallback(
    (questionId: string) => openedQuestionIds.includes(questionId),
    [openedQuestionIds],
  );

  const closeQuestionModal = useCallback(() => {
    if (!activeQuestionId) return;

    setOpenedQuestionIds(prev => (prev.includes(activeQuestionId) ? prev : [...prev, activeQuestionId]));
    setActiveQuestionId(null);
    setQuestionFlowState(null);
  }, [activeQuestionId]);

  const handleQuestionSelect = useCallback((questionId: string) => {
    if (questionId !== DEMO_QUESTION.id) return;
    if (isOpened(questionId)) return;

    setActiveQuestionId(questionId);
    setQuestionFlowState(createQuestionFlowState(questionId));
  }, [isOpened]);

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
    setPlayerScores(prev => ({
      ...prev,
      [playerId]: (prev[playerId] ?? 0) + delta,
    }));
  }, []);

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
  }, [activeQuestionId]);

  const resetDemo = useCallback(() => {
    setActiveQuestionId(null);
    setOpenedQuestionIds([...DEMO_LOCKED_QUESTION_IDS]);
    setQuestionFlowState(null);
    setPlayerScores(buildInitialScores());
  }, []);

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
