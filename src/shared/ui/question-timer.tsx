//помог сделать CODEX
import { motion } from "motion/react";

import { Progress } from "@/shared/components/ui/progress";

type QuestionTimerProps = {
  durationMs: number;
  remainingMs: number;
};

function toSeconds(ms: number): number {
  return Math.max(0, Math.ceil(ms / 1000));
}

export function QuestionTimer({ durationMs, remainingMs }: QuestionTimerProps) {
  const safeDuration = Math.max(durationMs, 1);
  const safeRemaining = Math.max(0, Math.min(remainingMs, safeDuration));
  const secondsLeft = toSeconds(safeRemaining);
  const progressValue = (safeRemaining / safeDuration) * 100;
  const isDangerZone = secondsLeft <= 10;

  return (
    <motion.div
      animate={isDangerZone ? { scale: [1, 1.04, 1] } : { scale: 1 }}
      transition={isDangerZone ? { duration: 0.9, repeat: Infinity } : { duration: 0.2 }}
      className="w-52"
    >
      <div className="flex items-end justify-end gap-3">
        <div
          className={`text-4xl font-mono font-black leading-none ${
            isDangerZone ? "text-destructive" : "text-primary"
          }`}
        >
          {secondsLeft}
        </div>
      </div>

      <Progress
        value={progressValue}
        className={`mt-3 h-2 ${isDangerZone ? "bg-destructive/20" : "bg-primary/20"}`}
      />
    </motion.div>
  );
}
