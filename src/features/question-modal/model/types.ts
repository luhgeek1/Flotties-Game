import type { Player } from "@/entities/players";

export type QuestionModalPlayer = Pick<Player, "id" | "name" | "keyCode">;
