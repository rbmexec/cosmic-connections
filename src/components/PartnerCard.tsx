"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, ChevronDown, ChevronUp, Heart } from "lucide-react";
import { lifePathData, calculateCompatibility } from "@/lib/cosmic-calculations";
import CompatibilityBar from "./CompatibilityBar";
import type { UserProfile } from "@/types/profile";

const currentUser: UserProfile = {
  id: "0", name: "You", age: 28, birthYear: 1996, location: "NYC", occupation: "Engineer",
  photo: "", lifePath: 7,
  westernZodiac: { sign: "Virgo", symbol: "\u264D", element: "Earth" },
  chineseZodiac: { animal: "Rat", symbol: "\uD83D\uDC00", element: "Fire", elementColor: "#ef4444", elementSymbol: "\uD83D\uDD25", fullName: "Fire Rat" },
  prompts: [],
};

export default function PartnerCard({ profile }: { profile: UserProfile }) {
  const [expanded, setExpanded] = useState(false);
  const compat = calculateCompatibility(currentUser, profile);
  const lp = lifePathData[profile.lifePath];

  const emotional = Math.min(99, compat.western + Math.floor(Math.random() * 6));
  const lifeGoals = Math.min(99, compat.lifePath + Math.floor(Math.random() * 5));
  const communication = Math.min(99, Math.round((compat.western + compat.chinese) / 2) + 3);
  const values = Math.min(99, compat.chinese + Math.floor(Math.random() * 7));
  const longTerm = compat.overall;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card rounded-3xl overflow-hidden max-w-sm mx-auto"
    >
      <div className="relative h-56">
        <img src={profile.photo} alt={profile.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-cosmic-card via-transparent to-transparent" />
        <div className="absolute bottom-4 left-4 right-4">
          <h2 className="text-2xl font-bold font-serif">{profile.name}, {profile.age}</h2>
          <p className="text-sm text-slate-200">{profile.occupation}</p>
          <div className="flex items-center gap-1 text-slate-300 text-xs mt-0.5">
            <MapPin size={11} />
            <span>{profile.location}</span>
          </div>
        </div>
        <div className="absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1.5 rounded-full glass-card">
          <Heart size={14} className="text-mode-partner fill-mode-partner" />
          <span className="text-sm font-bold text-mode-partner">{compat.overall}%</span>
        </div>
      </div>

      <div className="p-5 space-y-4">
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center justify-between w-full text-left"
        >
          <span className="text-xs text-slate-500 uppercase tracking-wider">Deep Compatibility</span>
          {expanded ? <ChevronUp size={16} className="text-slate-500" /> : <ChevronDown size={16} className="text-slate-500" />}
        </button>

        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="space-y-3 overflow-hidden"
            >
              <CompatibilityBar label="Emotional Bond" score={emotional} color="#ec4899" delay={0} />
              <CompatibilityBar label="Life Goals" score={lifeGoals} color="#ec4899" delay={0.1} />
              <CompatibilityBar label="Communication" score={communication} color="#ec4899" delay={0.2} />
              <CompatibilityBar label="Values Match" score={values} color="#ec4899" delay={0.3} />
              <CompatibilityBar label="Long-term Potential" score={longTerm} color="#ec4899" delay={0.4} />
            </motion.div>
          )}
        </AnimatePresence>

        <div className="p-3 rounded-xl bg-mode-partner/5 border border-mode-partner/20">
          <p className="text-xs text-mode-partner mb-1">Cosmic Insight</p>
          <p className="text-sm text-slate-300">
            Your {currentUser.westernZodiac.element} energy harmonizes with {profile.name}&apos;s {profile.westernZodiac.element} nature.
            As a Life Path {profile.lifePath} ({lp?.name}), {profile.name} brings {lp?.traits[0].toLowerCase()} energy to complement your analytical depth.
          </p>
        </div>

        <div className="flex items-center gap-2 p-3 rounded-xl bg-white/5">
          <span className="text-xl font-serif text-amber-accent">{profile.lifePath}</span>
          <div>
            <p className="text-sm font-medium">{lp?.name}</p>
            <p className="text-xs text-slate-400">{lp?.description}</p>
          </div>
        </div>

        <div className="space-y-3">
          {profile.prompts.slice(0, 2).map((prompt, i) => (
            <div key={i} className="p-3 rounded-xl bg-white/5">
              <p className="text-xs text-slate-500 mb-1">{prompt.question}</p>
              <p className="text-sm text-slate-200">{prompt.answer}</p>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
