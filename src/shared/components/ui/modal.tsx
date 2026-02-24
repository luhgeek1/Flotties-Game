import { type ReactNode, useEffect } from "react";
import { X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

import { cn } from "@/shared/lib/utils";
import { Button } from "./button";

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  contentClassName?: string;
};

let openedModalsCount = 0;
let previousBodyOverflow = "";
let previousBodyPaddingRight = "";

export function Modal({
  isOpen,
  onClose,
  title,
  children,
  contentClassName,
}: ModalProps) {
  useEffect(() => {
    if (!isOpen || typeof document === "undefined") {
      return;
    }

    const body = document.body;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

    openedModalsCount += 1;

    if (openedModalsCount === 1) {
      previousBodyOverflow = body.style.overflow;
      previousBodyPaddingRight = body.style.paddingRight;
      body.style.overflow = "hidden";

      if (scrollbarWidth > 0) {
        body.style.paddingRight = `${scrollbarWidth}px`;
      }
    }

    return () => {
      openedModalsCount = Math.max(0, openedModalsCount - 1);

      if (openedModalsCount === 0) {
        body.style.overflow = previousBodyOverflow;
        body.style.paddingRight = previousBodyPaddingRight;
      }
    };
  }, [isOpen]);

  return (
    <AnimatePresence initial={false}>
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
              "w-full max-w-md rounded-3xl border shadow-2xl p-6 md:p-7 max-h-[90vh] overflow-y-auto bg-card text-card-foreground",
              contentClassName,
            )}
            onClick={event => event.stopPropagation()}
          >
            <div className="flex items-center justify-between gap-3 mb-4">
              <h3 className="text-xl font-black">{title}</h3>

              <Button
                type="button"
                size="icon"
                variant="ghost"
                className="h-8 w-8 text-current/60 hover:text-current"
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
