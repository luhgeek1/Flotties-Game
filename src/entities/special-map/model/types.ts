import type { QuestionPackRound, QuestionPackSpecial } from "@/shared/api/questionPack";

export type SpecialQuestionType = "catInBag" | "auction";

export type RoundSpecialCell = {
  type: SpecialQuestionType;
  specialQuestionId: string;
};

export type RoundSpecialMap = Record<string, RoundSpecialCell>;

export type CreateRoundSpecialMapArgs = {
  round: QuestionPackRound;
  special: QuestionPackSpecial;
  random?: () => number;
};
