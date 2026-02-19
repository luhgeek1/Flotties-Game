import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";

import type { QuestionPack } from "@/shared/api/questionPack";
import {
  DEFAULT_SETUP_PLAYERS,
  type PlayerId,
  type SetupPlayer,
} from "@/entities/players";

export type SetupStep = "players" | "packs";
export type SetupAddPlayerModalState = {
  nickname: string;
  avatar: string | null;
  banner: string | null;
  error: string;
};

const STEP_STORAGE_KEY = "setup-step";
const PLAYERS_STORAGE_KEY = "setup-players";
const SELECTED_PLAYERS_STORAGE_KEY = "setup-selected-players";
const SELECTED_PACK_ID_STORAGE_KEY = "setup-selected-pack-id";
const ADD_PLAYER_MODAL_STATE_STORAGE_KEY = "setup-add-player-modal-state";

export const PLAYERS_TO_START_GAME = 3;
export const INITIAL_SETUP_ADD_PLAYER_MODAL_STATE: SetupAddPlayerModalState = {
  nickname: "",
  avatar: null,
  banner: null,
  error: "",
};

export const setupStepAtom = atomWithStorage<SetupStep>(
  STEP_STORAGE_KEY,
  "players",
  undefined,
  { getOnInit: true },
);

export const setupPlayersAtom = atomWithStorage<SetupPlayer[]>(
  PLAYERS_STORAGE_KEY,
  DEFAULT_SETUP_PLAYERS,
  undefined,
  { getOnInit: true },
);

export const setupSelectedPlayerIdsAtom = atomWithStorage<PlayerId[]>(
  SELECTED_PLAYERS_STORAGE_KEY,
  [],
  undefined,
  { getOnInit: true },
);

export const setupSelectedPackIdAtom = atomWithStorage<QuestionPack["id"] | null>(
  SELECTED_PACK_ID_STORAGE_KEY,
  null,
  undefined,
  { getOnInit: true },
);

export const setupAddPlayerModalStateAtom = atomWithStorage<SetupAddPlayerModalState>(
  ADD_PLAYER_MODAL_STATE_STORAGE_KEY,
  INITIAL_SETUP_ADD_PLAYER_MODAL_STATE,
  undefined,
  { getOnInit: true },
);

export const resetSetupAddPlayerModalStateAtom = atom(
  null,
  (_get, set) => {
    set(setupAddPlayerModalStateAtom, INITIAL_SETUP_ADD_PLAYER_MODAL_STATE);
  },
);
