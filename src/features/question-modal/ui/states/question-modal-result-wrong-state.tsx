import { X } from "@/shared/ui/icons";

import { Button } from "@/shared/components/ui/button";

type QuestionModalResultWrongStateProps = {
  answerText?: string;
  showCorrectAnswer?: boolean;
  onContinue: () => void;
};

export function QuestionModalResultWrongState({
  answerText,
  showCorrectAnswer = false,
  onContinue,
}: QuestionModalResultWrongStateProps) {
  return (
    <div className="space-y-6 text-center animate-in zoom-in w-full max-w-xl">
      <div className="inline-flex p-4 rounded-full mb-4 bg-red-100 text-red-600">
        <X className="w-12 h-12" />
      </div>

      <h2 className="text-4xl font-black">Неверно</h2>

      {showCorrectAnswer && answerText ? (
        <div className="bg-muted p-6 rounded-xl border mt-8">
          <p className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-2">
            Правильный ответ
          </p>
          <p className="text-3xl font-black text-primary">{answerText}</p>
        </div>
      ) : null}

      <Button type="button" size="lg" className="mt-8 w-full" onClick={onContinue}>
        {showCorrectAnswer ? "Закрыть" : "Продолжить"}
      </Button>
    </div>
  );
}
