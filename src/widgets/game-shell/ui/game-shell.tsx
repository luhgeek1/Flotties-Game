import type { ReactNode } from "react";
import { Users } from "lucide-react";

import { Button } from "@/shared/components/ui/button";
import { Header } from "@/widgets/header";

type GameShellProps = {
  packTitle: string;
  questionsProgress: string;
  playersSlot: ReactNode;
  children: ReactNode;
  onExitToSetup?: () => void;
  onOpenAllQuestionsClick?: () => void;
  onThemeToggle?: () => void;
};

export function GameShell({
  packTitle,
  questionsProgress,
  playersSlot,
  children,
  onExitToSetup,
  onOpenAllQuestionsClick,
  onThemeToggle,
}: GameShellProps) {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans selection:bg-primary/30 transition-colors duration-300">
      <div className="flex-1 flex flex-col h-screen overflow-hidden bg-background">
        <Header
          title={packTitle}
          subtitle={questionsProgress}
          onExitToSetup={onExitToSetup}
          onThemeToggle={onThemeToggle}
          rightSlot={onOpenAllQuestionsClick ? (
            <Button type="button" variant="outline" size="sm" onClick={onOpenAllQuestionsClick}>
              Закончить раньше
            </Button>
          ) : null}
        />

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
