import { CheckCircle2, Pencil, Trash2 } from "lucide-react";
import { motion } from "motion/react";

type PlayerSetupCardProps = {
  layoutId: string;
  name: string;
  status?: string;
  onEdit?: () => void;
  onDelete?: () => void;
};

export function PlayerSetupCard({
  layoutId,
  name,
  status = "Участвует",
  onEdit,
  onDelete,
}: PlayerSetupCardProps) {
  return (
    <motion.div
      layoutId={layoutId}
      className={`
        flex items-center justify-between p-3 rounded-xl border-2 transition-all duration-200 cursor-pointer
        border-primary bg-primary/5 shadow-md
      `}
    >
      <div className="flex items-center gap-3">
        <div
          className={`
            w-10 h-10 rounded-xl flex items-center justify-center transition-colors
            bg-primary text-primary-foreground
          `}
        >
          <CheckCircle2 className="w-5 h-5" />
        </div>

        <div className="flex flex-col">
          <span className="text-base font-bold text-primary">{name}</span>
          <span className="text-xs text-muted-foreground">{status}</span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onEdit}
          className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-9 w-9 text-muted-foreground/50 hover:text-primary"
        >
          <Pencil className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={onDelete}
          className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-9 w-9 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
}
