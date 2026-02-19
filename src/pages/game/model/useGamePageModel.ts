import { useAtomValue } from "jotai";
import { useCallback, useMemo } from "react";

import { useAuctionInteraction, useAuctionQuestionData } from "@/features/auction/model";
import { useCatInBagInteraction, useCatInBagQuestionData } from "@/features/cat-in-bag/model";
import { usePlayerPick } from "@/features/player-pick";
import { selectedQuestionPackAtom } from "@/shared/store/questionAtom";
import { setupPlayersAtom, setupSelectedPlayerIdsAtom } from "@/shared/store/setupAtoms";

import { useGameBoardData } from "./useGameBoardData";
import { useGamePlayers } from "./useGamePlayers";
import { useQuestionState } from "./useQuestionState";
import { useRoundSpecialMap } from "./useRoundSpecialMap";

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

  const { gamePlayers, questionPlayers, changePlayerScore } = useGamePlayers(setupPlayers, selectedPlayerIds);
  const { boardThemes, questionsById, totalQuestions, packTitle } = useGameBoardData(selectedPack, roundIndex);
  const { roundSpecialMap } = useRoundSpecialMap(selectedPack, roundIndex);
  const {
    specialTypeByQuestionId,
    catInBagThemeByQuestionId,
    questionsByIdWithCatInBag,
    questionPlayersForState,
    isSingleAttemptQuestion: isCatInBagSingleAttemptQuestion,
    catInBagSelectedAnsweringPlayerId,
    setCatInBagSelectedAnsweringPlayerId,
  } = useCatInBagQuestionData({
    selectedPack,
    roundSpecialMap,
    questionsById,
    questionPlayers,
  });

  const { questionsByIdWithAuction, isSingleAttemptAuctionQuestion } = useAuctionQuestionData({
    selectedPack,
    roundSpecialMap,
    questionsById: questionsByIdWithCatInBag,
  });

  const isSingleAttemptQuestion = useCallback((questionId: string) => (
    isSingleAttemptAuctionQuestion(questionId)
    || isCatInBagSingleAttemptQuestion(questionId)
  ), [isCatInBagSingleAttemptQuestion, isSingleAttemptAuctionQuestion]);
  const {
    activeQuestion,
    activeQuestionId,
    handleQuestionSelect,
    startQuestionAnswering,
    modalState,
    questionTimerDurationMs,
    setAnswerInput,
    submitAnswer,
    continueAfterWrong,
    openedQuestionIds,
    openAllQuestions,
  } = useQuestionState({
    questionsById: questionsByIdWithAuction,
    players: questionPlayersForState,
    isSingleAttemptQuestion,
    onPlayerScoreDelta: changePlayerScore,
  });
  const modalQuestionId = activeQuestionId ?? modalState?.questionId ?? null;
  const modalQuestion = modalQuestionId ? questionsByIdWithAuction.get(modalQuestionId) ?? null : null;
  const isQuestionModalOpen = modalQuestionId !== null;

  const { currentPickerId, currentPicker } = usePlayerPick({
    players: gamePlayers,
    roundIndex,
    completedPicksCount: openedQuestionIds.length,
  });
  const {
    isCatInBagQuestionActive,
    isCatInBagQuestionTitleVisible,
    isBannerOpen: isCatInBagBannerOpen,
    isTransferModalOpen: isCatInBagTransferOpen,
    modalMode: catInBagModalMode,
    chooserName: catInBagChooserName,
    answeringPlayerName: catInBagAnsweringPlayerName,
    bidQuestionTheme: catInBagBidQuestionTheme,
    transferPlayers: catInBagTransferPlayers,
    bidOptions: catInBagBidOptions,
    handleBoardQuestionSelect: handleCatInBagBoardQuestionSelect,
    handleBannerClose: handleCatInBagBannerClose,
    handleTransferPlayerSelect: handleCatInBagTransferPlayerSelect,
    handleBidSelect: handleCatInBagBidSelect,
  } = useCatInBagInteraction({
    players: gamePlayers,
    roundIndex,
    currentPickerId,
    specialTypeByQuestionId,
    catInBagThemeByQuestionId,
    onRegularQuestionSelect: handleQuestionSelect,
    onStartQuestionAnswering: startQuestionAnswering,
    selectedAnsweringPlayerId: catInBagSelectedAnsweringPlayerId,
    setSelectedAnsweringPlayerId: setCatInBagSelectedAnsweringPlayerId,
    isQuestionModalOpen,
    modalQuestionId,
  });

  const handleAuctionComplete = useCallback(({ questionId, targetPlayerId }: { questionId: string; targetPlayerId: string }) => {
    startQuestionAnswering(questionId, targetPlayerId);
  }, [startQuestionAnswering]);

  const getAuctionNominal = useCallback(
    (questionId: string) => questionsById.get(questionId)!.value,
    [questionsById],
  );

  const auction = useAuctionInteraction({
    players: gamePlayers,
    currentPickerId,
    specialTypeByQuestionId,
    getQuestionNominal: getAuctionNominal,
    onNonAuctionQuestionSelect: handleCatInBagBoardQuestionSelect,
    onAuctionComplete: handleAuctionComplete,
    isBlocked: isCatInBagBannerOpen || isCatInBagTransferOpen || isQuestionModalOpen,
  });

  const questionsProgress = `Questions: ${openedQuestionIds.length}/${totalQuestions}`;

  const isRoundComplete = useMemo(() => (
    totalQuestions > 0
    && openedQuestionIds.length >= totalQuestions
    && !isQuestionModalOpen
  ), [isQuestionModalOpen, openedQuestionIds, totalQuestions]);
  const hasNextRound = roundIndex === 0 && Boolean(onRoundTransitionConfirm);
  const isRoundTransitionModalOpen = isRoundComplete && (hasNextRound || roundIndex > 0);
  const hasQuestionsToPick = openedQuestionIds.length < totalQuestions;
  const activePickerId = hasQuestionsToPick ? currentPickerId : null;
  const isRoundStartIntroOpen = hasQuestionsToPick
    && openedQuestionIds.length === 0
    && !isQuestionModalOpen
    && !isRoundTransitionModalOpen;

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
      onOpenAllQuestionsClick: openAllQuestions,
    },
    pickBanner: {
      playerName: currentPicker?.name ?? null,
      isOpen: isRoundStartIntroOpen,
    },
    gameBoard: {
      themes: boardThemes,
      specialTypeByQuestionId,
      openedQuestionIds,
      onQuestionSelect: auction.handleBoardQuestionSelect,
    },
    catInBagBanner: {
      open: isCatInBagBannerOpen,
      onClose: handleCatInBagBannerClose,
    },
    auctionBanner: {
      open: auction.isBannerOpen,
      onClose: auction.handleBannerClose,
    },
    auctionModal: {
      open: auction.isModalOpen,
      nominal: auction.nominal,
      currentBid: auction.currentBid,
      leaderPlayerId: auction.leaderPlayerId,
      players: auction.players,
      isSinglePlayerMode: auction.isSinglePlayerMode,
      excludedPlayersCount: auction.excludedPlayersCount,
      turnPlayerId: auction.turnPlayerId,
      turnPlayerName: auction.turnPlayerName,
      turnPlayerBalance: auction.turnPlayerBalance,
      bidInput: auction.bidInput,
      minBid: auction.minBid,
      passedPlayerIds: auction.passedPlayerIds,
      isInputBidValid: auction.isInputBidValid,
      onBidInputChange: auction.handleBidInputChange,
      onSubmitBid: auction.handleSubmitBid,
      onMinBid: auction.handleMinBid,
      onAllIn: auction.handleAllIn,
      onPass: auction.handlePass,
    },
    auctionGuardModal: {
      open: auction.isEntryGuardModalOpen,
      mode: auction.entryGuardMode ?? "unavailable",
      nominal: auction.entryGuardNominal ?? auction.nominal,
      eligiblePlayersCount: auction.entryGuardEligiblePlayersCount,
      excludedPlayersCount: auction.entryGuardExcludedPlayersCount,
      onContinue: auction.handleEntryGuardContinue,
    },
    catInBagTransferModal: {
      open: isCatInBagTransferOpen,
      mode: catInBagModalMode ?? "transfer",
      chooserName: catInBagChooserName ?? currentPicker?.name ?? null,
      answeringPlayerName: catInBagAnsweringPlayerName,
      questionTheme: catInBagBidQuestionTheme,
      players: catInBagTransferPlayers,
      bidOptions: catInBagBidOptions,
      onSelectPlayer: handleCatInBagTransferPlayerSelect,
      onSelectBid: handleCatInBagBidSelect,
    },
    isCatInBagQuestionTitleVisible,
    questionModal: {
      isOpen: isQuestionModalOpen,
      questionId: modalQuestionId,
      questionValue: modalQuestion?.value ?? activeQuestion?.value ?? "",
      questionText: modalQuestion?.question ?? activeQuestion?.question ?? "",
      answerText: modalQuestion?.answers[0] ?? activeQuestion?.answers[0] ?? "Ответ не указан",
      players: questionPlayersForState,
      isSingleAttemptMode: isCatInBagQuestionActive,
      phase: modalState?.phase ?? null,
      remainingMs: modalState?.remainingMs ?? questionTimerDurationMs,
      timerDurationMs: questionTimerDurationMs,
      attemptedPlayerIds: modalState?.attemptedPlayerIds ?? [],
      activePlayerId: modalState?.activePlayerId ?? null,
      answerInput: modalState?.answerInput ?? "",
      onAnswerInputChange: setAnswerInput,
      onSubmitAnswer: submitAnswer,
      onContinue: continueAfterWrong,
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
