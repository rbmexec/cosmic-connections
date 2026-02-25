"use client";

import { motion, type HTMLMotionProps } from "framer-motion";
import { forwardRef, type ReactNode } from "react";

interface IconButtonProps extends Omit<HTMLMotionProps<"button">, "children"> {
  icon: ReactNode;
  label?: string;
  className?: string;
}

const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ icon, label, className = "", ...props }, ref) => {
    return (
      <motion.button
        ref={ref}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
        className={`w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-all ${className}`}
        aria-label={label}
        {...props}
      >
        {icon}
      </motion.button>
    );
  }
);

IconButton.displayName = "IconButton";
export default IconButton;
