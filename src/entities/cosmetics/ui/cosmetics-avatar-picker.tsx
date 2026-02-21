import { motion } from "motion/react";

import { cn } from "@/shared/lib/utils";

import type { AvatarOption } from "../model/defaults";

type CosmeticsAvatarPickerProps = {
  options: AvatarOption[];
  selectedValue: string;
  onSelect: (value: string) => void;
  isDarkSurface?: boolean;
  className?: string;
};

export function CosmeticsAvatarPicker({
  options,
  selectedValue,
  onSelect,
  isDarkSurface = false,
  className,
}: CosmeticsAvatarPickerProps) {
  return (
    <div className={cn("flex justify-center gap-3 w-full", className)}>
      {options.map(option => {
        const isSelected = selectedValue === option.value;

        return (
          <motion.button
            key={option.value}
            type="button"
            onClick={() => onSelect(option.value)}
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.98 }}
            className={cn(
              "w-12 h-12 rounded-full flex items-center justify-center transition-all border-2 relative overflow-hidden bg-transparent",
              isSelected
                ? isDarkSurface
                  ? "border-slate-100 ring-1 ring-slate-100 scale-110 z-10"
                  : "border-slate-900 ring-1 ring-slate-900 scale-110 z-10"
                : isDarkSurface
                  ? "border-transparent hover:bg-slate-700/70"
                  : "border-transparent hover:bg-slate-100",
            )}
          >
            <img src={option.value} alt="Preset avatar" className="h-full w-full object-cover rounded-full" />
          </motion.button>
        );
      })}
    </div>
  );
}
