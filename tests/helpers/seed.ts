import type { Page } from "@playwright/test";

import {
  ADMIN_MODE_KEY,
  GAME_ACTIVE_QUESTION_ID_KEY,
  GAME_OPENED_IDS_KEY,
  GAME_PLAYER_SCORES_KEY,
  GAME_QUESTION_FLOW_KEY,
  GAME_ROUND_2_UNLOCKED_KEY,
  GAME_ROUND_FIRST_PICK_DONE_KEY,
  GAME_ROUTE_LOCK_KEY,
  ONBOARDING_STARTED_GAME_KEY,
  ROUND_SPECIAL_MAPS_KEY,
  SETUP_SELECTED_PACK_KEY,
  SETUP_SELECTED_PLAYERS_KEY,
  SETUP_STEP_KEY,
} from "./storage-keys";

export const DEFAULT_PACK_ID = "default-pack-ru-v1";
export const DEFAULT_SELECTED_PLAYERS = ["p1", "p2", "p3"];

const DEFAULT_ROUND_SPECIAL_MAPS = {
  "default-pack-ru-v1:round-1": {
    "r1-startups-500": { type: "catInBag", specialQuestionId: "cat-1" },
    "r1-langs-500": { type: "catInBag", specialQuestionId: "cat-2" },
    "r1-memes-500": { type: "auction", specialQuestionId: "auction-1" },
    "r1-egypt-500": { type: "auction", specialQuestionId: "auction-2" },
  },
  "default-pack-ru-v1:round-2": {
    "r2-movies-1000": { type: "catInBag", specialQuestionId: "cat-3" },
    "r2-geo-1000": { type: "catInBag", specialQuestionId: "cat-4" },
    "r2-music-1000": { type: "auction", specialQuestionId: "auction-3" },
    "r2-history-ru-1000": { type: "auction", specialQuestionId: "auction-4" },
  },
} as const;

type StorageSeed = {
  json?: Record<string, unknown>;
  raw?: Record<string, string | null | undefined>;
};

type SeedStorageOptions = {
  oncePerTab?: boolean;
};

type SeedSetupOptions = {
  adminMode?: boolean;
  preserveOnReload?: boolean;
};

type SeedDirectRouteOptions = {
  routeLock?: string;
  adminMode?: boolean;
  scores?: Record<string, number>;
  openedQuestionIds?: string[];
  activeQuestionId?: string;
  questionFlow?: Record<string, unknown>;
  isRound2Unlocked?: boolean;
  isRoundFirstPickDone?: boolean;
  preserveOnReload?: boolean;
};

export async function seedStorage(
  page: Page,
  { json = {}, raw = {} }: StorageSeed,
  { oncePerTab = false }: SeedStorageOptions = {},
) {
  await page.addInitScript(
    ({ jsonEntries, rawEntries, seedOncePerTab }) => {
      const oncePerTabKey = "__pw-seed-once-per-tab__";
      if (seedOncePerTab && window.sessionStorage.getItem(oncePerTabKey) === "1") {
        return;
      }

      window.localStorage.clear();
      window.sessionStorage.clear();

      Object.entries(jsonEntries).forEach(([key, value]) => {
        if (value === undefined) return;
        window.localStorage.setItem(key, JSON.stringify(value));
      });

      Object.entries(rawEntries).forEach(([key, value]) => {
        if (value == null) {
          window.localStorage.removeItem(key);
          return;
        }

        window.localStorage.setItem(key, value);
      });

      if (seedOncePerTab) {
        window.sessionStorage.setItem(oncePerTabKey, "1");
      }
    },
    { jsonEntries: json, rawEntries: raw, seedOncePerTab: oncePerTab },
  );
}

export async function seedSetupState(page: Page, options: SeedSetupOptions = {}) {
  const { adminMode = false, preserveOnReload = false } = options;

  await seedStorage(page, {
    json: {
      [ONBOARDING_STARTED_GAME_KEY]: true,
      [ADMIN_MODE_KEY]: adminMode,
      [SETUP_STEP_KEY]: "players",
      [SETUP_SELECTED_PLAYERS_KEY]: [],
      [SETUP_SELECTED_PACK_KEY]: null,
      [ROUND_SPECIAL_MAPS_KEY]: DEFAULT_ROUND_SPECIAL_MAPS,
    },
    raw: {
      [GAME_ROUTE_LOCK_KEY]: null,
    },
  }, { oncePerTab: preserveOnReload });
}

export async function seedDirectRouteState(page: Page, options: SeedDirectRouteOptions = {}) {
  const {
    routeLock = "game",
    adminMode = false,
    scores = { p1: 0, p2: 0, p3: 0 },
    openedQuestionIds = [],
    activeQuestionId,
    questionFlow,
    isRound2Unlocked = false,
    isRoundFirstPickDone = true,
    preserveOnReload = false,
  } = options;

  await seedStorage(page, {
    json: {
      [ONBOARDING_STARTED_GAME_KEY]: true,
      [ADMIN_MODE_KEY]: adminMode,
      [SETUP_SELECTED_PLAYERS_KEY]: DEFAULT_SELECTED_PLAYERS,
      [SETUP_SELECTED_PACK_KEY]: DEFAULT_PACK_ID,
      [ROUND_SPECIAL_MAPS_KEY]: DEFAULT_ROUND_SPECIAL_MAPS,
      [GAME_PLAYER_SCORES_KEY]: scores,
      [GAME_OPENED_IDS_KEY]: openedQuestionIds,
      [GAME_ROUND_2_UNLOCKED_KEY]: isRound2Unlocked,
      [GAME_ROUND_FIRST_PICK_DONE_KEY]: isRoundFirstPickDone,
      ...(activeQuestionId ? { [GAME_ACTIVE_QUESTION_ID_KEY]: activeQuestionId } : {}),
      ...(questionFlow ? { [GAME_QUESTION_FLOW_KEY]: questionFlow } : {}),
    },
    raw: {
      [GAME_ROUTE_LOCK_KEY]: routeLock,
    },
  }, { oncePerTab: preserveOnReload });
}
