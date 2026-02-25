"use client";

import { motion, AnimatePresence } from "framer-motion";
import { User, Flame, Briefcase, Heart, MessageCircle, Lock } from "lucide-react";
import { useTranslations } from "next-intl";
import { useSubscription } from "@/lib/subscription-context";
import type { AppMode } from "@/types/profile";

const modes: { key: AppMode; labelKey: string; icon: typeof User; activeClass: string; glowClass: string; premium: boolean }[] = [
  { key: "personal", labelKey: "personal", icon: User, activeClass: "text-mode-personal bg-mode-personal/15", glowClass: "glow-personal", premium: false },
  { key: "attraction", labelKey: "attraction", icon: Flame, activeClass: "text-mode-attraction bg-mode-attraction/15", glowClass: "glow-attraction", premium: false },
  { key: "business", labelKey: "business", icon: Briefcase, activeClass: "text-mode-business bg-mode-business/15", glowClass: "glow-business", premium: true },
  { key: "partner", labelKey: "partner", icon: Heart, activeClass: "text-mode-partner bg-mode-partner/15", glowClass: "glow-partner", premium: true },
  { key: "messages", labelKey: "messages", icon: MessageCircle, activeClass: "text-mode-messages bg-mode-messages/15", glowClass: "glow-messages", premium: false },
];

interface ModeSelectorProps {
  activeMode: AppMode;
  onModeChange: (mode: AppMode) => void;
  onUpgradeRequired?: (mode: AppMode) => void;
  unreadCount?: number;
}

export default function ModeSelector({ activeMode, onModeChange, onUpgradeRequired, unreadCount }: ModeSelectorProps) {
  const t = useTranslations('modes');
  const tc = useTranslations('common');
  const { features } = useSubscription();

  return (
    <div className="flex gap-1.5 p-1.5 rounded-2xl glass-card-strong w-full max-w-md mx-auto">
      {modes.map(({ key, labelKey, icon: Icon, activeClass, glowClass, premium }) => {
        const isActive = activeMode === key;
        const isLocked = !features.modes.includes(key);
        return (
          <button
            key={key}
            onClick={() => {
              if (isLocked && onUpgradeRequired) {
                onUpgradeRequired(key);
              } else {
                onModeChange(key);
              }
            }}
            className={`flex-1 flex items-center justify-center gap-1.5 py-3 px-2 rounded-xl transition-all duration-300 relative ${
              isActive ? `${activeClass} ${glowClass}` : isLocked ? "text-slate-600 hover:text-slate-500" : "text-slate-500 hover:text-slate-300 hover:bg-white/5"
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
            <AnimatePresence>
              {isActive && (
                <motion.span
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: "auto", opacity: 1 }}
                  exit={{ width: 0, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  className="text-[10px] font-bold uppercase tracking-wider relative z-10 overflow-hidden whitespace-nowrap"
                >
                  {t(labelKey)}
                </motion.span>
              )}
            </AnimatePresence>
            {isLocked ? (
              <span className="absolute -top-1.5 -right-0.5">
                <Lock size={10} className="text-slate-500" />
              </span>
            ) : premium ? (
              <span className="absolute -top-1.5 -right-0.5 premium-badge">{tc('pro')}</span>
            ) : null}
            {key === "messages" && unreadCount !== undefined && unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] rounded-full bg-mode-messages text-white text-[10px] font-bold flex items-center justify-center px-1 z-20">
                {unreadCount}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
