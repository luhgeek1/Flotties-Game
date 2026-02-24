import type { GameQuestionFlowState } from "@/shared/store/gameAtoms";

export const QUESTION_TIMER_DURATION_MS = 30_000;
export const QUESTION_TIMER_TICK_MS = 100;
export const RESULT_CORRECT_AUTO_CLOSE_MS = 1_600;

export type QuestionStatePlayer = {
  id: string;
  keyCode: string;
};

export type SetQuestionFlowState = (
  next:
    | GameQuestionFlowState
    | null
    | ((prev: GameQuestionFlowState | null) => GameQuestionFlowState | null),
) => void;

export function createQuestionFlowState(questionId: string): GameQuestionFlowState {
  return {
    questionId,
    phase: "reading",
    remainingMs: QUESTION_TIMER_DURATION_MS,
    attemptedPlayerIds: [],
    activePlayerId: null,
    answerInput: "",
  };
}

export function createQuestionFlowAnsweringState(
  questionId: string,
  playerId: string,
): GameQuestionFlowState {
  return {
    questionId,
    phase: "answering",
    remainingMs: QUESTION_TIMER_DURATION_MS,
    attemptedPlayerIds: [],
    activePlayerId: playerId,
    answerInput: "",
  };
}
//" ПрИвЕт, Ёж! " -> "привет еж"
export function normalizeAnswer(value: string): string {
  return value
    .trim()
    .toLocaleLowerCase()
    .replace(/ё/g, "е")
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .replace(/\s+/g, " ");
}

export function checkAnswer(input: string, allowedAnswers: readonly string[]): boolean {
  const normalizedInput = normalizeAnswer(input);
  if (!normalizedInput) return false;

  return allowedAnswers.some(answer => normalizeAnswer(answer) === normalizedInput);
}

export function setWrongAnswerResult(state: GameQuestionFlowState): GameQuestionFlowState {
  if (!state.activePlayerId) return state;

  const attemptedPlayerIds = state.attemptedPlayerIds.includes(state.activePlayerId)
    ? state.attemptedPlayerIds
    : [...state.attemptedPlayerIds, state.activePlayerId];

  return {
    ...state,
    phase: "result-wrong",
    attemptedPlayerIds,
  };
}

export function setTimeoutResult(state: GameQuestionFlowState): GameQuestionFlowState {
  return {
    ...state,
    phase: "result-timeout",
    activePlayerId: null,
    answerInput: "",
  };
}

export function setReadingReplay(state: GameQuestionFlowState): GameQuestionFlowState {
  return {
    ...state,
    phase: "reading",
    activePlayerId: null,
    answerInput: "",
  };
}

function ensureQuestionFlowState(
  prev: GameQuestionFlowState | null,
  activeQuestionId: string,
): GameQuestionFlowState {
  if (!prev || prev.questionId !== activeQuestionId) {
    return createQuestionFlowState(activeQuestionId);
  }

  return prev;
}

export function applyTimerTick(
  prev: GameQuestionFlowState | null,
  activeQuestionId: string,
): GameQuestionFlowState | null {
  const state = ensureQuestionFlowState(prev, activeQuestionId);
  if (state.phase !== "reading") return state;

  const nextRemainingMs = Math.max(0, state.remainingMs - QUESTION_TIMER_TICK_MS);
  if (nextRemainingMs <= 0) {
    return {
      ...setTimeoutResult(state),
      remainingMs: 0,
    };
  }

  return {
    ...state,
    remainingMs: nextRemainingMs,
  };
}

export function applyPlayerBuzz(
  prev: GameQuestionFlowState | null,
  activeQuestionId: string,
  playerId: string,
): GameQuestionFlowState | null {
  const state = ensureQuestionFlowState(prev, activeQuestionId);
  if (state.phase !== "reading") return state;
  if (state.attemptedPlayerIds.includes(playerId)) return state;

  return {
    ...state,
    phase: "answering",
    activePlayerId: playerId,
    answerInput: "",
  };
}
