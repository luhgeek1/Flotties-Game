import { AlertTriangle } from "@/shared/ui/icons";
import { AnimatePresence, motion } from "motion/react";

import { Button } from "@/shared/components/ui/button";

type ExitGameModalProps = {
  isOpen: boolean;
  onCancel?: () => void;
  onConfirm?: () => void;
  title?: string;
  description?: string;
  cancelLabel?: string;
  confirmLabel?: string;
};

export function ExitGameModal({
  isOpen,
  onCancel,
  onConfirm,
  title = "End game?",
  description = "Current progress will be lost. You will return to setup.",
  cancelLabel = "Cancel",
  confirmLabel = "End game",
}: ExitGameModalProps) {
  return (
    <AnimatePresence initial={false}>
      {isOpen ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-60 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4"
          onClick={onCancel}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            className="w-full max-w-sm bg-card border border-border rounded-xl shadow-2xl p-6"
            onClick={event => event.stopPropagation()}
          >
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center text-destructive mb-2">
                <AlertTriangle className="w-6 h-6" />
              </div>

              <div className="space-y-2">
                <h3 className="text-xl font-bold">{title}</h3>
                <p className="text-sm text-muted-foreground">
                  {description}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 w-full pt-4">
                <Button type="button" variant="outline" className="w-full" onClick={onCancel}>
                  {cancelLabel}
                </Button>
                <Button type="button" variant="destructive" className="w-full" onClick={onConfirm}>
                  {confirmLabel}
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
