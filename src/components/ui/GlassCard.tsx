"use client";

import { motion, type HTMLMotionProps } from "framer-motion";
import { forwardRef, type ReactNode } from "react";

type GlassTier = "default" | "strong" | "subtle";

const tierClass: Record<GlassTier, string> = {
  default: "glass-card",
  strong: "glass-card-strong",
  subtle: "glass-card-subtle",
};

interface GlassCardProps extends Omit<HTMLMotionProps<"div">, "children"> {
  tier?: GlassTier;
  as?: "div" | "button";
  className?: string;
  children: ReactNode;
}

const GlassCard = forwardRef<HTMLDivElement, GlassCardProps>(
  ({ tier = "default", as = "div", className = "", children, ...props }, ref) => {
    const base = `${tierClass[tier]} rounded-2xl ${className}`;

    if (as === "button") {
      return (
        <motion.div
          ref={ref}
          role="button"
          tabIndex={0}
          className={`${base} cursor-pointer`}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          {...props}
        >
          {children}
        </motion.div>
      );
    }

    return (
      <motion.div ref={ref} className={base} {...props}>
        {children}
      </motion.div>
    );
  }
);

GlassCard.displayName = "GlassCard";
export default GlassCard;
