"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles, Sun, Moon, Hash, Star, Globe, Compass,
  Users, TrendingUp, Heart, Calendar, Gem,
} from "lucide-react";
import {
  lifePathData,
  zodiacDescriptions,
  chineseAnimalDescriptions,
  elementDescriptions,
  chineseElementDescriptions,
  calculateBirthdayNumber,
  calculatePersonalYear,
  birthdayNumberData,
  personalYearData,
  calculateAllCompatibility,
  getCompatibilityLabel,
} from "@/lib/cosmic-calculations";
import type { MatchInsightsData } from "@/lib/cosmic-calculations";
import type { LifePathInfo, UserProfile } from "@/types/profile";

type ZodiacDesc = { traits: string; ruler: string; compatibleSigns: string[] };
type AnimalDesc = { traits: string; luckyNumbers: number[]; luckyColors: string[]; compatibleAnimals: string[]; incompatibleAnimals: string[] };

const selfTabs = ["Overview", "Your Numbers", "Cosmic Compass", "Intersections"] as const;
type SelfTab = (typeof selfTabs)[number];

interface PersonalCardProps {
  profile: UserProfile;
  currentUser?: UserProfile;
  allProfiles?: UserProfile[];
}

// ─── Category Card for Overview grid ───
function CategoryCard({ icon, label, onClick }: { icon: React.ReactNode; label: string; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center justify-center gap-1.5 p-3 rounded-xl transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer"
      style={{
        background: "rgba(13, 61, 56, 0.5)",
        border: "1px solid rgba(251, 191, 36, 0.3)",
        boxShadow: "inset 0 0 0 1px rgba(251, 191, 36, 0.1), 0 2px 8px rgba(0,0,0,0.2)",
        minHeight: "80px",
      }}
    >
      <div className="text-amber-400">{icon}</div>
      <span className="text-[10px] font-semibold uppercase tracking-wider text-amber-300/90">{label}</span>
    </button>
  );
}

// ─── Section Header ───
function SectionHeader({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex items-center gap-2 mb-2.5">
      <span className="text-amber-400">{icon}</span>
      <p className="text-[10px] uppercase tracking-[0.15em] font-bold text-amber-400">{label}</p>
    </div>
  );
}

// ─── Tier config for distribution bar ───
const tierConfig = [
  { key: "soulmate" as const, label: "Soulmate", color: "#ec4899" },
  { key: "excellent" as const, label: "Excellent", color: "#a78bfa" },
  { key: "great" as const, label: "Great", color: "#10b981" },
  { key: "worthExploring" as const, label: "Exploring", color: "#3b82f6" },
  { key: "challenging" as const, label: "Challenging", color: "#f97316" },
];

export default function PersonalCard({ profile, currentUser, allProfiles }: PersonalCardProps) {
  const isSelfView = !!currentUser && profile.id === currentUser.id;

  if (isSelfView && allProfiles) {
    return <SelfProfileView user={currentUser} allProfiles={allProfiles} />;
  }

  // Fallback: legacy other-profile view
  return <LegacyPersonalCard profile={profile} />;
}

// ═══════════════════════════════════════════
// Self-Profile Dashboard (new 4-tab view)
// ═══════════════════════════════════════════

