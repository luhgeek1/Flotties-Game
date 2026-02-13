import { atom } from "jotai";
import { fetchDefaultQuestionPack, type QuestionPack } from "../api/questionPack";
import { setupSelectedPackIdAtom } from "./setupAtoms";

// загрузка всех паков 
export const questionPacksAtom = atom(async () => {
  const defaultPack = await fetchDefaultQuestionPack();
  return [defaultPack];
});

// что выбрал юзер то и вернуть 
export function getSelectedQuestionPack(
  packs: QuestionPack[],
  selectedPackId: QuestionPack["id"] | null,
): QuestionPack | null {
  if (packs.length === 0) {
    return null;
  }

  return packs.find(pack => pack.id === selectedPackId) ?? packs[0];
}

//получить активные паки 
export const selectedQuestionPackAtom = atom(async get => {
  const packs = await get(questionPacksAtom);
  const selectedPackId = get(setupSelectedPackIdAtom);

  return getSelectedQuestionPack(packs, selectedPackId);
});
