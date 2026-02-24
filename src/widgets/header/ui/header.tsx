import type { ReactNode } from "react";
import { useCallback, useState } from "react";
import { LogOut, Moon, Sun } from "lucide-react";

import { AdminModeSwitch } from "@/features/admin";
import { ExitGameModal } from "@/features/exit-game";
import { Button } from "@/shared/components/ui/button";
import { useTheme } from "@/app/lib/use-theme";

type HeaderProps = {
  title: string;
  subtitle?: string;
  onExitToSetup?: () => void;
  onThemeToggle?: () => void;
  rightSlot?: ReactNode;
};

export function Header({
  title,
  subtitle,
  onExitToSetup,
  onThemeToggle,
  rightSlot,
}: HeaderProps) {
  const { isDark, toggleTheme } = useTheme();
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

  const handleThemeToggle = onThemeToggle ?? toggleTheme;

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

        <div className="flex items-center gap-2">
          <AdminModeSwitch />
          {rightSlot}
          <Button
            type="button"
            variant="ghost"
            size="icon"
            title="Переключить тему"
            onClick={handleThemeToggle}
          >
            {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
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
