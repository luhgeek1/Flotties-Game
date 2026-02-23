export type QuestionPackQuestionType = "normal";

export type QuestionPackQuestion = {
  id: string;
  value: number;
  type: QuestionPackQuestionType;
  question: string;
  answers: string[];
};

export type QuestionPackSpecialQuestion = {
  id: string;
  theme: string;
  question: string;
  answers: string[];
};

export type QuestionPackSpecialBucket = {
  questions: QuestionPackSpecialQuestion[];
};

export type QuestionPackSpecial = {
  catInBag: QuestionPackSpecialBucket;
  auction: QuestionPackSpecialBucket;
};

export type QuestionPackSpecialByRound = Record<string, QuestionPackSpecial>;

export type QuestionPackSpecialConfig = {
  byRound: QuestionPackSpecialByRound;
};

export type QuestionPackTheme = {
  id: string;
  title: string;
  questions: QuestionPackQuestion[];
};

export type QuestionPackRound = {
  id: string;
  title: string;
  values: number[];
  themes: QuestionPackTheme[];
};

export type QuestionPackRounds = {
  main: QuestionPackRound[];
  final: QuestionPackSpecialQuestion;
};

export type QuestionPack = {
  id: string;
  title: string;
  lang: string;
  rounds: QuestionPackRounds;
  special: QuestionPackSpecialConfig;
};

export async function fetchDefaultQuestionPack(): Promise<QuestionPack> {
  const resp = await fetch(new URL("../storage/questions.json", import.meta.url));
  if (!resp.ok) {
    throw new Error("Failed to load question pack");
  }

  return (await resp.json()) as QuestionPack;
}
