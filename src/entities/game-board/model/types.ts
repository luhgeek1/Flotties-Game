import type { QuestionPackQuestion, QuestionPackTheme } from "@/shared/api/questionPack";

export type GameBoardQuestion = Pick<QuestionPackQuestion, "id" | "value">;

export type GameBoardTheme = Omit<QuestionPackTheme, "questions"> & {
  questions: GameBoardQuestion[];
};
