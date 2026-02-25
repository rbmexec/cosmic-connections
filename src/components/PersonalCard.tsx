"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles, Sun, Moon, Hash, Star, Globe, Compass,
  Users, TrendingUp, Heart, Calendar, Gem, Eye, Flame, Shield,
  ChevronDown, ChevronUp, Briefcase, GraduationCap, Pencil, Grid3x3,
} from "lucide-react";
import { Lock } from "lucide-react";
import PortfolioEditor from "@/components/PortfolioEditor";
import InstagramConnect from "@/components/InstagramConnect";
import SpotifyConnect from "@/components/SpotifyConnect";
import VerifiedBadge from "@/components/VerifiedBadge";
import VerificationFlow from "@/components/VerificationFlow";
import PromptEditor from "@/components/PromptEditor";
import PhotoUpload from "@/components/PhotoUpload";
import VoiceNoteRecorder from "@/components/VoiceNoteRecorder";
import VoiceNotePlayer from "@/components/VoiceNotePlayer";
import VideoIntroPlayer from "@/components/VideoIntroPlayer";
import { useSubscription } from "@/lib/subscription-context";
import { useOverlay } from "@/lib/overlay-context";
import CosmicInfo from "@/components/CosmicInfo";
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
  calculateExpressionNumber,
  calculateSoulUrgeNumber,
  calculatePersonalityNumber,
  calculateBalanceNumber,
  calculateSecretPassion,
  calculateKarmicLessons,
  calculateSubconsciousSelf,
  calculatePinnacles,
  calculatePeriodCycles,
  calculateChallenges,
  expressionNumberData,
  soulUrgeNumberData,
  personalityNumberData,
  balanceNumberData,
  secretPassionData,
  karmicLessonData,
  pinnacleNumberData,
  periodCycleData,
  challengeNumberData,
  calculateLoShuGrid,
  astroHouseData,
} from "@/lib/cosmic-calculations";
import type { MatchInsightsData, PinnacleInfo, CycleInfo, ChallengeInfo, LoShuGrid } from "@/lib/cosmic-calculations";
import type { LifePathInfo, UserProfile } from "@/types/profile";

type ZodiacDesc = { traits: string; ruler: string; compatibleSigns: string[]; polarity: string; polarityLabel: string };
type AnimalDesc = { traits: string; luckyNumbers: number[]; luckyColors: string[]; compatibleAnimals: string[]; incompatibleAnimals: string[] };

const selfTabKeys = ["overview", "yourNumbers", "cosmicCompass", "intersections"] as const;
type SelfTab = (typeof selfTabKeys)[number];

interface PersonalCardProps {
  profile: UserProfile;
  currentUser?: UserProfile;
  allProfiles?: UserProfile[];
  onOpenCircle?: () => void;
  onOpenBlueprint?: () => void;
  onUpgradeRequired?: (trigger: string) => void;
  onProfileUpdate?: (updated: Partial<UserProfile>) => void;
  onOpenQuiz?: () => void;
  onOpenCosmicCalendar?: () => void;
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
  { key: "soulmate" as const, labelKey: "soulmate" as const, color: "#ec4899" },
  { key: "excellent" as const, labelKey: "excellent" as const, color: "#a78bfa" },
  { key: "great" as const, labelKey: "great" as const, color: "#10b981" },
  { key: "worthExploring" as const, labelKey: "exploring" as const, color: "#3b82f6" },
  { key: "challenging" as const, labelKey: "challenging" as const, color: "#f97316" },
];

export default function PersonalCard({ profile, currentUser, allProfiles, onOpenCircle, onOpenBlueprint, onUpgradeRequired, onProfileUpdate, onOpenQuiz, onOpenCosmicCalendar }: PersonalCardProps) {
  const isSelfView = !!currentUser && profile.id === currentUser.id;

  if (isSelfView && allProfiles) {
    return <SelfProfileView user={currentUser} allProfiles={allProfiles} onOpenCircle={onOpenCircle} onOpenBlueprint={onOpenBlueprint} onUpgradeRequired={onUpgradeRequired} onProfileUpdate={onProfileUpdate} onOpenQuiz={onOpenQuiz} onOpenCosmicCalendar={onOpenCosmicCalendar} />;
  }

  // Fallback: legacy other-profile view
  return <LegacyPersonalCard profile={profile} />;
}

// ═══════════════════════════════════════════
// Self-Profile Dashboard (new 4-tab view)
// ═══════════════════════════════════════════

