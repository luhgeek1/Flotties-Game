import { ArrowLeft, Eye, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

import { Button } from "@/shared/components/ui/button";

export type QuestionModalPlayer = {
  id: string;
  name: string;
  answered?: boolean;
};

type QuestionModalProps = {
  isOpen: boolean;
  questionId: string | null;
  questionValue: number | string;
  questionText: string;
  answerText: string;
  players: QuestionModalPlayer[];
  onClose?: () => void;
  onBackToBoard?: () => void;
};

export function QuestionModal({
  isOpen,
  questionId,
  questionValue,
  questionText,
  answerText,
  onClose,
  onBackToBoard,
}: QuestionModalProps) {
  return (
    <AnimatePresence>
      {isOpen ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4"
        >
          <motion.div
            layoutId={`question-${questionId ?? "placeholder-question-id"}`}
            className="w-full max-w-4xl bg-card border border-border rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
          >
            <div className="bg-muted p-6 flex justify-between items-center border-b border-border">
              <div className="text-2xl font-bold text-primary">{questionValue}</div>

              <Button type="button" variant="ghost" size="icon" title="Close" onClick={onClose}>
                <X className="w-6 h-6" />
              </Button>
            </div>

            <div className="flex-1 p-8 md:p-12 flex flex-col items-center justify-center text-center overflow-y-auto">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="prose dark:prose-invert lg:prose-xl max-w-none mb-8"
              >
                <h2 className="text-3xl md:text-5xl font-bold leading-tight mb-8 text-foreground">
                  {questionText}
                </h2>

                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  className="mt-8 p-6 bg-green-100 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg"
                >
                  <p className="text-xl md:text-2xl text-green-700 dark:text-green-400 font-semibold">
                    {answerText}
                  </p>
                </motion.div>
              </motion.div>

              <Button type="button" size="lg" className="gap-2 text-lg px-8 py-6 h-auto">
                <Eye className="w-5 h-5" />
                Show answer
              </Button>

              <div className="w-full mt-10">
                <h3 className="text-muted-foreground mb-4 uppercase tracking-widest text-sm font-semibold">
                  Who answered?
                </h3>


                <div className="mt-8">
                  <Button
                    type="button"
                    variant="secondary"
                    size="lg"
                    className="gap-2 w-full md:w-auto"
                    onClick={onBackToBoard}
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Back to board
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
