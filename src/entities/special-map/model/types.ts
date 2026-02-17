import type { QuestionPackRound, QuestionPackSpecial } from "@/shared/api/questionPack";

export type CreateRoundSpecialMapArgs = {
  round: QuestionPackRound;
  special: QuestionPackSpecial;
  random?: () => number;
};
