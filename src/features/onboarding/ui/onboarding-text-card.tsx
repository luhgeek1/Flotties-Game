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
      <p className="text-left text-xs font-semibold uppercase tracking-[0.08em] text-slate-400">
        Флотти
      </p>

      {text ? (
        <p className={cn("mt-1 font-semibold leading-relaxed text-slate-900", textClassName)}>
          {text}
        </p>
      ) : null}

      {children ? (
        <div className={text ? "mt-3" : "mt-2"}>
          {children}
        </div>
      ) : null}
    </div>
  );
}
