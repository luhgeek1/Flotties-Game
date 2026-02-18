import { LogOut, Sun } from "lucide-react";
import { useAtomValue } from "jotai";

import { Button } from "@/shared/components/ui/button";
import { selectedQuestionPackAtom } from "@/shared/store/questionAtom";

import { TopicReveal } from "./topic-reveal";

type FinalStartThemePageProps = {
  onExitToSetup?: () => void;
  onNext?: () => void;
};

export function FinalStartThemePage({ onExitToSetup, onNext }: FinalStartThemePageProps) {
  const selectedPack = useAtomValue(selectedQuestionPackAtom);
  const finalTheme = selectedPack.rounds.final.theme;

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans selection:bg-primary/30 transition-colors duration-300">
      <header className="h-16 border-b bg-card/80 backdrop-blur px-6 flex items-center justify-between shrink-0 z-30">
        <div className="flex items-center gap-4">
          <Button type="button" variant="ghost" size="icon" title="Exit to setup" onClick={onExitToSetup}>
            <LogOut className="w-5 h-5 text-muted-foreground hover:text-destructive transition-colors" />
          </Button>

          <div>
            <h1 className="font-bold text-xl leading-none">FinalStartTheme</h1>
            <span className="text-xs text-muted-foreground">Объявление темы</span>
          </div>
        </div>

        <Button type="button" variant="ghost" size="icon" title="Toggle theme" disabled>
          <Sun className="w-5 h-5 opacity-45" />
        </Button>
      </header>

      <main className="flex flex-1 items-center justify-center p-4 md:p-8">
        <TopicReveal topic={finalTheme} onNext={() => onNext?.()} />
      </main>
    </div>
  );
}
