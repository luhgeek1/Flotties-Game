import { useAtom, useAtomValue } from "jotai";
import { useCallback, useEffect, useMemo, useState } from "react";

import { resolveSelectedPlayers } from "@/entities/players";
import { selectedQuestionPackAtom } from "@/shared/store/questionAtom";
import { gamePlayerScoresAtom } from "@/shared/store/gameAtoms";
import { finalBidByPlayerIdAtom, finalAnswerByPlayerIdAtom } from "@/shared/store/finalAtom";
import { setupPlayersAtom, setupSelectedPlayerIdsAtom } from "@/shared/store/setupAtoms";
import { finalResultsStateAtom, type FinalResultsPlayerState } from "@/shared/store/finalResultsAtom";

type UseFinalResultsModelArgs = {
  onReset?: () => void;
};

type DisplayPlayer = FinalResultsPlayerState;

function normalize(value: string): string {
  return value
    .toLowerCase()
    .replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, "")
    .trim();
}

function isAnswerCorrect(playerAnswer: string, correctAnswer: string): boolean {
  const playerNormalized = normalize(playerAnswer);
  const correctNormalized = normalize(correctAnswer);

  if (!playerNormalized || !correctNormalized) {
    return false;
  }

  return playerNormalized === correctNormalized
    || (playerNormalized.length > 3 && correctNormalized.includes(playerNormalized))
    || (correctNormalized.length > 3 && playerNormalized.includes(correctNormalized));
}

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => {
    window.setTimeout(resolve, ms);
  });
}

const WINNER_COINS_BONUS = 150;

const DEFAULT_RESULTS_SEQUENCE_TIMING = {
  initialDelayMs: 500,
  perPlayerRevealDelayMs: 1600,
  beforeControlsDelayMs: 800,
} as const;

const SINGLE_WINNER_RESULTS_SEQUENCE_TIMING = {
  initialDelayMs: 0,
  perPlayerRevealDelayMs: 0,
  beforeControlsDelayMs: 120,
} as const;

