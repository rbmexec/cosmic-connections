"use client";

import { motion } from "framer-motion";
import { User, Flame, Briefcase, Heart } from "lucide-react";
import type { AppMode } from "@/types/profile";

const modes: { key: AppMode; label: string; icon: typeof User; activeClass: string; glowClass: string; premium: boolean }[] = [
  { key: "personal", label: "Personal", icon: User, activeClass: "text-mode-personal bg-mode-personal/15", glowClass: "glow-personal", premium: false },
  { key: "attraction", label: "Attraction", icon: Flame, activeClass: "text-mode-attraction bg-mode-attraction/15", glowClass: "glow-attraction", premium: false },
  { key: "business", label: "Business", icon: Briefcase, activeClass: "text-mode-business bg-mode-business/15", glowClass: "glow-business", premium: true },
  { key: "partner", label: "Partner", icon: Heart, activeClass: "text-mode-partner bg-mode-partner/15", glowClass: "glow-partner", premium: true },
];

interface ModeSelectorProps {
  activeMode: AppMode;
  onModeChange: (mode: AppMode) => void;
}

export default function ModeSelector({ activeMode, onModeChange }: ModeSelectorProps) {
  return (
    <div className="flex gap-1.5 p-1.5 rounded-2xl glass-card-strong w-full max-w-md mx-auto">
      {modes.map(({ key, label, icon: Icon, activeClass, glowClass, premium }) => {
        const isActive = activeMode === key;
        return (
          <button
            key={key}
            onClick={() => onModeChange(key)}
            className={`flex-1 flex flex-col items-center gap-1 py-2.5 px-2 rounded-xl transition-all duration-300 relative ${
              isActive ? `${activeClass} ${glowClass}` : "text-slate-500 hover:text-slate-300 hover:bg-white/5"
            }`}
          >
            {isActive && (
              <motion.div
                layoutId="mode-indicator"
                className="absolute inset-0 rounded-xl bg-white/5"
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
            <Icon size={18} className="relative z-10" />
            <span className="text-[10px] font-bold uppercase tracking-wider relative z-10">{label}</span>
            {premium && (
              <span className="absolute -top-1.5 -right-0.5 premium-badge">PRO</span>
            )}
          </button>
        );
      })}
    </div>
  );
}
