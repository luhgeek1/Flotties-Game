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

export function useFinalResultsModel({ onReset }: UseFinalResultsModelArgs = {}) {
  const selectedPack = useAtomValue(selectedQuestionPackAtom);
  const setupPlayers = useAtomValue(setupPlayersAtom);
  const selectedPlayerIds = useAtomValue(setupSelectedPlayerIdsAtom);
  const playerScores = useAtomValue(gamePlayerScoresAtom);
  const finalBids = useAtomValue(finalBidByPlayerIdAtom);
  const finalAnswers = useAtomValue(finalAnswerByPlayerIdAtom);
  const [savedResults, setSavedResults] = useAtom(finalResultsStateAtom);

  const basePlayers = useMemo<DisplayPlayer[]>(() => {
    const correctAnswer = selectedPack.rounds.final.answers[0] ?? "";

    return resolveSelectedPlayers(setupPlayers, selectedPlayerIds).map(player => {
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
        isRevealed: false,
      };
    });
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
      await sleep(500);
      if (isCancelled) return;

      for (const player of basePlayers) {
        if (isCancelled) return;

        setDisplayPlayers(prev => prev.map(item => (
          item.id === player.id ? { ...item, isRevealed: true } : item
        )));

        await sleep(1600);
      }

      if (isCancelled) return;
      const sortedPlayers = [...basePlayers]
        .map(player => ({ ...player, isRevealed: true }))
        .sort((a, b) => b.finalScore - a.finalScore);

      setIsSorting(true);
      setDisplayPlayers(sortedPlayers);

      await sleep(800);
      if (isCancelled) return;

      setShowControls(true);
      setSavedResults({
        sourceKey,
        players: sortedPlayers,
        isSorting: true,
        showControls: true,
        isCompleted: true,
      });
    };

    runSequence();

    return () => {
      isCancelled = true;
    };
  }, [basePlayers, canRestoreSavedResults, setSavedResults, sourceKey]);

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
    isRestoredResults: canRestoreSavedResults,
    winnerScore,
    onReset: handleReset,
  };
}
