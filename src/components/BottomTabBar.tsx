"use client";

import { motion } from "framer-motion";
import { User, Flame, Briefcase, Heart, Users, MessageCircle, Lock } from "lucide-react";
import { useSubscription } from "@/lib/subscription-context";
import type { AppMode } from "@/types/profile";

const tabs: { key: AppMode; icon: typeof User; label: string }[] = [
  { key: "personal", icon: User, label: "You" },
  { key: "attraction", icon: Flame, label: "Discover" },
  { key: "business", icon: Briefcase, label: "Business" },
  { key: "partner", icon: Heart, label: "Partner" },
  { key: "friend", icon: Users, label: "Friends" },
  { key: "messages", icon: MessageCircle, label: "Messages" },
];

interface BottomTabBarProps {
  mode: AppMode;
  onModeChange: (mode: AppMode) => void;
  onUpgradeRequired?: (mode: AppMode) => void;
  unreadCount?: number;
}

export default function BottomTabBar({ mode, onModeChange, onUpgradeRequired, unreadCount }: BottomTabBarProps) {
  const { features } = useSubscription();

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40">
      <div className="max-w-lg mx-auto">
        <nav data-tour="tabs-modes" className="flex items-center justify-around px-2 py-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] bg-black border-t border-white/5">
          {tabs.map(({ key, icon: Icon, label }) => {
            const isActive = mode === key;
            const isLocked = !features.modes.includes(key);

            return (
              <button
                key={key}
                data-tour={`tab-${key}`}
                onClick={() => {
                  if (isLocked && onUpgradeRequired) {
                    onUpgradeRequired(key);
                  } else {
                    onModeChange(key);
                  }
                }}
                className="relative flex flex-col items-center gap-1 px-4 py-1.5 transition-colors"
              >
                <div className="relative">
                  <Icon
                    size={22}
                    className={isActive ? "text-violet-500" : isLocked ? "text-white/20" : "text-white/40"}
                  />
                  {isLocked && (
                    <Lock size={8} className="absolute -top-1 -right-1.5 text-white/30" />
                  )}
                  {key === "messages" && unreadCount !== undefined && unreadCount > 0 && (
                    <span className="absolute -top-1.5 -right-2 min-w-[16px] h-[16px] rounded-full bg-violet-500 text-white text-[9px] font-bold flex items-center justify-center px-1">
                      {unreadCount}
                    </span>
                  )}
                </div>
                <span
                  className={`text-[10px] tracking-wide ${
                    isActive ? "text-violet-500 font-medium" : isLocked ? "text-white/20" : "text-white/40"
                  }`}
                >
                  {label}
                </span>
                {isActive && (
                  <motion.div
                    layoutId="tab-indicator"
                    className="absolute -top-0.5 left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-full bg-violet-500"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
