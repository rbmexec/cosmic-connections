"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, MessageCircle, X, Heart } from "lucide-react";
import { calculateCompatibility, lifePathData } from "@/lib/cosmic-calculations";
import type { UserProfile } from "@/types/profile";

const currentUser: UserProfile = {
  id: "0", name: "You", age: 28, birthYear: 1996, location: "NYC", occupation: "Engineer",
  photo: "", lifePath: 7,
  westernZodiac: { sign: "Virgo", symbol: "\u264D", element: "Earth" },
  chineseZodiac: { animal: "Rat", symbol: "\uD83D\uDC00", element: "Fire", elementColor: "#ef4444", elementSymbol: "\uD83D\uDD25", fullName: "Fire Rat" },
  prompts: [],
};

interface MatchModalProps {
  profile: UserProfile | null;
  onClose: () => void;
}

export default function MatchModal({ profile, onClose }: MatchModalProps) {
  if (!profile) return null;
  const compat = calculateCompatibility(currentUser, profile);
  const lp = lifePathData[profile.lifePath];

  return (
    <AnimatePresence>
      {profile && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md" />

          {/* Floating hearts */}
          {Array.from({ length: 12 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute text-mode-partner/30"
              initial={{
                x: Math.random() * (typeof window !== "undefined" ? window.innerWidth : 400),
                y: (typeof window !== "undefined" ? window.innerHeight : 800) + 20,
                rotate: Math.random() * 360,
                scale: Math.random() * 0.5 + 0.5,
              }}
              animate={{
                y: -100,
                rotate: Math.random() * 360,
                transition: { duration: Math.random() * 3 + 3, delay: Math.random() * 2, ease: "easeOut" },
              }}
            >
              <Heart size={Math.random() * 20 + 12} fill="currentColor" />
            </motion.div>
          ))}

          {/* Modal */}
          <motion.div
            initial={{ scale: 0.7, opacity: 0, y: 40 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.7, opacity: 0, y: 40 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            onClick={(e) => e.stopPropagation()}
            className="relative glass-card-strong rounded-[28px] p-8 max-w-sm w-full text-center glow-partner overflow-hidden"
          >
            {/* Shimmer overlay */}
            <div className="absolute inset-0 shimmer pointer-events-none" />

            <button onClick={onClose} className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors z-10">
              <X size={20} />
            </button>

            <motion.div
              animate={{ rotate: [0, 15, -15, 10, -10, 0] }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <Sparkles size={44} className="text-mode-partner mx-auto mb-3" />
            </motion.div>

            <h2 className="text-3xl font-bold text-gradient-cosmic">
              It&apos;s a Match!
            </h2>
            <p className="text-slate-400 mt-2 text-sm">
              The cosmos have aligned for you and {profile.name}
            </p>

            <div className="relative mt-6 mb-2">
              <img
                src={profile.photo}
                alt={profile.name}
                className="w-28 h-28 rounded-full object-cover mx-auto ring-3 ring-mode-partner/40 shadow-[0_0_30px_rgba(236,72,153,0.3)]"
              />
              <motion.div
                className="absolute -bottom-1 left-1/2 -translate-x-1/2 glass-card-strong rounded-full px-3 py-1"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5, type: "spring" }}
              >
                <span className="text-sm font-bold text-mode-partner">{compat.overall}%</span>
              </motion.div>
            </div>

            <p className="mt-4 text-lg font-semibold">{profile.name}, {profile.age}</p>
            <p className="text-xs text-slate-400 mt-1">
              {profile.westernZodiac.symbol} {profile.westernZodiac.sign} &middot; {profile.chineseZodiac.fullName} &middot; Path {profile.lifePath} ({lp?.name})
            </p>

            {/* Mini compatibility */}
            <div className="flex gap-2 mt-4 justify-center">
              <div className="glass-card rounded-xl px-3 py-2 text-center">
                <p className="text-xs font-bold text-mode-partner">{compat.lifePath}%</p>
                <p className="text-[8px] text-slate-500 uppercase">Numerology</p>
              </div>
              <div className="glass-card rounded-xl px-3 py-2 text-center">
                <p className="text-xs font-bold text-mode-personal">{compat.western}%</p>
                <p className="text-[8px] text-slate-500 uppercase">Western</p>
              </div>
              <div className="glass-card rounded-xl px-3 py-2 text-center">
                <p className="text-xs font-bold text-green-400">{compat.chinese}%</p>
                <p className="text-[8px] text-slate-500 uppercase">Chinese</p>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={onClose}
                className="flex-1 py-3 rounded-2xl border border-slate-600/50 text-sm font-semibold text-slate-300 hover:bg-white/5 transition-all"
              >
                Keep Swiping
              </button>
              <button
                onClick={onClose}
                className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-mode-partner to-pink-600 text-white text-sm font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-all shadow-[0_4px_15px_rgba(236,72,153,0.3)]"
              >
                <MessageCircle size={16} />
                Message
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
