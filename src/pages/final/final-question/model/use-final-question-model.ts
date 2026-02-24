import { useAtom, useAtomValue } from "jotai";
import { useCallback, useMemo } from "react";
import { DEFAULT_PLAYER_AVATAR_URL } from "@/entities/players";

import { finalAnswerByPlayerIdAtom, finalAnswerInputByPlayerIdAtom } from "@/features/game-session/store/finalAtom";
import { useFinalPlayerQueue } from "@/pages/final/model/useFinalPlayerQueue";
import { selectedQuestionPackAtom } from "@/features/game-session/store/questionAtom";

type UseFinalQuestionModelArgs = {
  onConfirmAnswer?: () => void;
};

export function useFinalQuestionModel({ onConfirmAnswer }: UseFinalQuestionModelArgs = {}) {
  const selectedPack = useAtomValue(selectedQuestionPackAtom);
  const [answerInputByPlayerId, setAnswerInputByPlayerId] = useAtom(finalAnswerInputByPlayerIdAtom);
  const [answerByPlayerId, setAnswerByPlayerId] = useAtom(finalAnswerByPlayerIdAtom);
  const { playersQueue, currentPlayer, setActivePlayerId, advancePlayerIndex } = useFinalPlayerQueue({
    preferActivePlayer: true,
  });

  const answerInput = currentPlayer ? answerInputByPlayerId[currentPlayer.id] ?? "" : "";
  const normalizedAnswer = answerInput.trim();
  const isAnswerValid = normalizedAnswer.length > 0;
  const submittedAnswersCount = useMemo(
    () => playersQueue.reduce((count, player) => (player.id in answerByPlayerId ? count + 1 : count), 0),
    [answerByPlayerId, playersQueue],
  );
  const isAllPlayersAnswerDone = playersQueue.length > 0 && submittedAnswersCount >= playersQueue.length;

  const proceedToNextPlayer = useCallback((finalAnswer: string) => {
    if (!currentPlayer) return;

    const isCurrentPlayerAlreadySubmitted = currentPlayer.id in answerByPlayerId;
    const nextSubmittedAnswersCount = submittedAnswersCount + (isCurrentPlayerAlreadySubmitted ? 0 : 1);
    const willCompleteAllAnswers = playersQueue.length > 0 && nextSubmittedAnswersCount >= playersQueue.length;

    setAnswerByPlayerId(prev => ({
      ...prev,
      [currentPlayer.id]: finalAnswer,
    }));

    setAnswerInputByPlayerId(prev => ({
      ...prev,
      [currentPlayer.id]: finalAnswer,
    }));

    setActivePlayerId(null);
    advancePlayerIndex();

    if (!willCompleteAllAnswers) {
      onConfirmAnswer?.();
    }
  }, [
    advancePlayerIndex,
    answerByPlayerId,
    currentPlayer,
    onConfirmAnswer,
    playersQueue.length,
    setActivePlayerId,
    setAnswerByPlayerId,
    setAnswerInputByPlayerId,
    submittedAnswersCount,
  ]);

  const handleAnswerInputChange = useCallback((nextValue: string) => {
    if (!currentPlayer) return;

    setAnswerInputByPlayerId(prev => ({
      ...prev,
      [currentPlayer.id]: nextValue,
    }));
  }, [currentPlayer, setAnswerInputByPlayerId]);

  const handleSubmitAnswer = useCallback(() => {
    if (!currentPlayer || !isAnswerValid) return;

    proceedToNextPlayer(normalizedAnswer);
  }, [currentPlayer, isAnswerValid, normalizedAnswer, proceedToNextPlayer]);

  const handleTimeoutAnswer = useCallback(() => {
    if (!currentPlayer) return;

    proceedToNextPlayer("");
  }, [currentPlayer, proceedToNextPlayer]);

  return {
    packTitle: selectedPack.title,
    finalQuestionText: selectedPack.rounds.final.question,
    finalAnswerText: selectedPack.rounds.final.answers[0] ?? "Ответ не указан",
    currentPlayerId: currentPlayer?.id ?? null,
    currentPlayerName: currentPlayer?.name ?? "Игрок",
    currentPlayerAvatarUrl: currentPlayer?.avatarUrl ?? DEFAULT_PLAYER_AVATAR_URL,
    answerInput,
    isSubmitDisabled: !isAnswerValid,
    isAllPlayersAnswerDone,
    onAnswerInputChange: handleAnswerInputChange,
    onSubmitAnswer: handleSubmitAnswer,
    onTimeoutAnswer: handleTimeoutAnswer,
  };
}
