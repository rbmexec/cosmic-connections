import { type ReactNode } from "react";

type BadgeVariant = "default" | "amber" | "purple" | "green" | "red" | "blue" | "pink";

const variantStyles: Record<BadgeVariant, string> = {
  default: "bg-white/10 text-slate-300 border-white/10",
  amber: "bg-amber-400/15 text-amber-300 border-amber-400/20",
  purple: "bg-purple-400/15 text-purple-300 border-purple-400/20",
  green: "bg-emerald-400/15 text-emerald-300 border-emerald-400/20",
  red: "bg-red-400/15 text-red-300 border-red-400/20",
  blue: "bg-blue-400/15 text-blue-300 border-blue-400/20",
  pink: "bg-pink-400/15 text-pink-300 border-pink-400/20",
};

interface BadgeProps {
  variant?: BadgeVariant;
  className?: string;
  children: ReactNode;
}

export default function Badge({ variant = "default", className = "", children }: BadgeProps) {
  return (
    <span
      className={`cosmic-tag border inline-flex items-center gap-1 ${variantStyles[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
