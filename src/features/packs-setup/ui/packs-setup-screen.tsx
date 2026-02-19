import { useAtom, useAtomValue } from "jotai";
import { motion } from "motion/react";
import { ArrowLeft, Upload, Play } from "lucide-react";

import { QuestionPackCard } from "@/entities/question-pack";
import { Button } from "@/shared/components/ui/button";
import { questionPacksAtom } from "@/shared/store/questionAtom";
import { cn } from "@/shared/lib/utils";
import {
  PLAYERS_TO_START_GAME,
  setupSelectedPackIdAtom,
  setupSelectedPlayerIdsAtom,
} from "@/shared/store/setupAtoms";
import { SetupShell } from "@/widgets/setup-shell";

type PacksSetupScreenProps = {
  onBack?: () => void;
  onStart?: () => void;
};

export function PacksSetupScreen({ onBack, onStart }: PacksSetupScreenProps) {
  const questionPacks = useAtomValue(questionPacksAtom);
  const selectedPlayerIds = useAtomValue(setupSelectedPlayerIdsAtom);
  const [selectedPackId, setSelectedPackId] = useAtom(setupSelectedPackIdAtom);

  //выбор пака
  const togglePackSelection = (packId: string) => {
    setSelectedPackId(prevSelectedPackId => {
      if (prevSelectedPackId === packId) {
        return null;
      }

      return packId;
    });
  };

  const canStart = selectedPackId !== null && selectedPlayerIds.length === PLAYERS_TO_START_GAME;

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
          <Button
            type="button"
            variant="ghost"
            size="icon-lg"
            onClick={onBack}
            className="-ml-2"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>

          <h2 className="text-2xl font-bold tracking-tight">Выберите пак вопросов</h2>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {questionPacks.map(questionPack => {
            const roundsCount = questionPack.rounds.main.length;
            const themesCount = questionPack.rounds.main.at(0)?.themes.length ?? 0;

            return (
              <QuestionPackCard
                key={questionPack.id}
                title={questionPack.title}
                roundsCount={roundsCount}
                themesCount={themesCount}
                lang={questionPack.lang.toUpperCase()}
                isSelected={selectedPackId === questionPack.id}
                onToggle={() => togglePackSelection(questionPack.id)}
              />
            );
          })}

          <div className="rounded-xl border-2 border-dashed border-muted bg-muted/20 p-4 flex items-center gap-4 text-muted-foreground cursor-not-allowed opacity-60">
            <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center shrink-0">
              <Upload className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold">Загрузить свой пак</h3>
              <p className="text-xs mt-1">Поддержка JSON файлов (Скоро)</p>
            </div>
          </div>
        </div>

        <div className="pt-6">
          <Button
            type="button"
            disabled={!canStart}
            onClick={() => {
              if (!canStart) return;
              onStart?.();
            }}
            className={cn(
              "w-full text-lg h-14 rounded-xl font-bold",
              canStart
                ? "bg-primary text-primary-foreground hover:bg-primary/90 shadow-xl shadow-primary/20"
                : "bg-primary/60 text-primary-foreground",
            )}
          >
            Начать игру
            <Play className="w-5 h-5 ml-2 fill-current" />
          </Button>
        </div>
      </motion.div>
    </SetupShell>
  );
}
