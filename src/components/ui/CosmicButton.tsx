"use client";

import { motion, type HTMLMotionProps } from "framer-motion";
import { forwardRef, type ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger" | "cosmic";
type ButtonSize = "sm" | "md" | "lg";

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-gradient-to-r from-amber-500 to-amber-600 text-black font-semibold shadow-lg shadow-amber-500/20",
  secondary:
    "border border-slate-600 text-slate-200 hover:border-slate-500 hover:bg-white/5",
  ghost:
    "text-slate-400 hover:text-white hover:bg-white/5",
  danger:
    "bg-red-500/20 border border-red-500/30 text-red-400 hover:bg-red-500/30",
  cosmic:
    "bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold shadow-lg shadow-purple-500/20",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "px-3 py-1.5 text-xs rounded-lg gap-1.5",
  md: "px-4 py-2.5 text-sm rounded-xl gap-2",
  lg: "px-6 py-3 text-base rounded-xl gap-2.5",
};

interface CosmicButtonProps extends Omit<HTMLMotionProps<"button">, "children"> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: ReactNode;
  fullWidth?: boolean;
  disabled?: boolean;
  children: ReactNode;
}

const CosmicButton = forwardRef<HTMLButtonElement, CosmicButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      icon,
      fullWidth = false,
      disabled = false,
      className = "",
      children,
      ...props
    },
    ref
  ) => {
    return (
      <motion.button
        ref={ref}
        className={`
          inline-flex items-center justify-center transition-colors
          ${variantStyles[variant]}
          ${sizeStyles[size]}
          ${fullWidth ? "w-full" : ""}
          ${disabled ? "opacity-50 pointer-events-none" : ""}
          ${className}
        `}
        whileHover={disabled ? undefined : { scale: 1.03 }}
        whileTap={disabled ? undefined : { scale: 0.97 }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
        disabled={disabled}
        {...props}
      >
        {icon && <span className="shrink-0">{icon}</span>}
        {children}
      </motion.button>
    );
  }
);

CosmicButton.displayName = "CosmicButton";
export default CosmicButton;
