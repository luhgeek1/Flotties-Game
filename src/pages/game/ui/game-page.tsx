import { useState } from "react";

import { GameBoard, type GameBoardTheme } from "@/entities/game-board";
import { PlayerScoreCard } from "@/entities/players";
import { ExitGameModal } from "@/features/exit-game";
import { QuestionModal, type QuestionModalPlayer } from "@/features/question-modal";
import { GameShell } from "@/widgets/game-shell";

type GamePageProps = {
  onExitToSetup?: () => void;
};

const BOARD_THEMES: GameBoardTheme[] = [
  { id: "theme-1", title: "Theme 1 title", values: [100, 200, 300, 400, 500] },
  { id: "theme-2", title: "Theme 2 title", values: [100, 200, 300, 400, 500] },
  { id: "theme-3", title: "Theme 3 title", values: [100, 200, 300, 400, 500] },
  { id: "theme-4", title: "Theme 4 title", values: [100, 200, 300, 400, 500] },
  { id: "theme-5", title: "Theme 5 title", values: [100, 200, 300, 400, 500] },
  { id: "theme-6", title: "Theme 6 title", values: [100, 200, 300, 400, 500] },
];

const SIDEBAR_PLAYERS = [
  { id: "player-1", name: "Player 1", score: 0 },
  { id: "player-2", name: "Player 2", score: 0 },
];

const QUESTION_PLAYERS: QuestionModalPlayer[] = [
  { id: "player-1", name: "Player 1" },
  { id: "player-2", name: "Player 2", answered: true },
];

export function GamePage({ onExitToSetup }: GamePageProps) {
  const [activeQuestionId, setActiveQuestionId] = useState<string | null>(null);
  const [isExitModalOpen, setIsExitModalOpen] = useState(false);

  const closeQuestionModal = () => {
    setActiveQuestionId(null);
  };

  const closeExitModal = () => {
    setIsExitModalOpen(false);
  };

  const handleExitConfirm = () => {
    setIsExitModalOpen(false);
    setActiveQuestionId(null);
    onExitToSetup?.();
  };

  return (
    <>
      <GameShell
        packTitle="Pack title"
        questionsProgress="Questions: 0/30"
        onExitClick={() => setIsExitModalOpen(true)}
        playersSlot={SIDEBAR_PLAYERS.map(player => (
          <PlayerScoreCard
            key={player.id}
            layoutId={`player-card-${player.id}`}
            name={player.name}
            score={player.score}
          />
        ))}
      >
        <GameBoard themes={BOARD_THEMES} onQuestionSelect={setActiveQuestionId} />
      </GameShell>

      <QuestionModal
        isOpen={activeQuestionId !== null}
        questionId={activeQuestionId}
        questionValue={100}
        questionText="Question text"
        answerText="Answer text"
        players={QUESTION_PLAYERS}
        onClose={closeQuestionModal}
        onBackToBoard={closeQuestionModal}
      />

      <ExitGameModal
        isOpen={isExitModalOpen}
        onCancel={closeExitModal}
        onConfirm={handleExitConfirm}
      />
    </>
  );
}
