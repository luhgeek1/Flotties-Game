import type { RoundSpecialMap, SpecialQuestionType } from "@/shared/store/specialCIBAtom";

import type { CreateRoundSpecialMapArgs } from "./types";

type SpecialCandidate = {
  type: SpecialQuestionType;
  specialQuestionId: string;
};
// алгоритм Фишера-Йейтса помог кодекс сделать 
// перемешивает массив index для того чтобы на рандом нам потом выбрать вопросы которые заментся на простые
function shuffle<T>(items: readonly T[], random: () => number): T[] { 
  const next = [...items];
  
  for (let index = next.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(random() * (index + 1));
    [next[index], next[swapIndex]] = [next[swapIndex], next[index]];
  }

  return next;
}

function getRoundQuestionIds(round: CreateRoundSpecialMapArgs["round"]): string[] {
  return round.themes.flatMap(theme => theme.questions.map(question => question.id));
}

function getSpecialCandidates(special: CreateRoundSpecialMapArgs["special"]): SpecialCandidate[] {
  const catInBagCandidates = special.catInBag.questions.map(question => ({
    type: "catInBag" as const,
    specialQuestionId: question.id,
  }));

  const auctionCandidates = special.auction.questions.map(question => ({
    type: "auction" as const,
    specialQuestionId: question.id,
  }));

  return [...catInBagCandidates, ...auctionCandidates];
}

export function createRoundSpecialMap({
  round,
  special,
  random = Math.random,
}: CreateRoundSpecialMapArgs): RoundSpecialMap {
  const roundQuestionIds = getRoundQuestionIds(round);
  const specialCandidates = getSpecialCandidates(special);

  if (roundQuestionIds.length === 0 || specialCandidates.length === 0) {
    return {};
  }

  const shuffledQuestionIds = shuffle(roundQuestionIds, random);
  const shuffledSpecialCandidates = shuffle(specialCandidates, random);
  const assignmentCount = Math.min(shuffledQuestionIds.length, shuffledSpecialCandidates.length);

  const roundSpecialMap: RoundSpecialMap = {};

  for (let index = 0; index < assignmentCount; index += 1) {
    const questionId = shuffledQuestionIds[index];
    const candidate = shuffledSpecialCandidates[index];

    roundSpecialMap[questionId] = {
      type: candidate.type,
      specialQuestionId: candidate.specialQuestionId,
    };
  }

  return roundSpecialMap;
}
