import { CheckCircle2, FileText } from "lucide-react";

import { cn } from "@/shared/lib/utils";

type QuestionPackCardProps = {
  title: string;
  roundsCount: number;
  themesCount: number;
  lang: string;
  isSelected: boolean;
  version?: string;
  onToggle?: () => void;
};

export function QuestionPackCard({
  title,
  roundsCount,
  themesCount,
  lang,
  isSelected,
  version = "V1.0",
  onToggle,
}: QuestionPackCardProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={cn(
        "w-full cursor-pointer rounded-xl border-2 p-4 transition-all duration-200 flex items-center gap-4 relative overflow-hidden text-left",
        isSelected
          ? "border-primary bg-primary/5 shadow-md ring-1 ring-primary/20"
          : "border-muted bg-background hover:border-primary/30",
      )}
    >
      <div className="w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
        <FileText className="w-6 h-6" />
      </div>

      <div className="flex-1">
        <div className="flex justify-between items-start">
          <h3 className="font-bold text-base">{title}</h3>

          {isSelected ? (
            <div className="text-primary animate-in fade-in zoom-in duration-200">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          ) : null}
        </div>

        <p className="text-xs text-muted-foreground mt-1">
          {roundsCount} раунда • {themesCount} тем
        </p>

        <div className="mt-2 flex gap-2">
          <div className="inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 text-foreground text-[10px] font-mono uppercase bg-background/50 h-5">
            {lang}
          </div>
          <div className="inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 text-foreground text-[10px] font-mono uppercase bg-background/50 h-5">
            {version}
          </div>
        </div>
      </div>
    </button>
  );
}
