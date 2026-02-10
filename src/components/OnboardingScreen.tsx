"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Camera, Sparkles, Star } from "lucide-react";
import {
  calculateLifePath,
  getWesternZodiacFromDate,
  getChineseZodiacFromYear,
} from "@/lib/cosmic-calculations";
import { saveUserProfile } from "@/lib/user-storage";
import type { UserProfile } from "@/types/profile";

const ZODIAC_SYMBOLS = ["♈","♉","♊","♋","♌","♍","♎","♏","♐","♑","♒","♓"];

const RELATIONSHIP_OPTIONS = [
  "Single",
  "In a relationship",
  "Married",
  "It's complicated",
  "Prefer not to say",
];

interface OnboardingScreenProps {
  onComplete: (profile: UserProfile) => void;
}

export default function OnboardingScreen({ onComplete }: OnboardingScreenProps) {
  const [name, setName] = useState("");
  const [birthday, setBirthday] = useState("");
  const [birthTime, setBirthTime] = useState("");
  const [city, setCity] = useState("");
  const [gender, setGender] = useState("");
  const [occupation, setOccupation] = useState("");
  const [relationship, setRelationship] = useState("");

  const birthdayDate = useMemo(() => {
    if (!birthday) return null;
    const d = new Date(birthday + "T00:00:00");
    return isNaN(d.getTime()) ? null : d;
  }, [birthday]);

  const cosmicPreview = useMemo(() => {
    if (!birthdayDate) return null;
    const western = getWesternZodiacFromDate(birthdayDate);
    const chinese = getChineseZodiacFromYear(birthdayDate.getFullYear());
    const lifePath = calculateLifePath(birthdayDate);
    return { western, chinese, lifePath };
  }, [birthdayDate]);

  const initials = name
    .split(" ")
    .filter(Boolean)
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const canSubmit = name.trim() && birthdayDate && city.trim();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!birthdayDate || !cosmicPreview) return;

    const today = new Date();
    let age = today.getFullYear() - birthdayDate.getFullYear();
    const monthDiff = today.getMonth() - birthdayDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthdayDate.getDate())) {
      age--;
    }

    const profile: UserProfile = {
      id: "self",
      name: name.trim(),
      age,
      birthYear: birthdayDate.getFullYear(),
      location: city.trim(),
      occupation: occupation.trim() || "Not specified",
      photo: "",
      lifePath: cosmicPreview.lifePath,
      westernZodiac: cosmicPreview.western,
      chineseZodiac: cosmicPreview.chinese,
      birthMonth: birthdayDate.getMonth() + 1,
      birthDay: birthdayDate.getDate(),
      prompts: [],
    };

    saveUserProfile(profile);
    onComplete(profile);
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" style={{ background: "linear-gradient(145deg, #042f2e 0%, #064e3b 30%, #065f46 50%, #0d3d38 70%, #021a18 100%)" }}>
      <div className="max-w-lg mx-auto px-5 py-8">
        {/* Zodiac Wheel Header */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="relative flex items-center justify-center mb-6"
        >
          {/* Rotating zodiac ring */}
          <div className="relative w-48 h-48">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0"
            >
              {ZODIAC_SYMBOLS.map((symbol, i) => {
                const angle = (i * 30 - 90) * (Math.PI / 180);
                const x = 50 + 42 * Math.cos(angle);
                const y = 50 + 42 * Math.sin(angle);
                return (
                  <span
                    key={i}
                    className="absolute text-lg opacity-40"
                    style={{
                      left: `${x}%`,
                      top: `${y}%`,
                      transform: "translate(-50%, -50%)",
                      color: i % 2 === 0 ? "#fbbf24" : "#5eead4",
                    }}
                  >
                    {symbol}
                  </span>
                );
              })}
            </motion.div>

            {/* Avatar circle */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-24 h-24 rounded-full bg-teal-900/60 border-2 border-amber-400/40 flex items-center justify-center relative">
                {initials ? (
                  <span className="text-2xl font-bold text-amber-300">{initials}</span>
                ) : (
                  <Camera size={28} className="text-teal-400/60" />
                )}
                <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-teal-700 border-2 border-amber-400/50 flex items-center justify-center">
                  <Camera size={12} className="text-amber-300" />
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center mb-8"
        >
          <h1 className="text-2xl font-bold text-white mb-1 flex items-center justify-center gap-2">
            <Sparkles size={18} className="text-amber-400" />
            Discover Your Cosmos
            <Sparkles size={18} className="text-amber-400" />
          </h1>
          <p className="text-teal-300/70 text-sm">Tell us about yourself to unlock your cosmic profile</p>
        </motion.div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name */}
          <FieldCard label="Full Name" delay={0.25}>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your full name"
              className="w-full bg-transparent text-white placeholder-teal-500/50 text-sm outline-none"
            />
          </FieldCard>

          {/* Birthday */}
          <FieldCard label="Birthday" delay={0.3}>
            <input
              type="date"
              value={birthday}
              onChange={(e) => setBirthday(e.target.value)}
              className="w-full bg-transparent text-white text-sm outline-none [color-scheme:dark]"
            />
          </FieldCard>

          {/* Cosmic Preview */}
          {cosmicPreview && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="flex gap-2"
            >
              <div className="flex-1 p-3 rounded-xl bg-amber-400/10 border border-amber-400/20 text-center">
                <span className="text-lg font-bold text-amber-300">{cosmicPreview.lifePath}</span>
                <p className="text-[9px] text-amber-400/60 uppercase tracking-wider mt-0.5">Life Path</p>
              </div>
              <div className="flex-1 p-3 rounded-xl bg-teal-400/10 border border-teal-400/20 text-center">
                <span className="text-lg">{cosmicPreview.western.symbol}</span>
                <p className="text-[9px] text-teal-400/60 uppercase tracking-wider mt-0.5">{cosmicPreview.western.sign}</p>
              </div>
              <div className="flex-1 p-3 rounded-xl bg-emerald-400/10 border border-emerald-400/20 text-center">
                <span className="text-lg">{cosmicPreview.chinese.symbol}</span>
                <p className="text-[9px] text-emerald-400/60 uppercase tracking-wider mt-0.5">{cosmicPreview.chinese.fullName}</p>
              </div>
            </motion.div>
          )}

          {/* Birth Time */}
          <FieldCard label="Birth Time (optional)" delay={0.35}>
            <input
              type="time"
              value={birthTime}
              onChange={(e) => setBirthTime(e.target.value)}
              className="w-full bg-transparent text-white text-sm outline-none [color-scheme:dark]"
            />
          </FieldCard>

          {/* City of Birth */}
          <FieldCard label="City of Birth" delay={0.4}>
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="e.g. New York"
              className="w-full bg-transparent text-white placeholder-teal-500/50 text-sm outline-none"
            />
          </FieldCard>

          {/* Gender */}
          <FieldCard label="Gender" delay={0.45}>
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="w-full bg-transparent text-white text-sm outline-none appearance-none cursor-pointer"
            >
              <option value="" className="bg-teal-900">Select gender</option>
              <option value="Male" className="bg-teal-900">Male</option>
              <option value="Female" className="bg-teal-900">Female</option>
              <option value="Non-binary" className="bg-teal-900">Non-binary</option>
            </select>
          </FieldCard>

          {/* Occupation */}
          <FieldCard label="Occupation" delay={0.5}>
            <input
              type="text"
              value={occupation}
              onChange={(e) => setOccupation(e.target.value)}
              placeholder="What do you do?"
              className="w-full bg-transparent text-white placeholder-teal-500/50 text-sm outline-none"
            />
          </FieldCard>

          {/* Relationship Status */}
          <FieldCard label="Relationship Status" delay={0.55}>
            <select
              value={relationship}
              onChange={(e) => setRelationship(e.target.value)}
              className="w-full bg-transparent text-white text-sm outline-none appearance-none cursor-pointer"
            >
              <option value="" className="bg-teal-900">Select status</option>
              {RELATIONSHIP_OPTIONS.map((opt) => (
                <option key={opt} value={opt} className="bg-teal-900">{opt}</option>
              ))}
            </select>
          </FieldCard>

          {/* Submit */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="pt-4 pb-8"
          >
            <button
              type="submit"
              disabled={!canSubmit}
              className="w-full py-4 rounded-2xl font-bold text-base tracking-wide transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
              style={{
                background: canSubmit
                  ? "linear-gradient(135deg, #fbbf24 0%, #f59e0b 50%, #d97706 100%)"
                  : "rgba(251, 191, 36, 0.2)",
                color: canSubmit ? "#1a1a2e" : "rgba(251, 191, 36, 0.5)",
                boxShadow: canSubmit ? "0 4px 20px rgba(251, 191, 36, 0.3)" : "none",
              }}
            >
              <Star size={18} />
              Enter the Cosmos
              <Star size={18} />
            </button>
          </motion.div>
        </form>
      </div>
    </div>
  );
}

function FieldCard({ label, delay, children }: { label: string; delay: number; children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay }}
      className="rounded-2xl p-4 border"
      style={{
        background: "rgba(13, 148, 136, 0.12)",
        borderColor: "rgba(13, 148, 136, 0.25)",
      }}
    >
      <label className="block text-[10px] font-bold uppercase tracking-[0.15em] text-amber-400 mb-2">
        {label}
      </label>
      {children}
    </motion.div>
  );
}
