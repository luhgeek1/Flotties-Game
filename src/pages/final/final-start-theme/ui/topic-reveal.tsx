import { motion } from "motion/react";

import { Button } from "@/shared/components/ui/button";

type TopicRevealProps = {
  topic: string;
  onNext: () => void;
};

export function TopicReveal({ topic, onNext }: TopicRevealProps) {
  return (
    <div className="flex w-full max-w-5xl flex-col items-center justify-center gap-8 text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4"
      >
        <h2 className="text-xl font-medium uppercase tracking-widest text-muted-foreground">
          Тема финального раунда
        </h2>
        <h1 className="text-5xl font-bold tracking-tight text-foreground md:text-7xl">
          {topic}
        </h1>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        <Button size="lg" onClick={onNext} className="mt-8">
          Перейти к ставкам
        </Button>
      </motion.div>
    </div>
  );
}
