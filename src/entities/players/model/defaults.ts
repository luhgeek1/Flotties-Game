import type { SetupPlayer } from "./types";
import defaultPlayerAvatar from "@/shared/assets/default-user-avatar.svg";

export const DEFAULT_PLAYER_AVATAR_URL = defaultPlayerAvatar;

export const PLAYER_SELECTION_KEY_CODES = ["KeyA", "Space", "KeyL"] as const;

export const DEFAULT_SETUP_PLAYERS: SetupPlayer[] = [
  {
    id: "p1",
    name: "Игрок 1",
    avatarUrl: DEFAULT_PLAYER_AVATAR_URL,
    banner: "bg-white",
  },
  {
    id: "p2",
    name: "Игрок 2",
    avatarUrl: DEFAULT_PLAYER_AVATAR_URL,
    banner: "bg-white",
  },
  {
    id: "p3",
    name: "Игрок 3",
    avatarUrl: DEFAULT_PLAYER_AVATAR_URL,
    banner: "bbg-white",
  },
];
