"use client";

import { User, Heart, Briefcase, Sparkles } from "lucide-react";
import type { AppMode } from "@/types/profile";

const modes: { key: AppMode; label: string; icon: typeof User; color: string; premium: boolean }[] = [
  { key: "personal", label: "Personal", icon: User, color: "text-mode-personal", premium: false },
  { key: "attraction", label: "Attraction", icon: Heart, color: "text-mode-attraction", premium: false },
  { key: "business", label: "Business", icon: Briefcase, color: "text-mode-business", premium: true },
  { key: "partner", label: "Partner", icon: Sparkles, color: "text-mode-partner", premium: true },
];

interface ModeSelectorProps {
  activeMode: AppMode;
  onModeChange: (mode: AppMode) => void;
}

export default function ModeSelector({ activeMode, onModeChange }: ModeSelectorProps) {
  return (
    <div className="flex gap-1 p-1 rounded-2xl glass-card w-full max-w-md mx-auto">
      {modes.map(({ key, label, icon: Icon, color, premium }) => {
        const isActive = activeMode === key;
        return (
          <button
            key={key}
            onClick={() => onModeChange(key)}
            className={`flex-1 flex flex-col items-center gap-1 py-2.5 px-2 rounded-xl transition-all duration-300 relative ${
              isActive
                ? `bg-white/10 ${color}`
                : "text-slate-500 hover:text-slate-300 hover:bg-white/5"
            }`}
          >
            <Icon size={18} />
            <span className="text-[11px] font-medium">{label}</span>
            {premium && (
              <span className="absolute -top-1 -right-1 text-[8px] bg-amber-accent text-black font-bold px-1.5 py-0.5 rounded-full">
                PRO
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
