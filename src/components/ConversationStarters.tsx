"use client";

import { motion } from "framer-motion";
import { Sparkles, Hash, Star, MessageCircle, Globe, Flame, Droplets, Mountain, Wind, Lock } from "lucide-react";
import { useTranslations } from "next-intl";
import type { ConversationStarter } from "@/lib/cosmic-conversation-starters";

interface ConversationStartersProps {
  starters: ConversationStarter[];
  onSelect: (text: string) => void;
  maxVisible?: number;
}

function getIconComponent(icon: string) {
  switch (icon) {
    case "flame":
      return <Flame size={12} />;
    case "droplets":
      return <Droplets size={12} />;
    case "mountain":
      return <Mountain size={12} />;
    case "wind":
      return <Wind size={12} />;
    case "hash":
      return <Hash size={12} />;
    case "star":
      return <Star size={12} />;
    case "message-circle":
      return <MessageCircle size={12} />;
    case "globe":
      return <Globe size={12} />;
    case "sparkles":
    default:
      return <Sparkles size={12} />;
  }
}

function getTagColor(tag: ConversationStarter["tag"]): string {
  switch (tag) {
    case "Element Bond":
      return "text-teal-400 bg-teal-400/10 border-teal-400/20";
    case "Numerology":
      return "text-amber-400 bg-amber-400/10 border-amber-400/20";
    case "Zodiac":
      return "text-purple-400 bg-purple-400/10 border-purple-400/20";
    case "Prompt Reaction":
      return "text-indigo-400 bg-indigo-400/10 border-indigo-400/20";
    case "Chinese Zodiac":
      return "text-pink-400 bg-pink-400/10 border-pink-400/20";
    default:
      return "text-slate-400 bg-slate-400/10 border-slate-400/20";
  }
}

export default function ConversationStarters({ starters, onSelect, maxVisible }: ConversationStartersProps) {
  const t = useTranslations("starters");

  const visibleStarters = maxVisible !== undefined ? starters.slice(0, maxVisible) : starters;
  const lockedCount = maxVisible !== undefined ? Math.max(0, starters.length - maxVisible) : 0;

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-1.5 mb-2">
        <Sparkles size={12} className="text-amber-400" />
        <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
          {t("title")}
        </p>
      </div>

      <div className="flex flex-col gap-2">
        {visibleStarters.map((starter, i) => (
          <motion.button
            key={i}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + i * 0.08, type: "spring", stiffness: 300, damping: 25 }}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelect(starter.text)}
            className="glass-card rounded-2xl px-4 py-3 text-left hover:bg-white/5 transition-all group"
          >
            <div className="flex items-center gap-2 mb-1.5">
              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-semibold border ${getTagColor(starter.tag)}`}>
                {getIconComponent(starter.icon)}
                {starter.tag}
              </span>
            </div>
            <p className="text-xs text-slate-300 group-hover:text-white leading-relaxed transition-colors">
              {starter.text}
            </p>
          </motion.button>
        ))}

        {lockedCount > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + visibleStarters.length * 0.08 }}
            className="flex items-center justify-center gap-2 py-3 glass-card rounded-2xl border border-amber-400/20"
          >
            <Lock size={12} className="text-amber-400" />
            <span className="text-xs text-amber-400 font-semibold">
              {t("unlockMore", { count: lockedCount })}
            </span>
          </motion.div>
        )}
      </div>
    </div>
  );
}
