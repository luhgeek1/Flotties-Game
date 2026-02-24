import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { PlayerAvatar } from "@/entities/players";
import readingLottiImage from "@/shared/assets/izuglalotti.png";

import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";

type QuestionModalAnsweringStateProps = {
  playerName: string;
  playerAvatarUrl: string;
  questionText: string;
  answerInput: string;
  prefilledAnswerText?: string;
  onAnswerInputChange: (value: string) => void;
  onSubmitAnswer: () => void;
};

const ANSWERING_HINT_DELAY_MS = 7000;

export function QuestionModalAnsweringState({
  playerName,
  playerAvatarUrl,
  questionText,
  answerInput,
  prefilledAnswerText = "",
  onAnswerInputChange,
  onSubmitAnswer,
}: QuestionModalAnsweringStateProps) {
  const [isSlowAnswerHintVisible, setIsSlowAnswerHintVisible] = useState(false);

  useEffect(() => {
    if (!prefilledAnswerText) return;
    if (answerInput.length > 0) return;
    onAnswerInputChange(prefilledAnswerText);
  }, [answerInput, onAnswerInputChange, prefilledAnswerText]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setIsSlowAnswerHintVisible(true);
    }, ANSWERING_HINT_DELAY_MS);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, []);

  return (
    <>
      <div className="mx-auto w-full max-w-2xl space-y-8 animate-in slide-in-from-bottom-10">
        <div className="flex items-center justify-center gap-4 mb-4">
          <div className="w-16 h-16 rounded-full border border-border overflow-hidden bg-background flex items-center justify-center">
            <PlayerAvatar
              value={playerAvatarUrl}
              alt={playerName}
              className="text-primary"
            />
          </div>

          <div className="text-left">
            <p className="text-sm text-muted-foreground uppercase font-bold">Отвечает</p>
            <h2 className="text-3xl font-black">{playerName}</h2>
          </div>
        </div>

        <div className="text-2xl font-medium mb-8 opacity-80">{questionText}</div>

        <div className="relative">
          <Input
            autoFocus
            value={answerInput}
            onChange={event => onAnswerInputChange(event.target.value)}
            onKeyDown={event => {
              if (event.key !== "Enter") return;
              event.preventDefault();
              onSubmitAnswer();
            }}
            placeholder="Введите ответ..."
            className="text-center text-2xl h-16 font-mono border-2 border-primary/50 focus-visible:ring-offset-2"
          />
        </div>

        <div className="pt-4 flex justify-center">
          <Button type="button" size="lg" className="w-full max-w-60" onClick={onSubmitAnswer}>
            Ответить
          </Button>
        </div>
      </div>

      {isSlowAnswerHintVisible ? (
        <div className="pointer-events-none fixed bottom-0 right-0 z-60">
          <motion.img
            src={readingLottiImage}
            alt="Reading Lotti"
            className="pointer-events-none select-none h-auto w-[min(34vw,460px)] sm:w-[min(36vw,520px)] md:w-[min(40vw,620px)]"
            initial={{ y: 24, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
            draggable={false}
          />

          <motion.div
            className="absolute right-[8%] top-[66%] w-[min(26vw,360px)]"
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.24, delay: 0.06, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="rounded-2xl border border-slate-200 bg-white/95 p-3 shadow-lg sm:p-4 md:p-5">
              <p className="text-center text-sm font-semibold leading-snug text-slate-900 sm:text-base md:text-lg">
                Отвечай скорее
              </p>
            </div>
          </motion.div>
        </div>
      ) : null}
    </>
  );
}
