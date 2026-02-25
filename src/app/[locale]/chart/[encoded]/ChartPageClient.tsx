"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Sun, Moon } from "lucide-react";
import { useTranslations } from "next-intl";
import CosmicBackground from "@/components/CosmicBackground";
import { decodeReferralData } from "@/lib/referral-link";
import {
  calculateLifePath,
  getWesternZodiacFromDate,
  getChineseZodiacFromYear,
  lifePathData,
  zodiacDescriptions,
  chineseAnimalDescriptions,
  elementDescriptions,
  chineseElementDescriptions,
  calculateBirthdayNumber,
  calculatePersonalYear,
  birthdayNumberData,
  personalYearData,
  calculateLoShuGrid,
} from "@/lib/cosmic-calculations";
import type { UserProfile } from "@/types/profile";

const tabKeys = ["overview", "numerology", "western", "eastern"] as const;
type TabKey = (typeof tabKeys)[number];

export default function ChartPageClient({ encoded }: { encoded: string }) {
  const t = useTranslations('chart');
  const tc = useTranslations('common');
  const [activeTab, setActiveTab] = useState<TabKey>("overview");

  const data = useMemo(() => decodeReferralData(encoded), [encoded]);

  const profile = useMemo((): UserProfile | null => {
    if (!data) return null;
    const date = new Date(data.birthday + "T00:00:00");
    if (isNaN(date.getTime())) return null;
    const birthYear = date.getFullYear();
    const birthMonth = date.getMonth() + 1;
    const birthDay = date.getDate();
    const now = new Date();
    let age = now.getFullYear() - birthYear;
    if (now.getMonth() + 1 < birthMonth || (now.getMonth() + 1 === birthMonth && now.getDate() < birthDay)) age--;

    return {
      id: "referral",
      name: data.name,
      age,
      birthYear,
      location: "",
      occupation: "",
      photo: "",
      lifePath: calculateLifePath(date),
      westernZodiac: getWesternZodiacFromDate(date),
      chineseZodiac: getChineseZodiacFromYear(birthYear),
      prompts: [],
      birthMonth,
      birthDay,
    };
  }, [data]);

  if (!profile) {
    return (
      <main className="min-h-[100dvh] relative">
        <CosmicBackground />
        <div className="relative z-10 max-w-lg mx-auto px-4 min-h-[100dvh] flex flex-col items-center justify-center text-center">
          <Sparkles size={48} className="text-amber-400 mb-4" />
          <h1 className="text-2xl font-bold text-white mb-2">{t('invalidLink')}</h1>
          <p className="text-slate-400 mb-6">{t('invalidLinkDesc')}</p>
          <a href="/" className="px-6 py-3 rounded-2xl bg-gradient-to-r from-teal-500 to-teal-600 text-white text-sm font-semibold">
            {t('discoverChart')}
          </a>
        </div>
      </main>
    );
  }

  const lp = lifePathData[profile.lifePath];
  const zodiac = zodiacDescriptions[profile.westernZodiac.sign];
  const animal = chineseAnimalDescriptions[profile.chineseZodiac.animal];
  const birthdayNum = profile.birthDay ? calculateBirthdayNumber(profile.birthDay) : null;
  const personalYear = profile.birthMonth && profile.birthDay ? calculatePersonalYear(profile.birthMonth, profile.birthDay) : null;
  const loShuGrid = profile.birthMonth && profile.birthDay && profile.birthYear ? calculateLoShuGrid(profile.birthMonth, profile.birthDay, profile.birthYear) : null;
  const tl = useTranslations('loShu');

  const initials = profile.name
    .split(" ")
    .filter(Boolean)
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

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

        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-[28px] overflow-hidden"
        >
          {/* Header */}
          <div className="relative py-6 px-5 flex flex-col items-center" style={{ background: "linear-gradient(180deg, rgba(13,61,56,0.6) 0%, transparent 100%)" }}>
            <div className="w-20 h-20 rounded-full bg-teal-900/60 border-2 border-amber-400/50 flex items-center justify-center mb-3">
              <span className="text-2xl font-bold text-amber-300">{initials}</span>
            </div>
            <h2 className="text-xl font-bold tracking-tight text-white">{profile.name}</h2>
            <div className="flex gap-2 mt-3">
              <span className="glass-card-strong rounded-xl px-2.5 py-1 flex items-center gap-1.5 text-xs">
                <span className="text-amber-400 font-bold">{profile.lifePath}</span>
                <span className="text-[9px] text-slate-400">LP</span>
              </span>
              <span className="glass-card-strong rounded-xl px-2.5 py-1 flex items-center gap-1.5 text-xs">
                <span>{profile.westernZodiac.symbol}</span>
                <span className="text-[9px] text-slate-400">{profile.westernZodiac.sign}</span>
              </span>
              <span className="glass-card-strong rounded-xl px-2.5 py-1 flex items-center gap-1.5 text-xs">
                <span>{profile.chineseZodiac.symbol}</span>
                <span className="text-[9px] text-slate-400">{profile.chineseZodiac.animal}</span>
              </span>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 px-3 pt-1">
            {tabKeys.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-2 text-[10px] font-semibold rounded-xl transition-all duration-300 ${
                  activeTab === tab
                    ? "bg-amber-400/15 text-amber-400 shadow-[0_0_12px_rgba(251,191,36,0.15)]"
                    : "text-slate-500 hover:text-slate-300 hover:bg-white/5"
                }`}
              >
                {tc(tab)}
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
                      <p className="text-xs text-slate-500 uppercase tracking-widest">{tc('cosmicBlueprint')}</p>
                    </div>
                    <div className="flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-r from-amber-400/5 to-transparent border border-amber-400/10">
                      <div className="w-12 h-12 rounded-full bg-amber-400/10 flex items-center justify-center">
                        <span className="text-2xl font-serif font-bold text-gradient-gold">{profile.lifePath}</span>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-white">{lp?.name}</p>
                        <p className="text-xs text-slate-400 mt-0.5">{lp?.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-r from-purple-400/5 to-transparent border border-purple-400/10">
                      <div className="w-12 h-12 rounded-full bg-purple-400/10 flex items-center justify-center">
                        <Sun size={22} className="text-purple-400" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-white">{profile.westernZodiac.symbol} {profile.westernZodiac.sign}</p>
                        <p className="text-xs text-slate-400 mt-0.5">{profile.westernZodiac.element} {tc('elementSign')} &middot; {tc('ruledBy', { ruler: zodiac?.ruler })}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-r from-green-500/5 to-transparent border border-green-500/10">
                      <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center">
                        <Moon size={22} className="text-green-400" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-white">{profile.chineseZodiac.symbol} {profile.chineseZodiac.fullName}</p>
                        <p className="text-xs text-slate-400 mt-0.5">{profile.chineseZodiac.element} {tc('element')} &middot; {tc('chineseZodiac')}</p>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "numerology" && lp && (
                  <div className="space-y-5">
                    <div className="text-center">
                      <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-amber-400/20 to-amber-400/5 flex items-center justify-center border border-amber-400/20">
                        <span className="text-4xl font-serif font-bold text-gradient-gold">{profile.lifePath}</span>
                      </div>
                      <p className="text-lg font-bold mt-3 text-white">{lp.name}</p>
                      <p className="text-sm text-slate-400 mt-1 leading-relaxed">{lp.description}</p>
                      <div className="flex flex-wrap justify-center gap-2 mt-3">
                        {lp.traits.map((t) => (
                          <span key={t} className="cosmic-tag bg-amber-400/10 text-amber-400 border border-amber-400/20">{t}</span>
                        ))}
                      </div>
                    </div>

                    {birthdayNum !== null && birthdayNumberData[birthdayNum] && (
                      <div className="p-4 rounded-2xl bg-white/[0.03] border border-amber-400/10">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-full bg-amber-400/10 flex items-center justify-center border border-amber-400/20">
                            <span className="text-xl font-serif font-bold text-amber-300">{birthdayNum}</span>
                          </div>
                          <div className="flex-1">
                            <p className="text-xs text-amber-400/60 uppercase tracking-widest font-semibold">{tc('birthdayNumber')}</p>
                            <p className="text-sm font-semibold text-white mt-0.5">{birthdayNumberData[birthdayNum].name}</p>
                          </div>
                        </div>
                        <p className="text-xs text-slate-400 mt-2 leading-relaxed">{birthdayNumberData[birthdayNum].description}</p>
                      </div>
                    )}

                    {personalYear !== null && personalYearData[personalYear] && (
                      <div className="p-4 rounded-2xl bg-white/[0.03] border border-teal-400/10">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-full bg-teal-400/10 flex items-center justify-center border border-teal-400/20">
                            <span className="text-xl font-serif font-bold text-teal-300">{personalYear}</span>
                          </div>
                          <div className="flex-1">
                            <p className="text-xs text-teal-400/60 uppercase tracking-widest font-semibold">{tc('personalYear', { year: new Date().getFullYear() })}</p>
                            <p className="text-sm font-semibold text-white mt-0.5">{personalYearData[personalYear].name}</p>
                          </div>
                        </div>
                        <p className="text-xs text-slate-400 mt-2 leading-relaxed">{personalYearData[personalYear].description}</p>
                      </div>
                    )}

                    {/* Lo Shu Grid */}
                    {loShuGrid && (
                      <div className="p-4 rounded-2xl bg-white/[0.03] border border-rose-400/10">
                        <p className="text-xs text-rose-400/60 uppercase tracking-widest font-semibold mb-3">{t('loShuGrid')}</p>
                        <div className="grid grid-cols-3 gap-1.5">
                          {[4,9,2,3,5,7,8,1,6].map((num) => {
                            const pos = loShuGrid.positions[num];
                            const isPresent = pos.count > 0;
                            const isStrong = pos.count >= 2;
                            return (
                              <div
                                key={num}
                                className="rounded-xl p-2 text-center"
                                style={{
                                  background: isPresent ? `${pos.color}${isStrong ? "20" : "10"}` : "rgba(255,255,255,0.02)",
                                  border: `1px solid ${isPresent ? `${pos.color}${isStrong ? "40" : "20"}` : "rgba(255,255,255,0.05)"}`,
                                  opacity: isPresent ? 1 : 0.4,
                                }}
                              >
                                <div className="flex items-center justify-center gap-1">
                                  <span className="text-lg font-bold font-serif" style={{ color: isPresent ? pos.color : "rgba(255,255,255,0.3)" }}>{num}</span>
                                  {isStrong && <span className="text-[8px] font-bold" style={{ color: pos.color }}>×{pos.count}</span>}
                                </div>
                                <p className="text-[8px] mt-0.5 leading-tight" style={{ color: isPresent ? `${pos.color}cc` : "rgba(255,255,255,0.2)" }}>
                                  {tl(`pos${num}` as "pos1")}
                                </p>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === "western" && zodiac && (
                  <div className="space-y-5">
                    <div className="text-center">
                      <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-purple-400/20 to-purple-400/5 flex items-center justify-center border border-purple-400/20">
                        <span className="text-4xl">{profile.westernZodiac.symbol}</span>
                      </div>
                      <p className="text-lg font-bold mt-3 text-white">{profile.westernZodiac.sign}</p>
                      <p className="text-xs text-slate-400">{tc('ruledBy', { ruler: zodiac.ruler })} &middot; {profile.westernZodiac.element} {tc('element')}</p>
                      <p className="text-[10px] text-purple-300/70 mt-1">{zodiac.polarityLabel}</p>
                    </div>
                    <p className="text-sm text-slate-300 leading-relaxed">{zodiac.traits}</p>
                    <div className="p-3 rounded-xl bg-purple-400/5 border border-purple-400/10">
                      <p className="text-[10px] text-purple-300 font-semibold uppercase tracking-widest mb-1">
                        <Sparkles size={10} className="inline mr-1" />{tc('elementMeaning')}
                      </p>
                      <p className="text-xs text-slate-400 leading-relaxed">{elementDescriptions[profile.westernZodiac.element]}</p>
                    </div>
                    <div className="p-3 rounded-xl bg-purple-400/5 border border-purple-400/10">
                      <p className="text-[10px] text-purple-300 font-semibold uppercase tracking-widest mb-1">{tc('polarity')}</p>
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
                          <span key={s} className="cosmic-tag bg-purple-400/10 text-purple-300 border border-purple-400/20">{s}</span>
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
                      <p className="text-lg font-bold mt-3 text-white">{profile.chineseZodiac.fullName}</p>
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
                        <p className="text-sm font-semibold text-white">{animal.luckyNumbers.join(", ")}</p>
                      </div>
                      <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5">
                        <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">{tc('luckyColors')}</p>
                        <p className="text-sm font-semibold text-white">{animal.luckyColors.join(", ")}</p>
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

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8 text-center"
        >
          <p className="text-sm text-slate-400 mb-4">{t('discoverConnections')}</p>
          <a
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-teal-500 to-teal-600 text-white text-sm font-semibold shadow-[0_4px_20px_rgba(20,184,166,0.35)]"
          >
            <Sparkles size={16} />
            {t('getChart')}
          </a>
        </motion.div>
      </div>
    </main>
  );
}
