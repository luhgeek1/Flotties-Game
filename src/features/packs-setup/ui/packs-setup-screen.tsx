import { useAtomValue } from "jotai";
import { motion } from "motion/react";
import { ArrowLeft, Upload, Play } from "lucide-react";

import { QuestionPackCard } from "@/entities/question-pack";
import { questionPackAtom } from "@/shared/store/questionAtom";
import { SetupShell } from "@/widgets/setup-shell";

type PacksSetupScreenProps = {
  onBack?: () => void;
  onStart?: () => void;
};

export function PacksSetupScreen({ onBack, onStart }: PacksSetupScreenProps) {
  const questionPack = useAtomValue(questionPackAtom);
  const packTitle = questionPack.title;
  const packLang = questionPack.lang.toUpperCase();
  const roundsCount = questionPack.rounds.length;
  const themesCount = questionPack.rounds.at(0)?.themes.length ?? 0;

  return (
    <SetupShell>
      <motion.div
        key="packs-step"
        initial={{ x: 20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: 20, opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="space-y-6"
      >
        <div className="flex items-center gap-2 mb-6">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-10 w-10 -ml-2"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <h2 className="text-2xl font-bold tracking-tight">Выберите пак вопросов</h2>
        </div>

        <div className="grid grid-cols-1 gap-4">
          <QuestionPackCard
            title={packTitle}
            roundsCount={roundsCount}
            themesCount={themesCount}
            lang={packLang}
          />

          <div className="rounded-xl border-2 border-dashed border-muted bg-muted/20 p-5 flex items-center gap-5 text-muted-foreground cursor-not-allowed opacity-60">
            <div className="w-14 h-14 rounded-lg bg-muted flex items-center justify-center shrink-0">
              <Upload className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-semibold">Загрузить свой пак</h3>
              <p className="text-xs mt-1">Поддержка JSON файлов (Скоро)</p>
            </div>
          </div>
        </div>

        <div className="pt-6">
          <button
            type="button"
            onClick={onStart}
            className="inline-flex items-center justify-center whitespace-nowrap ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 w-full text-lg h-14 rounded-xl font-bold shadow-xl shadow-primary/20"
          >
            Начать игру
            <Play className="w-5 h-5 ml-2 fill-current" />
          </button>
        </div>
      </motion.div>
    </SetupShell>
  );
}
