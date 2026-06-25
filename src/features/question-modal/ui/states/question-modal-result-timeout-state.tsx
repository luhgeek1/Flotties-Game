import { X } from "@/shared/ui/icons";

import { Button } from "@/shared/components/ui/button";

type QuestionModalResultTimeoutStateProps = {
  answerText: string;
  isTimeoutByClock: boolean;
  showCorrectAnswer?: boolean;
  onContinue: () => void;
};

export function QuestionModalResultTimeoutState({
  answerText,
  isTimeoutByClock,
  showCorrectAnswer = true,
  onContinue,
}: QuestionModalResultTimeoutStateProps) {
  return (
    <div className="space-y-6 text-center animate-in zoom-in w-full max-w-xl">
      <div className="inline-flex p-4 rounded-full mb-4 bg-red-100 text-red-600">
        <X className="w-12 h-12" />
      </div>

      <h2 className="text-4xl font-black">
        {isTimeoutByClock ? "Время вышло" : "Никто не ответил"}
      </h2>

      {showCorrectAnswer ? (
        <div className="bg-muted p-6 rounded-xl border mt-8">
          <p className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-2">
            Правильный ответ
          </p>
          <p className="text-3xl font-black text-primary">{answerText}</p>
        </div>
      ) : null}

      <Button type="button" size="lg" className="mt-8 w-full" onClick={onContinue}>
        Продолжить
      </Button>
    </div>
  );
}
