import { User } from "lucide-react";
import type { ReactNode } from "react";

import { cn } from "@/shared/lib/utils";

type PlayerAvatarProps = {
  value: string | null;
  alt: string;
  className?: string;
  emojiClassName?: string;
  fallback?: ReactNode;
};

function isImageAvatar(value: string) {
  return (
    value.startsWith("data:image")
    || value.startsWith("blob:")
    || value.startsWith("http://")
    || value.startsWith("https://")
    || value.startsWith("/")
  );
}

export function PlayerAvatar({
  value,
  alt,
  className,
  emojiClassName,
  fallback,
}: PlayerAvatarProps) {
  if (!value) {
    return (
      <div className={cn("h-full w-full flex items-center justify-center", className)}>
        {fallback ?? <User className="w-6 h-6" />}
      </div>
    );
  }

  if (isImageAvatar(value)) {
    return <img src={value} alt={alt} className={cn("h-full w-full object-cover", className)} />;
  }

  return (
    <div className={cn("h-full w-full flex items-center justify-center text-2xl", className, emojiClassName)}>
      {value}
    </div>
  );
}
