import { CheckCircle2, FileText } from "@/shared/ui/icons";

import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { cn } from "@/shared/lib/utils";

type QuestionPackCardProps = {
  title: string;
  roundsCount: number;
  themesCount: number;
  lang: string;
  isSelected: boolean;
  onToggle?: () => void;
};

export function QuestionPackCard({
  title,
  roundsCount,
  themesCount,
  lang,
  isSelected,
  onToggle,
}: QuestionPackCardProps) {
  return (
    <Button
      type="button"
      variant="ghost"
      onClick={onToggle}
      className={cn(
        "h-auto w-full cursor-pointer rounded-xl border-2 p-4 transition-all duration-200 flex items-center justify-start gap-4 relative overflow-hidden text-left shadow-none",
        isSelected
          ? "border-primary bg-primary/5 shadow-md ring-1 ring-primary/20 hover:bg-primary/5 hover:text-foreground"
          : "border-muted bg-background hover:border-primary/30 hover:bg-background hover:text-foreground",
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
          <Badge
            variant="outline"
            className="text-[10px] font-mono uppercase bg-background/50 h-5 px-2 py-0.5 font-semibold"
          >
            {lang}
          </Badge>
        </div>
      </div>
    </Button>
  );
}
