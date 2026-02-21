import { ArrowLeft, History, Moon, Sun } from "lucide-react";

import { GameCard } from "@/features/history";
import { Button } from "@/shared/components/ui/button";
import { useTheme } from "@/shared/lib/use-theme";
import { useHistoryPageModel } from "../model";

type HistoryPageProps = {
  onBackToSetup?: () => void;
};

export function HistoryPage({ onBackToSetup }: HistoryPageProps) {
  const model = useHistoryPageModel();
  const { isDark, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/30 transition-colors duration-300">
      <Button
        type="button"
        variant="ghost"
        size="icon"
        title="Переключить тему"
        onClick={toggleTheme}
        className="fixed right-4 top-4 z-30 rounded-full border border-border bg-card/70 backdrop-blur hover:bg-card md:right-8 md:top-8"
      >
        {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
      </Button>

      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <Button
            type="button"
            variant="outline"
            className="w-fit"
            onClick={onBackToSetup}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            К настройке
          </Button>

          <div className="flex items-center gap-2 text-muted-foreground">
            <History className="w-4 h-4" />
            <span className="text-sm font-semibold tracking-wide uppercase">История игр</span>
          </div>
        </div>

        {model.cards.length > 0 ? (
          <div className="flex flex-col gap-4">
            {model.cards.map((game, index) => (
              <GameCard key={game.id} game={game} index={index} />
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-border/70 bg-card p-8 text-center text-muted-foreground">
            История игр пока пуста
          </div>
        )}
      </div>
    </div>
  );
}
