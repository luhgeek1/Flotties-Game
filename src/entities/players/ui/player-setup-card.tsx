import { CheckCircle2, Pencil, Trash2 } from "lucide-react";
import { motion } from "motion/react";

import { Button } from "@/shared/components/ui/button";
import { formatKeyCode } from "@/shared/lib/format-key-code";
import { cn } from "@/shared/lib/utils";
import { PlayerAvatar } from "./player-avatar";

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
  const currentStatus = isSelected ? status : "Не участвует";
  const canToggle = Boolean(onToggle) && !isDisabled;

  return (
    <motion.div
      layoutId={layoutId}
      onClick={canToggle ? onToggle : undefined}
      className={cn(
        "flex items-center justify-between rounded-xl border-2 p-3 transition-all duration-200",
        canToggle ? "cursor-pointer" : "cursor-default",
        isSelected ? "border-primary shadow-md" : "border-border shadow-sm",
        banner ?? "bg-background",
        !isSelected && isDisabled ? "opacity-45 grayscale" : "",
      )}
    >
      <div className="flex items-center gap-3">
        <div
          className={cn(
            "relative h-10 w-10 rounded-xl overflow-hidden border transition-colors",
            isSelected ? "border-primary/60" : "border-border"
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
          <span className={cn("text-base font-bold", isSelected ? "text-primary" : "text-foreground")}>
            {name}
          </span>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">{currentStatus}</span>
            {isSelected && keyCode ? (
              <kbd className="rounded border border-border bg-muted px-1.5 py-0.5 text-[11px] font-semibold uppercase leading-none text-muted-foreground">
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
          disabled={!onEdit || isDisabled}
          onClick={event => {
            event.stopPropagation();
            onEdit?.();
          }}
          className="h-9 w-9 text-muted-foreground hover:text-primary"
        >
          <Pencil className="h-4 w-4" />
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="icon"
          disabled={!onDelete || isDisabled}
          onClick={event => {
            event.stopPropagation();
            onDelete?.();
          }}
          className="h-9 w-9 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </motion.div>
  );
}
