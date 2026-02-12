import type { Player } from "./types";

export const DEFAULT_PLAYERS: Omit<Player, "score">[] = [
  { id: "p1", name: "Игрок 1", keyCode: "KeyA" },
  { id: "p2", name: "Игрок 2", keyCode: "KeyL" },
  { id: "p3", name: "Игрок 3", keyCode: "Space" },
];

export function createDefaultPlayers(): Player[] {
  return DEFAULT_PLAYERS.map(p => ({ ...p, score: 0 }));
}
