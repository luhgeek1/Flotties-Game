import { atomWithStorage } from "jotai/utils";

import type { QuestionPack } from "@/shared/api/questionPack";
import type { PlayerId } from "@/entities/players";

export type SetupStep = "players" | "packs";

const STEP_STORAGE_KEY = "setup-step";
const SELECTED_PLAYERS_STORAGE_KEY = "setup-selected-players";
const SELECTED_PACKS_STORAGE_KEY = "setup-selected-packs";

export const setupStepAtom = atomWithStorage<SetupStep>(
  STEP_STORAGE_KEY,
  "players",
  undefined,
  { getOnInit: true },
);

export const setupSelectedPlayerIdsAtom = atomWithStorage<PlayerId[]>(
  SELECTED_PLAYERS_STORAGE_KEY,
  [],
  undefined,
  { getOnInit: true },
);

export const setupSelectedPackIdsAtom = atomWithStorage<QuestionPack["id"][]>(
  SELECTED_PACKS_STORAGE_KEY,
  [],
  undefined,
  { getOnInit: true },
);
