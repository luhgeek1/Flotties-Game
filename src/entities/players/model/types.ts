export type PlayerId = string;

export type SetupPlayer = {
  id: PlayerId;
  name: string;
  avatarUrl: string;
  banner: string;
  balance: number;
};

export type Player = SetupPlayer & {
  keyCode: string;
  score: number;
};
