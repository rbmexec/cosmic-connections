"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, ChevronDown, ChevronUp } from "lucide-react";
import { useTranslations } from "next-intl";
import CosmicBackground from "@/components/CosmicBackground";
import { decodeComparisonData } from "@/lib/referral-link";
import { buildProfileFromConnection } from "@/lib/circle-profile";
import {
  calculateCompatibility,
  getCompatibilityLabel,
  lifePathData,
  calculateLoShuGrid,
} from "@/lib/cosmic-calculations";
import type { LoShuGrid } from "@/lib/cosmic-calculations";
import type { UserProfile } from "@/types/profile";
import type { CircleConnection } from "@/types/circle";

function buildProfileFromData(data: { name: string; birthday: string }): UserProfile | null {
  const date = new Date(data.birthday + "T00:00:00");
  if (isNaN(date.getTime())) return null;
  const connection: CircleConnection = {
    id: "comparison",
    name: data.name,
    birthday: data.birthday,
    relationship: "friend",
    createdAt: new Date().toISOString(),
  };
  return buildProfileFromConnection(connection);
}

function ProfileBadge({ profile, color }: { profile: UserProfile; color: string }) {
  const initials = profile.name
    .split(" ")
    .filter(Boolean)
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className="w-16 h-16 rounded-full flex items-center justify-center border-2"
        style={{ borderColor: color + "60", background: color + "15" }}
      >
        <span className="text-lg font-bold" style={{ color }}>{initials}</span>
      </div>
      <p className="text-sm font-semibold text-white text-center max-w-[120px] truncate">{profile.name}</p>
      <div className="flex gap-1.5">
        <span className="glass-card-strong rounded-lg px-1.5 py-0.5 flex items-center gap-1 text-[10px]">
          <span className="text-amber-400 font-bold">{profile.lifePath}</span>
          <span className="text-[8px] text-slate-500">LP</span>
        </span>
        <span className="glass-card-strong rounded-lg px-1.5 py-0.5 text-[10px]">
          {profile.westernZodiac.symbol}
        </span>
        <span className="glass-card-strong rounded-lg px-1.5 py-0.5 text-[10px]">
          {profile.chineseZodiac.symbol}
        </span>
      </div>
    </div>
  );
}

