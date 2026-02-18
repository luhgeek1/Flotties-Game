import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { useCallback, useMemo } from "react";

import { useAuctionInteraction, useAuctionQuestionData } from "@/features/auction/model";
import { useCatInBagInteraction, useCatInBagQuestionData } from "@/features/cat-in-bag/model";
import { usePlayerPick } from "@/features/player-pick";
import { gameIsExitModalOpenAtom } from "@/shared/store/gameAtoms";
import { selectedQuestionPackAtom } from "@/shared/store/questionAtom";
import { resetRoundTransitionStorageAtom } from "@/shared/store/round-transition-storage";
import { setupSelectedPlayerIdsAtom } from "@/shared/store/setupAtoms";

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
  const selectedPlayerIds = useAtomValue(setupSelectedPlayerIdsAtom);

  const [isExitModalOpen, setIsExitModalOpen] = useAtom(gameIsExitModalOpenAtom);
  const resetRoundTransitionStorage = useSetAtom(resetRoundTransitionStorageAtom);

  const { gamePlayers, questionPlayers, resetScores, changePlayerScore } = useGamePlayers(selectedPlayerIds);
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

  const { questionsByIdWithAuction } = useAuctionQuestionData({
    selectedPack,
    roundSpecialMap,
    questionsById: questionsByIdWithCatInBag,
  });

  const isSingleAttemptQuestion = useCallback((questionId: string) => (
    specialTypeByQuestionId[questionId] === "auction"
    || isCatInBagSingleAttemptQuestion(questionId)
  ), [isCatInBagSingleAttemptQuestion, specialTypeByQuestionId]);
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
    resetQuestionState,
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
  const isRoundTransitionModalOpen = Boolean(onRoundTransitionConfirm) && isRoundComplete;
  const hasQuestionsToPick = openedQuestionIds.length < totalQuestions;
  const activePickerId = hasQuestionsToPick ? currentPickerId : null;
  const isRoundStartIntroOpen = hasQuestionsToPick
    && openedQuestionIds.length === 0
    && !isQuestionModalOpen
    && !isRoundTransitionModalOpen;

  const handleExitClick = useCallback(() => {
    setIsExitModalOpen(true);
  }, [setIsExitModalOpen]);

  const handleExitCancel = useCallback(() => {
    setIsExitModalOpen(false);
  }, [setIsExitModalOpen]);

  const exitToSetup = useCallback(() => {
    resetRoundTransitionStorage();
    resetQuestionState();
    resetScores();
    onExitToSetup?.();
  }, [onExitToSetup, resetQuestionState, resetRoundTransitionStorage, resetScores]);

  const handleExitConfirm = useCallback(() => {
    setIsExitModalOpen(false);
    exitToSetup();
  }, [exitToSetup, setIsExitModalOpen]);

  const handleRoundTransitionConfirm = useCallback(() => {
    onRoundTransitionConfirm?.();
  }, [onRoundTransitionConfirm]);

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
      onExitClick: handleExitClick,
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
    exitModal: {
      isOpen: isExitModalOpen,
      onCancel: handleExitCancel,
      onConfirm: handleExitConfirm,
    },
    roundTransitionModal: {
      isOpen: isRoundTransitionModalOpen,
      playerScores: roundTransitionPlayerScores,
      roundNumber: roundIndex + 1,
      onExitToSetup: exitToSetup,
      onConfirm: handleRoundTransitionConfirm,
    },
  };
}
