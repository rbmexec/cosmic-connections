"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { lifePathData, zodiacDescriptions, chineseAnimalDescriptions, elementDescriptions, chineseElementDescriptions } from "@/lib/cosmic-calculations";
import type { UserProfile } from "@/types/profile";

const tabs = ["Overview", "Numerology", "Western", "Eastern"] as const;
type Tab = (typeof tabs)[number];

export default function PersonalCard({ profile }: { profile: UserProfile }) {
  const [activeTab, setActiveTab] = useState<Tab>("Overview");
  const lp = lifePathData[profile.lifePath];
  const zodiac = zodiacDescriptions[profile.westernZodiac.sign];
  const animal = chineseAnimalDescriptions[profile.chineseZodiac.animal];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card rounded-3xl overflow-hidden max-w-sm mx-auto"
    >
      <div className="relative h-48">
        <img src={profile.photo} alt={profile.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-cosmic-card via-transparent to-transparent" />
        <div className="absolute bottom-4 left-4">
          <h2 className="text-2xl font-bold font-serif">{profile.name}, {profile.age}</h2>
          <p className="text-sm text-slate-300">{profile.occupation} &middot; {profile.location}</p>
        </div>
      </div>

      <div className="flex gap-1 p-2">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-2 text-xs font-medium rounded-xl transition-colors ${
              activeTab === tab
                ? "bg-mode-personal/20 text-mode-personal"
                : "text-slate-500 hover:text-slate-300"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="p-5 min-h-[260px]">
        {activeTab === "Overview" && (
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/5">
              <span className="text-2xl font-serif text-amber-accent">{profile.lifePath}</span>
              <div>
                <p className="text-sm font-medium">{lp?.name}</p>
                <p className="text-xs text-slate-400">Life Path Number</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/5">
              <span className="text-2xl">{profile.westernZodiac.symbol}</span>
              <div>
                <p className="text-sm font-medium">{profile.westernZodiac.sign}</p>
                <p className="text-xs text-slate-400">{profile.westernZodiac.element} Sign</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/5">
              <span className="text-2xl">{profile.chineseZodiac.symbol}</span>
              <div>
                <p className="text-sm font-medium">{profile.chineseZodiac.fullName}</p>
                <p className="text-xs text-slate-400">Chinese Zodiac</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === "Numerology" && lp && (
          <div className="space-y-4">
            <div className="text-center">
              <span className="text-4xl font-serif text-amber-accent">{profile.lifePath}</span>
              <p className="text-lg font-medium mt-1">{lp.name}</p>
              <p className="text-sm text-slate-400 mt-1">{lp.description}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wider mb-2">Key Strengths</p>
              <div className="flex flex-wrap gap-2">
                {lp.traits.map((t) => (
                  <span key={t} className="text-xs px-2.5 py-1 rounded-full bg-amber-accent/10 text-amber-accent">{t}</span>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "Western" && zodiac && (
          <div className="space-y-4">
            <div className="text-center">
              <span className="text-4xl">{profile.westernZodiac.symbol}</span>
              <p className="text-lg font-medium mt-1">{profile.westernZodiac.sign}</p>
              <p className="text-xs text-slate-400">Ruled by {zodiac.ruler}</p>
            </div>
            <p className="text-sm text-slate-300">{zodiac.traits}</p>
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wider mb-2">Element: {profile.westernZodiac.element}</p>
              <p className="text-xs text-slate-400">{elementDescriptions[profile.westernZodiac.element]}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wider mb-2">Compatible Signs</p>
              <div className="flex flex-wrap gap-2">
                {zodiac.compatibleSigns.map((s) => (
                  <span key={s} className="text-xs px-2.5 py-1 rounded-full bg-mode-personal/10 text-mode-personal">{s}</span>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "Eastern" && animal && (
          <div className="space-y-4">
            <div className="text-center">
              <span className="text-4xl">{profile.chineseZodiac.symbol}</span>
              <p className="text-lg font-medium mt-1">{profile.chineseZodiac.fullName}</p>
            </div>
            <p className="text-sm text-slate-300">{animal.traits}</p>
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wider mb-2">Element: {profile.chineseZodiac.element}</p>
              <p className="text-xs text-slate-400">{chineseElementDescriptions[profile.chineseZodiac.element]}</p>
            </div>
            <div className="flex gap-4">
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Lucky Numbers</p>
                <p className="text-sm text-slate-300">{animal.luckyNumbers.join(", ")}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Lucky Colors</p>
                <p className="text-sm text-slate-300">{animal.luckyColors.join(", ")}</p>
              </div>
            </div>
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wider mb-2">Compatible Animals</p>
              <div className="flex flex-wrap gap-2">
                {animal.compatibleAnimals.map((a) => (
                  <span key={a} className="text-xs px-2.5 py-1 rounded-full bg-green-500/10 text-green-400">{a}</span>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
