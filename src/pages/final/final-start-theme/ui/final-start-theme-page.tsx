import { useAtomValue } from "jotai";

import { selectedQuestionPackAtom } from "@/features/game-session/store/questionAtom";
import { Header } from "@/widgets/header";

import { TopicReveal } from "./topic-reveal";

type FinalStartThemePageProps = {
  onExitToSetup?: () => void;
  onNext?: () => void;
};

export function FinalStartThemePage({ onExitToSetup, onNext }: FinalStartThemePageProps) {
  const selectedPack = useAtomValue(selectedQuestionPackAtom);
  const finalTheme = selectedPack.rounds.final.theme;
  const packTitle = selectedPack.title;

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans selection:bg-primary/30 transition-colors duration-300">
      <Header
        title={packTitle}
        subtitle="Объявление темы"
        onExitToSetup={onExitToSetup}
        isThemeToggleDisabled
      />

      <main className="flex flex-1 items-center justify-center p-4 md:p-8">
        <TopicReveal topic={finalTheme} onNext={() => onNext?.()} />
      </main>
    </div>
  );
}
