import { GamePage } from "./game-page";

type GamePage2RProps = {
  onExitToSetup?: () => void;
  onRoundTransitionConfirm?: () => void;
};

export function GamePage2R({ onExitToSetup, onRoundTransitionConfirm }: GamePage2RProps) {
  return (
    <GamePage
      onExitToSetup={onExitToSetup}
      onRoundTransitionConfirm={onRoundTransitionConfirm}
      roundIndex={1}
    />
  );
}
