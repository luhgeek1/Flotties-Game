import type { ReactNode } from "react";
import { Moon, Sun } from "lucide-react";
import { motion } from "motion/react";

import { Button } from "@/shared/components/ui/button";
import { useTheme } from "@/shared/lib/use-theme";

type SetupShellProps = {
  children: ReactNode;
};

export function SetupShell({ children }: SetupShellProps) {
  const { isDark, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans selection:bg-primary/30 transition-colors duration-300">
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

      <div className="flex-1 flex flex-col p-4 md:p-8 max-w-2xl mx-auto w-full relative">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="w-full space-y-8 my-auto"
        >
          <div className="text-center space-y-2 mb-10">
            <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-foreground">
              Твоя Игра
            </h1>
          </div>

          {children}
        </motion.div>
      </div>
    </div>
  );
}
