"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles, Check, Crown, Zap } from "lucide-react";
import { useTranslations } from "next-intl";
import { useSubscription } from "@/lib/subscription-context";

interface UpgradeModalProps {
  open: boolean;
  onClose: () => void;
  trigger?: string;
}

const proFeatures = [
  "deepCosmicReading",
  "attractionCosmicAnalysis",
  "unlimitedConversations",
  "seeWhoLikedYou",
  "allModes",
  "unlimitedSwipes",
  "subScores",
  "cosmicBlueprint",
  "dailyForecast",
  "icebreakers",
  "circleAdds5",
  "extendedPrompts",
  "typingIndicators",
  "conversationStarters",
  "compatibilityQuiz",
  "eventsRsvp",
  "voiceNotes",
  "icebreakerComments",
  "referrals",
] as const;

const cosmicPlusExtras = [
  "circleAddsUnlimited",
  "allModesCosmic",
  "priorityInFeed",
  "undoLastSwipe",
  "monthlyReading",
  "videoIntros",
  "videoCall",
  "compatibilityReport",
  "retrogradeAlerts",
  "discoveryFilters",
  "quizComparison",
] as const;

export default function UpgradeModal({ open, onClose, trigger }: UpgradeModalProps) {
  const t = useTranslations("subscription");
  const { openCheckout } = useSubscription();
  const [billing, setBilling] = useState<"monthly" | "yearly">("monthly");

  const proMonthlyId = process.env.NEXT_PUBLIC_STRIPE_PRO_MONTHLY_PRICE_ID || "";
  const proYearlyId = process.env.NEXT_PUBLIC_STRIPE_PRO_YEARLY_PRICE_ID || "";
  const cosmicPlusId = process.env.NEXT_PUBLIC_STRIPE_COSMIC_PLUS_MONTHLY_PRICE_ID || "";

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md" />

          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 40 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 40 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            onClick={(e) => e.stopPropagation()}
            className="relative glass-card-strong rounded-[28px] p-6 max-w-md w-full max-h-[90vh] overflow-y-auto"
          >
            <button onClick={onClose} className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors z-10">
              <X size={20} />
            </button>

            <div className="text-center mb-5">
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
              >
                <Crown size={36} className="text-amber-400 mx-auto mb-2" />
              </motion.div>
              <h2 className="text-2xl font-bold text-gradient-cosmic">{t("title")}</h2>
              <p className="text-sm text-slate-400 mt-1">{t("subtitle")}</p>
              {trigger && (
                <p className="text-xs text-amber-400/80 mt-1">{t("triggerHint", { feature: trigger })}</p>
              )}
            </div>

            {/* Billing Toggle */}
            <div className="flex items-center justify-center gap-2 mb-5">
              <button
                onClick={() => setBilling("monthly")}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  billing === "monthly"
                    ? "bg-amber-400/20 text-amber-400 border border-amber-400/30"
                    : "text-slate-500 border border-white/10"
                }`}
              >
                {t("monthly")}
              </button>
              <button
                onClick={() => setBilling("yearly")}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  billing === "yearly"
                    ? "bg-amber-400/20 text-amber-400 border border-amber-400/30"
                    : "text-slate-500 border border-white/10"
                }`}
              >
                {t("yearly")}
                <span className="ml-1 text-green-400">{t("save50")}</span>
              </button>
            </div>

            {/* Pro Card */}
            <div className="glass-card rounded-2xl p-5 mb-4 border border-amber-400/20">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Zap size={18} className="text-amber-400" />
                  <h3 className="font-bold text-white">{t("proName")}</h3>
                </div>
                <div className="text-right">
                  <span className="text-xl font-bold text-white">
                    {billing === "monthly" ? "$9.99" : "$4.99"}
                  </span>
                  <span className="text-xs text-slate-400">/{t("perMonth")}</span>
                </div>
              </div>
              <ul className="space-y-2 mb-4">
                {proFeatures.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-xs text-slate-300">
                    <Check size={14} className="text-amber-400 shrink-0" />
                    {t(`features.${f}`)}
                  </li>
                ))}
              </ul>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => openCheckout(billing === "monthly" ? proMonthlyId : proYearlyId)}
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 text-white text-sm font-bold hover:opacity-90 transition-all shadow-[0_4px_20px_rgba(245,158,11,0.3)]"
              >
                {t("upgradeToPro")}
              </motion.button>
            </div>

            {/* Cosmic Plus Card */}
            <div className="glass-card rounded-2xl p-5 border border-purple-400/20 relative overflow-hidden">
              <div className="absolute inset-0 shimmer pointer-events-none" />
              <div className="flex items-center justify-between mb-3 relative">
                <div className="flex items-center gap-2">
                  <Sparkles size={18} className="text-purple-400" />
                  <h3 className="font-bold text-white">{t("cosmicPlusName")}</h3>
                </div>
                <div className="text-right">
                  <span className="text-xl font-bold text-white">$19.99</span>
                  <span className="text-xs text-slate-400">/{t("perMonth")}</span>
                </div>
              </div>
              <p className="text-[10px] text-purple-300/80 mb-3">{t("cosmicPlusIncludes")}</p>
              <ul className="space-y-2 mb-4 relative">
                {cosmicPlusExtras.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-xs text-slate-300">
                    <Check size={14} className="text-purple-400 shrink-0" />
                    {t(`features.${f}`)}
                  </li>
                ))}
              </ul>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => openCheckout(cosmicPlusId)}
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm font-bold hover:opacity-90 transition-all shadow-[0_4px_20px_rgba(168,85,247,0.3)] relative"
              >
                {t("upgradeToCosmicPlus")}
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
