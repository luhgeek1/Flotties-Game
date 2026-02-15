import { GamePage } from "./game-page";

type GamePage2RProps = {
  onExitToSetup?: () => void;
};

export function GamePage2R({ onExitToSetup }: GamePage2RProps) {
  return <GamePage onExitToSetup={onExitToSetup} roundIndex={1} />;
}
