import { useAtom, useAtomValue } from "jotai";
import { useCallback, useEffect, useMemo } from "react";

import { useGameBoardData, useGamePlayers, useRoundSpecialMap } from "@/features/game-session";
import { usePlayerPick } from "@/features/player-pick";
import { adminModeEnabledAtom } from "@/features/admin/store/adminModeAtom";
import { gameRoundFirstPickDoneAtom } from "@/features/game-session/store/gameAtoms";
import { selectedQuestionPackAtom } from "@/features/game-session/store/questionAtom";
import { setupPlayersAtom, setupSelectedPlayerIdsAtom } from "@/features/game-session/store/setupAtoms";
import { useGameQuestionFlow } from "./useGameQuestionFlow";
import { useGameSpecialInteractions } from "./useGameSpecialInteractions";
import { useGameSpecialQuestionData } from "./useGameSpecialQuestionData";

type UseGamePageModelArgs = {
  onExitToSetup?: () => void;
  onRoundTransitionConfirm?: () => void;
  roundIndex: number;
};

export function useGamePageModel({
  onExitToSetup,
  onRoundTransitionConfirm,
  roundIndex,
}: UseGamePageModelArgs) {
  const selectedPack = useAtomValue(selectedQuestionPackAtom);
  const setupPlayers = useAtomValue(setupPlayersAtom);
  const selectedPlayerIds = useAtomValue(setupSelectedPlayerIdsAtom);
  const isAdminMode = useAtomValue(adminModeEnabledAtom);
  const [isRoundFirstPickDone, setIsRoundFirstPickDone] = useAtom(gameRoundFirstPickDoneAtom);

  const { gamePlayers, questionPlayers, changePlayerScore } = useGamePlayers(setupPlayers, selectedPlayerIds);
  const { boardThemes, questionsById, totalQuestions, packTitle } = useGameBoardData(selectedPack, roundIndex);
  const { roundSpecialMap, roundSpecial } = useRoundSpecialMap(selectedPack, roundIndex);

  const specialQuestionData = useGameSpecialQuestionData({
    roundSpecial,
    roundSpecialMap,
    questionsById,
    questionPlayers,
  });

  const questionFlow = useGameQuestionFlow({
    questionsById: specialQuestionData.questionsByIdWithAuction,
    questionPlayers: specialQuestionData.questionPlayersForState,
    isSingleAttemptQuestion: specialQuestionData.isSingleAttemptQuestion,
    onPlayerScoreDelta: changePlayerScore,
    isAdminMode,
  });

  const { currentPickerId, currentPicker } = usePlayerPick({
    players: gamePlayers,
    roundIndex,
    completedPicksCount: questionFlow.openedQuestionIds.length,
  });

  const specialInteractions = useGameSpecialInteractions({
    players: gamePlayers,
    roundIndex,
    currentPickerId,
    specialTypeByQuestionId: specialQuestionData.specialTypeByQuestionId,
    catInBagThemeByQuestionId: specialQuestionData.catInBagThemeByQuestionId,
    questionsById,
    onRegularQuestionSelect: questionFlow.handleQuestionSelect,
    onStartQuestionAnswering: questionFlow.startQuestionAnswering,
    selectedAnsweringPlayerId: specialQuestionData.catInBagSelectedAnsweringPlayerId,
    setSelectedAnsweringPlayerId: specialQuestionData.setCatInBagSelectedAnsweringPlayerId,
    isQuestionModalOpen: questionFlow.isQuestionModalOpen,
    modalQuestionId: questionFlow.modalQuestionId,
  });

  const handleBoardQuestionSelect = (questionId: string) => {
    if (!isRoundFirstPickDone) {
      setIsRoundFirstPickDone(true);
    }

    specialInteractions.onBoardQuestionSelect(questionId);
  };

  const questionsProgress = `Questions: ${questionFlow.openedQuestionIds.length}/${totalQuestions}`;

  const isRoundComplete = useMemo(() => (
    totalQuestions > 0
    && questionFlow.openedQuestionIds.length >= totalQuestions
    && !questionFlow.isQuestionModalOpen
  ), [questionFlow.isQuestionModalOpen, questionFlow.openedQuestionIds.length, totalQuestions]);
  const hasNextRound = roundIndex === 0 && Boolean(onRoundTransitionConfirm);
  const isRoundTransitionModalOpen = isRoundComplete && (hasNextRound || roundIndex > 0);
  const hasQuestionsToPick = questionFlow.openedQuestionIds.length < totalQuestions;
  const activePickerId = hasQuestionsToPick ? currentPickerId : null;
  const isRoundStartIntroOpen = hasQuestionsToPick
    && !isRoundFirstPickDone
    && questionFlow.openedQuestionIds.length === 0
    && !questionFlow.isQuestionModalOpen
    && !isRoundTransitionModalOpen;

  useEffect(() => {
    if (!isRoundFirstPickDone) return;
    if (questionFlow.openedQuestionIds.length > 0) return;
    if (questionFlow.isQuestionModalOpen) return;
    if (isRoundTransitionModalOpen) return;

    setIsRoundFirstPickDone(false);
  }, [
    isRoundFirstPickDone,
    isRoundTransitionModalOpen,
    questionFlow.isQuestionModalOpen,
    questionFlow.openedQuestionIds.length,
    setIsRoundFirstPickDone,
  ]);

  const navigateToSetup = useCallback(() => {
    onExitToSetup?.();
  }, [onExitToSetup]);

  const handleRoundTransitionConfirm = useCallback(() => {
    if (onRoundTransitionConfirm) {
      onRoundTransitionConfirm();
      return;
    }

    navigateToSetup();
  }, [navigateToSetup, onRoundTransitionConfirm]);

  const roundTransitionPlayerScores = useMemo(
    () => gamePlayers.map(player => ({
      id: player.id,
      name: player.name,
      score: player.score,
    })),
    [gamePlayers],
  );

  return {
    gameShell: {
      packTitle,
      questionsProgress,
      players: gamePlayers,
      activePickerId,
      onExitToSetup: navigateToSetup,
      onOpenAllQuestionsClick: isAdminMode ? questionFlow.openAllQuestions : undefined,
    },
    pickBanner: {
      playerName: currentPicker?.name ?? null,
      isOpen: isRoundStartIntroOpen,
    },
    gameBoard: {
      themes: boardThemes,
      specialTypeByQuestionId: isAdminMode ? specialQuestionData.specialTypeByQuestionId : {},
      openedQuestionIds: questionFlow.openedQuestionIds,
      onQuestionSelect: handleBoardQuestionSelect,
    },
    catInBagBanner: specialInteractions.catInBagBanner,
    auctionBanner: specialInteractions.auctionBanner,
    auctionModal: specialInteractions.auctionModal,
    auctionGuardModal: specialInteractions.auctionGuardModal,
    catInBagTransferModal: {
      ...specialInteractions.catInBagTransferModal,
      chooserName: specialInteractions.catInBagTransferModal.chooserName ?? currentPicker?.name ?? null,
    },
    questionModal: {
      ...questionFlow.questionModalBase,
      isSingleAttemptMode: specialInteractions.isCatInBagQuestionActive,
    },
    roundTransitionModal: {
      isOpen: isRoundTransitionModalOpen,
      playerScores: roundTransitionPlayerScores,
      roundNumber: roundIndex + 1,
      hasNextRound,
      onExitToSetup: navigateToSetup,
      onConfirm: handleRoundTransitionConfirm,
    },
  };
}
