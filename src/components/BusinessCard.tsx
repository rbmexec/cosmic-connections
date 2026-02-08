"use client";

import { motion } from "framer-motion";
import { Briefcase, MapPin } from "lucide-react";
import { lifePathData, calculateCompatibility } from "@/lib/cosmic-calculations";
import CompatibilityBar from "./CompatibilityBar";
import type { UserProfile } from "@/types/profile";

// Simulated "current user" for compatibility calc
const currentUser: UserProfile = {
  id: "0", name: "You", age: 28, birthYear: 1996, location: "NYC", occupation: "Engineer",
  photo: "", lifePath: 7,
  westernZodiac: { sign: "Virgo", symbol: "\u264D", element: "Earth" },
  chineseZodiac: { animal: "Rat", symbol: "\uD83D\uDC00", element: "Fire", elementColor: "#ef4444", elementSymbol: "\uD83D\uDD25", fullName: "Fire Rat" },
  prompts: [],
};

export default function BusinessCard({ profile }: { profile: UserProfile }) {
  const compat = calculateCompatibility(currentUser, profile);
  const lp = lifePathData[profile.lifePath];

  // Derive business-specific scores from the cosmic data
  const workStyle = Math.min(99, compat.lifePath + Math.floor(Math.random() * 5));
  const communication = Math.min(99, compat.western + Math.floor(Math.random() * 8));
  const visionAlignment = Math.min(99, compat.chinese + Math.floor(Math.random() * 6));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card rounded-3xl overflow-hidden max-w-sm mx-auto"
    >
      <div className="flex gap-4 p-5">
        <img src={profile.photo} alt={profile.name} className="w-20 h-20 rounded-2xl object-cover" />
        <div className="flex-1 min-w-0">
          <h2 className="text-lg font-bold font-serif truncate">{profile.name}, {profile.age}</h2>
          <div className="flex items-center gap-1 text-mode-business text-sm mt-0.5">
            <Briefcase size={13} />
            <span className="truncate">{profile.occupation}</span>
          </div>
          <div className="flex items-center gap-1 text-slate-400 text-xs mt-0.5">
            <MapPin size={11} />
            <span>{profile.location}</span>
          </div>
        </div>
      </div>

      <div className="px-5 pb-2">
        <div className="flex items-center gap-2 p-3 rounded-xl bg-white/5">
          <span className="text-xl font-serif text-amber-accent">{profile.lifePath}</span>
          <div>
            <p className="text-sm font-medium">{lp?.name}</p>
            <p className="text-xs text-slate-400">{lp?.description}</p>
          </div>
        </div>
      </div>

      <div className="px-5 pb-5 space-y-3">
        <p className="text-xs text-slate-500 uppercase tracking-wider">Professional Compatibility</p>
        <CompatibilityBar label="Work Style" score={workStyle} color="#10b981" delay={0} />
        <CompatibilityBar label="Communication" score={communication} color="#10b981" delay={0.15} />
        <CompatibilityBar label="Vision Alignment" score={visionAlignment} color="#10b981" delay={0.3} />
      </div>

      {profile.prompts.length > 0 && (
        <div className="px-5 pb-5">
          <div className="p-3 rounded-xl bg-white/5">
            <p className="text-xs text-slate-500 mb-1">{profile.prompts[0].question}</p>
            <p className="text-sm text-slate-200">{profile.prompts[0].answer}</p>
          </div>
        </div>
      )}
    </motion.div>
  );
}
