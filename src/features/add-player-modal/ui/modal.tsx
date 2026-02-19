import { X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import type { ReactNode } from "react";

import { Button } from "@/shared/components/ui/button";
import { cn } from "@/shared/lib/utils";

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  contentClassName?: string;
};

export function Modal({ isOpen, onClose, title, children, contentClassName }: ModalProps) {
  return (
    <AnimatePresence>
      {isOpen ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-70 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.96, opacity: 0, y: 14 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.96, opacity: 0, y: 14 }}
            transition={{ duration: 0.2 }}
            className={cn(
              "w-full max-w-md rounded-3xl border border-slate-200 shadow-2xl p-6 md:p-7 max-h-[90vh] overflow-y-auto",
              contentClassName,
            )}
            onClick={event => event.stopPropagation()}
          >
            <div className="flex items-center justify-between gap-3 mb-4">
              <h3 className="text-xl font-black text-slate-900">{title}</h3>

              <Button
                type="button"
                size="icon"
                variant="ghost"
                className="h-8 w-8 text-slate-500 hover:text-slate-900"
                onClick={onClose}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {children}
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
