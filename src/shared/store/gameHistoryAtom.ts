import { atomWithStorage } from "jotai/utils";

import type { PlayerId } from "@/entities/players";
import type { QuestionPack } from "@/shared/api/questionPack";
import type { GamePlayerScores } from "./gameAtoms";

const GAME_HISTORY_STORAGE_KEY = "game-history";
const GAME_ROUND_MVPS_STORAGE_KEY = "game-round-mvps";
const GAME_STARTED_AT_STORAGE_KEY = "game-started-at";

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
  startedAt: string;
  endedAt: string;
  durationMs: number;
  selectedPackId: QuestionPack["id"];
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

export const gameStartedAtAtom = atomWithStorage<string | null>(
  GAME_STARTED_AT_STORAGE_KEY,
  null,
  undefined,
  { getOnInit: true },
);
