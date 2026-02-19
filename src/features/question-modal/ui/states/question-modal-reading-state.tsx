import type { QuestionModalPlayer } from "../../model/types";
import { formatKeyCode } from "@/shared/lib/format-key-code";

type QuestionModalReadingStateProps = {
  questionText: string;
  players: QuestionModalPlayer[];
  attemptedPlayerIds: string[];
};

export function QuestionModalReadingState({
  questionText,
  players,
  attemptedPlayerIds,
}: QuestionModalReadingStateProps) {
  const attemptedPlayerIdSet = new Set(attemptedPlayerIds);

  return (
    <div className="w-full max-w-4xl">
      <h2 className="text-3xl md:text-4xl font-bold leading-tight">{questionText}</h2>

      <div className="mt-12 flex flex-wrap justify-center gap-6">
        {players.map(player => {
          const attempted = attemptedPlayerIdSet.has(player.id);

          return (
            <div
              key={player.id}
              className={`flex min-w-36 flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                attempted
                  ? "opacity-50 grayscale border-destructive/70 bg-destructive/5"
                  : "border-primary/20"
              }`}
            >
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center font-mono font-bold text-lg ${
                  attempted ? "bg-destructive/15 text-destructive" : "bg-muted text-foreground"
                }`}
              >
                {formatKeyCode(player.keyCode)}
              </div>

              <span className="font-bold text-sm">{player.name}</span>
            </div>
          );
        })}
      </div>

      <p className="text-sm text-muted-foreground mt-8 animate-pulse">
        Нажмите вашу клавишу, чтобы ответить!
      </p>
    </div>
  );
}
