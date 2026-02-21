import { motion } from "motion/react";

import { cn } from "@/shared/lib/utils";

import type { BannerOption } from "../model/defaults";

type CosmeticsBannerPickerProps = {
  options: BannerOption[];
  selectedValue: string;
  onSelect: (value: string) => void;
  isDarkTheme?: boolean;
  className?: string;
  selectedIndicatorLayoutId?: string;
};

export function CosmeticsBannerPicker({
  options,
  selectedValue,
  onSelect,
  isDarkTheme = false,
  className,
  selectedIndicatorLayoutId = "selectedBannerDot",
}: CosmeticsBannerPickerProps) {
  return (
    <div className={cn("grid grid-cols-5 gap-2", className)}>
      {options.map(option => {
        const isSelected = selectedValue === option.value;
        const isDefaultOption = option.value === "bg-white";
        const isDarkDefaultOption = isDarkTheme && isDefaultOption;
        const optionBannerClassName = isDefaultOption ? `${option.value} dark:bg-slate-800` : option.value;

        return (
          <motion.button
            key={option.id}
            type="button"
            title={option.label}
            onClick={() => onSelect(option.value)}
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.98 }}
            className={cn(
              "h-10 rounded-lg border-2 transition-all",
              optionBannerClassName,
              isSelected
                ? isDarkDefaultOption
                  ? "border-slate-100 ring-1 ring-slate-100 shadow-sm"
                  : "border-slate-900 ring-1 ring-slate-900 shadow-sm"
                : isDarkDefaultOption
                  ? "border-transparent hover:border-slate-500"
                  : "border-transparent hover:border-slate-300",
            )}
          >
            {isSelected ? (
              <motion.div layoutId={selectedIndicatorLayoutId} className="w-full h-full flex items-center justify-center">
                <div
                  className={cn(
                    "w-2 h-2 rounded-full",
                    isDarkDefaultOption ? "bg-slate-100" : "bg-slate-900",
                  )}
                />
              </motion.div>
            ) : null}
          </motion.button>
        );
      })}
    </div>
  );
}
