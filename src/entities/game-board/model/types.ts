import type { QuestionPackQuestion, QuestionPackTheme } from "@/shared/api/questionPack";

export type GameBoardQuestion = Pick<QuestionPackQuestion, "id" | "value">;
export type GameBoardSpecialQuestionType = "catInBag" | "auction";
export type GameBoardSpecialTypeByQuestionId = Record<string, GameBoardSpecialQuestionType>;

export type GameBoardTheme = Omit<QuestionPackTheme, "questions"> & {
  questions: GameBoardQuestion[];
};
