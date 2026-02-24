import { cn } from "@/shared/lib/utils";

type PlayerAvatarProps = {
  value: string;
  alt: string;
  className?: string;
};

export function PlayerAvatar({
  value,
  alt,
  className,
}: PlayerAvatarProps) {
  return (
    <img
      src={value}
      alt={alt}
      className={cn("h-full w-full object-cover", className)}
      decoding="async"
    />
  );
}
