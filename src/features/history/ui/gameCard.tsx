import { Calendar, Clock, Crown, Star, Trash2, Trophy, Zap } from "@/shared/ui/icons";
import { motion } from "motion/react";
import type { ReactNode } from "react";

import { PlayerAvatar } from "@/entities/players";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Card } from "@/shared/components/ui/card";
import { Separator } from "@/shared/components/ui/separator";

export type GameCardPlayer = {
  id: string;
  name: string;
  avatarUrl: string;
  score: number;
  isWinner: boolean;
};

export type GameCardMvpRound = {
  names: string;
  avatarUrl: string;
  score: number | null;
};

export type GameCardData = {
  id: string;
  startTime: string;
  duration: string;
  packName: string;
  mvp1: GameCardMvpRound | null;
  mvp2: GameCardMvpRound | null;
  players: GameCardPlayer[];
  isCompleted: boolean;
};

type GameCardProps = {
  game: GameCardData;
  index: number;
  onDelete?: (gameId: string) => void;
};

function MvpBadge({
  title,
  icon,
  mvp,
}: {
  title: string;
  icon: ReactNode;
  mvp: GameCardMvpRound | null;
}) {
  if (!mvp) {
    return (
      <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 pr-3 pl-1.5 py-1 dark:border-zinc-800 dark:bg-zinc-800">
        <div className="rounded-md bg-slate-100 p-1 dark:bg-zinc-700/80">{icon}</div>
        <div className="flex flex-col leading-none">
          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider dark:text-zinc-300">{title}</span>
          <span className="mt-0.5 text-xs font-semibold text-slate-500 dark:text-zinc-200">—</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 pr-3 pl-1.5 py-1 dark:border-zinc-800 dark:bg-zinc-800">
      <div className="rounded-md bg-slate-100 p-1 dark:bg-zinc-700/80">{icon}</div>
      <div className="flex flex-col leading-none">
        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider dark:text-zinc-300">{title}</span>
        <div className="flex items-center gap-1.5 mt-0.5">
          <div className="h-4 w-4 overflow-hidden rounded-full border border-slate-200 bg-white dark:border-zinc-700 dark:bg-zinc-700/70">
            <PlayerAvatar value={mvp.avatarUrl} alt={mvp.names} />
          </div>
          <span className="text-xs font-semibold text-slate-700 dark:text-zinc-50">{mvp.names}</span>
          {mvp.score !== null ? (
            <span className="text-[10px] font-mono text-slate-500 dark:text-zinc-300">{mvp.score}</span>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export function GameCard({ game, index, onDelete }: GameCardProps) {
  const sortedPlayers = [...game.players].sort((a, b) => b.score - a.score);

  return (
    <motion.div
      className="flex items-center gap-3"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <Card className="group flex-1 overflow-hidden border-border/50 p-0 gap-0 transition-all duration-300 hover:shadow-lg dark:hover:shadow-black/40">
        <div className="flex flex-col sm:flex-row sm:items-stretch">
          <div className="flex-1 p-5 flex flex-col gap-4">
            <div className="flex items-center gap-2">
              {!game.isCompleted ? (
                <Badge variant="secondary" className="text-[10px] tracking-wider">
                  Незавершенная
                </Badge>
              ) : null}
              <span className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {new Date(game.startTime).toLocaleDateString(undefined, {
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>

            <h3 className="font-bold text-lg text-foreground tracking-tight group-hover:text-primary transition-colors">
              {game.packName}
            </h3>

            <div className="flex flex-wrap gap-3">
              <MvpBadge
                title="MVP R1"
                icon={<Star className="h-3 w-3 fill-slate-500 text-slate-500 dark:fill-zinc-200 dark:text-zinc-200" />}
                mvp={game.mvp1}
              />

              <MvpBadge
                title="MVP R2"
                icon={<Zap className="h-3 w-3 fill-slate-500 text-slate-500 dark:fill-zinc-200 dark:text-zinc-200" />}
                mvp={game.mvp2}
              />
            </div>

            <div className="mt-auto pt-2">
              <div className="inline-flex items-center gap-1.5 bg-secondary/50 px-2.5 py-1 rounded-full text-xs text-muted-foreground">
                <Clock className="w-3.5 h-3.5" />
                <span className="font-medium font-mono">{game.duration}</span>
              </div>
            </div>
          </div>

          <div className="hidden sm:block w-px bg-border my-4" />
          <Separator className="sm:hidden" />

          <div className="flex flex-col justify-center bg-slate-50/50 p-4 sm:w-75 dark:bg-zinc-900">
            <div className="space-y-3">
              {sortedPlayers.map(player => (
                <div
                  key={player.id}
                  className={`flex items-center gap-3 p-2 rounded-lg transition-colors ${
                    player.isWinner
                      ? "border border-amber-100 bg-amber-50/85 dark:border-amber-300/40 dark:bg-amber-500/15"
                      : "hover:bg-white dark:hover:bg-zinc-800/70"
                  }`}
                >
                  <div className="relative">
                    <div
                      className={`h-9 w-9 overflow-hidden rounded-full border bg-white dark:bg-zinc-700/70 ${
                        player.isWinner ? "border-amber-200 dark:border-amber-300/50" : "border-slate-200 dark:border-zinc-700"
                      }`}
                    >
                      <PlayerAvatar value={player.avatarUrl} alt={player.name} />
                    </div>

                    {player.isWinner ? (
                      <div className="absolute -top-2 -right-2 rounded-full border border-amber-200 bg-amber-100 p-0.5 text-amber-600 shadow-sm dark:border-amber-300/60 dark:bg-amber-400/25 dark:text-amber-200">
                        <Crown className="w-2.5 h-2.5 fill-current" />
                      </div>
                    ) : null}
                  </div>

                  <div className="flex-1 min-w-0 flex items-center justify-between gap-2">
                    <span className={`truncate text-sm font-medium ${player.isWinner ? "text-amber-900 dark:text-amber-200" : "text-slate-700 dark:text-zinc-50"}`}>
                      {player.name}
                    </span>

                    <div className="flex items-center gap-2">
                      <span className={`font-mono text-sm font-bold ${player.isWinner ? "text-amber-600 dark:text-amber-300" : "text-slate-500 dark:text-zinc-300"}`}>
                        {player.score.toLocaleString()}
                      </span>
                      {player.isWinner ? <Trophy className="h-3.5 w-3.5 text-amber-500 dark:text-amber-300" /> : null}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {onDelete ? (
        <Button
          type="button"
          variant="ghost"
          size="lg"
          title="Удалить игру"
          aria-label="Удалить игру"
          onClick={() => onDelete(game.id)}
          className="size-10 shrink-0 rounded-full border border-red-200/70 bg-rose-100 p-0 text-red-600 shadow-none hover:bg-rose-200 hover:text-red-700 dark:border-red-400/40 dark:bg-red-500/15 dark:text-red-300 dark:hover:bg-red-500/25"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      ) : null}
    </motion.div>
  );
}
