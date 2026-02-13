import { motion } from "motion/react";
import type { GameBoardTheme } from "../model";

type GameBoardProps = {
  themes: GameBoardTheme[];
  onQuestionSelect?: (questionId: string) => void;
};

export function GameBoard({ themes, onQuestionSelect }: GameBoardProps) {
  const columns = Math.max(themes.length, 1);

  return (
    <div className="w-full max-w-350 h-full flex flex-col justify-center max-h-[90vh]">
      <div
        className="grid gap-3 h-full"
        style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
      >
        {themes.map(theme => (
          <div key={theme.id} className="flex flex-col gap-3 h-full">
            <div className="flex-1 min-h-15 max-h-25 bg-primary/10 border border-primary/20 rounded-lg flex items-center justify-center p-2 text-center shadow-sm">
              <h3 className="font-bold text-[10px] sm:text-xs md:text-sm lg:text-base uppercase tracking-tight text-foreground wrap-break-word w-full leading-tight line-clamp-3">
                {theme.title}
              </h3>
            </div>

            {theme.questions.map(question => {
              return (
                <motion.button
                  key={question.id}
                  type="button"
                  layoutId={`question-${question.id}`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onQuestionSelect?.(question.id)}
                  className="flex-1 rounded-lg flex items-center justify-center text-xl md:text-3xl font-black font-mono transition-all duration-200 shadow-sm border bg-card text-primary border-border hover:border-primary hover:bg-primary/5 hover:shadow-md cursor-pointer"
                >
                  {question.value}
                </motion.button>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
