"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Heart, XCircle, MapPin, Briefcase, Sparkles } from "lucide-react";
import { calculateCompatibility, lifePathData } from "@/lib/cosmic-calculations";
import { useTranslations } from "next-intl";
import type { UserProfile } from "@/types/profile";

function getScoreColor(score: number): string {
  if (score >= 80) return "#10b981";
  if (score >= 60) return "#f59e0b";
  return "#ef4444";
}

interface DiscoveryProfileSheetProps {
  profile: UserProfile | null;
  currentUser: UserProfile;
  onLike: () => void;
  onPass: () => void;
  onClose: () => void;
}

export default function DiscoveryProfileSheet({
  profile,
  currentUser,
  onLike,
  onPass,
  onClose,
}: DiscoveryProfileSheetProps) {
  const t = useTranslations("discovery");
  const tc = useTranslations("common");

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
          className="fixed inset-0 z-50 flex items-end justify-center"
          onClick={onClose}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

          {/* Sheet */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            onClick={(e) => e.stopPropagation()}
            className="relative glass-card-strong rounded-t-[28px] w-full max-w-lg max-h-[85vh] overflow-y-auto pb-safe"
          >
            {/* Handle bar */}
            <div className="flex justify-center pt-3 pb-2">
              <div className="w-10 h-1 rounded-full bg-white/20" />
            </div>

            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors z-10"
            >
              <X size={20} />
            </button>

            {/* Profile photo */}
            <div className="px-6 pb-4">
              <div className="relative">
                <img
                  src={profile.photo}
                  alt={profile.name}
                  className="w-full aspect-square rounded-2xl object-cover"
                />
                {/* Score badge */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring" }}
                  className="absolute bottom-3 right-3 glass-card-strong rounded-full px-4 py-2 flex items-center gap-1.5"
                >
                  <Sparkles size={14} className="text-amber-400" />
                  <span
                    className="text-lg font-bold"
                    style={{ color: getScoreColor(compat.overall) }}
                  >
                    {compat.overall}%
                  </span>
                </motion.div>
              </div>

              {/* Name & basics */}
              <div className="mt-4">
                <h2 className="text-2xl font-bold text-white">
                  {profile.name}, {profile.age}
                </h2>
                <div className="flex items-center gap-2 mt-1 text-slate-400 text-sm">
                  <MapPin size={14} />
                  <span>{profile.location}</span>
                </div>
                <div className="flex items-center gap-2 mt-1 text-slate-400 text-sm">
                  <Briefcase size={14} />
                  <span>{profile.occupation}</span>
                </div>
              </div>

              {/* Zodiac badges */}
              <div className="flex flex-wrap gap-2 mt-4">
                <div className="glass-card rounded-full px-3 py-1 text-xs text-slate-300">
                  {profile.westernZodiac.symbol} {profile.westernZodiac.sign}
                </div>
                <div className="glass-card rounded-full px-3 py-1 text-xs text-slate-300">
                  {profile.chineseZodiac.symbol} {profile.chineseZodiac.fullName}
                </div>
                <div className="glass-card rounded-full px-3 py-1 text-xs text-slate-300">
                  {tc("lifePath")} {profile.lifePath}
                  {lp ? ` - ${lp.name}` : ""}
                </div>
              </div>

              {/* Compatibility sub-scores */}
              <div className="flex gap-2 mt-4">
                <div className="flex-1 glass-card rounded-xl p-3 text-center">
                  <p className="text-sm font-bold" style={{ color: getScoreColor(compat.lifePath) }}>
                    {compat.lifePath}%
                  </p>
                  <p className="text-[10px] text-slate-500 uppercase mt-0.5">{tc("numerology")}</p>
                </div>
                <div className="flex-1 glass-card rounded-xl p-3 text-center">
                  <p className="text-sm font-bold" style={{ color: getScoreColor(compat.western) }}>
                    {compat.western}%
                  </p>
                  <p className="text-[10px] text-slate-500 uppercase mt-0.5">{tc("western")}</p>
                </div>
                <div className="flex-1 glass-card rounded-xl p-3 text-center">
                  <p className="text-sm font-bold" style={{ color: getScoreColor(compat.chinese) }}>
                    {compat.chinese}%
                  </p>
                  <p className="text-[10px] text-slate-500 uppercase mt-0.5">{tc("chinese")}</p>
                </div>
              </div>

              {/* Prompts */}
              {profile.prompts.length > 0 && (
                <div className="mt-5 space-y-3">
                  {profile.prompts.map((prompt, i) => (
                    <div key={i} className="glass-card rounded-xl p-4">
                      <p className="text-[10px] text-amber-400/80 uppercase font-semibold tracking-wider mb-1">
                        {prompt.question}
                      </p>
                      <p className="text-sm text-slate-300 leading-relaxed">
                        {prompt.answer}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Action buttons */}
            <div className="sticky bottom-0 px-6 py-4 glass-card-strong border-t border-white/5">
              <div className="flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={onPass}
                  className="flex-1 py-3.5 rounded-2xl border border-slate-600/50 text-sm font-semibold text-slate-300 hover:bg-white/5 transition-all flex items-center justify-center gap-2"
                >
                  <XCircle size={18} />
                  {t("pass")}
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={onLike}
                  className="flex-1 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 text-white text-sm font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-all shadow-[0_4px_20px_rgba(245,158,11,0.3)]"
                >
                  <Heart size={18} fill="currentColor" />
                  {t("like")}
                </motion.button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
