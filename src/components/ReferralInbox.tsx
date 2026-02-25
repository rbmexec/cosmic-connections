"use client";

import { useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Gift, Eye, Sparkles } from "lucide-react";
import { useTranslations } from "next-intl";
import { sampleProfiles } from "@/data/profiles";
import type { UserProfile } from "@/types/profile";

interface Referral {
  id: string;
  recommender: UserProfile;
  referredProfile: UserProfile;
  message: string;
  createdAt: string;
}

interface ReferralInboxProps {
  onViewProfile: (profileId: string) => void;
}

export default function ReferralInbox({ onViewProfile }: ReferralInboxProps) {
  const t = useTranslations("referral");

  // Demo referrals generated from sample profiles
  const referrals: Referral[] = useMemo(
    () => [
      {
        id: "ref-1",
        recommender: sampleProfiles[2], // Valentina
        referredProfile: sampleProfiles[5], // Luca
        message:
          "You two would have the most amazing dinner conversations. Trust me on this one!",
        createdAt: new Date(Date.now() - 2 * 3600_000).toISOString(),
      },
      {
        id: "ref-2",
        recommender: sampleProfiles[8], // Nadia
        referredProfile: sampleProfiles[10], // Yuki
        message:
          "Your artistic souls are cosmically aligned. You need to see her photography.",
        createdAt: new Date(Date.now() - 18 * 3600_000).toISOString(),
      },
      {
        id: "ref-3",
        recommender: sampleProfiles[3], // Ravi
        referredProfile: sampleProfiles[13], // Sebastian
        message: "",
        createdAt: new Date(Date.now() - 48 * 3600_000).toISOString(),
      },
    ],
    [],
  );

  function formatTimeAgo(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / 3_600_000);
    const diffDays = Math.floor(diffMs / 86_400_000);

    if (diffHours < 1) return t("justNow");
    if (diffHours < 24) return t("hoursAgo", { count: diffHours });
    return t("daysAgo", { count: diffDays });
  }

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center gap-2 mb-1">
        <Gift size={16} className="text-purple-400" />
        <h3 className="text-sm font-bold text-white">{t("inboxTitle")}</h3>
        {referrals.length > 0 && (
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-400 border border-purple-500/30">
            {referrals.length}
          </span>
        )}
      </div>

      {/* Empty state */}
      {referrals.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-2xl p-8 text-center"
        >
          <Gift size={40} className="text-slate-600 mx-auto mb-3" />
          <p className="text-sm text-slate-500">{t("emptyInbox")}</p>
          <p className="text-xs text-slate-600 mt-1">{t("emptyInboxHint")}</p>
        </motion.div>
      )}

      {/* Referral list */}
      <AnimatePresence>
        {referrals.map((referral, index) => (
          <motion.div
            key={referral.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="glass-card rounded-2xl p-4 border border-purple-400/10 hover:border-purple-400/20 transition-colors"
          >
            {/* Recommender line */}
            <div className="flex items-center gap-2 mb-3">
              <img
                src={referral.recommender.photo}
                alt={referral.recommender.name}
                className="w-5 h-5 rounded-full object-cover ring-1 ring-white/10"
              />
              <p className="text-[10px] text-slate-400 flex-1">
                <span className="text-slate-300 font-semibold">
                  {referral.recommender.name}
                </span>{" "}
                {t("recommendedForYou")}
              </p>
              <span className="text-[10px] text-slate-600">
                {formatTimeAgo(referral.createdAt)}
              </span>
            </div>

            {/* Referred profile card */}
            <div className="flex items-center gap-3">
              <div className="relative">
                <img
                  src={referral.referredProfile.photo}
                  alt={referral.referredProfile.name}
                  className="w-14 h-14 rounded-2xl object-cover ring-1 ring-white/10"
                />
                <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-cosmic-card flex items-center justify-center text-[10px] border border-white/10">
                  {referral.referredProfile.westernZodiac.symbol}
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-white truncate">
                  {referral.referredProfile.name},{" "}
                  {referral.referredProfile.age}
                </p>
                <p className="text-[10px] text-slate-400 truncate">
                  {referral.referredProfile.westernZodiac.sign} &middot;{" "}
                  {referral.referredProfile.chineseZodiac.fullName} &middot;{" "}
                  {referral.referredProfile.occupation}
                </p>
                {referral.message && (
                  <div className="flex items-start gap-1.5 mt-1.5">
                    <Sparkles
                      size={10}
                      className="text-purple-400 mt-0.5 shrink-0"
                    />
                    <p className="text-[11px] text-slate-300/80 italic line-clamp-2">
                      &ldquo;{referral.message}&rdquo;
                    </p>
                  </div>
                )}
              </div>

              {/* View profile button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onViewProfile(referral.referredProfile.id)}
                className="shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-xl bg-purple-500/15 text-purple-400 text-xs font-semibold hover:bg-purple-500/25 transition-colors border border-purple-500/20"
              >
                <Eye size={12} />
                {t("viewProfile")}
              </motion.button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
