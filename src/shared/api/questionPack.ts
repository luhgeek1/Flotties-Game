export type QuestionTheme = {
  id: string;
  title: string;
  questions: unknown[];
};

export type QuestionRound = {
  id: string;
  title: string;
  values: number[];
  themes: QuestionTheme[];
};

export type QuestionPack = {
  id: string;
  title: string;
  lang: string;
  rounds: QuestionRound[];
};

export async function fetchDefaultQuestionPack(): Promise<QuestionPack> {
  const resp = await fetch(new URL("../../app/questions.json", import.meta.url));
  if (!resp.ok) {
    throw new Error("Failed to load question pack");
  }

  return (await resp.json()) as QuestionPack;
}
