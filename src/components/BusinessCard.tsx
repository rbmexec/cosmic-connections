"use client";

import { motion } from "framer-motion";
import { Briefcase, MapPin, TrendingUp } from "lucide-react";
import { lifePathData, calculateCompatibility } from "@/lib/cosmic-calculations";
import CompatibilityBar from "./CompatibilityBar";
import MatchInsights from "./MatchInsights";
import type { UserProfile } from "@/types/profile";

const defaultUser: UserProfile = {
  id: "0", name: "You", age: 28, birthYear: 1996, location: "NYC", occupation: "Engineer",
  photo: "", lifePath: 7,
  westernZodiac: { sign: "Virgo", symbol: "\u264D", element: "Earth" },
  chineseZodiac: { animal: "Rat", symbol: "\uD83D\uDC00", element: "Fire", elementColor: "#ef4444", elementSymbol: "\uD83D\uDD25", fullName: "Fire Rat" },
  prompts: [],
};

export default function BusinessCard({ profile, allProfiles = [], currentUser }: { profile: UserProfile; allProfiles?: UserProfile[]; currentUser?: UserProfile }) {
  const user = currentUser ?? defaultUser;
  const compat = calculateCompatibility(user, profile);
  const lp = lifePathData[profile.lifePath];

  const workStyle = Math.min(99, compat.lifePath + Math.floor(Math.random() * 5));
  const communication = Math.min(99, compat.western + Math.floor(Math.random() * 8));
  const visionAlignment = Math.min(99, compat.chinese + Math.floor(Math.random() * 6));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card rounded-[28px] overflow-hidden max-w-sm mx-auto card-stack-shadow"
    >
      {/* Header with photo and info */}
      <div className="p-5 pb-4">
        <div className="flex gap-4">
          <div className="relative">
            <img src={profile.photo} alt={profile.name} className="w-[72px] h-[72px] rounded-2xl object-cover ring-2 ring-mode-business/20" />
            <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-mode-business flex items-center justify-center">
              <Briefcase size={11} className="text-white" />
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-xl font-bold tracking-tight truncate">
              {profile.name}<span className="text-slate-400 font-light ml-2">{profile.age}</span>
            </h2>
            <p className="text-sm text-mode-business font-medium truncate">{profile.occupation}</p>
            <div className="flex items-center gap-1 text-slate-400 text-xs mt-1">
              <MapPin size={11} />
              <span>{profile.location}</span>
            </div>
          </div>
          {/* Overall Score */}
          <div className="flex flex-col items-center justify-center">
            <div className="w-14 h-14 rounded-full border-2 border-mode-business/30 flex items-center justify-center bg-mode-business/5">
              <span className="text-lg font-bold text-mode-business">{compat.overall}%</span>
            </div>
            <span className="text-[8px] text-slate-500 uppercase tracking-wider mt-1">Match</span>
          </div>
        </div>
      </div>

      {/* Life Path */}
      <div className="px-5 pb-4">
        <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-gradient-to-r from-amber-accent/5 to-transparent border border-amber-accent/10">
          <div className="w-10 h-10 rounded-full bg-amber-accent/10 flex items-center justify-center shrink-0">
            <span className="text-lg font-serif font-bold text-gradient-gold">{profile.lifePath}</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold">{lp?.name}</p>
            <p className="text-xs text-slate-400 truncate">{lp?.description}</p>
          </div>
        </div>
      </div>

      {/* Professional Compatibility */}
      <div className="px-5 pb-4 space-y-3">
        <div className="flex items-center gap-2">
          <TrendingUp size={13} className="text-mode-business" />
          <p className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold">Professional Compatibility</p>
        </div>
        <CompatibilityBar label="Work Style" score={workStyle} color="#10b981" delay={0} />
        <CompatibilityBar label="Communication" score={communication} color="#10b981" delay={0.15} />
        <CompatibilityBar label="Vision Alignment" score={visionAlignment} color="#10b981" delay={0.3} />
      </div>

      {/* Community Compatibility */}
      {allProfiles.length > 1 && (
        <div className="px-5 pb-4">
          <MatchInsights profile={profile} allProfiles={allProfiles} accentColor="#10b981" compact />
        </div>
      )}

      {/* Prompts */}
      <div className="px-5 pb-5 space-y-2.5">
        {profile.prompts.slice(0, 2).map((prompt, i) => (
          <div key={i} className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/5">
            <p className="text-[10px] text-mode-business font-semibold uppercase tracking-wider mb-1">{prompt.question}</p>
            <p className="text-[13px] text-slate-200 leading-relaxed">{prompt.answer}</p>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
