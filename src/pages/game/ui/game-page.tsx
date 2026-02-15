import { useMemo } from "react";
import { useAtom, useAtomValue } from "jotai";

import { GameBoard } from "@/entities/game-board";
import { PlayerScoreCard } from "@/entities/players";
import { ExitGameModal } from "@/features/exit-game";
import { QuestionModal } from "@/features/question-modal";
import { RoundTransitionModal } from "@/features/round-transition";
import { GameShell } from "@/widgets/game-shell";

import {
  gameIsExitModalOpenAtom,
} from "@/shared/store/gameAtoms";
import { selectedQuestionPackAtom } from "@/shared/store/questionAtom";
import { setupSelectedPlayerIdsAtom } from "@/shared/store/setupAtoms";

import { useGamePlayers } from "../model/useGamePlayers";
import { useGameBoardData } from "../model/useGameBoardData";
import { useQuestionState } from "../model/useQuestionState";

type GamePageProps = {
  onExitToSetup?: () => void;
  onRoundTransitionConfirm?: () => void;
  roundIndex?: number;
};

export function GamePage({ onExitToSetup, onRoundTransitionConfirm, roundIndex = 0 }: GamePageProps) {
  const selectedPack = useAtomValue(selectedQuestionPackAtom);
  const selectedPlayerIds = useAtomValue(setupSelectedPlayerIdsAtom);

  const [isExitModalOpen, setIsExitModalOpen] = useAtom(gameIsExitModalOpenAtom);

  const { gamePlayers, questionPlayers, resetScores, changePlayerScore } = useGamePlayers(selectedPlayerIds);
  const { boardThemes, questionsById, totalQuestions, packTitle } = useGameBoardData(selectedPack, roundIndex);
  const {
    activeQuestion,
    activeQuestionId,
    handleQuestionSelect,
    modalState,
    questionTimerDurationMs,
    setAnswerInput,
    submitAnswer,
    markAnswerWrong,
    continueAfterWrong,
    openedQuestionIds,
    openAllQuestions,
    resetQuestionState,
  } = useQuestionState({
    questionsById,
    players: questionPlayers,
    onPlayerScoreDelta: changePlayerScore,
  });
  const modalQuestionId = activeQuestionId ?? modalState?.questionId ?? null;
  const modalQuestion = modalQuestionId ? questionsById.get(modalQuestionId) ?? null : null;
  const isQuestionModalOpen = modalQuestionId !== null;

  const questionsProgress = `Questions: ${openedQuestionIds.length}/${totalQuestions}`;
  const isRoundComplete = useMemo(() => (
    totalQuestions > 0
    && openedQuestionIds.length >= totalQuestions
    && !isQuestionModalOpen
  ), [isQuestionModalOpen, openedQuestionIds, totalQuestions]);
  const isRoundTransitionModalOpen = Boolean(onRoundTransitionConfirm) && isRoundComplete;

  const setExitModalOpen = (open: boolean) => setIsExitModalOpen(open);

  const exitToSetup = () => {
    resetQuestionState();
    resetScores();
    onExitToSetup?.();
  };

  const handleExitConfirm = () => {
    setExitModalOpen(false);
    exitToSetup();
  };

  return (
    <>
      <GameShell
        packTitle={packTitle}
        questionsProgress={questionsProgress}
        onExitClick={() => setExitModalOpen(true)}
        onOpenAllQuestionsClick={openAllQuestions}
        playersSlot={gamePlayers.map(player => (
          <PlayerScoreCard
            key={player.id}
            layoutId={`player-card-${player.id}`}
            name={player.name}
            score={player.score}
          />
        ))}
      >
        <GameBoard
          themes={boardThemes}
          openedQuestionIds={openedQuestionIds}
          onQuestionSelect={handleQuestionSelect}
        />
      </GameShell>

      <QuestionModal
        isOpen={isQuestionModalOpen}
        questionId={modalQuestionId}
        questionValue={modalQuestion?.value ?? activeQuestion?.value ?? ""}
        questionText={modalQuestion?.question ?? activeQuestion?.question ?? ""}
        answerText={modalQuestion?.answers[0] ?? activeQuestion?.answers[0] ?? "Ответ не указан"}
        players={questionPlayers}
        phase={modalState?.phase ?? null}
        remainingMs={modalState?.remainingMs ?? questionTimerDurationMs}
        timerDurationMs={questionTimerDurationMs}
        attemptedPlayerIds={modalState?.attemptedPlayerIds ?? []}
        activePlayerId={modalState?.activePlayerId ?? null}
        answerInput={modalState?.answerInput ?? ""}
        onAnswerInputChange={setAnswerInput}
        onSubmitAnswer={submitAnswer}
        onMarkAnswerWrong={markAnswerWrong}
        onContinue={continueAfterWrong}
      />

      <ExitGameModal
        isOpen={isExitModalOpen}
        onCancel={() => setExitModalOpen(false)}
        onConfirm={handleExitConfirm}
      />

      <RoundTransitionModal
        isOpen={isRoundTransitionModalOpen}
        onExitToSetup={() => {
          exitToSetup();
        }}
        onConfirm={() => {
          onRoundTransitionConfirm?.();
        }}
      />
    </>
  );
}