export function useFinalResultsModel({ onReset }: UseFinalResultsModelArgs = {}) {
  const selectedPack = useAtomValue(selectedQuestionPackAtom);
  const [setupPlayers, setSetupPlayers] = useAtom(setupPlayersAtom);
  const selectedPlayerIds = useAtomValue(setupSelectedPlayerIdsAtom);
  const playerScores = useAtomValue(gamePlayerScoresAtom);
  const finalBids = useAtomValue(finalBidByPlayerIdAtom);
  const finalAnswers = useAtomValue(finalAnswerByPlayerIdAtom);
  const [savedResults, setSavedResults] = useAtom(finalResultsStateAtom);
  const positiveScorePlayersCount = useMemo(
    () => selectedPlayerIds.filter(playerId => (playerScores[playerId] ?? 0) > 0).length,
    [playerScores, selectedPlayerIds],
  );
  const isSinglePositiveScoreWinner = positiveScorePlayersCount === 1;
  const sequenceTiming = isSinglePositiveScoreWinner
    ? SINGLE_WINNER_RESULTS_SEQUENCE_TIMING
    : DEFAULT_RESULTS_SEQUENCE_TIMING;

  const basePlayers = useMemo<DisplayPlayer[]>(() => {
    const correctAnswer = selectedPack.rounds.final.answers[0] ?? "";

    const playersWithScores = resolveSelectedPlayers(setupPlayers, selectedPlayerIds).map(player => {
      const wager = finalBids[player.id] ?? 0;
      const answer = finalAnswers[player.id] ?? "";
      const initialScore = playerScores[player.id] ?? 0;
      const isCorrect = isAnswerCorrect(answer, correctAnswer);
      const finalScore = isCorrect ? initialScore + wager : initialScore - wager;

      return {
        id: player.id,
        name: player.name,
        wager,
        answer,
        isCorrect,
        initialScore,
        finalScore,
        winnerBonus: 0,
        isRevealed: false,
      };
    });

    const winnerScore = playersWithScores.reduce(
      (max, player) => Math.max(max, player.finalScore),
      Number.NEGATIVE_INFINITY,
    );

    return playersWithScores.map(player => ({
      ...player,
      winnerBonus: player.finalScore === winnerScore ? WINNER_COINS_BONUS : 0,
    }));
  }, [finalAnswers, finalBids, playerScores, selectedPack.rounds.final.answers, selectedPlayerIds, setupPlayers]);

  const sourceKey = useMemo(() => JSON.stringify({
    packId: selectedPack.id,
    players: basePlayers.map(player => ({
      id: player.id,
      initialScore: player.initialScore,
      wager: player.wager,
      answer: player.answer,
    })),
  }), [basePlayers, selectedPack.id]);

  const canRestoreSavedResults = savedResults.isCompleted
    && savedResults.sourceKey === sourceKey
    && savedResults.players.length === basePlayers.length;

  const [displayPlayers, setDisplayPlayers] = useState<DisplayPlayer[]>(() => (
    canRestoreSavedResults ? savedResults.players : basePlayers
  ));
  const [isSorting, setIsSorting] = useState(() => (
    canRestoreSavedResults ? savedResults.isSorting : false
  ));
  const [showControls, setShowControls] = useState(() => (
    canRestoreSavedResults ? savedResults.showControls : false
  ));

  useEffect(() => {
    if (canRestoreSavedResults || basePlayers.length === 0) return;

    let isCancelled = false;

    const runSequence = async () => {
      await sleep(sequenceTiming.initialDelayMs);
      if (isCancelled) return;

      if (isSinglePositiveScoreWinner) {
        setDisplayPlayers(prev => prev.map(player => ({
          ...player,
          isRevealed: true,
        })));
      } else {
        const revealPlayers = basePlayers.filter(player => (
          player.wager > 0 || player.answer.trim().length > 0
        ));

        for (let index = 0; index < revealPlayers.length; index += 1) {
          const player = revealPlayers[index];
          if (isCancelled) return;

          setDisplayPlayers(prev => prev.map(item => (
            item.id === player.id ? { ...item, isRevealed: true } : item
          )));

          const hasNextRevealStep = index < revealPlayers.length - 1;
          if (hasNextRevealStep) {
            await sleep(sequenceTiming.perPlayerRevealDelayMs);
          }
        }
      }

      if (isCancelled) return;
      const sortedPlayers = [...basePlayers]
        .map(player => ({ ...player, isRevealed: true }))
        .sort((a, b) => b.finalScore - a.finalScore);

      setIsSorting(true);
      setDisplayPlayers(sortedPlayers);

      const winnerBonusByPlayerId = new Map(
        sortedPlayers
          .filter(player => player.winnerBonus > 0)
          .map(player => [player.id, player.winnerBonus] as const),
      );

      await sleep(sequenceTiming.beforeControlsDelayMs);
      if (isCancelled) return;

      setShowControls(true);
      setSavedResults({
        sourceKey,
        players: sortedPlayers,
        isSorting: true,
        showControls: true,
        isCompleted: true,
      });

      if (winnerBonusByPlayerId.size > 0) {
        setSetupPlayers(prevPlayers => prevPlayers.map(player => {
          const bonus = winnerBonusByPlayerId.get(player.id) ?? 0;

          if (bonus <= 0) return player;

          return {
            ...player,
            balance: player.balance + bonus,
          };
        }));
      }
    };

    runSequence();

    return () => {
      isCancelled = true;
    };
  }, [basePlayers, canRestoreSavedResults, isSinglePositiveScoreWinner, sequenceTiming, setSavedResults, setSetupPlayers, sourceKey]);

  const winnerScore = useMemo(
    () => displayPlayers.reduce((max, player) => Math.max(max, player.finalScore), Number.NEGATIVE_INFINITY),
    [displayPlayers],
  );

  const handleReset = useCallback(() => {
    onReset?.();
  }, [onReset]);

  return {
    packTitle: selectedPack.title,
    displayPlayers,
    isSorting,
    showControls,
    isSinglePositiveScoreWinner,
    isRestoredResults: canRestoreSavedResults,
    winnerScore,
    onReset: handleReset,
  };
}
