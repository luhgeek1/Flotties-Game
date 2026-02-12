import { CheckCircle2, FileText } from "lucide-react";

type QuestionPackCardProps = {
  title: string;
  roundsCount: number;
  themesCount: number;
  lang: string;
  version?: string;
};

export function QuestionPackCard({
  title,
  roundsCount,
  themesCount,
  lang,
  version = "V1.0",
}: QuestionPackCardProps) {
  return (
    <div
      className={`
        cursor-pointer rounded-xl border-2 p-5 transition-all duration-200 flex items-center gap-5 relative overflow-hidden
        border-primary bg-primary/5 shadow-md ring-1 ring-primary/20
      `}
    >
      <div className="w-14 h-14 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
        <FileText className="w-7 h-7" />
      </div>

      <div className="flex-1">
        <div className="flex justify-between items-start">
          <h3 className="font-bold text-lg">{title}</h3>

          <div className="text-primary animate-in fade-in zoom-in duration-200">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

        <p className="text-sm text-muted-foreground mt-1">
          {roundsCount} раунда • {themesCount} тем
        </p>

        <div className="mt-2 flex gap-2">
          <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 text-foreground text-[10px] font-mono uppercase bg-background/50 h-5">
            {lang}
          </div>
          <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 text-foreground text-[10px] font-mono uppercase bg-background/50 h-5">
            {version}
          </div>
        </div>
      </div>
    </div>
  );
}
