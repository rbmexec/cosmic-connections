"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Heart, X } from "lucide-react";
import { useTranslations } from "next-intl";
import type { Prompt } from "@/types/profile";

interface IcebreakerCommentInputProps {
  open: boolean;
  prompt: Prompt;
  onSendWithComment: (comment: string) => void;
  onJustLike: () => void;
  onClose: () => void;
}

export default function IcebreakerCommentInput({
  open,
  prompt,
  onSendWithComment,
  onJustLike,
  onClose,
}: IcebreakerCommentInputProps) {
  const t = useTranslations("icebreaker");
  const [comment, setComment] = useState("");

  const handleSendWithComment = () => {
    const trimmed = comment.trim();
    if (!trimmed) return;
    onSendWithComment(trimmed);
    setComment("");
  };

  const handleJustLike = () => {
    setComment("");
    onJustLike();
  };

  const handleClose = () => {
    setComment("");
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
            onClick={handleClose}
          />

          {/* Slide-up panel */}
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            transition={{ type: "spring", stiffness: 300, damping: 28 }}
            className="fixed bottom-0 left-0 right-0 z-50 px-4 pb-6 pt-2"
          >
            <div className="glass-card-strong rounded-[24px] p-5 max-w-md mx-auto border border-white/10 shadow-[0_-8px_40px_rgba(0,0,0,0.5)]">
              {/* Close button */}
              <button
                onClick={handleClose}
                className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors p-1 rounded-full hover:bg-white/10"
              >
                <X size={16} />
              </button>

              {/* Prompt display */}
              <div className="mb-4">
                <p className="text-[10px] text-amber-400 font-semibold uppercase tracking-wider mb-1">
                  {prompt.question}
                </p>
                <p className="text-sm text-slate-200 leading-relaxed">
                  {prompt.answer}
                </p>
              </div>

              {/* Comment input */}
              <div className="glass-card rounded-2xl p-2 flex items-center gap-2 mb-4 border border-white/5">
                <input
                  type="text"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSendWithComment()}
                  placeholder={t("commentPlaceholder")}
                  className="flex-1 bg-transparent text-sm text-white placeholder-slate-500 outline-none px-3 py-2"
                  autoFocus
                />
                <Send size={14} className="text-slate-500 mr-2" />
              </div>

              {/* Action buttons */}
              <div className="flex gap-3">
                <motion.button
                  onClick={handleSendWithComment}
                  disabled={!comment.trim()}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 text-white text-sm font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-all shadow-[0_4px_20px_rgba(245,158,11,0.3)] disabled:opacity-30"
                >
                  <Send size={14} />
                  {t("sendAndLike")}
                </motion.button>
                <motion.button
                  onClick={handleJustLike}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  className="flex-1 py-3 rounded-2xl border border-slate-600/50 text-slate-300 text-sm font-semibold flex items-center justify-center gap-2 hover:bg-white/5 transition-all"
                >
                  <Heart size={14} />
                  {t("justLike")}
                </motion.button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
