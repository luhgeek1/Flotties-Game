import { useCallback } from "react";

import type { RoundSpecialMap } from "@/entities/special-map";
import { useAuctionQuestionData } from "@/features/auction/model";
import { useCatInBagQuestionData } from "@/features/cat-in-bag/model";
import type { QuestionModalPlayer } from "@/features/question-modal";
import type { QuestionPackQuestion, QuestionPackSpecial } from "@/shared/api/questionPack";

type UseGameSpecialQuestionDataArgs = {
  roundSpecial: QuestionPackSpecial;
  roundSpecialMap: RoundSpecialMap;
  questionsById: Map<string, QuestionPackQuestion>;
  questionPlayers: QuestionModalPlayer[];
};

export function useGameSpecialQuestionData({
  roundSpecial,
  roundSpecialMap,
  questionsById,
  questionPlayers,
}: UseGameSpecialQuestionDataArgs) {
  const {
    specialTypeByQuestionId,
    catInBagThemeByQuestionId,
    questionsByIdWithCatInBag,
    questionPlayersForState,
    isSingleAttemptQuestion: isCatInBagSingleAttemptQuestion,
    catInBagSelectedAnsweringPlayerId,
    setCatInBagSelectedAnsweringPlayerId,
  } = useCatInBagQuestionData({
    roundSpecial,
    roundSpecialMap,
    questionsById,
    questionPlayers,
  });

  const { questionsByIdWithAuction, isSingleAttemptAuctionQuestion } = useAuctionQuestionData({
    roundSpecial,
    roundSpecialMap,
    questionsById: questionsByIdWithCatInBag,
  });

  const isSingleAttemptQuestion = useCallback((questionId: string) => (
    isSingleAttemptAuctionQuestion(questionId)
    || isCatInBagSingleAttemptQuestion(questionId)
  ), [isCatInBagSingleAttemptQuestion, isSingleAttemptAuctionQuestion]);

  return {
    specialTypeByQuestionId,
    catInBagThemeByQuestionId,
    questionsByIdWithAuction,
    questionPlayersForState,
    isSingleAttemptQuestion,
    catInBagSelectedAnsweringPlayerId,
    setCatInBagSelectedAnsweringPlayerId,
  };
}
