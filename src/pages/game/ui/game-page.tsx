import { GameBoard } from "@/entities/game-board";
import { AuctionModal, AuctionUnavailableModal } from "@/features/auction";
import { RayGifBanner } from "@/features/special-banner";
import { CatInBagTransferModal } from "@/features/cat-in-bag/cat-in-bag-transfer";
import { PlayerScoreCard } from "@/entities/players";
import { PlayerPickBanner } from "@/features/player-pick";
import { QuestionModal } from "@/features/question-modal";
import { RoundTransitionModal } from "@/features/round-transition"
import { GameShell } from "@/widgets/game-shell";

import { useGamePageModel } from "../model/useGamePageModel";

type GamePageProps = {
  onExitToSetup?: () => void;
  onRoundTransitionConfirm?: () => void;
  roundIndex?: number;
};

export function GamePage({ onExitToSetup, onRoundTransitionConfirm, roundIndex = 0 }: GamePageProps) {
  const model = useGamePageModel({
    onExitToSetup,
    onRoundTransitionConfirm,
    roundIndex,
  });

  return (
    <>
      <GameShell
        packTitle={model.gameShell.packTitle}
        questionsProgress={model.gameShell.questionsProgress}
        onExitToSetup={model.gameShell.onExitToSetup}
        onOpenAllQuestionsClick={model.gameShell.onOpenAllQuestionsClick}
        playersSlot={model.gameShell.players.map(player => (
          <PlayerScoreCard
            key={player.id}
            layoutId={`player-card-${player.id}`}
            name={player.name}
            score={player.score}
            avatarUrl={player.avatarUrl}
            keyCode={player.keyCode}
            isPicking={player.id === model.gameShell.activePickerId}
          />
        ))}
      >
        <div className="relative h-full w-full flex items-center justify-center">
          <PlayerPickBanner
            playerName={model.pickBanner.playerName}
            isOpen={model.pickBanner.isOpen}
          />
          <GameBoard {...model.gameBoard} />
        </div>
      </GameShell>


      <RayGifBanner
        open={model.catInBagBanner.open}
        onClose={model.catInBagBanner.onClose}
        specialType="catInBag"
        autoCloseMs={3000}
      />

      <RayGifBanner
        open={model.auctionBanner.open}
        onClose={model.auctionBanner.onClose}
        specialType="auction"
        autoCloseMs={3000}
      />

      <AuctionUnavailableModal {...model.auctionGuardModal} />

      <AuctionModal {...model.auctionModal} />

      <CatInBagTransferModal {...model.catInBagTransferModal} />

      {model.isCatInBagQuestionTitleVisible ? (
        <div className="fixed left-1/2 top-4 z-60 -translate-x-1/2 pointer-events-none">
          <div className="rounded-full border border-slate-200 bg-white/95 px-5 py-2 text-sm font-black uppercase tracking-wide text-slate-900 shadow-md">
            Кот в мешке
          </div>
        </div>
      ) : null}

      <QuestionModal {...model.questionModal} />

      <RoundTransitionModal {...model.roundTransitionModal} />
    </>
  );
}