function SelfProfileView({ user, allProfiles }: { user: UserProfile; allProfiles: UserProfile[] }) {
  const [activeTab, setActiveTab] = useState<SelfTab>("Overview");

  const lp = lifePathData[user.lifePath];
  const zodiac = zodiacDescriptions[user.westernZodiac.sign];
  const animal = chineseAnimalDescriptions[user.chineseZodiac.animal];

  const birthdayNum = useMemo(() => {
    if (user.birthDay) return calculateBirthdayNumber(user.birthDay);
    return null;
  }, [user.birthDay]);

  const personalYear = useMemo(() => {
    if (user.birthMonth && user.birthDay) return calculatePersonalYear(user.birthMonth, user.birthDay);
    return null;
  }, [user.birthMonth, user.birthDay]);

  const communityData: MatchInsightsData = useMemo(
    () => calculateAllCompatibility(user, allProfiles),
    [user, allProfiles],
  );

  const initials = user.name
    .split(" ")
    .filter(Boolean)
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  // Count profiles sharing the same western element
  const sameElementCount = allProfiles.filter(
    (p) => p.id !== user.id && p.westernZodiac.element === user.westernZodiac.element
  ).length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card rounded-[28px] overflow-hidden max-w-sm mx-auto card-stack-shadow"
    >
      {/* Self-Avatar Header */}
      <div className="relative py-6 px-5 flex flex-col items-center" style={{ background: "linear-gradient(180deg, rgba(13,61,56,0.6) 0%, transparent 100%)" }}>
        <div className="w-20 h-20 rounded-full bg-teal-900/60 border-2 border-amber-400/50 flex items-center justify-center mb-3">
          {user.photo ? (
            <img src={user.photo} alt={user.name} className="w-full h-full rounded-full object-cover" />
          ) : (
            <span className="text-2xl font-bold text-amber-300">{initials}</span>
          )}
        </div>
        <h2 className="text-xl font-bold tracking-tight text-white">{user.name}</h2>
        <p className="text-xs text-slate-400 mt-0.5">{user.occupation} &middot; {user.location}</p>
        {/* Cosmic trio badges */}
        <div className="flex gap-2 mt-3">
          <span className="glass-card-strong rounded-xl px-2.5 py-1 flex items-center gap-1.5 text-xs">
            <span className="text-amber-400 font-bold">{user.lifePath}</span>
            <span className="text-[9px] text-slate-400">LP</span>
          </span>
          <span className="glass-card-strong rounded-xl px-2.5 py-1 flex items-center gap-1.5 text-xs">
            <span>{user.westernZodiac.symbol}</span>
            <span className="text-[9px] text-slate-400">{user.westernZodiac.sign}</span>
          </span>
          <span className="glass-card-strong rounded-xl px-2.5 py-1 flex items-center gap-1.5 text-xs">
            <span>{user.chineseZodiac.symbol}</span>
            <span className="text-[9px] text-slate-400">{user.chineseZodiac.animal}</span>
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 px-3 pt-1">
        {selfTabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-2 text-[10px] font-semibold rounded-xl transition-all duration-300 ${
              activeTab === tab
                ? "bg-amber-400/15 text-amber-400 shadow-[0_0_12px_rgba(251,191,36,0.15)]"
                : "text-slate-500 hover:text-slate-300 hover:bg-white/5"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="p-5 min-h-[320px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === "Overview" && (
              <OverviewTab user={user} lp={lp} zodiac={zodiac} animal={animal} onNavigate={setActiveTab} />
            )}
            {activeTab === "Your Numbers" && (
              <YourNumbersTab user={user} lp={lp} birthdayNum={birthdayNum} personalYear={personalYear} />
            )}
            {activeTab === "Cosmic Compass" && (
              <CosmicCompassTab user={user} zodiac={zodiac} animal={animal} />
            )}
            {activeTab === "Intersections" && (
              <IntersectionsTab user={user} allProfiles={allProfiles} data={communityData} sameElementCount={sameElementCount} />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

// ─── Tab 1: Overview ───
function OverviewTab({
  user, lp, zodiac, animal, onNavigate,
}: {
  user: UserProfile;
  lp: LifePathInfo | undefined;
  zodiac: ZodiacDesc | undefined;
  animal: AnimalDesc | undefined;
  onNavigate: (tab: SelfTab) => void;
}) {
  return (
    <div className="space-y-4">
      {/* Western Astrology Section */}
      <div>
        <SectionHeader icon={<Sun size={12} />} label="Western Astrology" />
        <div className="grid grid-cols-3 gap-2">
          <CategoryCard icon={<Globe size={18} />} label="Birth Chart" onClick={() => onNavigate("Cosmic Compass")} />
          <CategoryCard icon={<Heart size={18} />} label="Love Match" onClick={() => onNavigate("Intersections")} />
          <CategoryCard icon={<Sun size={18} />} label="Sun Sign" onClick={() => onNavigate("Cosmic Compass")} />
        </div>
      </div>

      {/* Chinese Astrology Section */}
      <div>
        <SectionHeader icon={<Moon size={12} />} label="Chinese Astrology" />
        <div className="grid grid-cols-2 gap-2">
          <CategoryCard icon={<Star size={18} />} label="Zodiac" onClick={() => onNavigate("Cosmic Compass")} />
          <CategoryCard icon={<Gem size={18} />} label="Lucky Info" onClick={() => onNavigate("Cosmic Compass")} />
        </div>
      </div>

      {/* Numerology Section */}
      <div>
        <SectionHeader icon={<Hash size={12} />} label="Numerology" />
        <div className="grid grid-cols-3 gap-2">
          <CategoryCard icon={<Compass size={18} />} label="Life Path" onClick={() => onNavigate("Your Numbers")} />
          <CategoryCard icon={<Calendar size={18} />} label="Birthday #" onClick={() => onNavigate("Your Numbers")} />
          <CategoryCard icon={<TrendingUp size={18} />} label="Personal Yr" onClick={() => onNavigate("Your Numbers")} />
        </div>
      </div>
    </div>
  );
}

// ─── Tab 2: Your Numbers ───
function YourNumbersTab({
  user, lp, birthdayNum, personalYear,
}: {
  user: UserProfile;
  lp: LifePathInfo | undefined;
  birthdayNum: number | null;
  personalYear: number | null;
}) {
  const bdData = birthdayNum ? birthdayNumberData[birthdayNum] : null;
  const pyData = personalYear ? personalYearData[personalYear] : null;

  return (
    <div className="space-y-5">
      {/* Life Path Hero */}
      {lp && (
        <div className="text-center">
          <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-amber-400/20 to-amber-400/5 flex items-center justify-center border border-amber-400/30">
            <span className="text-4xl font-serif font-bold text-gradient-gold">{user.lifePath}</span>
          </div>
          <p className="text-lg font-bold mt-3 text-white">{lp.name}</p>
          <p className="text-sm text-slate-400 mt-1 leading-relaxed">{lp.description}</p>
          <div className="flex flex-wrap justify-center gap-2 mt-3">
            {lp.traits.map((t) => (
              <span key={t} className="cosmic-tag bg-amber-400/10 text-amber-400 border border-amber-400/20">{t}</span>
            ))}
          </div>
        </div>
      )}

      {/* Birthday Number */}
      {bdData && birthdayNum !== null && (
        <div className="p-4 rounded-2xl bg-white/[0.03] border border-amber-400/10">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-amber-400/10 flex items-center justify-center border border-amber-400/20">
              <span className="text-xl font-serif font-bold text-amber-300">{birthdayNum}</span>
            </div>
            <div className="flex-1">
              <p className="text-xs text-amber-400/60 uppercase tracking-widest font-semibold">Birthday Number</p>
              <p className="text-sm font-semibold text-white mt-0.5">{bdData.name}</p>
            </div>
          </div>
          <p className="text-xs text-slate-400 mt-2 leading-relaxed">{bdData.description}</p>
        </div>
      )}

      {/* Personal Year */}
      {pyData && personalYear !== null && (
        <div className="p-4 rounded-2xl bg-white/[0.03] border border-teal-400/10">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-teal-400/10 flex items-center justify-center border border-teal-400/20">
              <span className="text-xl font-serif font-bold text-teal-300">{personalYear}</span>
            </div>
            <div className="flex-1">
              <p className="text-xs text-teal-400/60 uppercase tracking-widest font-semibold">Personal Year {new Date().getFullYear()}</p>
              <p className="text-sm font-semibold text-white mt-0.5">{pyData.name}</p>
            </div>
          </div>
          <p className="text-xs text-slate-400 mt-2 leading-relaxed">{pyData.description}</p>
        </div>
      )}
    </div>
  );
}

// ─── Tab 3: Cosmic Compass ───
function CosmicCompassTab({
  user, zodiac, animal,
}: {
  user: UserProfile;
  zodiac: ZodiacDesc | undefined;
  animal: AnimalDesc | undefined;
}) {
  return (
    <div className="space-y-5">
      {/* Western Section */}
      {zodiac && (
        <div>
          <SectionHeader icon={<Sun size={12} />} label="Western Zodiac" />
          <div className="text-center mb-3">
            <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-purple-400/20 to-purple-400/5 flex items-center justify-center border border-purple-400/20">
              <span className="text-3xl">{user.westernZodiac.symbol}</span>
            </div>
            <p className="text-base font-bold mt-2 text-white">{user.westernZodiac.sign}</p>
            <p className="text-[11px] text-slate-400">{user.westernZodiac.element} Element &middot; Ruled by {zodiac.ruler}</p>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed mb-3">{zodiac.traits}</p>
          <div className="p-3 rounded-xl bg-purple-400/5 border border-purple-400/10 mb-3">
            <p className="text-[10px] text-purple-300 font-semibold uppercase tracking-widest mb-1">
              <Sparkles size={10} className="inline mr-1" />Element Meaning
            </p>
            <p className="text-xs text-slate-400 leading-relaxed">{elementDescriptions[user.westernZodiac.element]}</p>
          </div>
          <div>
            <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-2 font-semibold">Compatible Signs</p>
            <div className="flex flex-wrap gap-1.5">
              {zodiac.compatibleSigns.map((s) => (
                <span key={s} className="cosmic-tag bg-purple-400/10 text-purple-300 border border-purple-400/20">{s}</span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Divider */}
      <div className="border-t border-white/5" />

      {/* Chinese Section */}
      {animal && (
        <div>
          <SectionHeader icon={<Moon size={12} />} label="Chinese Zodiac" />
          <div className="text-center mb-3">
            <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-green-400/20 to-green-400/5 flex items-center justify-center border border-green-400/20">
              <span className="text-3xl">{user.chineseZodiac.symbol}</span>
            </div>
            <p className="text-base font-bold mt-2 text-white">{user.chineseZodiac.fullName}</p>
            <p className="text-[11px] text-slate-400">{user.chineseZodiac.element} Element</p>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed mb-3">{animal.traits}</p>
          <div className="p-3 rounded-xl bg-green-400/5 border border-green-400/10 mb-3">
            <p className="text-[10px] text-green-300 font-semibold uppercase tracking-widest mb-1">Element Meaning</p>
            <p className="text-xs text-slate-400 leading-relaxed">{chineseElementDescriptions[user.chineseZodiac.element]}</p>
          </div>
          <div className="grid grid-cols-2 gap-2 mb-3">
            <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5">
              <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">Lucky Numbers</p>
              <p className="text-sm font-semibold text-white">{animal.luckyNumbers.join(", ")}</p>
            </div>
            <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5">
              <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">Lucky Colors</p>
              <p className="text-sm font-semibold text-white">{animal.luckyColors.join(", ")}</p>
            </div>
          </div>
          <div className="mb-3">
            <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-2 font-semibold">Compatible</p>
            <div className="flex flex-wrap gap-1.5">
              {animal.compatibleAnimals.map((a) => (
                <span key={a} className="cosmic-tag bg-green-400/10 text-green-300 border border-green-400/20">{a}</span>
              ))}
            </div>
          </div>
          <div>
            <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-2 font-semibold">Incompatible</p>
            <div className="flex flex-wrap gap-1.5">
              {animal.incompatibleAnimals.map((a) => (
                <span key={a} className="cosmic-tag bg-red-400/10 text-red-400 border border-red-400/20">{a}</span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Tab 4: Intersections ───
function IntersectionsTab({
  user, allProfiles, data, sameElementCount,
}: {
  user: UserProfile;
  allProfiles: UserProfile[];
  data: MatchInsightsData;
  sameElementCount: number;
}) {
  const totalOthers = allProfiles.filter((p) => p.id !== user.id).length;
  const compatLabel = getCompatibilityLabel(data.averageScore);

  if (totalOthers === 0) {
    return (
      <div className="text-center py-8">
        <Users size={32} className="mx-auto text-slate-600 mb-3" />
        <p className="text-sm text-slate-400">No community profiles to compare with yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Average Score */}
      <div className="text-center py-2">
        <p className="text-[10px] text-amber-400/60 uppercase tracking-widest font-semibold mb-2">Community Compatibility</p>
        <span className="text-4xl font-bold" style={{ color: compatLabel.color }}>{data.averageScore}%</span>
        <p className="text-xs text-slate-400 mt-1">average match across {totalOthers} profiles</p>
        <p className="text-[10px] font-semibold mt-0.5" style={{ color: compatLabel.color }}>{compatLabel.label}</p>
        {data.rank && (
          <span
            className="inline-flex items-center gap-1 mt-2 text-[9px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full"
            style={{ background: "rgba(251,191,36,0.1)", border: "1px solid rgba(251,191,36,0.25)", color: "#fbbf24" }}
          >
            <Star size={10} />
            {data.rank}
          </span>
        )}
      </div>

      {/* Best Matches */}
      <div>
        <SectionHeader icon={<Heart size={12} />} label="Top Matches" />
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
                  <p className="text-sm font-semibold truncate text-white">{m.profile.name}</p>
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

      {/* Distribution */}
      <div>
        <p className="text-[10px] uppercase tracking-widest font-semibold text-slate-500 mb-2.5">Match Distribution</p>
        <div className="space-y-1.5">
          {tierConfig.map((tier) => {
            const count = data.distribution[tier.key];
            const pct = totalOthers > 0 ? (count / totalOthers) * 100 : 0;
            return (
              <div key={tier.key} className="flex items-center gap-2">
                <span className="text-[10px] text-slate-400 w-16 text-right">{tier.label}</span>
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

      {/* Cosmic Insight */}
      <div className="p-3 rounded-xl bg-amber-400/5 border border-amber-400/10">
        <p className="text-[10px] text-amber-400 font-semibold uppercase tracking-widest mb-1">
          <Sparkles size={10} className="inline mr-1" />Cosmic Insight
        </p>
        <p className="text-xs text-slate-400 leading-relaxed">
          Your {user.westernZodiac.sign} ({user.westernZodiac.element}) energy resonates with {sameElementCount} {sameElementCount === 1 ? "profile" : "profiles"} in the community who share your {user.westernZodiac.element} element affinity.
        </p>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════
// Legacy card for viewing other profiles
// ═══════════════════════════════════════════

const legacyTabs = ["Overview", "Numerology", "Western", "Eastern"] as const;
type LegacyTab = (typeof legacyTabs)[number];

function LegacyPersonalCard({ profile }: { profile: UserProfile }) {
  const [activeTab, setActiveTab] = useState<LegacyTab>("Overview");
  const lp = lifePathData[profile.lifePath];
  const zodiac = zodiacDescriptions[profile.westernZodiac.sign];
  const animal = chineseAnimalDescriptions[profile.chineseZodiac.animal];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card rounded-[28px] overflow-hidden max-w-sm mx-auto card-stack-shadow"
    >
      {/* Photo Header */}
      <div className="relative h-52">
        <img src={profile.photo} alt={profile.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 photo-gradient" />
        <div className="absolute bottom-4 left-5 right-5">
          <h2 className="text-[26px] font-bold tracking-tight">
            {profile.name}<span className="text-slate-300 font-light ml-2">{profile.age}</span>
          </h2>
          <p className="text-sm text-slate-300">{profile.occupation} &middot; {profile.location}</p>
        </div>
        <div className="absolute top-4 right-4 flex flex-col gap-1.5">
          <div className="glass-card-strong rounded-xl px-2.5 py-1 flex items-center gap-1.5">
            <span className="text-amber-accent text-sm font-bold">{profile.lifePath}</span>
            <span className="text-[9px] text-slate-400">LP</span>
          </div>
          <div className="glass-card-strong rounded-xl px-2.5 py-1 flex items-center gap-1.5">
            <span className="text-sm">{profile.westernZodiac.symbol}</span>
            <span className="text-[9px] text-slate-400">{profile.westernZodiac.element}</span>
          </div>
          <div className="glass-card-strong rounded-xl px-2.5 py-1 flex items-center gap-1.5">
            <span className="text-sm">{profile.chineseZodiac.symbol}</span>
            <span className="text-[9px] text-slate-400">{profile.chineseZodiac.element}</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 px-3 pt-3">
        {legacyTabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-2 text-[11px] font-semibold rounded-xl transition-all duration-300 ${
              activeTab === tab
                ? "bg-mode-personal/15 text-mode-personal shadow-[0_0_12px_rgba(167,139,250,0.15)]"
                : "text-slate-500 hover:text-slate-300 hover:bg-white/5"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="p-5 min-h-[280px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === "Overview" && (
              <div className="space-y-3">
                <div className="text-center mb-4">
                  <p className="text-xs text-slate-500 uppercase tracking-widest">Your Cosmic Blueprint</p>
                </div>
                <div className="flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-r from-amber-accent/5 to-transparent border border-amber-accent/10">
                  <div className="w-12 h-12 rounded-full bg-amber-accent/10 flex items-center justify-center">
                    <span className="text-2xl font-serif font-bold text-gradient-gold">{profile.lifePath}</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold">{lp?.name}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{lp?.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-r from-mode-personal/5 to-transparent border border-mode-personal/10">
                  <div className="w-12 h-12 rounded-full bg-mode-personal/10 flex items-center justify-center">
                    <Sun size={22} className="text-mode-personal" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold">{profile.westernZodiac.symbol} {profile.westernZodiac.sign}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{profile.westernZodiac.element} Sign &middot; Ruled by {zodiac?.ruler}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-r from-green-500/5 to-transparent border border-green-500/10">
                  <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center">
                    <Moon size={22} className="text-green-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold">{profile.chineseZodiac.symbol} {profile.chineseZodiac.fullName}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{profile.chineseZodiac.element} Element &middot; Chinese Zodiac</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "Numerology" && lp && (
              <div className="space-y-5">
                <div className="text-center">
                  <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-amber-accent/20 to-amber-accent/5 flex items-center justify-center border border-amber-accent/20">
                    <span className="text-4xl font-serif font-bold text-gradient-gold">{profile.lifePath}</span>
                  </div>
                  <p className="text-lg font-bold mt-3">{lp.name}</p>
                  <p className="text-sm text-slate-400 mt-1 leading-relaxed">{lp.description}</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-3 font-semibold">Core Strengths</p>
                  <div className="flex flex-wrap gap-2">
                    {lp.traits.map((t) => (
                      <span key={t} className="cosmic-tag bg-amber-accent/10 text-amber-accent border border-amber-accent/20">{t}</span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "Western" && zodiac && (
              <div className="space-y-5">
                <div className="text-center">
                  <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-mode-personal/20 to-mode-personal/5 flex items-center justify-center border border-mode-personal/20">
                    <span className="text-4xl">{profile.westernZodiac.symbol}</span>
                  </div>
                  <p className="text-lg font-bold mt-3">{profile.westernZodiac.sign}</p>
                  <p className="text-xs text-slate-400">Ruled by {zodiac.ruler} &middot; {profile.westernZodiac.element} Element</p>
                </div>
                <p className="text-sm text-slate-300 leading-relaxed">{zodiac.traits}</p>
                <div className="p-3 rounded-xl bg-mode-personal/5 border border-mode-personal/10">
                  <p className="text-[10px] text-mode-personal font-semibold uppercase tracking-widest mb-1">
                    <Sparkles size={10} className="inline mr-1" />Element Meaning
                  </p>
                  <p className="text-xs text-slate-400 leading-relaxed">{elementDescriptions[profile.westernZodiac.element]}</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-3 font-semibold">Best Matches</p>
                  <div className="flex flex-wrap gap-2">
                    {zodiac.compatibleSigns.map((s) => (
                      <span key={s} className="cosmic-tag bg-mode-personal/10 text-mode-personal border border-mode-personal/20">{s}</span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "Eastern" && animal && (
              <div className="space-y-5">
                <div className="text-center">
                  <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-green-500/20 to-green-500/5 flex items-center justify-center border border-green-500/20">
                    <span className="text-4xl">{profile.chineseZodiac.symbol}</span>
                  </div>
                  <p className="text-lg font-bold mt-3">{profile.chineseZodiac.fullName}</p>
                  <p className="text-xs text-slate-400">{profile.chineseZodiac.element} Element</p>
                </div>
                <p className="text-sm text-slate-300 leading-relaxed">{animal.traits}</p>
                <div className="p-3 rounded-xl bg-green-500/5 border border-green-500/10">
                  <p className="text-[10px] text-green-400 font-semibold uppercase tracking-widest mb-1">Element Meaning</p>
                  <p className="text-xs text-slate-400 leading-relaxed">{chineseElementDescriptions[profile.chineseZodiac.element]}</p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5">
                    <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">Lucky Numbers</p>
                    <p className="text-sm font-semibold">{animal.luckyNumbers.join(", ")}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5">
                    <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">Lucky Colors</p>
                    <p className="text-sm font-semibold">{animal.luckyColors.join(", ")}</p>
                  </div>
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-3 font-semibold">Compatible Animals</p>
                  <div className="flex flex-wrap gap-2">
                    {animal.compatibleAnimals.map((a) => (
                      <span key={a} className="cosmic-tag bg-green-500/10 text-green-400 border border-green-500/20">{a}</span>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-3 font-semibold">Incompatible Animals</p>
                  <div className="flex flex-wrap gap-2">
                    {animal.incompatibleAnimals.map((a) => (
                      <span key={a} className="cosmic-tag bg-red-500/10 text-red-400 border border-red-500/20">{a}</span>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
