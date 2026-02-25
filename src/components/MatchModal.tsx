"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, MessageCircle, X, Heart, Star, Lock, FileText } from "lucide-react";
import VerifiedBadge from "@/components/VerifiedBadge";
import { calculateCompatibility, lifePathData, zodiacDescriptions } from "@/lib/cosmic-calculations";
import { useTranslations } from "next-intl";
import { useSubscription } from "@/lib/subscription-context";
import type { UserProfile } from "@/types/profile";

function AnimatedNumber({ value, duration = 1000 }: { value: number; duration?: number }) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const start = performance.now();
    const animate = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(eased * value));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [value, duration]);

  return <>{display}</>;
}

function getScoreColor(score: number): string {
  if (score >= 80) return "#10b981";
  if (score >= 60) return "#f59e0b";
  return "#ef4444";
}

interface MatchModalProps {
  profile: UserProfile | null;
  currentUser: UserProfile;
  matchId: string | null;
  onClose: () => void;
  onMessage: (profile: UserProfile, matchId: string) => void;
  onUpgradeRequired?: (trigger: string) => void;
  onViewReport?: (profile: UserProfile) => void;
}

export default function MatchModal({ profile, currentUser, matchId, onClose, onMessage, onUpgradeRequired, onViewReport }: MatchModalProps) {
  const t = useTranslations('match');
  const tc = useTranslations('common');
  const ts = useTranslations('subscription');
  const { features } = useSubscription();
  const compat = profile ? calculateCompatibility(currentUser, profile) : null;
  const lp = profile ? lifePathData[profile.lifePath] : null;
  const isExceptional = compat ? compat.overall >= 80 : false;

  const cosmicInsight = useMemo(() => {
    if (!profile) return "";
    const userElement = currentUser.westernZodiac.element;
    const profileElement = profile.westernZodiac.element;
    const profileSign = profile.westernZodiac.sign;
    const zodiac = zodiacDescriptions[profileSign];

    if (userElement === profileElement) {
      return `Your shared ${userElement} energy creates a deep, intuitive bond`;
    }
    if (zodiac?.compatibleSigns.includes(currentUser.westernZodiac.sign)) {
      return `${currentUser.westernZodiac.sign} and ${profileSign} are naturally drawn to each other`;
    }
    return `Your ${userElement} energy harmonizes with ${profile.name}'s ${profileElement} nature`;
  }, [currentUser, profile]);

  // Confetti particles for high matches
  const confettiParticles = useMemo(() => {
    if (!isExceptional) return [];
    return Array.from({ length: 24 }).map((_, i) => {
      const angle = (i / 24) * Math.PI * 2 + (Math.random() - 0.5) * 0.5;
      const distance = 120 + Math.random() * 180;
      const colors = ["#fbbf24", "#f59e0b", "#ec4899", "#a78bfa", "#10b981"];
      return {
        id: i,
        x: Math.cos(angle) * distance,
        y: Math.sin(angle) * distance - 60,
        rotate: Math.random() * 720 - 360,
        scale: Math.random() * 0.6 + 0.4,
        color: colors[i % colors.length],
        delay: Math.random() * 0.3,
        duration: 0.8 + Math.random() * 0.4,
        shape: i % 3, // 0=star, 1=circle, 2=diamond
      };
    });
  }, [isExceptional]);

  if (!profile || !compat || !lp) return null;

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
            initial={{ scale: 0.5, opacity: 0, y: 60 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.5, opacity: 0, y: 60 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            onClick={(e) => e.stopPropagation()}
            className="relative glass-card-strong rounded-[28px] p-8 max-w-sm w-full text-center glow-partner overflow-hidden"
          >
            {/* Shimmer overlay */}
            <div className="absolute inset-0 shimmer pointer-events-none" />

            {/* Confetti burst for exceptional matches */}
            {isExceptional && confettiParticles.map((p) => (
              <motion.div
                key={`confetti-${p.id}`}
                className="absolute pointer-events-none"
                style={{
                  left: "50%",
                  top: "40%",
                  width: p.shape === 0 ? 10 : 8,
                  height: p.shape === 0 ? 10 : 8,
                  backgroundColor: p.shape !== 0 ? p.color : "transparent",
                  borderRadius: p.shape === 1 ? "50%" : p.shape === 2 ? "2px" : "0",
                  transform: p.shape === 2 ? "rotate(45deg)" : "none",
                }}
                initial={{ x: 0, y: 0, opacity: 1, scale: 0 }}
                animate={{
                  x: p.x,
                  y: p.y,
                  opacity: [1, 1, 0],
                  scale: [0, p.scale, p.scale * 0.5],
                  rotate: p.rotate,
                }}
                transition={{ duration: p.duration, delay: 0.3 + p.delay, ease: "easeOut" }}
              >
                {p.shape === 0 && <Star size={10} fill={p.color} color={p.color} />}
              </motion.div>
            ))}

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
              {t('itsAMatch')}
            </h2>
            <p className="text-slate-400 mt-2 text-sm">
              {t('cosmosAligned', { name: profile.name })}
            </p>

            {/* Dual Photos */}
            <div className="relative mt-6 mb-2 flex items-center justify-center">
              {/* Current user photo (left, behind) */}
              <motion.img
                src={currentUser.photo}
                alt={currentUser.name}
                className="w-24 h-24 rounded-full object-cover ring-2 ring-amber-400/30 shadow-[0_0_20px_rgba(251,191,36,0.2)] relative z-10"
                initial={{ x: 30, opacity: 0, scale: 0.8 }}
                animate={{ x: 0, opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 300 }}
              />
              {/* Match photo (right, in front) */}
              <motion.img
                src={profile.photo}
                alt={profile.name}
                className="w-24 h-24 rounded-full object-cover ring-3 ring-mode-partner/40 shadow-[0_0_30px_rgba(236,72,153,0.3)] relative z-20 -ml-5"
                initial={{ x: -30, opacity: 0, scale: 0.8 }}
                animate={{ x: 0, opacity: 1, scale: 1 }}
                transition={{ delay: 0.3, type: "spring", stiffness: 300 }}
              />
              {/* Score badge centered */}
              <motion.div
                className="absolute -bottom-2 left-1/2 -translate-x-1/2 z-30 glass-card-strong rounded-full px-3 py-1"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5, type: "spring" }}
              >
                <span className="text-sm font-bold" style={{ color: getScoreColor(compat.overall) }}>
                  <AnimatedNumber value={compat.overall} />%
                </span>
              </motion.div>
            </div>

            <p className="mt-5 text-lg font-semibold flex items-center justify-center gap-1.5">
              {profile.name}, {profile.age}
              {profile.isVerified && <VerifiedBadge size="md" />}
            </p>
            <p className="text-xs text-slate-400 mt-1">
              {profile.westernZodiac.symbol} {profile.westernZodiac.sign} &middot; {profile.chineseZodiac.fullName} &middot; {tc('lifePath')} {profile.lifePath} ({lp?.name})
            </p>

            {/* Cosmic insight */}
            <motion.p
              className="text-[11px] text-slate-300/80 italic mt-2 px-4"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              {cosmicInsight}
            </motion.p>

            {isExceptional && (
              <motion.p
                className="text-[10px] font-semibold text-amber-400 mt-1"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
              >
                <Sparkles size={10} className="inline mr-1" />
                {t('exceptionalMatch')}
              </motion.p>
            )}

            {/* Mini compatibility - color coded (gated for free users) */}
            {features.showSubScores ? (
              <div className="flex gap-2 mt-4 justify-center">
                <div className="glass-card rounded-xl px-3 py-2 text-center">
                  <p className="text-xs font-bold" style={{ color: getScoreColor(compat.lifePath) }}>
                    <AnimatedNumber value={compat.lifePath} />%
                  </p>
                  <p className="text-[8px] text-slate-500 uppercase">{tc('numerology')}</p>
                </div>
                <div className="glass-card rounded-xl px-3 py-2 text-center">
                  <p className="text-xs font-bold" style={{ color: getScoreColor(compat.western) }}>
                    <AnimatedNumber value={compat.western} />%
                  </p>
                  <p className="text-[8px] text-slate-500 uppercase">{tc('western')}</p>
                </div>
                <div className="glass-card rounded-xl px-3 py-2 text-center">
                  <p className="text-xs font-bold" style={{ color: getScoreColor(compat.chinese) }}>
                    <AnimatedNumber value={compat.chinese} />%
                  </p>
                  <p className="text-[8px] text-slate-500 uppercase">{tc('chinese')}</p>
                </div>
              </div>
            ) : (
              <button
                onClick={() => onUpgradeRequired?.("subScores")}
                className="mt-4 flex items-center gap-2 mx-auto px-4 py-2 rounded-xl glass-card border border-amber-400/20 hover:border-amber-400/40 transition-colors"
              >
                <Lock size={12} className="text-amber-400" />
                <span className="text-xs text-amber-400 font-semibold">{ts("unlockSubScores")}</span>
              </button>
            )}

            {/* View Full Report — Cosmic+ */}
            {features.compatibilityReport && onViewReport ? (
              <button
                onClick={() => onViewReport(profile)}
                className="mt-4 flex items-center justify-center gap-2 mx-auto px-4 py-2 rounded-xl glass-card border border-purple-400/20 hover:border-purple-400/40 transition-colors"
              >
                <FileText size={12} className="text-purple-400" />
                <span className="text-xs text-purple-400 font-semibold">View Full Report</span>
              </button>
            ) : !features.compatibilityReport ? (
              <button
                onClick={() => onUpgradeRequired?.("compatibilityReport")}
                className="mt-4 flex items-center justify-center gap-2 mx-auto px-4 py-2 rounded-xl glass-card border border-purple-400/10 hover:border-purple-400/20 transition-colors"
              >
                <Lock size={12} className="text-purple-400/50" />
                <span className="text-xs text-purple-400/50 font-semibold">Full Report</span>
              </button>
            ) : null}

            <div className="flex gap-3 mt-6">
              <motion.button
                onClick={onClose}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
                className="flex-1 py-3 rounded-2xl border border-slate-600/50 text-sm font-semibold text-slate-300 hover:bg-white/5 transition-all"
              >
                {t('keepSwiping')}
              </motion.button>
              <motion.button
                onClick={() => matchId && onMessage(profile, matchId)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
                className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-mode-partner to-pink-600 text-white text-sm font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-all shadow-[0_4px_20px_rgba(236,72,153,0.35)]"
              >
                <MessageCircle size={16} />
                {t('message')}
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
