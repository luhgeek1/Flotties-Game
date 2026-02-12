export type PlayerId = "p1" | "p2" | "p3";

export type Player = {
  id: PlayerId;
  name: string;
  keyCode: string;
  score: number;
};
