export type QuestionPackQuestion = {
  id: string;
  value: number;
  type: string;
  question: string;
  answers: string[];
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
  special: unknown;
};

export async function fetchDefaultQuestionPack(): Promise<QuestionPack> {
  const resp = await fetch(new URL("../storage/questions.json", import.meta.url));
  if (!resp.ok) {
    throw new Error("Failed to load question pack");
  }

  return (await resp.json()) as QuestionPack;
}
