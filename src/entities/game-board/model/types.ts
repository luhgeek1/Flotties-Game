export type GameBoardQuestion = {
  id: string;
  value: number;
};

export type GameBoardTheme = {
  id: string;
  title: string;
  questions: GameBoardQuestion[];
};
