"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  ArrowLeft,
  Sparkles,
  Hash,
  Star,
  Globe2,
  CheckCircle2,
  AlertTriangle,
  MessageSquareHeart,
  Share2,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { generateReport } from "@/lib/report-generator";
import { lifePathData } from "@/lib/cosmic-calculations";
import type { UserProfile } from "@/types/profile";

function AnimatedNumber({ value, duration = 1200 }: { value: number; duration?: number }) {
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

function ScoreBar({ score, color, delay = 0 }: { score: number; color: string; delay?: number }) {
  return (
    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
      <motion.div
        className="h-full rounded-full"
        style={{ backgroundColor: color }}
        initial={{ width: 0 }}
        animate={{ width: `${score}%` }}
        transition={{ duration: 0.8, delay, ease: "easeOut" }}
      />
    </div>
  );
}

function getScoreColor(score: number): string {
  if (score >= 80) return "#10b981";
  if (score >= 60) return "#f59e0b";
  return "#ef4444";
}

interface CompatibilityReportProps {
  profile: UserProfile;
  currentUser: UserProfile;
  onClose: () => void;
}

export default function CompatibilityReport({
  profile,
  currentUser,
  onClose,
}: CompatibilityReportProps) {
  const t = useTranslations("report");
  const tc = useTranslations("common");

  const report = useMemo(
    () => generateReport(currentUser, profile),
    [currentUser, profile]
  );

  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const url = `${window.location.origin}/chart/${btoa(
      JSON.stringify({ a: currentUser.id, b: profile.id })
    )}`;

    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  const lpA = lifePathData[currentUser.lifePath];
  const lpB = lifePathData[profile.lifePath];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/95 overflow-y-auto"
      >
        {/* Header */}
        <div className="sticky top-0 z-10 glass-card-strong px-4 py-3 flex items-center justify-between border-b border-white/5">
          <button
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <span className="text-sm font-semibold text-white">{t("title")}</span>
          <button
            onClick={handleShare}
            className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
          >
            <Share2 size={18} />
          </button>
        </div>

        {/* Copied toast */}
        <AnimatePresence>
          {copied && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="fixed top-16 left-1/2 -translate-x-1/2 z-20 glass-card-strong rounded-full px-4 py-2"
            >
              <span className="text-xs text-green-400 font-semibold">{t("linkCopied")}</span>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="max-w-lg mx-auto px-4 py-6 space-y-6">
          {/* Dual photos + score */}
          <div className="text-center">
            <div className="relative flex items-center justify-center mb-4">
              <motion.img
                src={currentUser.photo}
                alt={currentUser.name}
                className="w-20 h-20 rounded-full object-cover ring-2 ring-amber-400/30 shadow-[0_0_20px_rgba(251,191,36,0.2)]"
                initial={{ x: 30, opacity: 0, scale: 0.8 }}
                animate={{ x: 0, opacity: 1, scale: 1 }}
                transition={{ delay: 0.1, type: "spring", stiffness: 300 }}
              />
              <motion.img
                src={profile.photo}
                alt={profile.name}
                className="w-20 h-20 rounded-full object-cover ring-2 ring-purple-400/30 shadow-[0_0_20px_rgba(168,85,247,0.2)] -ml-4"
                initial={{ x: -30, opacity: 0, scale: 0.8 }}
                animate={{ x: 0, opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 300 }}
              />
            </div>

            <p className="text-sm text-slate-400 mb-1">
              {currentUser.name} & {profile.name}
            </p>

            {/* Animated score */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: "spring" }}
            >
              <span
                className="text-5xl font-black"
                style={{ color: getScoreColor(report.overallScore) }}
              >
                <AnimatedNumber value={report.overallScore} />
              </span>
              <span className="text-2xl font-bold text-slate-500">%</span>
            </motion.div>

            <p className="text-xs text-slate-500 mt-1">{t("overallCompatibility")}</p>
          </div>

          {/* Numerology Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="glass-card rounded-2xl p-5"
          >
            <div className="flex items-center gap-2 mb-3">
              <Hash size={18} className="text-amber-400" />
              <h3 className="font-bold text-white">{tc("numerology")}</h3>
              <span className="ml-auto text-sm font-bold" style={{ color: getScoreColor(report.numerologySection.score) }}>
                {report.numerologySection.score}%
              </span>
            </div>
            <ScoreBar score={report.numerologySection.score} color={getScoreColor(report.numerologySection.score)} delay={0.5} />
            <div className="flex gap-4 mt-3 mb-3">
              <div className="text-center">
                <p className="text-xs text-amber-400/80 font-semibold">{currentUser.name}</p>
                <p className="text-[10px] text-slate-500">
                  LP {currentUser.lifePath} {lpA ? `- ${lpA.name}` : ""}
                </p>
              </div>
              <div className="text-center">
                <p className="text-xs text-purple-400/80 font-semibold">{profile.name}</p>
                <p className="text-[10px] text-slate-500">
                  LP {profile.lifePath} {lpB ? `- ${lpB.name}` : ""}
                </p>
              </div>
            </div>
            <p className="text-sm text-slate-300 leading-relaxed">
              {report.numerologySection.analysis}
            </p>
          </motion.div>

          {/* Western Zodiac Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="glass-card rounded-2xl p-5"
          >
            <div className="flex items-center gap-2 mb-3">
              <Star size={18} className="text-teal-400" />
              <h3 className="font-bold text-white">{tc("western")}</h3>
              <span className="ml-auto text-sm font-bold" style={{ color: getScoreColor(report.westernSection.score) }}>
                {report.westernSection.score}%
              </span>
            </div>
            <ScoreBar score={report.westernSection.score} color={getScoreColor(report.westernSection.score)} delay={0.6} />
            <div className="flex gap-4 mt-3 mb-3">
              <div className="text-center">
                <p className="text-lg">{currentUser.westernZodiac.symbol}</p>
                <p className="text-[10px] text-slate-500">
                  {currentUser.westernZodiac.sign} ({currentUser.westernZodiac.element})
                </p>
              </div>
              <div className="text-center">
                <p className="text-lg">{profile.westernZodiac.symbol}</p>
                <p className="text-[10px] text-slate-500">
                  {profile.westernZodiac.sign} ({profile.westernZodiac.element})
                </p>
              </div>
            </div>
            <p className="text-sm text-slate-300 leading-relaxed">
              {report.westernSection.analysis}
            </p>
          </motion.div>

          {/* Chinese Zodiac Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="glass-card rounded-2xl p-5"
          >
            <div className="flex items-center gap-2 mb-3">
              <Globe2 size={18} className="text-red-400" />
              <h3 className="font-bold text-white">{tc("chinese")}</h3>
              <span className="ml-auto text-sm font-bold" style={{ color: getScoreColor(report.chineseSection.score) }}>
                {report.chineseSection.score}%
              </span>
            </div>
            <ScoreBar score={report.chineseSection.score} color={getScoreColor(report.chineseSection.score)} delay={0.7} />
            <div className="flex gap-4 mt-3 mb-3">
              <div className="text-center">
                <p className="text-lg">{currentUser.chineseZodiac.symbol}</p>
                <p className="text-[10px] text-slate-500">{currentUser.chineseZodiac.fullName}</p>
              </div>
              <div className="text-center">
                <p className="text-lg">{profile.chineseZodiac.symbol}</p>
                <p className="text-[10px] text-slate-500">{profile.chineseZodiac.fullName}</p>
              </div>
            </div>
            <p className="text-sm text-slate-300 leading-relaxed">
              {report.chineseSection.analysis}
            </p>
          </motion.div>

          {/* Strengths */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="glass-card rounded-2xl p-5"
          >
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle2 size={18} className="text-green-400" />
              <h3 className="font-bold text-white">{t("strengths")}</h3>
            </div>
            <ul className="space-y-3">
              {report.strengths.map((strength, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 + i * 0.1 }}
                  className="flex items-start gap-2"
                >
                  <Sparkles size={14} className="text-green-400 shrink-0 mt-0.5" />
                  <span className="text-sm text-slate-300">{strength}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Challenges */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="glass-card rounded-2xl p-5"
          >
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle size={18} className="text-amber-400" />
              <h3 className="font-bold text-white">{t("challenges")}</h3>
            </div>
            <ul className="space-y-3">
              {report.challenges.map((challenge, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.9 + i * 0.1 }}
                  className="flex items-start gap-2"
                >
                  <AlertTriangle size={14} className="text-amber-400 shrink-0 mt-0.5" />
                  <span className="text-sm text-slate-300">{challenge}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Cosmic Advice */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="glass-card-strong rounded-2xl p-5 border border-purple-400/20 relative overflow-hidden"
          >
            <div className="absolute inset-0 shimmer pointer-events-none" />
            <div className="relative">
              <div className="flex items-center gap-2 mb-4">
                <MessageSquareHeart size={18} className="text-purple-400" />
                <h3 className="font-bold text-white">{t("cosmicAdvice")}</h3>
              </div>
              <p className="text-sm text-slate-300 leading-relaxed italic">
                {report.cosmicAdvice}
              </p>
            </div>
          </motion.div>

          {/* Share button */}
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleShare}
            className="w-full py-3.5 rounded-2xl glass-card border border-purple-400/20 flex items-center justify-center gap-2 hover:border-purple-400/40 transition-all"
          >
            <Share2 size={16} className="text-purple-400" />
            <span className="text-sm font-semibold text-purple-400">
              {copied ? t("linkCopied") : t("shareReport")}
            </span>
          </motion.button>

          {/* Bottom spacing */}
          <div className="h-8" />
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
