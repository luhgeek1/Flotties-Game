export type PlayerPickParticipant = {
  id: string;
  name: string;
  score: number;
};

export type ResolveRoundStartPickerIdArgs = {
  players: readonly PlayerPickParticipant[];
  roundIndex: number;
};

export type ResolveCurrentPickerIdArgs = {
  players: readonly PlayerPickParticipant[];
  roundStartPickerId: string | null;
  completedPicksCount: number;
};
