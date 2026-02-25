"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, ChevronDown, ChevronUp, Heart, Sparkles } from "lucide-react";
import { useTranslations } from 'next-intl';
import { lifePathData, calculateCompatibility, getCompatibilityLabel, isSoulmateMatch } from "@/lib/cosmic-calculations";
import CompatibilityBar from "./CompatibilityBar";
import MatchInsights from "./MatchInsights";
import CosmicInfo from "@/components/CosmicInfo";
import VerifiedBadge from "@/components/VerifiedBadge";
import type { UserProfile } from "@/types/profile";

const defaultUser: UserProfile = {
  id: "0", name: "You", age: 28, birthYear: 1996, location: "NYC", occupation: "Engineer",
  photo: "", lifePath: 7,
  westernZodiac: { sign: "Virgo", symbol: "\u264D", element: "Earth" },
  chineseZodiac: { animal: "Rat", symbol: "\uD83D\uDC00", element: "Fire", elementColor: "#ef4444", elementSymbol: "\uD83D\uDD25", fullName: "Fire Rat" },
  prompts: [],
};

export default function PartnerCard({ profile, allProfiles = [], currentUser }: { profile: UserProfile; allProfiles?: UserProfile[]; currentUser?: UserProfile }) {
  const t = useTranslations('compatibility');
  const tc = useTranslations('common');
  const user = currentUser ?? defaultUser;
  const [expanded, setExpanded] = useState(false);
  const compat = calculateCompatibility(user, profile);
  const lp = lifePathData[profile.lifePath];

  const compatLabel = getCompatibilityLabel(compat.overall);
  const isSoulmate = isSoulmateMatch(user, profile);

  const emotional = Math.min(99, compat.western + Math.floor(Math.random() * 6));
  const lifeGoals = Math.min(99, compat.lifePath + Math.floor(Math.random() * 5));
  const communication = Math.min(99, Math.round((compat.western + compat.chinese) / 2) + 3);
  const values = Math.min(99, compat.chinese + Math.floor(Math.random() * 7));
  const longTerm = compat.overall;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card rounded-[28px] overflow-hidden max-w-sm mx-auto card-stack-shadow"
    >
      {/* Photo */}
      <div className="relative h-64">
        <Image src={profile.photo} alt={profile.name} fill className="object-cover" />
        <div className="absolute inset-0 photo-gradient" />

        {/* Compatibility Ring */}
        <div className="absolute top-4 right-4">
          <div className="relative w-16 h-16">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
              <circle cx="18" cy="18" r="15.5" fill="rgba(15, 23, 42, 0.7)" stroke="rgba(236, 72, 153, 0.15)" strokeWidth="2.5" />
              <circle
                cx="18" cy="18" r="15.5" fill="none"
                stroke="#ec4899" strokeWidth="2.5"
                strokeDasharray={`${compat.overall} ${100 - compat.overall}`}
                strokeLinecap="round"
                className="transition-all duration-1000"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-sm font-bold text-mode-partner">{compat.overall}%</span>
            </div>
          </div>
        </div>

        {/* Profile Info */}
        <div className="absolute bottom-4 left-5 right-5">
          <h2 className="text-[28px] font-bold tracking-tight flex items-center gap-1.5">
            {profile.name}{profile.isVerified && <VerifiedBadge size="md" />}<span className="text-slate-300 font-light ml-2">{profile.age}</span>
          </h2>
          <p className="text-sm text-slate-200">{profile.occupation}</p>
          <div className="flex items-center gap-1.5 text-slate-400 text-xs mt-0.5">
            <MapPin size={11} />
            <span>{profile.location}</span>
          </div>
        </div>
      </div>

      <div className="p-5 space-y-4">
        {/* Compatibility Label */}
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-widest" style={{ color: compatLabel.color }}>
            {compatLabel.label}
          </span>
          {isSoulmate && (
            <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-gradient-to-r from-mode-partner/20 to-mode-personal/20 border border-mode-partner/30 text-mode-partner pulse-glow">
              {t('soulmateLabel')}
            </span>
          )}
        </div>

        {/* Cosmic Insight */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-mode-partner/10 via-mode-partner/5 to-transparent border border-mode-partner/15">
          <div className="flex items-center gap-1.5 mb-2">
            <Sparkles size={12} className="text-mode-partner" />
            <p className="text-[10px] text-mode-partner font-bold uppercase tracking-widest">{tc('cosmicInsight')}</p>
          </div>
          <p className="text-[13px] text-slate-300 leading-relaxed">
            {t('cosmicInsightPartner', {
              userElement: user.westernZodiac.element,
              name: profile.name,
              profileElement: profile.westernZodiac.element,
              lifePath: profile.lifePath,
              lpName: lp?.name,
              trait1: lp?.traits[0].toLowerCase(),
              trait2: lp?.traits[1].toLowerCase(),
            })}
          </p>
        </div>

        {/* Cosmic Trio */}
        <div className="flex gap-2">
          <CosmicInfo type="lifePath" value={profile.lifePath} className="flex-1">
            <div className="w-full p-3 rounded-xl bg-amber-accent/5 border border-amber-accent/10 text-center">
              <span className="text-lg font-bold text-gradient-gold">{profile.lifePath}</span>
              <p className="text-[9px] text-slate-500 uppercase tracking-wider mt-0.5">{lp?.name}</p>
            </div>
          </CosmicInfo>
          <CosmicInfo type="westernZodiac" value={profile.westernZodiac.sign} className="flex-1">
            <div className="w-full p-3 rounded-xl bg-mode-personal/5 border border-mode-personal/10 text-center">
              <span className="text-lg">{profile.westernZodiac.symbol}</span>
              <p className="text-[9px] text-slate-500 uppercase tracking-wider mt-0.5">{profile.westernZodiac.sign}</p>
            </div>
          </CosmicInfo>
          <CosmicInfo type="chineseZodiac" value={profile.chineseZodiac.animal} className="flex-1">
            <div className="w-full p-3 rounded-xl bg-green-500/5 border border-green-500/10 text-center">
              <span className="text-lg">{profile.chineseZodiac.symbol}</span>
              <p className="text-[9px] text-slate-500 uppercase tracking-wider mt-0.5">{profile.chineseZodiac.fullName}</p>
            </div>
          </CosmicInfo>
        </div>

        {/* Deep Compatibility Expandable */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center justify-between w-full p-3 rounded-xl bg-white/[0.03] border border-white/5 transition-smooth hover:bg-white/[0.06]"
        >
          <div className="flex items-center gap-2">
            <Heart size={14} className="text-mode-partner" />
            <span className="text-xs font-semibold text-slate-300">{t('deepCompatibility')}</span>
          </div>
          {expanded
            ? <ChevronUp size={16} className="text-slate-500" />
            : <ChevronDown size={16} className="text-slate-500" />
          }
        </button>

        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-3 overflow-hidden"
            >
              <CompatibilityBar label={t('emotionalBond')} score={emotional} color="#ec4899" delay={0} />
              <CompatibilityBar label={t('lifeGoals')} score={lifeGoals} color="#f472b6" delay={0.1} />
              <CompatibilityBar label={t('communication')} score={communication} color="#f9a8d4" delay={0.2} />
              <CompatibilityBar label={t('valuesMatch')} score={values} color="#ec4899" delay={0.3} />
              <CompatibilityBar label={t('longTermPotential')} score={longTerm} color="#db2777" delay={0.4} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Community Compatibility */}
        {allProfiles.length > 1 && (
          <MatchInsights profile={profile} allProfiles={allProfiles} accentColor="#ec4899" />
        )}

        {/* Prompts */}
        <div className="space-y-2.5">
          {profile.prompts.slice(0, 2).map((prompt, i) => (
            <div key={i} className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/5">
              <p className="text-[10px] text-mode-partner font-semibold uppercase tracking-wider mb-1">{prompt.question}</p>
              <p className="text-[13px] text-slate-200 leading-relaxed">{prompt.answer}</p>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
