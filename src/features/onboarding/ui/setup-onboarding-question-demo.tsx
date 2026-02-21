import { motion } from "motion/react";

import { QuestionModal } from "@/features/question-modal";
import { Button } from "@/shared/components/ui/button";
import lottiForwardImage from "@/shared/assets/lottipryamoi.png";
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

          {!model.isDemoQuestionCompleted ? (
            <p className="text-sm font-medium text-slate-600 md:text-base">
              Дальше следуйте указаниям. 
            </p>
          ) : null}
        </div>
      </div>

      {model.isDemoQuestionCompleted ? (
        <motion.div
          className="fixed inset-0 z-30 bg-white/40 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          onClick={onFinish}
        >
          <motion.div
            className="pointer-events-auto absolute left-4 top-[70%] z-10 w-[min(60vw,720px)] -translate-y-1/2 rounded-[2rem] border border-slate-200 bg-white/95 p-6 shadow-lg sm:left-6 sm:p-8 md:left-10 md:p-10"
            initial={{ x: -24, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.35, delay: 0.06, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="text-lg font-semibold leading-relaxed text-slate-900 sm:text-xl md:text-2xl">
              Если всё понятно - кликните по экрану. Если хотите повторить демо - нажмите на кнопкку ниже. 
            </p>
            <Button
              type="button"
              variant="outline"
              className="mt-5"
              onClick={(event) => {
                event.stopPropagation();
                model.resetDemo();
              }}
            >
              Повторить демо
            </Button>
          </motion.div>

          <motion.img
            src={lottiForwardImage}
            alt="Лотти"
            className="pointer-events-none select-none absolute bottom-0 right-0 h-auto w-[min(50vw,700px)] sm:w-[min(50vw,700px)] md:w-[min(60vw,850px)]"
            initial={{ x: 120, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            draggable={false}
          />
        </motion.div>
      ) : null}

      <QuestionModal {...model.questionModal} />
    </motion.div>
  );
}
