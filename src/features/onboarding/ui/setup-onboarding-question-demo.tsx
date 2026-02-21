import { motion } from "motion/react";

import { QuestionModal } from "@/features/question-modal";
import { Button } from "@/shared/components/ui/button";
import { useOnboardingQuestionDemo } from "../model/useOnboardingQuestionDemo";

type SetupOnboardingQuestionDemoProps = {
  onFinish?: () => void;
};

export function SetupOnboardingQuestionDemo({ onFinish }: SetupOnboardingQuestionDemoProps) {
  const model = useOnboardingQuestionDemo();

  return (
    <motion.div
      className="fixed inset-0 z-50 bg-white text-slate-900"
      initial={false}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
    >
      <Button
        type="button"
        className="absolute right-4 top-4 z-10 md:right-8 md:top-8"
        onClick={onFinish}
      >
        SKIP
      </Button>

      <div className="flex h-full items-center justify-center p-4">
        <div className="flex max-w-xl flex-col items-center gap-5 text-center md:gap-7">
          <h2 className="text-2xl font-black leading-tight md:text-3xl">Нажми на кнопку чтобы открыть вопрос</h2>

          <motion.button
            type="button"
            onClick={() => model.handleQuestionSelect("r1-langs-100")}
            disabled={model.isDemoQuestionCompleted}
            className="flex h-34 w-34 items-center justify-center rounded-2xl border-2 border-primary bg-card text-5xl font-black font-mono text-primary shadow-md transition-colors hover:bg-primary/5 disabled:cursor-not-allowed disabled:opacity-50 md:h-42 md:w-42 md:text-6xl"
            whileHover={{ scale: model.isDemoQuestionCompleted ? 1 : 1.03 }}
            whileTap={{ scale: model.isDemoQuestionCompleted ? 1 : 0.98 }}
          >
            100
          </motion.button>

          {model.isDemoQuestionCompleted ? (
              <Button type="button" variant="outline" onClick={model.resetDemo}>
                Повторить демо
              </Button>

          ) : (
            <p className="text-sm font-medium text-slate-600 md:text-base">
              Дальше следуйте указаниям. 
            </p>
          )}
        </div>
      </div>

      <QuestionModal {...model.questionModal} />
    </motion.div>
  );
}
