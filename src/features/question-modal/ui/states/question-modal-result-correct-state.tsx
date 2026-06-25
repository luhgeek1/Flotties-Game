import { Check } from "@/shared/ui/icons";

type QuestionModalResultCorrectStateProps = {
  answerText: string;
};

export function QuestionModalResultCorrectState({
  answerText,
}: QuestionModalResultCorrectStateProps) {
  return (
    <div className="space-y-6 text-center animate-in zoom-in">
      <div className="inline-flex p-4 rounded-full mb-4 bg-green-100 text-green-600">
        <Check className="w-12 h-12" />
      </div>

      <h2 className="text-4xl font-black">Верно!</h2>

      <div className="bg-muted p-6 rounded-xl border mt-8">
        <p className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-2">
          Правильный ответ
        </p>
        <p className="text-3xl font-black text-primary">{answerText}</p>
      </div>
    </div>
  );
}
