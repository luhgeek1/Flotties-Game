import { User } from "lucide-react";
import { motion } from "motion/react";
import { formatKeyCode } from "@/shared/lib/format-key-code";
import { cn } from "@/shared/lib/utils";
import type { Player } from "../model/types";

type PlayerScoreCardProps = Pick<Player, "name" | "score" | "avatarUrl" | "keyCode"> & {
  layoutId?: string;
  isPicking?: boolean;
};

export function PlayerScoreCard({
  layoutId,
  name,
  score,
  avatarUrl,
  keyCode,
  isPicking = false,
}: PlayerScoreCardProps) {
  return (
    <motion.div
      layoutId={layoutId}
      className={cn(
        "flex items-center gap-4 p-3 rounded-xl border transition-all duration-200 shadow-sm",
        isPicking
          ? "bg-primary/5 border-primary shadow-primary/20"
          : "bg-card border-border hover:border-primary/40",
      )}
    >
      <div className="h-12 w-12 rounded-full shrink-0 border-2 shadow-sm bg-background border-border overflow-hidden">
        {avatarUrl ? (
          <img src={avatarUrl} alt={name} className="h-full w-full object-cover" />
        ) : (
          <div className="h-full w-full flex items-center justify-center text-foreground">
            <User className="w-6 h-6" />
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0 flex flex-col">
        <div className="flex items-center justify-between w-full gap-2">
          <div className="flex min-w-0 items-center gap-2">
            <span className="font-bold text-sm truncate">{name}</span>
            <kbd className="rounded border border-border bg-muted px-1.5 py-0.5 text-[11px] font-semibold uppercase leading-none text-muted-foreground">
              {formatKeyCode(keyCode)}
            </kbd>
          </div>
        </div>
        <div
          className={cn(
            "text-xl font-black font-mono leading-none mt-1",
            score < 0 ? "text-destructive" : "text-foreground",
          )}
        >
          {score}
        </div>
      </div>
    </motion.div>
  );
}
