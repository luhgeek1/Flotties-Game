import { atom } from "jotai";
import { fetchDefaultQuestionPack } from "../api/questionPack";

export const questionPackAtom = atom(async () => {
  return await fetchDefaultQuestionPack();
});
