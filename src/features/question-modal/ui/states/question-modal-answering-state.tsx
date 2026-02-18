import { User } from "lucide-react";

import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";

type QuestionModalAnsweringStateProps = {
  playerName: string;
  playerAvatarUrl: string | null;
  questionText: string;
  answerInput: string;
  onAnswerInputChange: (value: string) => void;
  onSubmitAnswer: () => void;
};

export function QuestionModalAnsweringState({
  playerName,
  playerAvatarUrl,
  questionText,
  answerInput,
  onAnswerInputChange,
  onSubmitAnswer,
}: QuestionModalAnsweringStateProps) {
  return (
    <div className="w-full max-w-2xl space-y-8 animate-in slide-in-from-bottom-10">
      <div className="flex items-center justify-center gap-4 mb-4">
        <div className="w-16 h-16 rounded-full border border-border overflow-hidden bg-background flex items-center justify-center">
          {playerAvatarUrl ? (
            <img src={playerAvatarUrl} alt={playerName} className="h-full w-full object-cover" />
          ) : (
            <User className="w-8 h-8 text-primary" />
          )}
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
  );
}
