import { useAtom, useAtomValue } from "jotai";

import { GameBoard } from "@/entities/game-board";
import { PlayerScoreCard } from "@/entities/players";
import { ExitGameModal } from "@/features/exit-game";
import { QuestionModal } from "@/features/question-modal";
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
};

export function GamePage({ onExitToSetup }: GamePageProps) {
  const selectedPack = useAtomValue(selectedQuestionPackAtom);
  const selectedPlayerIds = useAtomValue(setupSelectedPlayerIdsAtom);

  const [isExitModalOpen, setIsExitModalOpen] = useAtom(gameIsExitModalOpenAtom);

  const { gamePlayers, questionPlayers, resetScores } = useGamePlayers(selectedPlayerIds);
  const { boardThemes, questionsById, totalQuestions, packTitle } = useGameBoardData(selectedPack);
  const {
    activeQuestion,
    activeQuestionId,
    closeQuestionModal,
    handleQuestionSelect,
    openedQuestionIds,
    resetQuestionState,
  } = useQuestionState(questionsById);

  const questionsProgress = `Questions: ${openedQuestionIds.length}/${totalQuestions}`;

  const setExitModalOpen = (open: boolean) => setIsExitModalOpen(open);

  const handleExitConfirm = () => {
    setExitModalOpen(false);
    resetQuestionState();
    resetScores();
    onExitToSetup?.();
  };

  return (
    <>
      <GameShell
        packTitle={packTitle}
        questionsProgress={questionsProgress}
        onExitClick={() => setExitModalOpen(true)}
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
        isOpen={activeQuestion !== null}
        questionId={activeQuestionId}
        questionValue={activeQuestion?.value ?? ""}
        questionText={activeQuestion?.question ?? ""}
        answerText={activeQuestion?.answers[0] ?? "Ответ не указан"}
        players={questionPlayers}
        onClose={closeQuestionModal}
        onBackToBoard={closeQuestionModal}
      />

      <ExitGameModal
        isOpen={isExitModalOpen}
        onCancel={() => setExitModalOpen(false)}
        onConfirm={handleExitConfirm}
      />
    </>
  );
}
