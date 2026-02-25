"use client";

import { motion } from "framer-motion";
import { Users, Crown, Star } from "lucide-react";
import { calculateAllCompatibility, getCompatibilityLabel } from "@/lib/cosmic-calculations";
import { useTranslations } from "next-intl";
import type { MatchInsightsData } from "@/lib/cosmic-calculations";
import type { UserProfile } from "@/types/profile";

interface MatchInsightsProps {
  profile: UserProfile;
  allProfiles: UserProfile[];
  accentColor?: string;
  compact?: boolean;
}

const tierConfig = [
  { key: "soulmate" as const, labelKey: "soulmate", color: "#ec4899" },
  { key: "excellent" as const, labelKey: "excellent", color: "#a78bfa" },
  { key: "great" as const, labelKey: "great", color: "#10b981" },
  { key: "worthExploring" as const, labelKey: "exploring", color: "#3b82f6" },
  { key: "challenging" as const, labelKey: "challenging", color: "#f97316" },
];

export default function MatchInsights({ profile, allProfiles, accentColor = "#a78bfa", compact = false }: MatchInsightsProps) {
  const t = useTranslations('compatibility');
  const data: MatchInsightsData = calculateAllCompatibility(profile, allProfiles);
  const totalOthers = allProfiles.filter((p) => p.id !== profile.id).length;

  if (totalOthers === 0) return null;

  const compatLabel = getCompatibilityLabel(data.averageScore);

  if (compact) {
    return (
      <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users size={13} style={{ color: accentColor }} />
            <p className="text-[10px] uppercase tracking-widest font-semibold text-slate-500">{t('communityMatch')}</p>
          </div>
          {data.rank && (
            <span
              className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
              style={{ background: `${accentColor}15`, border: `1px solid ${accentColor}30`, color: accentColor }}
            >
              {data.rank}
            </span>
          )}
        </div>

        <div className="flex items-center gap-3">
          {/* Average score */}
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold" style={{ color: compatLabel.color }}>{data.averageScore}%</span>
            <span className="text-[10px] text-slate-500">{t('avg')}</span>
          </div>

          {/* Top matches mini */}
          <div className="flex -space-x-2 ml-auto">
            {data.bestMatches.map((m) => (
              <div key={m.profile.id} className="relative" title={`${m.profile.name}: ${m.score}%`}>
                <img
                  src={m.profile.photo}
                  alt={m.profile.name}
                  className="w-8 h-8 rounded-full object-cover ring-2 ring-cosmic-bg"
                />
                <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 text-[8px] font-bold bg-cosmic-bg px-1 rounded" style={{ color: getCompatibilityLabel(m.score).color }}>
                  {m.score}%
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Distribution mini bar */}
        <div className="flex h-2 rounded-full overflow-hidden gap-px">
          {tierConfig.map((tier) => {
            const count = data.distribution[tier.key];
            if (count === 0) return null;
            return (
              <motion.div
                key={tier.key}
                initial={{ width: 0 }}
                animate={{ width: `${(count / totalOthers) * 100}%` }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="rounded-full"
                style={{ backgroundColor: tier.color }}
                title={`${t(tier.labelKey)}: ${count}`}
              />
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Users size={13} style={{ color: accentColor }} />
          <p className="text-[10px] uppercase tracking-widest font-semibold text-slate-500">{t('communityCompatibility')}</p>
        </div>
        {data.rank && (
          <span
            className="text-[9px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full flex items-center gap-1"
            style={{ background: `${accentColor}15`, border: `1px solid ${accentColor}30`, color: accentColor }}
          >
            <Crown size={10} />
            {data.rank}
          </span>
        )}
      </div>

      {/* Average score */}
      <div className="text-center py-2">
        <span className="text-4xl font-bold" style={{ color: compatLabel.color }}>{data.averageScore}%</span>
        <p className="text-xs text-slate-400 mt-1">{t('averageMatch', { count: totalOthers })}</p>
        <p className="text-[10px] font-semibold mt-0.5" style={{ color: compatLabel.color }}>{compatLabel.label}</p>
      </div>

      {/* Best matches */}
      <div>
        <div className="flex items-center gap-1.5 mb-2.5">
          <Star size={11} style={{ color: accentColor }} />
          <p className="text-[10px] uppercase tracking-widest font-semibold text-slate-500">{t('topMatches')}</p>
        </div>
        <div className="space-y-2">
          {data.bestMatches.map((m, i) => {
            const label = getCompatibilityLabel(m.score);
            return (
              <motion.div
                key={m.profile.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="flex items-center gap-3 p-2.5 rounded-xl bg-white/[0.03] border border-white/5"
              >
                <img
                  src={m.profile.photo}
                  alt={m.profile.name}
                  className="w-10 h-10 rounded-full object-cover border-2"
                  style={{ borderColor: label.color + "40" }}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate">{m.profile.name}</p>
                  <p className="text-[10px] text-slate-400">{m.profile.westernZodiac.symbol} {m.profile.westernZodiac.sign} &middot; {m.profile.chineseZodiac.fullName}</p>
                </div>
                <div className="text-right">
                  <span className="text-lg font-bold" style={{ color: label.color }}>{m.score}%</span>
                  <p className="text-[9px]" style={{ color: label.color }}>{label.label}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Tier distribution */}
      <div>
        <p className="text-[10px] uppercase tracking-widest font-semibold text-slate-500 mb-2.5">{t('matchDistribution')}</p>
        <div className="space-y-1.5">
          {tierConfig.map((tier) => {
            const count = data.distribution[tier.key];
            const pct = totalOthers > 0 ? (count / totalOthers) * 100 : 0;
            return (
              <div key={tier.key} className="flex items-center gap-2">
                <span className="text-[10px] text-slate-400 w-16 text-right">{t(tier.labelKey)}</span>
                <div className="flex-1 h-3 rounded-full bg-white/5 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="h-full rounded-full"
                    style={{ backgroundColor: tier.color }}
                  />
                </div>
                <span className="text-[10px] text-slate-500 w-4">{count}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
