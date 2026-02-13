import { useAtom } from "jotai";
import { useMemo } from "react";
import { gameActiveQuestionIdAtom, gameOpenedQuestionIdsAtom } from "@/shared/store/gameAtoms";
import type { QuestionPackQuestion } from "@/shared/api/questionPack";

export function useQuestionState(questionsById: Map<string, QuestionPackQuestion>) {
  const [activeQuestionId, setActiveQuestionId] = useAtom(gameActiveQuestionIdAtom);
  const [openedQuestionIds, setOpenedQuestionIds] = useAtom(gameOpenedQuestionIdsAtom);

  const openedSet = useMemo(() => new Set(openedQuestionIds), [openedQuestionIds]);
  const isOpened = (id: string) => openedSet.has(id);

  const activeQuestion = activeQuestionId
    ? questionsById.get(activeQuestionId) ?? null
    : null;

  const markOpened = (id: string) => {
    setOpenedQuestionIds(prev => (prev.includes(id) ? prev : [...prev, id]));
  };

  const handleQuestionSelect = (id: string) => {
    if (isOpened(id)) return;
    setActiveQuestionId(id);
  };

  const closeQuestionModal = () => {
    if (activeQuestionId) markOpened(activeQuestionId);
    setActiveQuestionId(null);
  };

  const resetQuestionState = () => {
    setActiveQuestionId(null);
    setOpenedQuestionIds([]);
  };

  return {
    activeQuestion,
    activeQuestionId,
    openedQuestionIds,
    handleQuestionSelect,
    closeQuestionModal,
    resetQuestionState,
  };
}
