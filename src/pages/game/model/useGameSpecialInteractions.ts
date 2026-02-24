import { useCallback } from "react";

import { useAuctionInteraction, type AuctionPlayer } from "@/features/auction/model";
import { useCatInBagInteraction } from "@/features/cat-in-bag/model";
import type { GameBoardSpecialTypeByQuestionId } from "@/entities/game-board";
import type { QuestionPackQuestion } from "@/shared/api/questionPack";

type UseGameSpecialInteractionsArgs = {
  players: AuctionPlayer[];
  roundIndex: number;
  currentPickerId: string;
  specialTypeByQuestionId: GameBoardSpecialTypeByQuestionId;
  catInBagThemeByQuestionId: Record<string, string>;
  questionsById: Map<string, QuestionPackQuestion>;
  onRegularQuestionSelect: (questionId: string) => void;
  onStartQuestionAnswering: (questionId: string, playerId: string) => void;
  selectedAnsweringPlayerId: string | null;
  setSelectedAnsweringPlayerId: (playerId: string | null) => void;
  isQuestionModalOpen: boolean;
  modalQuestionId: string | null;
};

export function useGameSpecialInteractions({
  players,
  roundIndex,
  currentPickerId,
  specialTypeByQuestionId,
  catInBagThemeByQuestionId,
  questionsById,
  onRegularQuestionSelect,
  onStartQuestionAnswering,
  selectedAnsweringPlayerId,
  setSelectedAnsweringPlayerId,
  isQuestionModalOpen,
  modalQuestionId,
}: UseGameSpecialInteractionsArgs) {
  const {
    isCatInBagQuestionActive,
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
    players,
    roundIndex,
    currentPickerId,
    specialTypeByQuestionId,
    catInBagThemeByQuestionId,
    onRegularQuestionSelect,
    onStartQuestionAnswering,
    selectedAnsweringPlayerId,
    setSelectedAnsweringPlayerId,
    isQuestionModalOpen,
    modalQuestionId,
  });

  const handleAuctionComplete = useCallback(({ questionId, targetPlayerId }: { questionId: string; targetPlayerId: string }) => {
    onStartQuestionAnswering(questionId, targetPlayerId);
  }, [onStartQuestionAnswering]);

  const getAuctionNominal = useCallback(
    (questionId: string) => questionsById.get(questionId)!.value,
    [questionsById],
  );

  const auction = useAuctionInteraction({
    players,
    currentPickerId,
    specialTypeByQuestionId,
    getQuestionNominal: getAuctionNominal,
    onNonAuctionQuestionSelect: handleCatInBagBoardQuestionSelect,
    onAuctionComplete: handleAuctionComplete,
    isBlocked: isCatInBagBannerOpen || isCatInBagTransferOpen || isQuestionModalOpen,
  });

  return {
    isCatInBagQuestionActive,
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
      chooserName: catInBagChooserName ?? null,
      answeringPlayerName: catInBagAnsweringPlayerName,
      questionTheme: catInBagBidQuestionTheme,
      players: catInBagTransferPlayers,
      bidOptions: catInBagBidOptions,
      onSelectPlayer: handleCatInBagTransferPlayerSelect,
      onSelectBid: handleCatInBagBidSelect,
    },
    onBoardQuestionSelect: auction.handleBoardQuestionSelect,
  };
}
