import { User } from "lucide-react";
import { useState, type ReactNode } from "react";

import { cn } from "@/shared/lib/utils";

type PlayerAvatarProps = {
  value: string | null;
  alt: string;
  className?: string;
  fallback?: ReactNode;
};

export function PlayerAvatar({
  value,
  alt,
  className,
  fallback,
}: PlayerAvatarProps) {
  const [failedValue, setFailedValue] = useState<string | null>(null);
  const fallbackNode = fallback ?? <User className="w-6 h-6" />;

  if (!value || failedValue === value) {
    return (
      <div className={cn("h-full w-full flex items-center justify-center", className)}>
        {fallbackNode}
      </div>
    );
  }

  return (
    <img
      src={value}
      alt={alt}
      className={cn("h-full w-full object-cover", className)}
      onError={() => setFailedValue(value)}
    />
  );
}
