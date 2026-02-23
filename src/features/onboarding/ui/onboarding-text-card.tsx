import type { ReactNode } from "react";

import { cn } from "@/shared/lib/utils";

type OnboardingTextCardProps = {
  className?: string;
  text?: string;
  textClassName?: string;
  children?: ReactNode;
};

export function OnboardingTextCard({
  className,
  text,
  textClassName,
  children,
}: OnboardingTextCardProps) {
  return (
    <div className={cn("rounded-[2rem] border border-slate-200 bg-white/95 shadow-lg", className)}>
      {text ? (
        <p className={cn("font-semibold leading-relaxed text-slate-900", textClassName)}>
          {text}
        </p>
      ) : null}
      {children}
    </div>
  );
}