function SelfProfileView({ user, allProfiles, onOpenCircle, onOpenBlueprint, onUpgradeRequired, onProfileUpdate, onOpenQuiz, onOpenCosmicCalendar }: { user: UserProfile; allProfiles: UserProfile[]; onOpenCircle?: () => void; onOpenBlueprint?: () => void; onUpgradeRequired?: (trigger: string) => void; onProfileUpdate?: (updated: Partial<UserProfile>) => void; onOpenQuiz?: () => void; onOpenCosmicCalendar?: () => void }) {
  const tp = useTranslations('personal');
  const tc = useTranslations('common');
  const tcompat = useTranslations('compatibility');
  const { openOverlay } = useOverlay();
  const [activeTab, setActiveTab] = useState<SelfTab>("overview");

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

  // Extended numerology numbers
  const numerology = useMemo(() => {
    const hasName = !!user.name;
    const hasDate = !!(user.birthMonth && user.birthDay && user.birthYear);

    const expression = hasName ? calculateExpressionNumber(user.name) : null;
    const soulUrge = hasName ? calculateSoulUrgeNumber(user.name) : null;
    const personality = hasName ? calculatePersonalityNumber(user.name) : null;
    const balance = hasName ? calculateBalanceNumber(user.name) : null;
    const secretPassion = hasName ? calculateSecretPassion(user.name) : [];
    const karmicLessons = hasName ? calculateKarmicLessons(user.name) : [];
    const subconsciousSelf = hasName ? calculateSubconsciousSelf(user.name) : null;

    const pinnacles = hasDate ? calculatePinnacles(user.birthMonth!, user.birthDay!, user.birthYear, user.lifePath) : [];
    const periodCycles = hasDate ? calculatePeriodCycles(user.birthMonth!, user.birthDay!, user.birthYear, user.lifePath) : [];
    const challenges = hasDate ? calculateChallenges(user.birthMonth!, user.birthDay!, user.birthYear) : [];
    const loShuGrid = hasDate ? calculateLoShuGrid(user.birthMonth!, user.birthDay!, user.birthYear) : null;

    return { expression, soulUrge, personality, balance, secretPassion, karmicLessons, subconsciousSelf, pinnacles, periodCycles, challenges, loShuGrid };
  }, [user.name, user.birthMonth, user.birthDay, user.birthYear, user.lifePath]);

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
        <button
          onClick={() => openOverlay("editInfo", { profile: user, onProfileUpdate })}
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors z-10"
        >
          <Pencil size={14} className="text-white/70" />
        </button>
        <PhotoUpload
          currentPhoto={user.photo}
          onPhotoChange={(dataUri) => {
            onProfileUpdate?.({ photo: dataUri });
          }}
          size="lg"
        />
        <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-1.5 mt-3">
          {user.name}
          {user.isVerified && <VerifiedBadge size="md" />}
        </h2>
        <p className="text-xs text-slate-400 mt-0.5">{user.occupation} &middot; {user.location}</p>
        {(user.currentWork || user.school) && (
          <div className="flex flex-wrap justify-center gap-x-3 gap-y-0.5 mt-1">
            {user.currentWork && (
              <span className="flex items-center gap-1 text-[10px] text-slate-500">
                <Briefcase size={10} className="text-slate-500" />
                {user.currentWork}
              </span>
            )}
            {user.school && (
              <span className="flex items-center gap-1 text-[10px] text-slate-500">
                <GraduationCap size={10} className="text-slate-500" />
                {user.school}
              </span>
            )}
          </div>
        )}
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
        {selfTabKeys.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-2 text-[10px] font-semibold rounded-xl transition-all duration-300 ${
              activeTab === tab
                ? "bg-amber-400/15 text-amber-400 shadow-[0_0_12px_rgba(251,191,36,0.15)]"
                : "text-slate-500 hover:text-slate-300 hover:bg-white/5"
            }`}
          >
            {tp(tab)}
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
            {activeTab === "overview" && (
              <OverviewTab user={user} lp={lp} zodiac={zodiac} animal={animal} onNavigate={setActiveTab} onOpenCircle={onOpenCircle} onOpenBlueprint={onOpenBlueprint} onUpgradeRequired={onUpgradeRequired} onProfileUpdate={onProfileUpdate} onOpenQuiz={onOpenQuiz} onOpenCosmicCalendar={onOpenCosmicCalendar} />
            )}
            {activeTab === "yourNumbers" && (
              <YourNumbersTab user={user} lp={lp} birthdayNum={birthdayNum} personalYear={personalYear} numerology={numerology} />
            )}
            {activeTab === "cosmicCompass" && (
              <CosmicCompassTab user={user} zodiac={zodiac} animal={animal} />
            )}
            {activeTab === "intersections" && (
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
  user, lp, zodiac, animal, onNavigate, onOpenCircle, onOpenBlueprint, onUpgradeRequired, onProfileUpdate, onOpenQuiz, onOpenCosmicCalendar,
}: {
  user: UserProfile;
  lp: LifePathInfo | undefined;
  zodiac: ZodiacDesc | undefined;
  animal: AnimalDesc | undefined;
  onNavigate: (tab: SelfTab) => void;
  onOpenCircle?: () => void;
  onOpenBlueprint?: () => void;
  onUpgradeRequired?: (trigger: string) => void;
  onProfileUpdate?: (updated: Partial<UserProfile>) => void;
  onOpenQuiz?: () => void;
  onOpenCosmicCalendar?: () => void;
}) {
  const tp = useTranslations('personal');
  const tc = useTranslations('common');
  const tv = useTranslations('verification');
  const tq = useTranslations('quiz');
  const [verificationOpen, setVerificationOpen] = useState(false);
  const [isVerified, setIsVerified] = useState(user.isVerified || false);
  const ts = useTranslations('subscription');
  const { features } = useSubscription();
  const [portfolioOpen, setPortfolioOpen] = useState(false);
  return (
    <div className="space-y-5">
      {/* Your Cosmic Profile label */}
      <div className="text-center mb-1">
        <p className="text-xs text-slate-500 uppercase tracking-widest">{tp('yourCosmicProfile')}</p>
      </div>

      {/* Life Path Card */}
      {lp && (
        <button onClick={() => onNavigate("yourNumbers")} className="w-full text-left">
          <div className="flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-r from-amber-400/5 to-transparent border border-amber-400/10 hover:border-amber-400/25 transition-colors">
            <div className="w-12 h-12 rounded-full bg-amber-400/10 flex items-center justify-center border border-amber-400/20 shrink-0">
              <span className="text-2xl font-serif font-bold text-gradient-gold">{user.lifePath}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white">{lp.name}</p>
              <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">{lp.description}</p>
            </div>
          </div>
        </button>
      )}

      {/* Western Zodiac Card */}
      {zodiac && (
        <button onClick={() => onNavigate("cosmicCompass")} className="w-full text-left">
          <div className="flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-r from-purple-400/5 to-transparent border border-purple-400/10 hover:border-purple-400/25 transition-colors">
            <div className="w-12 h-12 rounded-full bg-purple-400/10 flex items-center justify-center border border-purple-400/20 shrink-0">
              <span className="text-2xl">{user.westernZodiac.symbol}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white">{user.westernZodiac.sign}</p>
              <p className="text-xs text-slate-400 mt-0.5">{tp('elementSignLabel', { element: user.westernZodiac.element })} &middot; {tc('ruledBy', { ruler: zodiac.ruler })}</p>
            </div>
          </div>
        </button>
      )}

      {/* Chinese Zodiac Card */}
      {animal && (
        <button onClick={() => onNavigate("cosmicCompass")} className="w-full text-left">
          <div className="flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-r from-green-400/5 to-transparent border border-green-400/10 hover:border-green-400/25 transition-colors">
            <div className="w-12 h-12 rounded-full bg-green-400/10 flex items-center justify-center border border-green-400/20 shrink-0">
              <span className="text-2xl">{user.chineseZodiac.symbol}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white">{user.chineseZodiac.fullName}</p>
              <p className="text-xs text-slate-400 mt-0.5">{tp('chineseZodiacLabel', { element: user.chineseZodiac.element })}</p>
            </div>
          </div>
        </button>
      )}

      {/* Divider */}
      <div className="border-t border-white/5" />

      {/* Professional Portfolio */}
      <button onClick={() => setPortfolioOpen(true)} className="w-full text-left">
        <div className="flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-r from-mode-business/5 to-transparent border border-mode-business/10 hover:border-mode-business/25 transition-colors">
          <div className="w-12 h-12 rounded-full bg-mode-business/10 flex items-center justify-center border border-mode-business/20 shrink-0">
            <Briefcase size={22} className="text-mode-business" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-white">{tp('portfolio')}</p>
            <p className="text-xs text-slate-400 mt-0.5">{tp('portfolioDesc')}</p>
          </div>
        </div>
      </button>

      <PortfolioEditor
        user={user}
        open={portfolioOpen}
        onClose={() => setPortfolioOpen(false)}
        onSave={async (data) => {
          try {
            await fetch("/api/user/profile", {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ ...user, ...data }),
            });
            onProfileUpdate?.(data);
          } catch {}
          setPortfolioOpen(false);
        }}
      />

      {/* My Circle — always accessible */}
      <button onClick={onOpenCircle} className="w-full text-left">
        <div className="flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-r from-teal-400/5 to-transparent border border-teal-400/10 hover:border-teal-400/25 transition-colors relative">
          <div className="w-12 h-12 rounded-full bg-teal-400/10 flex items-center justify-center border border-teal-400/20 shrink-0">
            <Users size={22} className="text-teal-400" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-white">{tp('myCircle')}</p>
            <p className="text-xs text-slate-400 mt-0.5">{tp('myCircleDesc')}</p>
          </div>
        </div>
      </button>

      {/* Cosmic Blueprint — gated */}
      <button onClick={features.cosmicBlueprint ? onOpenBlueprint : () => onUpgradeRequired?.("cosmicBlueprint")} className="w-full text-left">
        <div className="flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-r from-amber-400/5 via-purple-400/5 to-green-400/5 border border-amber-400/10 hover:border-amber-400/25 transition-colors relative">
          <div className="w-12 h-12 rounded-full bg-amber-400/10 flex items-center justify-center border border-amber-400/20 shrink-0">
            <Eye size={22} className="text-amber-400" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-white">{tc('cosmicBlueprint')}</p>
            <p className="text-xs text-slate-400 mt-0.5">{tp('cosmicBlueprintDesc')}</p>
          </div>
          {!features.cosmicBlueprint && <Lock size={14} className="text-slate-500 shrink-0" />}
        </div>
      </button>

      {/* Verification */}
      {!isVerified && (
        <button onClick={() => setVerificationOpen(true)} className="w-full text-left">
          <div className="flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-r from-blue-400/5 to-transparent border border-blue-400/10 hover:border-blue-400/25 transition-colors">
            <div className="w-12 h-12 rounded-full bg-blue-400/10 flex items-center justify-center border border-blue-400/20 shrink-0">
              <Shield size={22} className="text-blue-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white">{tv('getVerified')}</p>
              <p className="text-xs text-slate-400 mt-0.5">{tv('verifiedProfile')}</p>
            </div>
          </div>
        </button>
      )}

      <VerificationFlow
        open={verificationOpen}
        onClose={() => setVerificationOpen(false)}
        onVerified={() => {
          setIsVerified(true);
          onProfileUpdate?.({ isVerified: true });
        }}
      />

      {/* Divider */}
      <div className="border-t border-white/5" />

      {/* Prompt Editor */}
      <PromptEditor
        prompts={user.prompts || []}
        onChange={(prompts) => {
          onProfileUpdate?.({ prompts });
        }}
      />

      {/* Divider */}
      <div className="border-t border-white/5" />

      {/* Compatibility Quiz */}
      {onOpenQuiz && (
        <button onClick={onOpenQuiz} className="w-full text-left">
          <div className="flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-r from-pink-400/5 to-transparent border border-pink-400/10 hover:border-pink-400/25 transition-colors">
            <div className="w-12 h-12 rounded-full bg-pink-400/10 flex items-center justify-center border border-pink-400/20 shrink-0">
              <Heart size={22} className="text-pink-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white">{tq('compatibilityQuiz')}</p>
              <p className="text-xs text-slate-400 mt-0.5">
                {user.compatibilityAnswers && Object.keys(user.compatibilityAnswers).length > 0
                  ? tq('questionsCompleted', { count: Object.keys(user.compatibilityAnswers).length, total: 20 })
                  : tq('startQuiz')}
              </p>
            </div>
          </div>
        </button>
      )}

      {/* Voice Note */}
      {features.voiceNotes ? (
        <VoiceNoteRecorder
          onSave={() => {
            onProfileUpdate?.({ hasVoiceNote: true });
          }}
        />
      ) : user.hasVoiceNote ? (
        <VoiceNotePlayer hasVoiceNote />
      ) : null}

      {/* Video Intro */}
      {user.hasVideoIntro && (
        <VideoIntroPlayer hasVideoIntro profileName={user.name} profilePhoto={user.photo} />
      )}

      {/* Cosmic Calendar */}
      {onOpenCosmicCalendar && (
        <button onClick={onOpenCosmicCalendar} className="w-full text-left">
          <div className="flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-r from-indigo-400/5 to-transparent border border-indigo-400/10 hover:border-indigo-400/25 transition-colors">
            <div className="w-12 h-12 rounded-full bg-indigo-400/10 flex items-center justify-center border border-indigo-400/20 shrink-0">
              <Calendar size={22} className="text-indigo-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white">{tp('cosmicCalendar') || 'Cosmic Calendar'}</p>
              <p className="text-xs text-slate-400 mt-0.5">{tp('cosmicCalendarDesc') || 'Track celestial events and retrogrades'}</p>
            </div>
            {!features.retrogradeAlerts && <Lock size={14} className="text-slate-500 shrink-0" />}
          </div>
        </button>
      )}

      {/* Divider */}
      <div className="border-t border-white/5" />

      {/* Instagram */}
      <InstagramConnect />

      {/* Divider */}
      <div className="border-t border-white/5" />

      {/* Spotify */}
      <SpotifyConnect />
    </div>
  );
}

// ─── Reusable Sub-Components for Numerology ───

function NumerologySection({
  icon,
  label,
  color,
  defaultExpanded,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  color: string;
  defaultExpanded?: boolean;
  children: React.ReactNode;
}) {
  const [expanded, setExpanded] = useState(!!defaultExpanded);

  return (
    <div className="rounded-2xl overflow-hidden" style={{ border: `1px solid ${color}20` }}>
      <button
        onClick={() => setExpanded((v) => !v)}
        className="w-full flex items-center gap-2 px-4 py-3 transition-colors"
        style={{ background: `${color}08` }}
      >
        <span style={{ color }}>{icon}</span>
        <p className="text-[11px] uppercase tracking-[0.12em] font-bold flex-1 text-left" style={{ color }}>{label}</p>
        {expanded ? <ChevronUp size={14} style={{ color }} /> : <ChevronDown size={14} style={{ color }} />}
      </button>
      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 pt-2 space-y-3">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function NumerologyCard({
  number,
  label,
  name,
  description,
  color,
}: {
  number: number | string;
  label: string;
  name: string;
  description: string;
  color: string;
}) {
  return (
    <div className="p-3.5 rounded-xl bg-white/[0.03]" style={{ border: `1px solid ${color}18` }}>
      <div className="flex items-center gap-3">
        <div
          className="w-11 h-11 rounded-full flex items-center justify-center shrink-0"
          style={{ background: `${color}15`, border: `1px solid ${color}30` }}
        >
          <span className="text-lg font-serif font-bold" style={{ color }}>{number}</span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[10px] uppercase tracking-widest font-semibold" style={{ color: `${color}99` }}>{label}</p>
          <p className="text-sm font-semibold text-white mt-0.5">{name}</p>
        </div>
      </div>
      <p className="text-xs text-slate-400 mt-2 leading-relaxed">{description}</p>
    </div>
  );
}

// ─── Tab 2: Your Numbers (Expanded) ───

interface NumerologyData {
  expression: number | null;
  soulUrge: number | null;
  personality: number | null;
  balance: number | null;
  secretPassion: number[];
  karmicLessons: number[];
  subconsciousSelf: number | null;
  pinnacles: PinnacleInfo[];
  periodCycles: CycleInfo[];
  challenges: ChallengeInfo[];
  loShuGrid: LoShuGrid | null;
}

function YourNumbersTab({
  user, lp, birthdayNum, personalYear, numerology,
}: {
  user: UserProfile;
  lp: LifePathInfo | undefined;
  birthdayNum: number | null;
  personalYear: number | null;
  numerology: NumerologyData;
}) {
  const bdData = birthdayNum ? birthdayNumberData[birthdayNum] : null;
  const pyData = personalYear ? personalYearData[personalYear] : null;

  const tp = useTranslations('personal');
  const tc = useTranslations('common');
  const { expression, soulUrge, personality, balance, secretPassion, karmicLessons, subconsciousSelf, pinnacles, periodCycles, challenges, loShuGrid } = numerology;

  const exprData = expression !== null ? expressionNumberData[expression] : null;
  const soulData = soulUrge !== null ? soulUrgeNumberData[soulUrge] : null;
  const persData = personality !== null ? personalityNumberData[personality] : null;
  const balData = balance !== null ? balanceNumberData[balance] : null;
  const subSelfValue = subconsciousSelf !== null ? subconsciousSelf : null;

  return (
    <div className="space-y-3">
      {/* Section 1: Core Numbers (expanded by default, amber) */}
      <NumerologySection
        icon={<Sparkles size={14} />}
        label={tp('coreNumbers')}
        color="#f59e0b"
        defaultExpanded
      >
        {/* Life Path Hero */}
        {lp && (
          <div className="text-center pb-2">
            <div className="w-18 h-18 mx-auto rounded-full bg-gradient-to-br from-amber-400/20 to-amber-400/5 flex items-center justify-center border border-amber-400/30" style={{ width: 72, height: 72 }}>
              <span className="text-3xl font-serif font-bold text-gradient-gold">{user.lifePath}</span>
            </div>
            <p className="text-base font-bold mt-2 text-white">{lp.name}</p>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">{lp.description}</p>
            <div className="flex flex-wrap justify-center gap-1.5 mt-2">
              {lp.traits.map((t) => (
                <span key={t} className="cosmic-tag bg-amber-400/10 text-amber-400 border border-amber-400/20 text-[10px]">{t}</span>
              ))}
            </div>
          </div>
        )}

        {exprData && expression !== null && (
          <NumerologyCard number={expression} label={tp('expressionNumber')} name={exprData.name} description={exprData.description} color="#f59e0b" />
        )}
        {soulData && soulUrge !== null && (
          <NumerologyCard number={soulUrge} label={tp('soulUrgeNumber')} name={soulData.name} description={soulData.description} color="#f59e0b" />
        )}
        {persData && personality !== null && (
          <NumerologyCard number={personality} label={tp('personalityNumber')} name={persData.name} description={persData.description} color="#f59e0b" />
        )}
      </NumerologySection>

      {/* Section 2: Personal Timing (collapsed, teal) */}
      <NumerologySection
        icon={<Calendar size={14} />}
        label={tp('personalTiming')}
        color="#14b8a6"
      >
        {bdData && birthdayNum !== null && (
          <NumerologyCard number={birthdayNum} label={tc('birthdayNumber')} name={bdData.name} description={bdData.description} color="#14b8a6" />
        )}
        {pyData && personalYear !== null && (
          <NumerologyCard number={personalYear} label={tc('personalYear', { year: new Date().getFullYear() })} name={pyData.name} description={pyData.description} color="#14b8a6" />
        )}

      </NumerologySection>

      {/* Section 3: Hidden Influences (collapsed, purple) */}
      <NumerologySection
        icon={<Eye size={14} />}
        label={tp('hiddenInfluences')}
        color="#a78bfa"
      >
        {balData && balance !== null && (
          <NumerologyCard number={balance} label={tp('balanceNumber')} name={balData.name} description={balData.description} color="#a78bfa" />
        )}

        {/* Secret Passion */}
        {secretPassion.length > 0 && (
          <div className="p-3.5 rounded-xl bg-white/[0.03]" style={{ border: "1px solid rgba(167,139,250,0.1)" }}>
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full flex items-center justify-center shrink-0" style={{ background: "rgba(167,139,250,0.08)", border: "1px solid rgba(167,139,250,0.2)" }}>
                <span className="text-lg font-serif font-bold text-purple-400">{secretPassion.join(",")}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] uppercase tracking-widest font-semibold text-purple-400/60">{tp('secretPassion')}</p>
                <p className="text-sm font-semibold text-white mt-0.5">{secretPassion.map((n) => secretPassionData[n]?.name).filter(Boolean).join(" & ")}</p>
              </div>
            </div>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">{secretPassion.map((n) => secretPassionData[n]?.description).filter(Boolean).join(" ")}</p>
          </div>
        )}

        {/* Karmic Lessons */}
        <div className="p-3.5 rounded-xl bg-white/[0.03]" style={{ border: "1px solid rgba(167,139,250,0.1)" }}>
          <p className="text-[10px] uppercase tracking-widest font-semibold text-purple-400/60 mb-2">{tp('karmicLessons')}</p>
          {karmicLessons.length === 0 ? (
            <p className="text-xs text-slate-400">{tp('noKarmicLessons')}</p>
          ) : (
            <>
              <div className="flex flex-wrap gap-1.5 mb-2">
                {karmicLessons.map((n) => (
                  <span key={n} className="inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold" style={{ background: "rgba(167,139,250,0.1)", border: "1px solid rgba(167,139,250,0.25)", color: "#a78bfa" }}>{n}</span>
                ))}
              </div>
              <div className="space-y-1.5">
                {karmicLessons.map((n) => {
                  const data = karmicLessonData[n];
                  return data ? (
                    <p key={n} className="text-xs text-slate-400 leading-relaxed"><span className="text-purple-400 font-semibold">{n}:</span> {data.description}</p>
                  ) : null;
                })}
              </div>
            </>
          )}
        </div>

        {/* Subconscious Self */}
        {subSelfValue !== null && (
          <div className="p-3.5 rounded-xl bg-white/[0.03]" style={{ border: "1px solid rgba(167,139,250,0.1)" }}>
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full flex items-center justify-center shrink-0" style={{ background: "rgba(167,139,250,0.08)", border: "1px solid rgba(167,139,250,0.2)" }}>
                <span className="text-lg font-serif font-bold text-purple-400">{subSelfValue}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] uppercase tracking-widest font-semibold text-purple-400/60">{tp('subconsciousSelf')}</p>
                <p className="text-sm font-semibold text-white mt-0.5">{tp('digitsPresent', { count: subSelfValue })}</p>
              </div>
            </div>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              {subSelfValue >= 8
                ? tp('subconsciousHigh')
                : subSelfValue >= 6
                  ? tp('subconsciousMid')
                  : tp('subconsciousLow')}
            </p>
          </div>
        )}
      </NumerologySection>

      {/* Section 4: Life Timeline (collapsed, indigo) */}
      <NumerologySection
        icon={<TrendingUp size={14} />}
        label={tp('lifeTimeline')}
        color="#818cf8"
      >
        {/* Pinnacles */}
        {pinnacles.length > 0 && (
          <div>
            <p className="text-[10px] uppercase tracking-widest font-semibold text-indigo-400/60 mb-2">{tp('pinnacles')}</p>
            <div className="space-y-2">
              {pinnacles.map((p) => {
                const data = pinnacleNumberData[p.number];
                return (
                  <div key={p.label} className="p-3 rounded-xl bg-white/[0.03]" style={{ border: "1px solid rgba(129,140,248,0.1)" }}>
                    <div className="flex items-center gap-2.5">
                      <span className="inline-flex items-center justify-center w-9 h-9 rounded-full text-sm font-bold shrink-0" style={{ background: "rgba(129,140,248,0.1)", border: "1px solid rgba(129,140,248,0.25)", color: "#818cf8" }}>{p.number}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-white">{p.label}{data ? `: ${data.name}` : ""}</p>
                        <p className="text-[10px] text-slate-500">{tc('ages', { start: p.startAge, end: p.endAge !== null ? p.endAge : tc('endOfLife') })}</p>
                      </div>
                    </div>
                    {data && <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">{data.description}</p>}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Period Cycles */}
        {periodCycles.length > 0 && (
          <div>
            <p className="text-[10px] uppercase tracking-widest font-semibold text-indigo-400/60 mb-2">{tp('periodCycles')}</p>
            <div className="space-y-2">
              {periodCycles.map((c) => {
                const data = periodCycleData[c.number];
                return (
                  <div key={c.label} className="p-3 rounded-xl bg-white/[0.03]" style={{ border: "1px solid rgba(129,140,248,0.1)" }}>
                    <div className="flex items-center gap-2.5">
                      <span className="inline-flex items-center justify-center w-9 h-9 rounded-full text-sm font-bold shrink-0" style={{ background: "rgba(129,140,248,0.1)", border: "1px solid rgba(129,140,248,0.25)", color: "#818cf8" }}>{c.number}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-white">{c.label}{data ? `: ${data.name}` : ""}</p>
                        <p className="text-[10px] text-slate-500">{tc('ages', { start: c.startAge, end: c.endAge !== null ? c.endAge : tc('endOfLife') })}</p>
                      </div>
                    </div>
                    {data && <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">{data.description}</p>}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Challenges */}
        {challenges.length > 0 && (
          <div>
            <p className="text-[10px] uppercase tracking-widest font-semibold text-indigo-400/60 mb-2">{tp('challenges')}</p>
            <div className="space-y-2">
              {challenges.map((ch) => {
                const data = challengeNumberData[ch.number];
                return (
                  <div key={ch.label} className="p-3 rounded-xl bg-white/[0.03]" style={{ border: "1px solid rgba(129,140,248,0.1)" }}>
                    <div className="flex items-center gap-2.5">
                      <span className="inline-flex items-center justify-center w-9 h-9 rounded-full text-sm font-bold shrink-0" style={{ background: "rgba(129,140,248,0.1)", border: "1px solid rgba(129,140,248,0.25)", color: "#818cf8" }}>{ch.number}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-white">{ch.label}{data ? `: ${data.name}` : ""}</p>
                      </div>
                    </div>
                    {data && <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">{data.description}</p>}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </NumerologySection>

      {/* Section 5: Lo Shu Grid (collapsed, rose) */}
      {loShuGrid && (
        <NumerologySection
          icon={<Grid3x3 size={14} />}
          label={tp('loShuGrid')}
          color="#f43f5e"
        >
          <LoShuGridDisplay grid={loShuGrid} />
          {/* Astrological House for this Life Path */}
          {user.lifePath && astroHouseData[user.lifePath] && (
            <div className="p-3.5 rounded-xl bg-white/[0.03]" style={{ border: "1px solid rgba(244,63,94,0.1)" }}>
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full flex items-center justify-center shrink-0" style={{ background: "rgba(244,63,94,0.08)", border: "1px solid rgba(244,63,94,0.2)" }}>
                  <span className="text-lg font-serif font-bold text-rose-400">{astroHouseData[user.lifePath].house}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] uppercase tracking-widest font-semibold text-rose-400/60">{tp('astroHouse')}</p>
                  <p className="text-sm font-semibold text-white mt-0.5">{astroHouseData[user.lifePath].name}</p>
                </div>
              </div>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">{astroHouseData[user.lifePath].description}</p>
              <div className="flex flex-wrap gap-1.5 mt-2">
                {astroHouseData[user.lifePath].keywords.map((k) => (
                  <span key={k} className="cosmic-tag bg-rose-400/10 text-rose-400 border border-rose-400/20 text-[10px]">{k}</span>
                ))}
              </div>
            </div>
          )}
        </NumerologySection>
      )}
    </div>
  );
}

// ─── Lo Shu Grid Visual Display ───
const LO_SHU_LAYOUT = [
  [4, 9, 2],
  [3, 5, 7],
  [8, 1, 6],
];

function LoShuGridDisplay({ grid }: { grid: LoShuGrid }) {
  const tl = useTranslations('loShu');
  const tp = useTranslations('personal');

  return (
    <div className="space-y-3">
      <p className="text-[10px] text-slate-500 leading-relaxed">{tp('loShuGridDesc')}</p>

      {/* 3x3 Grid */}
      <div className="grid grid-cols-3 gap-1.5">
        {LO_SHU_LAYOUT.flat().map((num) => {
          const pos = grid.positions[num];
          const isPresent = pos.count > 0;
          const isStrong = pos.count >= 2;
          return (
            <div
              key={num}
              className="relative rounded-xl p-2.5 text-center transition-all"
              style={{
                background: isPresent ? `${pos.color}${isStrong ? "20" : "10"}` : "rgba(255,255,255,0.02)",
                border: `1px solid ${isPresent ? `${pos.color}${isStrong ? "40" : "20"}` : "rgba(255,255,255,0.05)"}`,
                opacity: isPresent ? 1 : 0.4,
              }}
            >
              <div className="flex items-center justify-center gap-1">
                <span
                  className="text-lg font-bold font-serif"
                  style={{ color: isPresent ? pos.color : "rgba(255,255,255,0.3)" }}
                >
                  {num}
                </span>
                {isStrong && (
                  <span className="text-[9px] font-bold px-1 py-0.5 rounded-full" style={{ background: `${pos.color}25`, color: pos.color }}>
                    ×{pos.count}
                  </span>
                )}
              </div>
              <p className="text-[8px] mt-0.5 leading-tight" style={{ color: isPresent ? `${pos.color}cc` : "rgba(255,255,255,0.2)" }}>
                {tl(`pos${num}` as "pos1")}
              </p>
            </div>
          );
        })}
      </div>

      {/* Strengths & Growth */}
      <div className="grid grid-cols-2 gap-2">
        {grid.presentDigits.length > 0 && (
          <div className="p-2.5 rounded-xl bg-rose-500/5 border border-rose-500/10">
            <p className="text-[9px] uppercase tracking-widest font-semibold text-rose-400/70 mb-1.5">{tp('loShuStrengths')}</p>
            <div className="flex flex-wrap gap-1">
              {grid.presentDigits.map((n) => (
                <span
                  key={n}
                  className="inline-flex items-center justify-center w-6 h-6 rounded-full text-[10px] font-bold"
                  style={{
                    background: `${grid.positions[n].color}15`,
                    border: `1px solid ${grid.positions[n].color}30`,
                    color: grid.positions[n].color,
                  }}
                >
                  {n}
                </span>
              ))}
            </div>
          </div>
        )}
        {grid.missingDigits.length > 0 && (
          <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5">
            <p className="text-[9px] uppercase tracking-widest font-semibold text-slate-500 mb-1.5">{tp('loShuGrowth')}</p>
            <div className="flex flex-wrap gap-1">
              {grid.missingDigits.map((n) => (
                <span
                  key={n}
                  className="inline-flex items-center justify-center w-6 h-6 rounded-full text-[10px] font-bold bg-white/5 border border-white/10 text-slate-500"
                >
                  {n}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
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
  const tc = useTranslations('common');
  return (
    <div className="space-y-5">
      {/* Western Section */}
      {zodiac && (
        <div>
          <SectionHeader icon={<Sun size={12} />} label={tc('westernZodiac')} />
          <div className="text-center mb-3">
            <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-purple-400/20 to-purple-400/5 flex items-center justify-center border border-purple-400/20">
              <span className="text-3xl">{user.westernZodiac.symbol}</span>
            </div>
            <p className="text-base font-bold mt-2 text-white">{user.westernZodiac.sign}</p>
            <p className="text-[11px] text-slate-400">{user.westernZodiac.element} {tc('element')} &middot; {tc('ruledBy', { ruler: zodiac.ruler })}</p>
            <p className="text-[10px] text-purple-300/70 mt-1">{zodiac.polarityLabel}</p>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed mb-3">{zodiac.traits}</p>
          <div className="p-3 rounded-xl bg-purple-400/5 border border-purple-400/10 mb-3">
            <p className="text-[10px] text-purple-300 font-semibold uppercase tracking-widest mb-1">
              <Sparkles size={10} className="inline mr-1" />{tc('elementMeaning')}
            </p>
            <p className="text-xs text-slate-400 leading-relaxed">{elementDescriptions[user.westernZodiac.element]}</p>
          </div>
          <div className="p-3 rounded-xl bg-purple-400/5 border border-purple-400/10 mb-3">
            <p className="text-[10px] text-purple-300 font-semibold uppercase tracking-widest mb-1">{tc('polarity')}</p>
            <p className="text-xs text-slate-400 leading-relaxed">
              {zodiac.polarity === "Positive"
                ? tc('polarityPositive')
                : tc('polarityNegative')}
            </p>
          </div>
          <div>
            <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-2 font-semibold">{tc('compatibleSigns')}</p>
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
          <SectionHeader icon={<Moon size={12} />} label={tc('chineseZodiac')} />
          <div className="text-center mb-3">
            <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-green-400/20 to-green-400/5 flex items-center justify-center border border-green-400/20">
              <span className="text-3xl">{user.chineseZodiac.symbol}</span>
            </div>
            <p className="text-base font-bold mt-2 text-white">{user.chineseZodiac.fullName}</p>
            <p className="text-[11px] text-slate-400">{user.chineseZodiac.element} {tc('element')}</p>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed mb-3">{animal.traits}</p>
          <div className="p-3 rounded-xl bg-green-400/5 border border-green-400/10 mb-3">
            <p className="text-[10px] text-green-300 font-semibold uppercase tracking-widest mb-1">{tc('elementMeaning')}</p>
            <p className="text-xs text-slate-400 leading-relaxed">{chineseElementDescriptions[user.chineseZodiac.element]}</p>
          </div>
          <div className="grid grid-cols-2 gap-2 mb-3">
            <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5">
              <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">{tc('luckyNumbers')}</p>
              <p className="text-sm font-semibold text-white">{animal.luckyNumbers.join(", ")}</p>
            </div>
            <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5">
              <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">{tc('luckyColors')}</p>
              <p className="text-sm font-semibold text-white">{animal.luckyColors.join(", ")}</p>
            </div>
          </div>
          <div className="mb-3">
            <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-2 font-semibold">{tc('compatible')}</p>
            <div className="flex flex-wrap gap-1.5">
              {animal.compatibleAnimals.map((a) => (
                <span key={a} className="cosmic-tag bg-green-400/10 text-green-300 border border-green-400/20">{a}</span>
              ))}
            </div>
          </div>
          <div>
            <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-2 font-semibold">{tc('incompatible')}</p>
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
  const tp = useTranslations('personal');
  const tc = useTranslations('common');
  const tcompat = useTranslations('compatibility');
  const totalOthers = allProfiles.filter((p) => p.id !== user.id).length;
  const compatLabel = getCompatibilityLabel(data.averageScore);

  if (totalOthers === 0) {
    return (
      <div className="text-center py-8">
        <Users size={32} className="mx-auto text-slate-600 mb-3" />
        <p className="text-sm text-slate-400">{tp('noCommunity')}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Average Score */}
      <div className="text-center py-2">
        <p className="text-[10px] text-amber-400/60 uppercase tracking-widest font-semibold mb-2">{tcompat('communityCompatibility')}</p>
        <span className="text-4xl font-bold" style={{ color: compatLabel.color }}>{data.averageScore}%</span>
        <p className="text-xs text-slate-400 mt-1">{tcompat('averageMatch', { count: totalOthers })}</p>
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
        <SectionHeader icon={<Heart size={12} />} label={tcompat('topMatches')} />
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
        <p className="text-[10px] uppercase tracking-widest font-semibold text-slate-500 mb-2.5">{tcompat('matchDistribution')}</p>
        <div className="space-y-1.5">
          {tierConfig.map((tier) => {
            const count = data.distribution[tier.key];
            const pct = totalOthers > 0 ? (count / totalOthers) * 100 : 0;
            return (
              <div key={tier.key} className="flex items-center gap-2">
                <span className="text-[10px] text-slate-400 w-16 text-right">{tcompat(tier.labelKey)}</span>
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
          <Sparkles size={10} className="inline mr-1" />{tc('cosmicInsight')}
        </p>
        <p className="text-xs text-slate-400 leading-relaxed">
          {tcompat('cosmicInsightIntersection', { sign: user.westernZodiac.sign, element: user.westernZodiac.element, count: sameElementCount })}
        </p>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════
// Legacy card for viewing other profiles
// ═══════════════════════════════════════════

const legacyTabKeys = ["overview", "numerology", "western", "eastern"] as const;
type LegacyTab = (typeof legacyTabKeys)[number];

function LegacyPersonalCard({ profile }: { profile: UserProfile }) {
  const tp = useTranslations('personal');
  const tc = useTranslations('common');
  const [activeTab, setActiveTab] = useState<LegacyTab>("overview");
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
      {profile.photo ? (
        <div className="relative h-52">
          <Image src={profile.photo} alt={profile.name} fill className="object-cover" />
          <div className="absolute inset-0 photo-gradient" />
          <div className="absolute bottom-4 left-5 right-5">
            <h2 className="text-[26px] font-bold tracking-tight">
              {profile.name}<span className="text-slate-300 font-light ml-2">{profile.age}</span>
            </h2>
            <p className="text-sm text-slate-300">{profile.occupation} &middot; {profile.location}</p>
            {(profile.currentWork || profile.school) && (
              <div className="flex flex-wrap gap-x-3 gap-y-0.5 mt-0.5">
                {profile.currentWork && (
                  <span className="flex items-center gap-1 text-[10px] text-slate-400">
                    <Briefcase size={10} />
                    {profile.currentWork}
                  </span>
                )}
                {profile.school && (
                  <span className="flex items-center gap-1 text-[10px] text-slate-400">
                    <GraduationCap size={10} />
                    {profile.school}
                  </span>
                )}
              </div>
            )}
          </div>
          <div className="absolute top-4 right-4 flex flex-col gap-1.5">
            <CosmicInfo type="lifePath" value={profile.lifePath}>
              <div className="glass-card-strong rounded-xl px-2.5 py-1 flex items-center gap-1.5">
                <span className="text-amber-accent text-sm font-bold">{profile.lifePath}</span>
                <span className="text-[9px] text-slate-400">LP</span>
              </div>
            </CosmicInfo>
            <CosmicInfo type="westernZodiac" value={profile.westernZodiac.sign}>
              <div className="glass-card-strong rounded-xl px-2.5 py-1 flex items-center gap-1.5">
                <span className="text-sm">{profile.westernZodiac.symbol}</span>
                <span className="text-[9px] text-slate-400">{profile.westernZodiac.element}</span>
              </div>
            </CosmicInfo>
            <CosmicInfo type="chineseZodiac" value={profile.chineseZodiac.animal}>
              <div className="glass-card-strong rounded-xl px-2.5 py-1 flex items-center gap-1.5">
                <span className="text-sm">{profile.chineseZodiac.symbol}</span>
                <span className="text-[9px] text-slate-400">{profile.chineseZodiac.element}</span>
              </div>
            </CosmicInfo>
          </div>
        </div>
      ) : (
        <div className="relative py-6 px-5 flex flex-col items-center" style={{ background: "linear-gradient(180deg, rgba(13,61,56,0.6) 0%, transparent 100%)" }}>
          <div className="w-20 h-20 rounded-full bg-teal-900/60 border-2 border-amber-400/50 flex items-center justify-center mb-3">
            <span className="text-2xl font-bold text-amber-300">
              {profile.name.split(" ").filter(Boolean).map((w) => w[0]).join("").toUpperCase().slice(0, 2)}
            </span>
          </div>
          <h2 className="text-xl font-bold tracking-tight text-white">
            {profile.name}{profile.age ? <span className="text-slate-300 font-light ml-2">{profile.age}</span> : null}
          </h2>
          {(profile.occupation || profile.location) && (
            <p className="text-xs text-slate-400 mt-0.5">
              {[profile.occupation, profile.location].filter(Boolean).join(" \u00b7 ")}
            </p>
          )}
          {(profile.currentWork || profile.school) && (
            <div className="flex flex-wrap justify-center gap-x-3 gap-y-0.5 mt-1">
              {profile.currentWork && (
                <span className="flex items-center gap-1 text-[10px] text-slate-500">
                  <Briefcase size={10} />
                  {profile.currentWork}
                </span>
              )}
              {profile.school && (
                <span className="flex items-center gap-1 text-[10px] text-slate-500">
                  <GraduationCap size={10} />
                  {profile.school}
                </span>
              )}
            </div>
          )}
          <div className="flex gap-2 mt-3">
            <CosmicInfo type="lifePath" value={profile.lifePath}>
              <span className="glass-card-strong rounded-xl px-2.5 py-1 flex items-center gap-1.5 text-xs">
                <span className="text-amber-400 font-bold">{profile.lifePath}</span>
                <span className="text-[9px] text-slate-400">LP</span>
              </span>
            </CosmicInfo>
            <CosmicInfo type="westernZodiac" value={profile.westernZodiac.sign}>
              <span className="glass-card-strong rounded-xl px-2.5 py-1 flex items-center gap-1.5 text-xs">
                <span>{profile.westernZodiac.symbol}</span>
                <span className="text-[9px] text-slate-400">{profile.westernZodiac.sign}</span>
              </span>
            </CosmicInfo>
            <CosmicInfo type="chineseZodiac" value={profile.chineseZodiac.animal}>
              <span className="glass-card-strong rounded-xl px-2.5 py-1 flex items-center gap-1.5 text-xs">
                <span>{profile.chineseZodiac.symbol}</span>
                <span className="text-[9px] text-slate-400">{profile.chineseZodiac.animal}</span>
              </span>
            </CosmicInfo>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 px-3 pt-3">
        {legacyTabKeys.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-2 text-[11px] font-semibold rounded-xl transition-all duration-300 ${
              activeTab === tab
                ? "bg-mode-personal/15 text-mode-personal shadow-[0_0_12px_rgba(167,139,250,0.15)]"
                : "text-slate-500 hover:text-slate-300 hover:bg-white/5"
            }`}
          >
            {tp(tab)}
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
            {activeTab === "overview" && (
              <div className="space-y-3">
                <div className="text-center mb-4">
                  <p className="text-xs text-slate-500 uppercase tracking-widest">{tp('yourCosmicProfile')}</p>
                </div>
                <CosmicInfo type="lifePath" value={profile.lifePath}>
                  <div className="flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-r from-amber-accent/5 to-transparent border border-amber-accent/10 w-full">
                    <div className="w-12 h-12 rounded-full bg-amber-accent/10 flex items-center justify-center">
                      <span className="text-2xl font-serif font-bold text-gradient-gold">{profile.lifePath}</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold">{lp?.name}</p>
                      <p className="text-xs text-slate-400 mt-0.5">{lp?.description}</p>
                    </div>
                  </div>
                </CosmicInfo>
                <CosmicInfo type="westernZodiac" value={profile.westernZodiac.sign}>
                  <div className="flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-r from-mode-personal/5 to-transparent border border-mode-personal/10 w-full">
                    <div className="w-12 h-12 rounded-full bg-mode-personal/10 flex items-center justify-center">
                      <Sun size={22} className="text-mode-personal" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold">{profile.westernZodiac.symbol} {profile.westernZodiac.sign}</p>
                      <p className="text-xs text-slate-400 mt-0.5">{tp('elementSignLabel', { element: profile.westernZodiac.element })} &middot; {tc('ruledBy', { ruler: zodiac?.ruler })}</p>
                    </div>
                  </div>
                </CosmicInfo>
                <CosmicInfo type="chineseZodiac" value={profile.chineseZodiac.animal}>
                  <div className="flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-r from-green-500/5 to-transparent border border-green-500/10 w-full">
                    <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center">
                      <Moon size={22} className="text-green-400" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold">{profile.chineseZodiac.symbol} {profile.chineseZodiac.fullName}</p>
                      <p className="text-xs text-slate-400 mt-0.5">{tp('chineseZodiacLabel', { element: profile.chineseZodiac.element })}</p>
                    </div>
                  </div>
                </CosmicInfo>
              </div>
            )}

            {activeTab === "numerology" && lp && (
              <div className="space-y-5">
                <div className="text-center">
                  <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-amber-accent/20 to-amber-accent/5 flex items-center justify-center border border-amber-accent/20">
                    <span className="text-4xl font-serif font-bold text-gradient-gold">{profile.lifePath}</span>
                  </div>
                  <p className="text-lg font-bold mt-3">{lp.name}</p>
                  <p className="text-sm text-slate-400 mt-1 leading-relaxed">{lp.description}</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-3 font-semibold">{tc('coreStrengths')}</p>
                  <div className="flex flex-wrap gap-2">
                    {lp.traits.map((t) => (
                      <span key={t} className="cosmic-tag bg-amber-accent/10 text-amber-accent border border-amber-accent/20">{t}</span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "western" && zodiac && (
              <div className="space-y-5">
                <div className="text-center">
                  <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-mode-personal/20 to-mode-personal/5 flex items-center justify-center border border-mode-personal/20">
                    <span className="text-4xl">{profile.westernZodiac.symbol}</span>
                  </div>
                  <p className="text-lg font-bold mt-3">{profile.westernZodiac.sign}</p>
                  <p className="text-xs text-slate-400">{tc('ruledBy', { ruler: zodiac.ruler })} &middot; {profile.westernZodiac.element} {tc('element')}</p>
                  <p className="text-[10px] text-mode-personal/70 mt-1">{zodiac.polarityLabel}</p>
                </div>
                <p className="text-sm text-slate-300 leading-relaxed">{zodiac.traits}</p>
                <div className="p-3 rounded-xl bg-mode-personal/5 border border-mode-personal/10">
                  <p className="text-[10px] text-mode-personal font-semibold uppercase tracking-widest mb-1">
                    <Sparkles size={10} className="inline mr-1" />{tc('elementMeaning')}
                  </p>
                  <p className="text-xs text-slate-400 leading-relaxed">{elementDescriptions[profile.westernZodiac.element]}</p>
                </div>
                <div className="p-3 rounded-xl bg-mode-personal/5 border border-mode-personal/10">
                  <p className="text-[10px] text-mode-personal font-semibold uppercase tracking-widest mb-1">{tc('polarity')}</p>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {zodiac.polarity === "Positive"
                      ? tc('polarityPositive')
                      : tc('polarityNegative')}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-3 font-semibold">{tc('bestMatches')}</p>
                  <div className="flex flex-wrap gap-2">
                    {zodiac.compatibleSigns.map((s) => (
                      <span key={s} className="cosmic-tag bg-mode-personal/10 text-mode-personal border border-mode-personal/20">{s}</span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "eastern" && animal && (
              <div className="space-y-5">
                <div className="text-center">
                  <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-green-500/20 to-green-500/5 flex items-center justify-center border border-green-500/20">
                    <span className="text-4xl">{profile.chineseZodiac.symbol}</span>
                  </div>
                  <p className="text-lg font-bold mt-3">{profile.chineseZodiac.fullName}</p>
                  <p className="text-xs text-slate-400">{profile.chineseZodiac.element} {tc('element')}</p>
                </div>
                <p className="text-sm text-slate-300 leading-relaxed">{animal.traits}</p>
                <div className="p-3 rounded-xl bg-green-500/5 border border-green-500/10">
                  <p className="text-[10px] text-green-400 font-semibold uppercase tracking-widest mb-1">{tc('elementMeaning')}</p>
                  <p className="text-xs text-slate-400 leading-relaxed">{chineseElementDescriptions[profile.chineseZodiac.element]}</p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5">
                    <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">{tc('luckyNumbers')}</p>
                    <p className="text-sm font-semibold">{animal.luckyNumbers.join(", ")}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5">
                    <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">{tc('luckyColors')}</p>
                    <p className="text-sm font-semibold">{animal.luckyColors.join(", ")}</p>
                  </div>
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-3 font-semibold">{tc('compatibleAnimals')}</p>
                  <div className="flex flex-wrap gap-2">
                    {animal.compatibleAnimals.map((a) => (
                      <span key={a} className="cosmic-tag bg-green-500/10 text-green-400 border border-green-500/20">{a}</span>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-3 font-semibold">{tc('incompatibleAnimals')}</p>
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
