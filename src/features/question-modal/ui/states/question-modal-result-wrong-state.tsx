import { X } from "lucide-react";

import { Button } from "@/shared/components/ui/button";

type QuestionModalResultWrongStateProps = {
  onContinue: () => void;
};

export function QuestionModalResultWrongState({
  onContinue,
}: QuestionModalResultWrongStateProps) {
  return (
    <div className="space-y-6 text-center animate-in zoom-in w-full max-w-xl">
      <div className="inline-flex p-4 rounded-full mb-4 bg-red-100 text-red-600">
        <X className="w-12 h-12" />
      </div>

      <h2 className="text-4xl font-black">Неверно</h2>

      <Button type="button" size="lg" className="mt-8 w-full" onClick={onContinue}>
        Продолжить
      </Button>
    </div>
  );
}
