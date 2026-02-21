import { atomWithStorage } from "jotai/utils";

import type { PlayerId } from "@/entities/players";
import type { QuestionPack } from "@/shared/api/questionPack";
import type { GamePlayerScores } from "./gameAtoms";

const GAME_HISTORY_STORAGE_KEY = "game-history";
const GAME_ROUND_MVPS_STORAGE_KEY = "game-round-mvps";

export type GameHistorySelectedPlayer = {
  id: PlayerId;
  name: string;
  avatarUrl: string;
  banner: string;
};

export type GameRoundMvp = {
  roundNumber: number;
  score: number;
  players: Array<{
    playerId: PlayerId;
    playerName: string;
  }>;
};

export type GameHistoryEntry = {
  id: string;
  endedAt: string;
  selectedPackId: QuestionPack["id"] | null;
  selectedPlayers: GameHistorySelectedPlayer[];
  playerScores: GamePlayerScores;
  roundMvps: GameRoundMvp[];
};

export const gameHistoryAtom = atomWithStorage<GameHistoryEntry[]>(
  GAME_HISTORY_STORAGE_KEY,
  [],
  undefined,
  { getOnInit: true },
);

export const gameRoundMvpsAtom = atomWithStorage<GameRoundMvp[]>(
  GAME_ROUND_MVPS_STORAGE_KEY,
  [],
  undefined,
  { getOnInit: true },
);
