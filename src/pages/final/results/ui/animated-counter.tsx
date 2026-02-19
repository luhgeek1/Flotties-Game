import { animate, motion, useMotionValue, useTransform } from "motion/react";
import { useEffect } from "react";

type AnimatedCounterProps = {
  from: number;
  to: number;
  play: boolean;
};

export function AnimatedCounter({ from, to, play }: AnimatedCounterProps) {
  const count = useMotionValue(from);
  const rounded = useTransform(count, latest => Math.round(latest));

  useEffect(() => {
    count.set(from);

    if (!play) {
      count.set(to);
      return;
    }

    const controls = animate(count, to, {
      duration: 0.8,
      ease: "easeInOut",
      delay: 0.1,
    });

    return () => {
      controls.stop();
    };
  }, [count, from, play, to]);

  return <motion.span className="tabular-nums tracking-tight">{rounded}</motion.span>;
}
