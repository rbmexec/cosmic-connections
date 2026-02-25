"use client";

import { type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

type OverlayVariant = "standard" | "fullscreen";

interface FullScreenOverlayProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  titleIcon?: ReactNode;
  variant?: OverlayVariant;
  children: ReactNode;
}

export default function FullScreenOverlay({
  open,
  onClose,
  title,
  titleIcon,
  variant = "standard",
  children,
}: FullScreenOverlayProps) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50"
        >
          {/* Backdrop */}
          <div
            className={`absolute inset-0 ${
              variant === "fullscreen"
                ? "bg-black/95"
                : "bg-black/90 backdrop-blur-md"
            }`}
          />

          {/* Content */}
          <div className="relative z-10 max-w-lg mx-auto px-4 pt-5 h-full overflow-y-auto pb-20">
            {/* Header */}
            {(title || variant !== "fullscreen") && (
              <div className="flex items-center justify-between mb-4">
                {title && (
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    {titleIcon}
                    {title}
                  </h2>
                )}
                <button
                  onClick={onClose}
                  className="text-slate-400 hover:text-white text-sm transition-colors ml-auto"
                >
                  Close
                </button>
              </div>
            )}
            {children}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
