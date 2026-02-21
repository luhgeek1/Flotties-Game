import { CheckCircle2, Pencil, Trash2 } from "lucide-react";
import { motion } from "motion/react";

import { Button } from "@/shared/components/ui/button";
import { formatKeyCode } from "@/shared/lib/format-key-code";
import { useTheme } from "@/shared/lib/use-theme";
import { cn } from "@/shared/lib/utils";
import { PlayerAvatar } from "./playerAvatar";

type PlayerSetupCardProps = {
  layoutId: string;
  name: string;
  avatarUrl: string;
  keyCode?: string;
  banner?: string;
  isSelected?: boolean;
  isDisabled?: boolean;
  status?: string;
  onToggle?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
};

export function PlayerSetupCard({
  layoutId,
  name,
  avatarUrl,
  keyCode,
  banner,
  isSelected = false,
  isDisabled = false,
  status = "Участвует",
  onToggle,
  onEdit,
  onDelete,
}: PlayerSetupCardProps) {
  const { isDark } = useTheme();
  const currentStatus = isSelected ? status : "Не участвует";
  const canToggle = Boolean(onToggle) && !isDisabled;
  const isDefaultBanner = banner === "bg-white";
  const isDarkDefaultBanner = isDark && isDefaultBanner;
  const resolvedBannerClassName = banner
    ? isDefaultBanner ? `${banner} dark:bg-slate-800` : banner
    : "bg-background";

  return (
    <motion.div
      layoutId={layoutId}
      onClick={canToggle ? onToggle : undefined}
      className={cn(
        "flex items-center justify-between rounded-xl border-2 p-3 transition-all duration-200",
        canToggle ? "cursor-pointer" : "cursor-default",
        isSelected
          ? "border-primary shadow-md"
          : isDarkDefaultBanner
            ? "border-border shadow-sm"
            : "border-slate-200 shadow-sm",
        resolvedBannerClassName,
        !isSelected && isDisabled ? "opacity-45 grayscale" : "",
      )}
    >
      <div className="flex items-center gap-3">
        <div
          className={cn(
            "relative h-10 w-10 rounded-xl overflow-hidden border transition-colors",
            isSelected
              ? "border-primary/60"
              : isDarkDefaultBanner
                ? "border-border"
                : "border-slate-300",
          )}
        >
          <PlayerAvatar value={avatarUrl} alt={name} />
          {isSelected ? (
            <span className="absolute -right-1 -bottom-1 rounded-full bg-primary p-0.5 text-primary-foreground">
              <CheckCircle2 className="h-3.5 w-3.5" />
            </span>
          ) : null}
        </div>

        <div className="flex flex-col">
          <span
            className={cn(
              "text-base font-bold",
              isDarkDefaultBanner
                ? isSelected ? "text-primary" : "text-foreground"
                : "text-slate-900",
            )}
          >
            {name}
          </span>
          <div className="flex items-center gap-2">
            <span className={cn(
              "text-xs",
              isDarkDefaultBanner ? "text-muted-foreground" : "text-slate-600",
            )}
            >
              {currentStatus}
            </span>
            {isSelected && keyCode ? (
              <kbd className={cn(
                "rounded border px-1.5 py-0.5 text-[11px] font-semibold uppercase leading-none",
                isDarkDefaultBanner
                  ? "border-border bg-muted text-muted-foreground"
                  : "border-slate-300 bg-slate-100 text-slate-600",
              )}
              >
                {formatKeyCode(keyCode)}
              </kbd>
            ) : null}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          disabled={!onEdit}
          onClick={event => {
            event.stopPropagation();
            onEdit?.();
          }}
          className={cn(
            "h-9 w-9",
            isDarkDefaultBanner ? "text-muted-foreground hover:text-primary" : "text-slate-500 hover:text-slate-900",
          )}
        >
          <Pencil className="h-4 w-4" />
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="icon"
          disabled={!onDelete}
          onClick={event => {
            event.stopPropagation();
            onDelete?.();
          }}
          className={cn(
            "h-9 w-9 hover:bg-destructive/10 hover:text-destructive",
            isDarkDefaultBanner ? "text-muted-foreground" : "text-slate-500",
          )}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </motion.div>
  );
}
