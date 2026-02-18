import type { ReactNode } from "react";
import { useCallback, useState } from "react";
import { LogOut, Sun } from "lucide-react";

import { ExitGameModal } from "@/features/exit-game";
import { Button } from "@/shared/components/ui/button";

type HeaderProps = {
  title: string;
  subtitle?: string;
  onExitToSetup?: () => void;
  onThemeToggle?: () => void;
  isThemeToggleDisabled?: boolean;
  rightSlot?: ReactNode;
};

export function Header({
  title,
  subtitle,
  onExitToSetup,
  onThemeToggle,
  isThemeToggleDisabled = false,
  rightSlot,
}: HeaderProps) {
  const [isExitModalOpen, setIsExitModalOpen] = useState(false);

  const handleExitClick = useCallback(() => {
    setIsExitModalOpen(true);
  }, []);

  const handleExitCancel = useCallback(() => {
    setIsExitModalOpen(false);
  }, []);

  const handleExitConfirm = useCallback(() => {
    setIsExitModalOpen(false);
    onExitToSetup?.();
  }, [onExitToSetup]);

  return (
    <>
      <header className="h-16 border-b bg-card/80 backdrop-blur px-6 flex items-center justify-between shrink-0 z-30">
        <div className="flex items-center gap-4">
          <Button type="button" variant="ghost" size="icon" title="Exit to setup" onClick={handleExitClick}>
            <LogOut className="w-5 h-5 text-muted-foreground hover:text-destructive transition-colors" />
          </Button>

          <div>
            <h1 className="font-bold text-xl leading-none">{title}</h1>
            {subtitle ? <span className="text-xs text-muted-foreground">{subtitle}</span> : null}
          </div>
        </div>

        <div className="flex gap-2">
          {rightSlot}
          <Button
            type="button"
            variant="ghost"
            size="icon"
            title="Toggle theme"
            disabled={isThemeToggleDisabled}
            onClick={onThemeToggle}
          >
            <Sun className={isThemeToggleDisabled ? "w-5 h-5 opacity-45" : "w-5 h-5"} />
          </Button>
        </div>
      </header>

      <ExitGameModal
        isOpen={isExitModalOpen}
        onCancel={handleExitCancel}
        onConfirm={handleExitConfirm}
      />
    </>
  );
}
