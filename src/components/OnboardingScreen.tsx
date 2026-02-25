"use client";

import { useState, useMemo, useRef, useEffect, useCallback } from "react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, Sparkles, Star, ChevronRight, ChevronLeft, Sun, Moon, Hash, Mail, Phone, ArrowRight } from "lucide-react";
import PhotoUpload from "@/components/PhotoUpload";
import {
  calculateLifePath,
  getWesternZodiacFromDate,
  getChineseZodiacFromYear,
  lifePathData,
  zodiacDescriptions,
  chineseAnimalDescriptions,
  elementDescriptions,
  chineseElementDescriptions,
} from "@/lib/cosmic-calculations";
import { saveUserProfile } from "@/lib/user-storage";
import type { UserProfile } from "@/types/profile";

const ZODIAC_SYMBOLS = ["♈","♉","♊","♋","♌","♍","♎","♏","♐","♑","♒","♓"];

const RELATIONSHIP_KEYS = [
  "single",
  "inRelationship",
  "married",
  "complicated",
  "preferNotToSay",
] as const;

const TOTAL_STEPS = 13;

interface OnboardingScreenProps {
  userId?: string;
  sessionEmail?: string;
  onComplete: (profile: UserProfile) => void;
}

export default function OnboardingScreen({ userId, sessionEmail, onComplete }: OnboardingScreenProps) {
  const t = useTranslations('onboarding');
  const tc = useTranslations('common');
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);

  // New step states
  const [email, setEmail] = useState(sessionEmail || "");
  const [phone, setPhone] = useState("");
  const [countryCode, setCountryCode] = useState("+1");
  const [otpCode, setOtpCode] = useState(["", "", "", "", "", ""]);
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [marketingOptOut, setMarketingOptOut] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  // Existing step states
  const [name, setName] = useState("");
  const [birthday, setBirthday] = useState("");
  const [birthTime, setBirthTime] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [gender, setGender] = useState("");
  const [occupation, setOccupation] = useState("");
  const [roleTitle, setRoleTitle] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [school, setSchool] = useState("");
  const [relationship, setRelationship] = useState("");
  const [photo, setPhoto] = useState("");

  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Resend cooldown timer
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
    return () => clearTimeout(timer);
  }, [resendCooldown]);

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

  const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  // Whether current step can proceed
  const canNext = (() => {
    switch (step) {
      case 0: return isValidEmail;
      case 1: return phone.length >= 7 && otpVerified;
      case 2: return true; // profile intro — always
      case 3: return name.trim().length > 0;
      case 4: return birthdayDate !== null;
      case 5: return true; // birth time is optional
      case 6: return city.trim().length > 0 && country.trim().length > 0;
      case 7: return true; // photo optional
      case 8: return true; // gender optional
      case 9: return true; // occupation optional
      case 10: return true; // portfolio optional
      case 11: return true; // relationship optional
      case 12: return true; // cosmic reveal
      default: return false;
    }
  })();

  function goNext() {
    if (!canNext) return;
    if (step < TOTAL_STEPS - 1) {
      setDirection(1);
      // Skip phone verification step (step 1) — SMS not yet configured
      setStep(step === 0 ? 2 : step + 1);
    } else {
      handleSubmit();
    }
  }

  function goBack() {
    if (step > 0) {
      setDirection(-1);
      // Skip phone verification step (step 1) going back
      setStep(step === 2 ? 0 : step - 1);
    }
  }

  const sendOtp = useCallback(() => {
    setOtpSent(true);
    setResendCooldown(30);
    setOtpCode(["", "", "", "", "", ""]);
    // Focus first digit
    setTimeout(() => otpRefs.current[0]?.focus(), 100);
  }, []);

  const handleOtpChange = useCallback((index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const digit = value.slice(-1);
    setOtpCode((prev) => {
      const next = [...prev];
      next[index] = digit;

      // Check if all 6 digits are filled
      if (digit && next.every((d) => d !== "")) {
        // Mock verify after 1s
        setTimeout(() => {
          setOtpVerified(true);
          // Auto-advance after brief delay
          setTimeout(() => {
            setDirection(1);
            setStep((s) => s + 1);
          }, 600);
        }, 1000);
      }

      return next;
    });

    // Move to next input
    if (digit && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  }, []);

  const handleOtpKeyDown = useCallback((index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otpCode[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  }, [otpCode]);

  async function handleSubmit() {
    if (!birthdayDate || !cosmicPreview) return;

    const today = new Date();
    let age = today.getFullYear() - birthdayDate.getFullYear();
    const monthDiff = today.getMonth() - birthdayDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthdayDate.getDate())) {
      age--;
    }

    const currentWork = roleTitle.trim() && companyName.trim()
      ? `${roleTitle.trim()} at ${companyName.trim()}`
      : roleTitle.trim() || "";

    const workExperience = roleTitle.trim()
      ? [{ title: roleTitle.trim(), company: companyName.trim() || "Independent", startDate: new Date().toISOString().slice(0, 7) }]
      : [];

    const profileData = {
      name: name.trim(),
      age,
      birthYear: birthdayDate.getFullYear(),
      location: city.trim(),
      country: country.trim(),
      occupation: occupation.trim() || "Not specified",
      photo: photo,
      lifePath: cosmicPreview.lifePath,
      westernZodiac: cosmicPreview.western,
      chineseZodiac: cosmicPreview.chinese,
      birthMonth: birthdayDate.getMonth() + 1,
      birthDay: birthdayDate.getDate(),
      prompts: [],
      workExperience,
      projects: [],
      currentWork,
      school: school.trim(),
    };

    // Persist to database if authenticated
    if (userId) {
      try {
        await Promise.all([
          fetch("/api/user/profile", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(profileData),
          }),
          fetch("/api/user/phone", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ phone: countryCode + phone }),
          }),
        ]);
      } catch {
        // Continue even if DB save fails — localStorage is fallback
      }
    }

    const profile: UserProfile = {
      id: userId || "self",
      ...profileData,
    };

    saveUserProfile(profile);
    onComplete(profile);
  }

  // Step titles/subtitles — first 3 are new, rest are original
  const stepTitles = [
    t('provideEmail'),
    t('phoneTitle'),
    "", // profile intro has its own layout
    t('stepTitles.name'),
    t('stepTitles.birthday'),
    t('stepTitles.birthTime'),
    t('stepTitles.birthPlace'),
    t('stepTitles.photo'),
    t('stepTitles.gender'),
    t('stepTitles.occupation'),
    t('stepTitles.portfolio'),
    t('stepTitles.relationship'),
    t('stepTitles.cosmicProfile'),
  ];

  const stepSubtitles = [
    t('emailSubtitle'),
    t('phoneSubtitle'),
    "",
    t('stepSubtitles.name'),
    t('stepSubtitles.birthday'),
    t('stepSubtitles.birthTime'),
    t('stepSubtitles.birthPlace'),
    t('stepSubtitles.photo'),
    t('stepSubtitles.gender'),
    t('stepSubtitles.occupation'),
    t('stepSubtitles.portfolio'),
    t('stepSubtitles.relationship'),
    t('stepSubtitles.cosmicProfile'),
  ];

  const slideVariants = {
    enter: (dir: number) => ({ x: dir > 0 ? 80 : -80, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? -80 : 80, opacity: 0 }),
  };

  // Steps 0-2 don't show the zodiac header
  const showZodiacHeader = step >= 3 && step < 12;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black">
      <div className="max-w-lg mx-auto px-5 py-8 h-full flex flex-col">
        {/* Progress bar */}
        <div className="flex gap-1.5 mb-6">
          {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
            <motion.div
              key={i}
              className="h-1 rounded-full flex-1"
              animate={{
                backgroundColor: i <= step ? "rgba(139, 92, 246, 0.9)" : "rgba(255, 255, 255, 0.08)",
              }}
              transition={{ duration: 0.3 }}
            />
          ))}
        </div>

        {/* Zodiac Wheel Header (only for steps 3-11) */}
        {showZodiacHeader && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="relative flex items-center justify-center mb-4 overflow-hidden"
          >
            <div className="relative w-40 h-40">
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
                      className="absolute text-base opacity-40"
                      style={{
                        left: `${x}%`,
                        top: `${y}%`,
                        transform: "translate(-50%, -50%)",
                        color: i % 2 === 0 ? "#a78bfa" : "#7c3aed",
                      }}
                    >
                      {symbol}
                    </span>
                  );
                })}
              </motion.div>

              {/* Avatar circle */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-20 h-20 rounded-full bg-white/5 border-2 border-violet-400/40 flex items-center justify-center relative">
                  {initials ? (
                    <span className="text-xl font-bold text-violet-300">{initials}</span>
                  ) : (
                    <Camera size={24} className="text-white/30" />
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Step title (skip for step 2 — profile intro has its own layout) */}
        {step !== 2 && (
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={`title-${step}`}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
              className="text-center mb-8"
            >
              {/* Icon for email/phone steps */}
              {step === 0 && (
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 rounded-full bg-violet-500/15 border border-violet-400/30 flex items-center justify-center">
                    <Mail size={28} className="text-violet-400" />
                  </div>
                </div>
              )}
              {step === 1 && !otpSent && (
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 rounded-full bg-violet-500/15 border border-violet-400/30 flex items-center justify-center">
                    <Phone size={28} className="text-violet-400" />
                  </div>
                </div>
              )}
              <h1 className="text-2xl font-bold text-white mb-1 flex items-center justify-center gap-2">
                {step >= 3 && <Sparkles size={16} className="text-violet-400" />}
                {otpSent && step === 1 ? t('enterCode') : stepTitles[step]}
                {step >= 3 && <Sparkles size={16} className="text-violet-400" />}
              </h1>
              {!otpSent || step !== 1 ? (
                <p className="text-slate-400 text-sm">{stepSubtitles[step]}</p>
              ) : null}
            </motion.div>
          </AnimatePresence>
        )}

        {/* Step content */}
        <div className="flex-1 flex flex-col">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={`step-${step}-${otpSent ? "otp" : "input"}`}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
              className="flex-1"
            >
              {/* Step 0: Email */}
              {step === 0 && (
                <div className="space-y-6">
                  <div className="border-b border-white/15 pb-2">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && canNext && goNext()}
                      placeholder={t('emailPlaceholder')}
                      autoFocus
                      className="w-full bg-transparent text-white placeholder-white/25 text-lg outline-none text-center"
                    />
                  </div>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={marketingOptOut}
                      onChange={(e) => setMarketingOptOut(e.target.checked)}
                      className="w-5 h-5 rounded border-white/20 bg-white/5 text-violet-500 focus:ring-violet-500 focus:ring-offset-0"
                    />
                    <span className="text-sm text-slate-400">{t('marketingOptOut')}</span>
                  </label>
                </div>
              )}

              {/* Step 1: Phone */}
              {step === 1 && !otpSent && (
                <div className="space-y-6">
                  <div className="flex gap-3 items-center">
                    <select
                      value={countryCode}
                      onChange={(e) => setCountryCode(e.target.value)}
                      className="bg-white/5 border border-white/15 rounded-xl px-3 py-3 text-white text-base outline-none"
                    >
                      <option value="+1">US +1</option>
                      <option value="+44">UK +44</option>
                      <option value="+61">AU +61</option>
                      <option value="+81">JP +81</option>
                      <option value="+82">KR +82</option>
                      <option value="+86">CN +86</option>
                      <option value="+91">IN +91</option>
                      <option value="+33">FR +33</option>
                      <option value="+49">DE +49</option>
                      <option value="+55">BR +55</option>
                      <option value="+52">MX +52</option>
                      <option value="+7">RU +7</option>
                      <option value="+34">ES +34</option>
                      <option value="+39">IT +39</option>
                      <option value="+966">SA +966</option>
                    </select>
                    <div className="flex-1 border-b border-white/15 pb-2">
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                        placeholder="Phone number"
                        autoFocus
                        className="w-full bg-transparent text-white placeholder-white/25 text-lg outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 1: OTP verification */}
              {step === 1 && otpSent && (
                <div className="space-y-6">
                  <div className="flex justify-center gap-2.5">
                    {otpCode.map((digit, i) => (
                      <input
                        key={i}
                        ref={(el) => { otpRefs.current[i] = el; }}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOtpChange(i, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(i, e)}
                        className={`w-12 h-14 rounded-xl border text-center text-xl font-bold outline-none transition-all ${
                          otpVerified
                            ? "border-emerald-400/60 bg-emerald-400/10 text-emerald-300"
                            : digit
                            ? "border-violet-400/60 bg-violet-400/10 text-white"
                            : "border-white/15 bg-white/5 text-white"
                        }`}
                      />
                    ))}
                  </div>

                  {otpVerified ? (
                    <motion.p
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-center text-emerald-400 text-sm font-medium"
                    >
                      {t('codeVerified')}
                    </motion.p>
                  ) : (
                    <div className="text-center">
                      <button
                        onClick={() => resendCooldown <= 0 && sendOtp()}
                        disabled={resendCooldown > 0}
                        className="text-sm text-violet-400 hover:text-violet-300 transition-colors disabled:text-slate-600"
                      >
                        {resendCooldown > 0
                          ? `${t('resendCode')} (${resendCooldown}s)`
                          : t('resendCode')}
                      </button>
                    </div>
                  )}

                  {/* Dev skip */}
                  {process.env.NODE_ENV === "development" && !otpVerified && (
                    <button
                      onClick={() => {
                        setOtpVerified(true);
                        setTimeout(() => { setDirection(1); setStep((s) => s + 1); }, 300);
                      }}
                      className="text-[10px] text-white/20 hover:text-white/40 transition-colors mt-4"
                    >
                      [DEV] Skip verification
                    </button>
                  )}
                </div>
              )}

              {/* Step 2: Profile intro */}
              {step === 2 && (
                <div className="flex-1 flex flex-col items-center justify-center text-center px-4">
                  {/* Slow-rotating zodiac wheel */}
                  <div className="relative w-48 h-48 mb-8">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 90, repeat: Infinity, ease: "linear" }}
                      className="absolute inset-0"
                    >
                      {ZODIAC_SYMBOLS.map((symbol, i) => {
                        const angle = (i * 30 - 90) * (Math.PI / 180);
                        const x = 50 + 44 * Math.cos(angle);
                        const y = 50 + 44 * Math.sin(angle);
                        return (
                          <span
                            key={i}
                            className="absolute text-xl opacity-30"
                            style={{
                              left: `${x}%`,
                              top: `${y}%`,
                              transform: "translate(-50%, -50%)",
                              color: i % 2 === 0 ? "#a78bfa" : "#7c3aed",
                            }}
                          >
                            {symbol}
                          </span>
                        );
                      })}
                    </motion.div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Sparkles size={32} className="text-violet-400/40" />
                    </div>
                  </div>

                  <motion.h1
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-2xl font-bold text-white leading-relaxed mb-8"
                  >
                    {t('profileIntroTitle')}
                  </motion.h1>

                  <motion.button
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={goNext}
                    className="px-12 py-4 rounded-full font-bold text-base text-white bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 transition-all shadow-lg shadow-violet-600/25"
                  >
                    {t('profileIntroBegin')}
                  </motion.button>
                </div>
              )}

              {/* Step 3: Name (was step 0) */}
              {step === 3 && (
                <FieldCard label={t('fields.fullName')}>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && goNext()}
                    placeholder={t('fields.enterFullName')}
                    autoFocus
                    className="w-full bg-transparent text-white placeholder-white/25 text-lg outline-none"
                  />
                </FieldCard>
              )}

              {/* Step 4: Birthday (was step 1) */}
              {step === 4 && (
                <div className="space-y-4">
                  <FieldCard label={t('fields.birthday')}>
                    <input
                      type="date"
                      value={birthday}
                      onChange={(e) => setBirthday(e.target.value)}
                      autoFocus
                      className="w-full bg-transparent text-white text-lg outline-none [color-scheme:dark]"
                    />
                  </FieldCard>

                  {/* Cosmic Preview */}
                  {cosmicPreview && (
                    <motion.div
                      initial={{ opacity: 0, y: 12, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ type: "spring", stiffness: 300, damping: 25 }}
                      className="flex gap-2"
                    >
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.1, type: "spring" }}
                        className="flex-1 p-4 rounded-xl bg-violet-500/10 border border-violet-400/20 text-center"
                      >
                        <span className="text-2xl font-bold text-violet-300">{cosmicPreview.lifePath}</span>
                        <p className="text-[10px] text-violet-400/60 uppercase tracking-wider mt-1">{tc('lifePath')}</p>
                      </motion.div>
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2, type: "spring" }}
                        className="flex-1 p-4 rounded-xl bg-purple-500/10 border border-purple-400/20 text-center"
                      >
                        <span className="text-2xl">{cosmicPreview.western.symbol}</span>
                        <p className="text-[10px] text-purple-400/60 uppercase tracking-wider mt-1">{cosmicPreview.western.sign}</p>
                      </motion.div>
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3, type: "spring" }}
                        className="flex-1 p-4 rounded-xl bg-fuchsia-500/10 border border-fuchsia-400/20 text-center"
                      >
                        <span className="text-2xl">{cosmicPreview.chinese.symbol}</span>
                        <p className="text-[10px] text-fuchsia-400/60 uppercase tracking-wider mt-1">{cosmicPreview.chinese.fullName}</p>
                      </motion.div>
                    </motion.div>
                  )}
                </div>
              )}

              {/* Step 5: Birth time (was step 2) */}
              {step === 5 && (
                <FieldCard label={t('fields.birthTimeOptional')}>
                  <input
                    type="time"
                    value={birthTime}
                    onChange={(e) => setBirthTime(e.target.value)}
                    autoFocus
                    className="w-full bg-transparent text-white text-lg outline-none [color-scheme:dark]"
                  />
                </FieldCard>
              )}

              {/* Step 6: Birth place (was step 3) */}
              {step === 6 && (
                <div className="space-y-4">
                  <FieldCard label={t('fields.cityOfBirth')}>
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && country.trim() && goNext()}
                      placeholder={t('fields.cityPlaceholder')}
                      autoFocus
                      className="w-full bg-transparent text-white placeholder-white/25 text-lg outline-none"
                    />
                  </FieldCard>
                  <FieldCard label={t('fields.country')}>
                    <input
                      type="text"
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && goNext()}
                      placeholder={t('fields.countryPlaceholder')}
                      className="w-full bg-transparent text-white placeholder-white/25 text-lg outline-none"
                    />
                  </FieldCard>
                </div>
              )}

              {/* Step 7: Photo (was step 4) */}
              {step === 7 && (
                <div className="flex flex-col items-center gap-6">
                  <PhotoUpload
                    currentPhoto={photo}
                    onPhotoChange={setPhoto}
                    size="lg"
                  />
                  <button
                    onClick={goNext}
                    className="text-white/30 text-sm hover:text-white/50 transition-colors"
                  >
                    {t('fields.skipPhoto')}
                  </button>
                </div>
              )}

              {/* Step 8: Gender (was step 5) */}
              {step === 8 && (
                <div className="space-y-3">
                  {[
                    { value: "Male", labelKey: "male" },
                    { value: "Female", labelKey: "female" },
                    { value: "Non-binary", labelKey: "nonBinary" },
                  ].map(({ value, labelKey }) => (
                    <motion.button
                      key={value}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => { setGender(value); setTimeout(goNext, 200); }}
                      className={`w-full rounded-2xl p-4 border text-left text-white text-base transition-all ${
                        gender === value
                          ? "border-violet-400/50 bg-violet-500/15"
                          : "border-white/10 bg-white/5 hover:border-white/20"
                      }`}
                    >
                      {t(`genderOptions.${labelKey}`)}
                    </motion.button>
                  ))}
                  <button
                    onClick={goNext}
                    className="w-full text-center text-white/30 text-sm mt-2 hover:text-white/50 transition-colors"
                  >
                    {t('skipStep')}
                  </button>
                </div>
              )}

              {/* Step 9: Occupation (was step 6) */}
              {step === 9 && (
                <FieldCard label={t('fields.occupation')}>
                  <input
                    type="text"
                    value={occupation}
                    onChange={(e) => setOccupation(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && goNext()}
                    placeholder={t('fields.occupationPlaceholder')}
                    autoFocus
                    className="w-full bg-transparent text-white placeholder-white/25 text-lg outline-none"
                  />
                </FieldCard>
              )}

              {/* Step 10: Portfolio (was step 7) */}
              {step === 10 && (
                <div className="space-y-4">
                  <FieldCard label={t('fields.roleTitle')}>
                    <input
                      type="text"
                      value={roleTitle}
                      onChange={(e) => setRoleTitle(e.target.value)}
                      placeholder={t('fields.roleTitlePlaceholder')}
                      autoFocus
                      className="w-full bg-transparent text-white placeholder-white/25 text-lg outline-none"
                    />
                  </FieldCard>
                  <FieldCard label={t('fields.companyName')}>
                    <input
                      type="text"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      placeholder={t('fields.companyNamePlaceholder')}
                      className="w-full bg-transparent text-white placeholder-white/25 text-lg outline-none"
                    />
                  </FieldCard>
                  <FieldCard label={t('fields.school')}>
                    <input
                      type="text"
                      value={school}
                      onChange={(e) => setSchool(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && goNext()}
                      placeholder={t('fields.schoolPlaceholder')}
                      className="w-full bg-transparent text-white placeholder-white/25 text-lg outline-none"
                    />
                  </FieldCard>
                  <button
                    onClick={goNext}
                    className="w-full text-center text-white/30 text-sm mt-2 hover:text-white/50 transition-colors"
                  >
                    {t('skipStep')}
                  </button>
                </div>
              )}

              {/* Step 11: Relationship (was step 8) */}
              {step === 11 && (
                <div className="space-y-3">
                  {RELATIONSHIP_KEYS.map((opt) => (
                    <motion.button
                      key={opt}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => { setRelationship(opt); }}
                      className={`w-full rounded-2xl p-4 border text-left text-white text-base transition-all ${
                        relationship === opt
                          ? "border-violet-400/50 bg-violet-500/15"
                          : "border-white/10 bg-white/5 hover:border-white/20"
                      }`}
                    >
                      {t(`relationshipOptions.${opt}`)}
                    </motion.button>
                  ))}
                </div>
              )}

              {/* Step 12: Cosmic Reveal (was step 9) */}
              {step === 12 && cosmicPreview && (
                <CosmicRevealStep cosmicPreview={cosmicPreview} name={name} />
              )}
            </motion.div>
          </AnimatePresence>

          {/* Navigation buttons */}
          {step !== 2 && (
            <div className="pt-6 pb-8 flex gap-3">
              {step > 0 && (
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={goBack}
                  className="w-14 h-14 rounded-2xl border border-white/10 flex items-center justify-center text-white/50 hover:bg-white/5 transition-all flex-shrink-0"
                >
                  <ChevronLeft size={22} />
                </motion.button>
              )}

              {/* Step 0: circle arrow button; Step 1 pre-OTP: send code; otherwise normal */}
              {step === 0 ? (
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={goNext}
                  disabled={!canNext}
                  className="flex-1 h-14 rounded-2xl flex items-center justify-center transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                  style={{
                    background: canNext
                      ? "linear-gradient(135deg, #7c3aed 0%, #8b5cf6 50%, #a78bfa 100%)"
                      : "rgba(124, 58, 237, 0.2)",
                  }}
                >
                  <ArrowRight size={22} className="text-white" />
                </motion.button>
              ) : step === 1 && !otpSent ? (
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={sendOtp}
                  disabled={phone.length < 7}
                  className="flex-1 h-14 rounded-2xl font-bold text-base tracking-wide transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
                  style={{
                    background: phone.length >= 7
                      ? "linear-gradient(135deg, #7c3aed 0%, #8b5cf6 50%, #a78bfa 100%)"
                      : "rgba(124, 58, 237, 0.2)",
                    color: phone.length >= 7 ? "#ffffff" : "rgba(167, 139, 250, 0.4)",
                  }}
                >
                  {t('codeSent').replace('!', '')}
                  <ArrowRight size={18} />
                </motion.button>
              ) : (
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={goNext}
                  disabled={!canNext}
                  className="flex-1 h-14 rounded-2xl font-bold text-base tracking-wide transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
                  style={{
                    background: canNext
                      ? step === TOTAL_STEPS - 1
                        ? "linear-gradient(135deg, #7c3aed 0%, #a78bfa 50%, #c4b5fd 100%)"
                        : "linear-gradient(135deg, #7c3aed 0%, #8b5cf6 50%, #a78bfa 100%)"
                      : "rgba(124, 58, 237, 0.15)",
                    color: canNext ? "#ffffff" : "rgba(167, 139, 250, 0.4)",
                    boxShadow: canNext
                      ? step === TOTAL_STEPS - 1
                        ? "0 4px 20px rgba(139, 92, 246, 0.4)"
                        : "0 4px 20px rgba(139, 92, 246, 0.2)"
                      : "none",
                  }}
                >
                  {step === TOTAL_STEPS - 1 ? (
                    <>
                      <Star size={18} />
                      {t('enterTheCosmos')}
                      <Star size={18} />
                    </>
                  ) : (
                    <>
                      {tc('continue')}
                      <ChevronRight size={18} />
                    </>
                  )}
                </motion.button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function FieldCard({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div
      className="rounded-2xl p-5 border"
      style={{
        background: "rgba(255, 255, 255, 0.04)",
        borderColor: "rgba(255, 255, 255, 0.1)",
      }}
    >
      <label className="block text-[10px] font-bold uppercase tracking-[0.15em] text-violet-400 mb-3">
        {label}
      </label>
      {children}
    </div>
  );
}

// ═══════════════════════════════════════
// Cosmic Reveal Step
// ═══════════════════════════════════════

function CosmicRevealStep({
  cosmicPreview,
  name,
}: {
  cosmicPreview: {
    western: ReturnType<typeof getWesternZodiacFromDate>;
    chinese: ReturnType<typeof getChineseZodiacFromYear>;
    lifePath: number;
  };
  name: string;
}) {
  const t = useTranslations('onboarding');
  const tc = useTranslations('common');
  const lp = lifePathData[cosmicPreview.lifePath];
  const zodiac = zodiacDescriptions[cosmicPreview.western.sign];
  const animal = chineseAnimalDescriptions[cosmicPreview.chinese.animal];
  const firstName = name.trim().split(" ")[0];

  return (
    <div className="space-y-4 overflow-y-auto max-h-[52vh] pr-1 pb-2">
      {/* Life Path Number */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, type: "spring", stiffness: 300, damping: 25 }}
        className="rounded-2xl p-5 border border-violet-400/20"
        style={{ background: "rgba(139, 92, 246, 0.06)" }}
      >
        <div className="flex items-center gap-2 mb-3">
          <Hash size={14} className="text-violet-400" />
          <p className="text-[10px] uppercase tracking-[0.15em] font-bold text-violet-400">{t('lifePathNumber')}</p>
        </div>
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-full bg-violet-400/15 border border-violet-400/25 flex items-center justify-center shrink-0">
            <span className="text-2xl font-serif font-bold text-violet-300">{cosmicPreview.lifePath}</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-base font-bold text-white">{lp?.name}</p>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">{lp?.description}</p>
            {lp?.traits && (
              <div className="flex flex-wrap gap-1.5 mt-2.5">
                {lp.traits.map((trait) => (
                  <span key={trait} className="text-[10px] px-2 py-0.5 rounded-full bg-violet-400/10 text-violet-400 border border-violet-400/20 font-medium">
                    {trait}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Western Zodiac */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, type: "spring", stiffness: 300, damping: 25 }}
        className="rounded-2xl p-5 border border-purple-400/20"
        style={{ background: "rgba(167, 139, 250, 0.06)" }}
      >
        <div className="flex items-center gap-2 mb-3">
          <Sun size={14} className="text-purple-400" />
          <p className="text-[10px] uppercase tracking-[0.15em] font-bold text-purple-400">{tc('westernZodiac')}</p>
        </div>
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-full bg-purple-400/15 border border-purple-400/25 flex items-center justify-center shrink-0">
            <span className="text-2xl">{cosmicPreview.western.symbol}</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-base font-bold text-white">{cosmicPreview.western.sign}</p>
            <p className="text-[11px] text-slate-500 mt-0.5">{cosmicPreview.western.element} {tc('element')}{zodiac ? ` \u00b7 ${tc('ruledBy', { ruler: zodiac.ruler })}` : ""}</p>
            {zodiac && (
              <p className="text-[10px] text-purple-300/70 mt-0.5">{zodiac.polarityLabel}</p>
            )}
            {zodiac && (
              <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">{zodiac.traits}</p>
            )}
            {zodiac && (
              <div className="mt-2.5 p-2.5 rounded-xl bg-purple-400/5 border border-purple-400/10">
                <p className="text-[9px] text-purple-300 uppercase tracking-widest font-semibold mb-1">{tc('bestMatches')}</p>
                <p className="text-xs text-slate-400">{zodiac.compatibleSigns.join(", ")}</p>
              </div>
            )}
          </div>
        </div>
        <div className="mt-3 p-2.5 rounded-xl bg-purple-400/5 border border-purple-400/10">
          <p className="text-[9px] text-purple-300 uppercase tracking-widest font-semibold mb-1">
            <Sparkles size={9} className="inline mr-1" />{cosmicPreview.western.element} {tc('element')}
          </p>
          <p className="text-[11px] text-slate-400 leading-relaxed">{elementDescriptions[cosmicPreview.western.element]}</p>
        </div>
        {zodiac && (
          <div className="mt-2 p-2.5 rounded-xl bg-purple-400/5 border border-purple-400/10">
            <p className="text-[9px] text-purple-300 uppercase tracking-widest font-semibold mb-1">{tc('polarity')}</p>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              {zodiac.polarity === "Positive"
                ? tc('polarityPositiveShort')
                : tc('polarityNegativeShort')}
            </p>
          </div>
        )}
      </motion.div>

      {/* Chinese Zodiac */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, type: "spring", stiffness: 300, damping: 25 }}
        className="rounded-2xl p-5 border border-fuchsia-400/20"
        style={{ background: "rgba(217, 70, 239, 0.06)" }}
      >
        <div className="flex items-center gap-2 mb-3">
          <Moon size={14} className="text-fuchsia-400" />
          <p className="text-[10px] uppercase tracking-[0.15em] font-bold text-fuchsia-400">{tc('chineseZodiac')}</p>
        </div>
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-full bg-fuchsia-400/15 border border-fuchsia-400/25 flex items-center justify-center shrink-0">
            <span className="text-2xl">{cosmicPreview.chinese.symbol}</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-base font-bold text-white">{cosmicPreview.chinese.fullName}</p>
            <p className="text-[11px] text-slate-500 mt-0.5">{cosmicPreview.chinese.element} {tc('element')}</p>
            {animal && (
              <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">{animal.traits}</p>
            )}
            {animal && (
              <div className="flex gap-2 mt-2.5">
                <div className="flex-1 p-2 rounded-xl bg-fuchsia-400/5 border border-fuchsia-400/10">
                  <p className="text-[9px] text-fuchsia-300 uppercase tracking-widest font-semibold mb-0.5">{t('luckyHash')}</p>
                  <p className="text-xs text-slate-400">{animal.luckyNumbers.join(", ")}</p>
                </div>
                <div className="flex-1 p-2 rounded-xl bg-fuchsia-400/5 border border-fuchsia-400/10">
                  <p className="text-[9px] text-fuchsia-300 uppercase tracking-widest font-semibold mb-0.5">{t('colors')}</p>
                  <p className="text-xs text-slate-400">{animal.luckyColors.join(", ")}</p>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="mt-3 p-2.5 rounded-xl bg-fuchsia-400/5 border border-fuchsia-400/10">
          <p className="text-[9px] text-fuchsia-300 uppercase tracking-widest font-semibold mb-1">{cosmicPreview.chinese.element} {tc('element')}</p>
          <p className="text-[11px] text-slate-400 leading-relaxed">{chineseElementDescriptions[cosmicPreview.chinese.element]}</p>
        </div>
      </motion.div>

      {/* Summary */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="text-center pt-1 pb-2"
      >
        <p className="text-xs text-slate-500 leading-relaxed">
          {t('cosmicSummary', { name: firstName, lifePath: String(cosmicPreview.lifePath), sign: cosmicPreview.western.sign, animal: cosmicPreview.chinese.fullName })}
        </p>
      </motion.div>
    </div>
  );
}
