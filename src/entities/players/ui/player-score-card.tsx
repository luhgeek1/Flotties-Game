import { User } from "lucide-react";
import { motion } from "motion/react";
import type { Player } from "../model/types";

type PlayerScoreCardProps = Pick<Player, "name" | "score"> & {
  layoutId?: string;
};

export function PlayerScoreCard({ layoutId, name, score }: PlayerScoreCardProps) {
  return (
    <motion.div
      layoutId={layoutId}
      className="flex items-center gap-4 p-3 rounded-xl border transition-all duration-200 bg-card border-border hover:border-primary/40 shadow-sm"
    >
      <div className="h-12 w-12 rounded-full flex items-center justify-center shrink-0 border-2 shadow-sm bg-background border-border text-foreground">
        <User className="w-6 h-6" />
      </div>

      <div className="flex-1 min-w-0 flex flex-col">
        <div className="flex items-center justify-between w-full">
          <span className="font-bold text-sm truncate">{name}</span>
        </div>
        <div className="text-xl font-black font-mono leading-none mt-1 text-foreground">{score}</div>
      </div>
    </motion.div>
  );
}
