import { useAtomValue, useSetAtom } from "jotai";
import { useCallback, useMemo } from "react";

import type { GameBoardSpecialTypeByQuestionId } from "@/entities/game-board";
import type { QuestionModalPlayer } from "@/features/question-modal";
import type { QuestionPack, QuestionPackQuestion, QuestionPackSpecialQuestion } from "@/shared/api/questionPack";
import { catInBagBidByQuestionIdAtom, catInBagSelectedAnsweringPlayerIdAtom, type RoundSpecialMap } from "@/shared/store/specialCIBAtom";

type UseCatInBagQuestionDataArgs = {
  selectedPack: QuestionPack;
  roundSpecialMap: RoundSpecialMap;
  questionsById: Map<string, QuestionPackQuestion>;
  questionPlayers: QuestionModalPlayer[];
};

type UseCatInBagQuestionDataResult = {
  specialTypeByQuestionId: GameBoardSpecialTypeByQuestionId;
  catInBagThemeByQuestionId: Record<string, string>;
  questionsByIdWithCatInBag: Map<string, QuestionPackQuestion>;
  questionPlayersForState: QuestionModalPlayer[];
  isSingleAttemptQuestion: (questionId: string) => boolean;
  catInBagSelectedAnsweringPlayerId: string | null;
  setCatInBagSelectedAnsweringPlayerId: (playerId: string | null) => void;
};

export function useCatInBagQuestionData({
  selectedPack,
  roundSpecialMap,
  questionsById,
  questionPlayers,
}: UseCatInBagQuestionDataArgs): UseCatInBagQuestionDataResult {
  const catInBagBidByQuestionId = useAtomValue(catInBagBidByQuestionIdAtom);
  const catInBagSelectedAnsweringPlayerId = useAtomValue(catInBagSelectedAnsweringPlayerIdAtom);
  const setCatInBagSelectedAnsweringPlayerId = useSetAtom(catInBagSelectedAnsweringPlayerIdAtom);

  const specialTypeByQuestionId = useMemo<GameBoardSpecialTypeByQuestionId>(() => {
    const next: GameBoardSpecialTypeByQuestionId = {};

    Object.entries(roundSpecialMap).forEach(([questionId, specialCell]) => {
      next[questionId] = specialCell.type;
    });

    return next;
  }, [roundSpecialMap]);

  const catInBagSpecialQuestionById = useMemo(() => {
    const next = new Map<string, QuestionPackSpecialQuestion>();
    selectedPack.special.catInBag.questions.forEach(question => {
      next.set(question.id, question);
    });
    return next;
  }, [selectedPack.special.catInBag.questions]);

  const catInBagThemeByQuestionId = useMemo<Record<string, string>>(() => {
    const next: Record<string, string> = {};

    Object.entries(roundSpecialMap).forEach(([questionId, specialCell]) => {
      if (specialCell.type !== "catInBag") return;

      const specialQuestion = catInBagSpecialQuestionById.get(specialCell.specialQuestionId);
      if (!specialQuestion) return;

      next[questionId] = specialQuestion.theme;
    });

    return next;
  }, [catInBagSpecialQuestionById, roundSpecialMap]);

  const questionsByIdWithCatInBag = useMemo(() => {
    const next = new Map(questionsById);

    Object.entries(roundSpecialMap).forEach(([questionId, specialCell]) => {
      if (specialCell.type !== "catInBag") return;

      const bid = catInBagBidByQuestionId[questionId];
      if (!bid) return;

      const specialQuestion = catInBagSpecialQuestionById.get(specialCell.specialQuestionId);
      if (!specialQuestion) return;

      const catInBagQuestion: QuestionPackQuestion = {
        id: questionId,
        type: "normal",
        value: bid,
        question: specialQuestion.question,
        answers: specialQuestion.answers,
      };

      next.set(questionId, catInBagQuestion);
    });

    return next;
  }, [catInBagBidByQuestionId, catInBagSpecialQuestionById, questionsById, roundSpecialMap]);

  const questionPlayersForState = useMemo(
    () => (
      catInBagSelectedAnsweringPlayerId
        ? questionPlayers.filter(player => player.id === catInBagSelectedAnsweringPlayerId)
        : questionPlayers
    ),
    [catInBagSelectedAnsweringPlayerId, questionPlayers],
  );

  const isSingleAttemptQuestion = useCallback((questionId: string) => (
    specialTypeByQuestionId[questionId] === "catInBag"
    && Boolean(catInBagSelectedAnsweringPlayerId)
  ), [catInBagSelectedAnsweringPlayerId, specialTypeByQuestionId]);

  return {
    specialTypeByQuestionId,
    catInBagThemeByQuestionId,
    questionsByIdWithCatInBag,
    questionPlayersForState,
    isSingleAttemptQuestion,
    catInBagSelectedAnsweringPlayerId,
    setCatInBagSelectedAnsweringPlayerId,
  };
}