function ExpandableSection({
  title,
  color,
  defaultOpen,
  children,
}: {
  title: string;
  color: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(!!defaultOpen);
  return (
    <div className="rounded-2xl overflow-hidden" style={{ border: `1px solid ${color}20` }}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center gap-2 px-4 py-3"
        style={{ background: `${color}08` }}
      >
        <p className="text-[11px] uppercase tracking-[0.12em] font-bold flex-1 text-left" style={{ color }}>{title}</p>
        {open ? <ChevronUp size={14} style={{ color }} /> : <ChevronDown size={14} style={{ color }} />}
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 pt-2">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const LO_SHU_LAYOUT = [
  [4, 9, 2],
  [3, 5, 7],
  [8, 1, 6],
];

function LoShuGridMini({ grid, tl }: { grid: LoShuGrid; tl: ReturnType<typeof useTranslations<"loShu">> }) {
  return (
    <div className="grid grid-cols-3 gap-1">
      {LO_SHU_LAYOUT.flat().map((num) => {
        const pos = grid.positions[num];
        const isPresent = pos.count > 0;
        const isStrong = pos.count >= 2;
        return (
          <div
            key={num}
            className="rounded-lg p-1.5 text-center"
            style={{
              background: isPresent ? `${pos.color}${isStrong ? "20" : "10"}` : "rgba(255,255,255,0.02)",
              border: `1px solid ${isPresent ? `${pos.color}${isStrong ? "40" : "20"}` : "rgba(255,255,255,0.05)"}`,
              opacity: isPresent ? 1 : 0.35,
            }}
          >
            <span className="text-sm font-bold font-serif" style={{ color: isPresent ? pos.color : "rgba(255,255,255,0.3)" }}>
              {num}
            </span>
            {isStrong && (
              <span className="text-[7px] font-bold ml-0.5" style={{ color: pos.color }}>×{pos.count}</span>
            )}
            <p className="text-[7px] leading-tight mt-0.5" style={{ color: isPresent ? `${pos.color}aa` : "rgba(255,255,255,0.15)" }}>
              {tl(`pos${num}` as "pos1")}
            </p>
          </div>
        );
      })}
    </div>
  );
}

export default function ComparisonPageClient({ encoded }: { encoded: string }) {
  const t = useTranslations("comparison");
  const tc = useTranslations("common");

  const data = useMemo(() => decodeComparisonData(encoded), [encoded]);

  const userProfile = useMemo(() => data ? buildProfileFromData(data.user) : null, [data]);
  const connProfile = useMemo(() => data ? buildProfileFromData(data.connection) : null, [data]);

  const compat = useMemo(() => {
    if (!userProfile || !connProfile) return null;
    return calculateCompatibility(userProfile, connProfile);
  }, [userProfile, connProfile]);

  if (!data || !userProfile || !connProfile || !compat) {
    return (
      <main className="min-h-[100dvh] relative">
        <CosmicBackground />
        <div className="relative z-10 max-w-lg mx-auto px-4 min-h-[100dvh] flex flex-col items-center justify-center text-center">
          <Sparkles size={48} className="text-amber-400 mb-4" />
          <h1 className="text-2xl font-bold text-white mb-2">{t("invalidLink")}</h1>
          <p className="text-slate-400 mb-6">{t("invalidLinkDesc")}</p>
          <a href="/" className="px-6 py-3 rounded-2xl bg-gradient-to-r from-teal-500 to-teal-600 text-white text-sm font-semibold">
            {t("getStarted")}
          </a>
        </div>
      </main>
    );
  }

  const compatLabel = getCompatibilityLabel(compat.overall);
  const userLp = lifePathData[userProfile.lifePath];
  const connLp = lifePathData[connProfile.lifePath];
  const tl = useTranslations("loShu");

  const userLoShu = useMemo(() => {
    if (!userProfile.birthMonth || !userProfile.birthDay || !userProfile.birthYear) return null;
    return calculateLoShuGrid(userProfile.birthMonth, userProfile.birthDay, userProfile.birthYear);
  }, [userProfile]);

  const connLoShu = useMemo(() => {
    if (!connProfile.birthMonth || !connProfile.birthDay || !connProfile.birthYear) return null;
    return calculateLoShuGrid(connProfile.birthMonth, connProfile.birthDay, connProfile.birthYear);
  }, [connProfile]);

  const dimensions = [
    { label: tc("numerology"), score: compat.lifePath, color: "#fbbf24" },
    { label: tc("western"), score: compat.western, color: "#a78bfa" },
    { label: tc("chinese"), score: compat.chinese, color: "#34d399" },
  ];

  return (
    <main className="min-h-[100dvh] relative">
      <CosmicBackground />
      <div className="relative z-10 max-w-lg mx-auto px-4 py-8">
        {/* App Header */}
        <div className="flex items-center justify-center gap-2 mb-6">
          <Sparkles size={18} className="text-amber-400" />
          <h1 className="text-lg font-bold tracking-tight text-gradient-cosmic">astr</h1>
          <Sparkles size={18} className="text-purple-400" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-[28px] overflow-hidden"
        >
          {/* Title */}
          <div className="text-center pt-6 px-5">
            <p className="text-[10px] uppercase tracking-widest text-slate-500 font-semibold">{t("cosmicCompatibility")}</p>
          </div>

          {/* Side-by-side profiles */}
          <div className="flex items-start justify-center gap-6 px-5 py-5">
            <ProfileBadge profile={userProfile} color="#14b8a6" />
            <div className="flex flex-col items-center justify-center pt-5">
              <Sparkles size={16} className="text-amber-400" />
            </div>
            <ProfileBadge profile={connProfile} color="#a78bfa" />
          </div>

          {/* Overall Compatibility Score */}
          <div className="text-center pb-5">
            <div className="relative w-24 h-24 mx-auto">
              <svg className="w-24 h-24 -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="6" />
                <motion.circle
                  cx="50"
                  cy="50"
                  r="42"
                  fill="none"
                  stroke={compatLabel.color}
                  strokeWidth="6"
                  strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 42}`}
                  initial={{ strokeDashoffset: 2 * Math.PI * 42 }}
                  animate={{ strokeDashoffset: 2 * Math.PI * 42 * (1 - compat.overall / 100) }}
                  transition={{ duration: 1.2, ease: "easeOut" }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <motion.span
                  className="text-2xl font-bold"
                  style={{ color: compatLabel.color }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  {compat.overall}%
                </motion.span>
              </div>
            </div>
            <p className="text-xs font-semibold mt-2" style={{ color: compatLabel.color }}>{compatLabel.label}</p>
          </div>

          {/* Dimension Breakdown */}
          <div className="px-5 pb-5">
            <p className="text-[10px] uppercase tracking-widest font-semibold text-slate-500 mb-3">{t("dimensionBreakdown")}</p>
            <div className="space-y-2.5">
              {dimensions.map((d) => (
                <div key={d.label} className="flex items-center gap-2">
                  <span className="text-[10px] text-slate-400 w-20 text-right">{d.label}</span>
                  <div className="flex-1 h-3 rounded-full bg-white/5 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${d.score}%` }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                      className="h-full rounded-full"
                      style={{ backgroundColor: d.color }}
                    />
                  </div>
                  <span className="text-[10px] font-semibold w-8" style={{ color: d.color }}>{d.score}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* Individual Cosmic Summaries */}
          <div className="px-5 pb-5 space-y-3">
            <ExpandableSection title={userProfile.name} color="#14b8a6">
              <div className="space-y-2">
                {userLp && (
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-amber-400/10 flex items-center justify-center border border-amber-400/20 shrink-0">
                      <span className="text-lg font-serif font-bold text-amber-300">{userProfile.lifePath}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-white">{tc("lifePath")} {userProfile.lifePath} — {userLp.name}</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">{userLp.description}</p>
                    </div>
                  </div>
                )}
                <div className="flex items-center gap-2 text-[10px] text-slate-400">
                  <span>{userProfile.westernZodiac.symbol} {userProfile.westernZodiac.sign}</span>
                  <span className="text-slate-600">&middot;</span>
                  <span>{userProfile.chineseZodiac.symbol} {userProfile.chineseZodiac.fullName}</span>
                </div>
              </div>
            </ExpandableSection>

            <ExpandableSection title={connProfile.name} color="#a78bfa">
              <div className="space-y-2">
                {connLp && (
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-amber-400/10 flex items-center justify-center border border-amber-400/20 shrink-0">
                      <span className="text-lg font-serif font-bold text-amber-300">{connProfile.lifePath}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-white">{tc("lifePath")} {connProfile.lifePath} — {connLp.name}</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">{connLp.description}</p>
                    </div>
                  </div>
                )}
                <div className="flex items-center gap-2 text-[10px] text-slate-400">
                  <span>{connProfile.westernZodiac.symbol} {connProfile.westernZodiac.sign}</span>
                  <span className="text-slate-600">&middot;</span>
                  <span>{connProfile.chineseZodiac.symbol} {connProfile.chineseZodiac.fullName}</span>
                </div>
              </div>
            </ExpandableSection>

            {/* Lo Shu Grid Comparison */}
            {userLoShu && connLoShu && (
              <ExpandableSection title={t("loShuComparison")} color="#f43f5e">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-[10px] text-center text-slate-500 mb-2">{userProfile.name}</p>
                    <LoShuGridMini grid={userLoShu} tl={tl} />
                  </div>
                  <div>
                    <p className="text-[10px] text-center text-slate-500 mb-2">{connProfile.name}</p>
                    <LoShuGridMini grid={connLoShu} tl={tl} />
                  </div>
                </div>
              </ExpandableSection>
            )}
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8 text-center"
        >
          <p className="text-sm text-slate-400 mb-4">{t("discoverYours")}</p>
          <a
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-teal-500 to-teal-600 text-white text-sm font-semibold shadow-[0_4px_20px_rgba(20,184,166,0.35)]"
          >
            <Sparkles size={16} />
            {t("getStarted")}
          </a>
        </motion.div>
      </div>
    </main>
  );
}
