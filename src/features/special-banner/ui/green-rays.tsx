import { motion } from "motion/react";

const DEFAULT_RAY_COLOR = "#004225";

type GreenRaysProps = {
  color?: string;
};

export function GreenRays({ color = DEFAULT_RAY_COLOR }: GreenRaysProps) {
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden z-0">
      <motion.div
        className="opacity-40"
        initial={{ rotate: 0 }}
        animate={{ rotate: 360 }}
        transition={{ duration: 10, ease: "linear", repeat: Infinity }}
        style={{
          width: "200vmax",
          height: "200vmax",
          background: `repeating-conic-gradient(
            from 0deg,
            transparent 0deg 15deg,
            ${color} 15deg 30deg
          )`,
          maskImage: "radial-gradient(circle, black 20%, transparent 70%)",
          WebkitMaskImage: "radial-gradient(circle, black 20%, transparent 70%)",
        }}
      />

      <motion.div
        className="absolute rounded-full blur-3xl opacity-50"
        initial={{ opacity: 0.3, scale: 0.92 }}
        animate={{ opacity: 0.55, scale: 1 }}
        transition={{
          duration: 1.8,
          ease: "easeInOut",
          repeat: Infinity,
          repeatType: "mirror",
        }}
        style={{
          width: 500,
          height: 500,
          backgroundColor: color,
        }}
      />
    </div>
  );
}
