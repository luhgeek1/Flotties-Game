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

export type QuestionPack = {
  id: string;
  title: string;
  lang: string;
  rounds: QuestionPackRound[];
  special: QuestionPackSpecial;
};

export async function fetchDefaultQuestionPack(): Promise<QuestionPack> {
  const resp = await fetch(new URL("../storage/questions.json", import.meta.url));
  if (!resp.ok) {
    throw new Error("Failed to load question pack");
  }

  return (await resp.json()) as QuestionPack;
}
