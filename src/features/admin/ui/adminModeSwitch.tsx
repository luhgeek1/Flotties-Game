import { Shield } from "@/shared/ui/icons";

import { Switch } from "@/shared/components/ui/switch";
import { cn } from "@/shared/lib/utils";

import { useAdminMode } from "../model";

type AdminModeSwitchProps = {
  className?: string;
};

export function AdminModeSwitch({ className }: AdminModeSwitchProps) {
  const { isAdminMode, setIsAdminMode } = useAdminMode();

  return (
    <label
      className={cn(
        "inline-flex h-8 items-center gap-2 rounded-full border border-border bg-card/80 px-3 text-xs font-semibold uppercase tracking-wide backdrop-blur transition-colors hover:bg-card",
        className,
      )}
    >
      <Shield className="h-3.5 w-3.5" />
      <span>Admin</span>
      <Switch
        size="sm"
        checked={isAdminMode}
        onCheckedChange={setIsAdminMode}
        aria-label="Toggle admin mode"
      />
    </label>
  );
}
