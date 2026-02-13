import { atomWithStorage } from "jotai/utils";

const ACTIVE_QUESTION_ID_STORAGE_KEY = "game-active-question-id";
const IS_EXIT_MODAL_OPEN_STORAGE_KEY = "game-is-exit-modal-open";
const OPENED_QUESTION_IDS_STORAGE_KEY = "game-opened-question-ids";
const PLAYER_SCORES_STORAGE_KEY = "game-player-scores";

export const gameActiveQuestionIdAtom = atomWithStorage<string | null>(
  ACTIVE_QUESTION_ID_STORAGE_KEY,
  null,
  undefined,
  { getOnInit: true },
);

export const gameIsExitModalOpenAtom = atomWithStorage<boolean>(
  IS_EXIT_MODAL_OPEN_STORAGE_KEY,
  false,
  undefined,
  { getOnInit: true },
);

export const gameOpenedQuestionIdsAtom = atomWithStorage<string[]>(
  OPENED_QUESTION_IDS_STORAGE_KEY,
  [],
  undefined,
  { getOnInit: true },
);

export type GamePlayerScores = Record<string, number>;

export const gamePlayerScoresAtom = atomWithStorage<GamePlayerScores>(
  PLAYER_SCORES_STORAGE_KEY,
  {},
  undefined,
  { getOnInit: true },
);
