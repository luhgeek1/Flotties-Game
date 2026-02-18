import { useAtomValue } from "jotai";
import { useCallback, useMemo } from "react";

import type { QuestionPack, QuestionPackQuestion, QuestionPackSpecialQuestion } from "@/shared/api/questionPack";
import { auctionWinningBidByQuestionIdAtom, auctionWinningPlayerByQuestionIdAtom } from "@/shared/store/specialAuctionAtom";
import type { RoundSpecialMap } from "@/shared/store/specialCIBAtom";

type UseAuctionQuestionDataArgs = {
  selectedPack: QuestionPack;
  roundSpecialMap: RoundSpecialMap;
  questionsById: Map<string, QuestionPackQuestion>;
};

export function useAuctionQuestionData({
  selectedPack,
  roundSpecialMap,
  questionsById,
}: UseAuctionQuestionDataArgs) {
  const auctionWinningBidByQuestionId = useAtomValue(auctionWinningBidByQuestionIdAtom);
  const auctionWinningPlayerByQuestionId = useAtomValue(auctionWinningPlayerByQuestionIdAtom);

  const auctionSpecialQuestionById = useMemo(() => {
    const next = new Map<string, QuestionPackSpecialQuestion>();
    selectedPack.special.auction.questions.forEach(question => {
      next.set(question.id, question);
    });
    return next;
  }, [selectedPack.special.auction.questions]);

  const questionsByIdWithAuction = useMemo(() => {
    const next = new Map(questionsById);

    Object.entries(roundSpecialMap).forEach(([questionId, specialCell]) => {
      if (specialCell.type !== "auction") return;

      const winningBid = auctionWinningBidByQuestionId[questionId];
      if (winningBid === undefined) return;

      const specialQuestion = auctionSpecialQuestionById.get(specialCell.specialQuestionId);
      if (!specialQuestion) return;

      const auctionQuestion: QuestionPackQuestion = {
        id: questionId,
        type: "normal",
        value: winningBid,
        question: specialQuestion.question,
        answers: specialQuestion.answers,
      };

      next.set(questionId, auctionQuestion);
    });

    return next;
  }, [auctionSpecialQuestionById, auctionWinningBidByQuestionId, questionsById, roundSpecialMap]);

  const isSingleAttemptAuctionQuestion = useCallback((questionId: string) => (
    Boolean(auctionWinningPlayerByQuestionId[questionId])
  ), [auctionWinningPlayerByQuestionId]);

  return {
    questionsByIdWithAuction,
    isSingleAttemptAuctionQuestion,
  };
}
