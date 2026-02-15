import type { ReactNode } from "react";
import { LogOut, Sun, Users } from "lucide-react";

import { Button } from "@/shared/components/ui/button";

type GameShellProps = {
  packTitle: string;
  questionsProgress: string;
  playersSlot: ReactNode;
  children: ReactNode;
  onExitClick?: () => void;
  onOpenAllQuestionsClick?: () => void;
  onThemeToggle?: () => void;
};

export function GameShell({
  packTitle,
  questionsProgress,
  playersSlot,
  children,
  onExitClick,
  onOpenAllQuestionsClick,
  onThemeToggle,
}: GameShellProps) {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans selection:bg-primary/30 transition-colors duration-300">
      <div className="flex-1 flex flex-col h-screen overflow-hidden bg-background">
        <header className="h-16 border-b bg-card/80 backdrop-blur px-6 flex items-center justify-between shrink-0 z-30">
          <div className="flex items-center gap-4">
            <Button type="button" variant="ghost" size="icon" title="Exit to setup" onClick={onExitClick}>
              <LogOut className="w-5 h-5 text-muted-foreground hover:text-destructive transition-colors" />
            </Button>

            <div>
              <h1 className="font-bold text-xl leading-none">{packTitle}</h1>
              <span className="text-xs text-muted-foreground">{questionsProgress}</span>
            </div>
          </div>

          <div className="flex gap-2">
            {onOpenAllQuestionsClick ? (
              <Button type="button" variant="outline" size="sm" onClick={onOpenAllQuestionsClick}>
                Закончить раньше
              </Button>
            ) : null}
            <Button type="button" variant="ghost" size="icon" title="Toggle theme" onClick={onThemeToggle}>
              <Sun className="w-5 h-5" />
            </Button>
          </div>
        </header>

        <div className="flex-1 flex overflow-hidden">
          <main className="flex-1 overflow-y-auto p-4 md:p-6 flex items-center justify-center">{children}</main>

          <aside className="w-72 border-l bg-card/50 backdrop-blur-sm p-6 flex flex-col gap-6 overflow-y-auto shrink-0 z-20 shadow-[-5px_0_20px_-10px_rgba(0,0,0,0.1)]">
            <div className="flex items-center gap-2 text-primary font-bold uppercase tracking-widest text-sm mb-2 opacity-70">
              <Users className="w-4 h-4" /> Players
            </div>

            <div className="flex flex-col gap-3">{playersSlot}</div>
          </aside>
        </div>

        <style>{`
          ::-webkit-scrollbar { width: 8px; height: 8px; }
          ::-webkit-scrollbar-track { background: transparent; }
          ::-webkit-scrollbar-thumb {
            background: hsl(var(--muted-foreground) / 0.3);
            border-radius: 4px;
          }
          ::-webkit-scrollbar-thumb:hover {
            background: hsl(var(--muted-foreground) / 0.5);
          }
        `}</style>
      </div>
    </div>
  );
}
