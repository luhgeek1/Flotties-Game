import { useMemo } from "react";

import type { GameBoardTheme } from "@/entities/game-board";
import type { QuestionPack, QuestionPackQuestion } from "@/shared/api/questionPack";

const EMPTY_BOARD_RESULT = {
  boardThemes: [] as GameBoardTheme[],
  questionsById: new Map<string, QuestionPackQuestion>(),
  totalQuestions: 0,
};

export function useGameBoardData(selectedPack: QuestionPack) {
  return useMemo(() => {
    const activeRound = selectedPack.rounds.at(0);

    if (!activeRound) {
      return {
        ...EMPTY_BOARD_RESULT,
        packTitle: selectedPack.title,
      };
    }

    const questionsById = new Map<string, QuestionPackQuestion>();

    const boardThemes: GameBoardTheme[] = activeRound.themes.map(theme => ({
      id: theme.id,
      title: theme.title,
      questions: theme.questions.map(question => {
        questionsById.set(question.id, question);
        return { id: question.id, value: question.value };
      }),
    }));

    return {
      boardThemes,
      questionsById,
      totalQuestions: questionsById.size,
      packTitle: selectedPack.title,
    };
  }, [selectedPack]);
}
