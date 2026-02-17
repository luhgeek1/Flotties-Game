import type { Player } from "./types";
import defaultPlayerAvatar from "@/shared/assets/default-user-avatar.svg";

export const DEFAULT_PLAYER_AVATAR_URL = defaultPlayerAvatar;

export const DEFAULT_PLAYERS: Omit<Player, "score">[] = [
  { id: "p1", name: "Игрок 1", keyCode: "KeyA", avatarUrl: DEFAULT_PLAYER_AVATAR_URL },
  { id: "p2", name: "Игрок 2", keyCode: "KeyL", avatarUrl: DEFAULT_PLAYER_AVATAR_URL },
  { id: "p3", name: "Игрок 3", keyCode: "Space", avatarUrl: DEFAULT_PLAYER_AVATAR_URL },
];

export function createDefaultPlayers(): Player[] {
  return DEFAULT_PLAYERS.map(p => ({ ...p, score: 0 }));
}
