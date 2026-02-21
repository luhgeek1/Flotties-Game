import { Calendar, Clock, Crown, Star, Trophy, Zap } from "lucide-react";
import { motion } from "motion/react";
import type { ReactNode } from "react";

import { PlayerAvatar } from "@/entities/players";
import { Badge } from "@/shared/components/ui/badge";
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
  avatarUrl: string | null;
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
};

type GameCardProps = {
  game: GameCardData;
  index: number;
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
      <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg pr-3 pl-1.5 py-1">
        <div className="bg-slate-100 p-1 rounded-md">{icon}</div>
        <div className="flex flex-col leading-none">
          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">{title}</span>
          <span className="text-xs font-semibold text-slate-500 mt-0.5">—</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg pr-3 pl-1.5 py-1">
      <div className="bg-slate-100 p-1 rounded-md">{icon}</div>
      <div className="flex flex-col leading-none">
        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">{title}</span>
        <div className="flex items-center gap-1.5 mt-0.5">
          <div className="w-4 h-4 rounded-full overflow-hidden border border-slate-200 bg-white">
            <PlayerAvatar value={mvp.avatarUrl} alt={mvp.names} />
          </div>
          <span className="text-xs font-semibold text-slate-700">{mvp.names}</span>
          {mvp.score !== null ? (
            <span className="text-[10px] font-mono text-slate-500">{mvp.score}</span>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export function GameCard({ game, index }: GameCardProps) {
  const sortedPlayers = [...game.players].sort((a, b) => b.score - a.score);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <Card className="group hover:shadow-lg transition-all duration-300 border-border/50 overflow-hidden p-0 gap-0">
        <div className="flex flex-col sm:flex-row sm:items-stretch">
          <div className="flex-1 p-5 flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="font-mono text-[10px] tracking-wider text-muted-foreground">
                #{game.id}
              </Badge>
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
                icon={<Star className="w-3 h-3 text-slate-500 fill-slate-500" />}
                mvp={game.mvp1}
              />

              <MvpBadge
                title="MVP R2"
                icon={<Zap className="w-3 h-3 text-slate-500 fill-slate-500" />}
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

          <div className="p-4 sm:w-75 bg-slate-50/50 flex flex-col justify-center">
            <div className="space-y-3">
              {sortedPlayers.map(player => (
                <div
                  key={player.id}
                  className={`flex items-center gap-3 p-2 rounded-lg transition-colors ${
                    player.isWinner ? "bg-amber-50/80 border border-amber-100" : "hover:bg-white"
                  }`}
                >
                  <div className="relative">
                    <div
                      className={`w-9 h-9 rounded-full overflow-hidden border bg-white ${
                        player.isWinner ? "border-amber-200" : "border-slate-200"
                      }`}
                    >
                      <PlayerAvatar value={player.avatarUrl} alt={player.name} />
                    </div>

                    {player.isWinner ? (
                      <div className="absolute -top-2 -right-2 bg-amber-100 text-amber-600 rounded-full p-0.5 border border-amber-200 shadow-sm">
                        <Crown className="w-2.5 h-2.5 fill-current" />
                      </div>
                    ) : null}
                  </div>

                  <div className="flex-1 min-w-0 flex items-center justify-between gap-2">
                    <span className={`text-sm font-medium truncate ${player.isWinner ? "text-amber-900" : "text-slate-700"}`}>
                      {player.name}
                    </span>

                    <div className="flex items-center gap-2">
                      <span className={`font-mono text-sm font-bold ${player.isWinner ? "text-amber-600" : "text-slate-400"}`}>
                        {player.score.toLocaleString()}
                      </span>
                      {player.isWinner ? <Trophy className="w-3.5 h-3.5 text-amber-500" /> : null}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
