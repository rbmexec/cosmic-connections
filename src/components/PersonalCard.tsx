"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Sun, Moon } from "lucide-react";
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
        {/* Cosmic trio badges */}
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
        {tabs.map((tab) => (
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
