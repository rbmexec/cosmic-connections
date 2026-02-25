"use client";

import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";
import type { Prompt } from "@/types/profile";

interface PromptDisplayProps {
  prompts: Prompt[];
  accentClass?: string;
  showCommentIcon?: boolean;
  onCommentClick?: (index: number) => void;
}

export default function PromptDisplay({ prompts, accentClass = "text-mode-attraction", showCommentIcon, onCommentClick }: PromptDisplayProps) {
  if (prompts.length === 0) return null;

  return (
    <div className="space-y-2.5">
      {prompts.map((prompt, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 + i * 0.08 }}
          className="p-3.5 rounded-2xl glass-card-strong relative group"
        >
          <p className={`text-[10px] ${accentClass} font-semibold uppercase tracking-wider mb-1`}>
            {prompt.question}
          </p>
          <p className="text-[13px] text-slate-200 leading-relaxed">{prompt.answer}</p>
          {showCommentIcon && onCommentClick && (
            <button
              onClick={() => onCommentClick(i)}
              className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-full hover:bg-white/10"
            >
              <MessageCircle size={14} className="text-slate-400" />
            </button>
          )}
        </motion.div>
      ))}
    </div>
  );
}
