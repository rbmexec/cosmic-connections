"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, MessageCircle, X } from "lucide-react";
import type { UserProfile } from "@/types/profile";

interface MatchModalProps {
  profile: UserProfile | null;
  onClose: () => void;
}

export default function MatchModal({ profile, onClose }: MatchModalProps) {
  return (
    <AnimatePresence>
      {profile && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="glass-card rounded-3xl p-8 max-w-sm w-full text-center"
          >
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Sparkles size={48} className="text-mode-partner mx-auto mb-4" />
            </motion.div>
            <h2 className="text-3xl font-bold font-serif bg-gradient-to-r from-mode-partner to-mode-personal bg-clip-text text-transparent">
              It&apos;s a Match!
            </h2>
            <p className="text-slate-400 mt-2 text-sm">
              You and {profile.name} are cosmically aligned
            </p>
            <img
              src={profile.photo}
              alt={profile.name}
              className="w-24 h-24 rounded-full object-cover mx-auto mt-5 ring-2 ring-mode-partner/50"
            />
            <p className="mt-3 font-medium">{profile.name}, {profile.age}</p>
            <p className="text-xs text-slate-400">
              {profile.westernZodiac.symbol} {profile.westernZodiac.sign} &middot; {profile.chineseZodiac.fullName} &middot; Life Path {profile.lifePath}
            </p>
            <div className="flex gap-3 mt-6">
              <button onClick={onClose} className="flex-1 py-3 rounded-2xl border border-slate-600 text-sm font-medium hover:bg-white/5 transition-colors">
                Keep Swiping
              </button>
              <button onClick={onClose} className="flex-1 py-3 rounded-2xl bg-mode-partner text-white text-sm font-medium flex items-center justify-center gap-2 hover:opacity-90 transition-opacity">
                <MessageCircle size={16} />
                Message
              </button>
            </div>
            <button onClick={onClose} className="absolute top-4 right-4 text-slate-500 hover:text-white">
              <X size={20} />
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
