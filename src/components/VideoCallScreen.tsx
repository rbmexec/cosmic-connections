"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { motion } from "framer-motion";
import { Mic, MicOff, Camera, CameraOff, Volume2, Phone, Info } from "lucide-react";
import { useTranslations } from "next-intl";

interface VideoCallScreenProps {
  matchProfile: {
    name: string;
    photo: string;
  };
  userPhoto: string;
  onEnd: () => void;
}

interface ConstellationDot {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  duration: number;
  delay: number;
}

export default function VideoCallScreen({ matchProfile, userPhoto, onEnd }: VideoCallScreenProps) {
  const t = useTranslations("videoCall");

  const [elapsed, setElapsed] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval>>(undefined);

  // Generate constellation dots
  const constellationDots: ConstellationDot[] = useMemo(
    () =>
      Array.from({ length: 40 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 3 + 1,
        opacity: Math.random() * 0.5 + 0.1,
        duration: Math.random() * 6 + 3,
        delay: Math.random() * 4,
      })),
    []
  );

  // Generate constellation lines between nearby dots
  const constellationLines = useMemo(() => {
    const lines: { x1: number; y1: number; x2: number; y2: number; id: string }[] = [];
    for (let i = 0; i < constellationDots.length; i++) {
      for (let j = i + 1; j < constellationDots.length; j++) {
        const dx = constellationDots[i].x - constellationDots[j].x;
        const dy = constellationDots[i].y - constellationDots[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 15 && lines.length < 20) {
          lines.push({
            x1: constellationDots[i].x,
            y1: constellationDots[i].y,
            x2: constellationDots[j].x,
            y2: constellationDots[j].y,
            id: `${i}-${j}`,
          });
        }
      }
    }
    return lines;
  }, [constellationDots]);

  // Timer
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setElapsed((prev) => prev + 1);
    }, 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-slate-950 flex flex-col"
    >
      {/* Constellation background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          {/* Lines */}
          {constellationLines.map((line) => (
            <motion.line
              key={line.id}
              x1={`${line.x1}%`}
              y1={`${line.y1}%`}
              x2={`${line.x2}%`}
              y2={`${line.y2}%`}
              stroke="rgba(168,85,247,0.08)"
              strokeWidth="0.1"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.6, 0] }}
              transition={{ duration: 5, repeat: Infinity, delay: Math.random() * 3 }}
            />
          ))}
        </svg>

        {/* Dots */}
        {constellationDots.map((dot) => (
          <motion.div
            key={dot.id}
            className="absolute rounded-full bg-white"
            style={{
              left: `${dot.x}%`,
              top: `${dot.y}%`,
              width: dot.size,
              height: dot.size,
            }}
            animate={{
              opacity: [dot.opacity * 0.3, dot.opacity, dot.opacity * 0.3],
              scale: [0.8, 1.2, 0.8],
            }}
            transition={{
              duration: dot.duration,
              repeat: Infinity,
              delay: dot.delay,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Top bar */}
      <div className="relative z-10 flex items-center justify-between px-4 py-3">
        {/* Demo mode badge */}
        <motion.div
          className="glass-card-strong rounded-full px-3 py-1 flex items-center gap-1.5 border border-purple-400/20"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Info size={11} className="text-purple-400" />
          <span className="text-[10px] font-semibold text-purple-300">{t("demoMode")}</span>
        </motion.div>

        {/* Timer */}
        <motion.div
          className="glass-card-strong rounded-full px-3 py-1"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <span className="text-xs font-semibold text-white tabular-nums">
            {formatTime(elapsed)}
          </span>
        </motion.div>
      </div>

      {/* Main video area — match's profile photo with breathing animation */}
      <div className="flex-1 relative flex items-center justify-center">
        <motion.div
          className="relative"
          animate={{
            scale: [1, 1.03, 1],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          {/* Glow ring */}
          <motion.div
            className="absolute -inset-4 rounded-full"
            style={{
              background:
                "radial-gradient(circle, rgba(168,85,247,0.15) 0%, rgba(168,85,247,0.05) 50%, transparent 70%)",
            }}
            animate={{
              scale: [1, 1.15, 1],
              opacity: [0.5, 0.8, 0.5],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />

          {/* Match photo */}
          <img
            src={matchProfile.photo}
            alt={matchProfile.name}
            className="w-44 h-44 rounded-full object-cover ring-2 ring-purple-400/30 shadow-[0_0_40px_rgba(168,85,247,0.2)]"
          />
        </motion.div>

        {/* Match name below photo */}
        <motion.div
          className="absolute bottom-[20%] left-1/2 -translate-x-1/2 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <p className="text-lg font-semibold text-white">{matchProfile.name}</p>
          <p className="text-xs text-slate-400 mt-0.5">{t("connected")}</p>
        </motion.div>

        {/* User's PiP (bottom-right corner) */}
        <motion.div
          className="absolute bottom-6 right-6"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6, type: "spring", stiffness: 300 }}
        >
          <div className="relative">
            {isCameraOff ? (
              <div className="w-24 h-32 rounded-2xl bg-slate-800 border border-white/10 flex items-center justify-center shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
                <CameraOff size={20} className="text-slate-500" />
              </div>
            ) : (
              <img
                src={userPhoto}
                alt={t("you")}
                className="w-24 h-32 rounded-2xl object-cover border-2 border-white/10 shadow-[0_4px_20px_rgba(0,0,0,0.5)]"
              />
            )}
            {/* Muted indicator on PiP */}
            {isMuted && (
              <div className="absolute bottom-1 right-1 w-5 h-5 rounded-full bg-red-500/90 flex items-center justify-center">
                <MicOff size={10} className="text-white" />
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Bottom control bar */}
      <motion.div
        className="relative z-10 px-6 pb-8 pt-4"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, type: "spring", stiffness: 300, damping: 25 }}
      >
        <div className="flex items-center justify-center gap-5">
          {/* Mute toggle */}
          <motion.button
            onClick={() => setIsMuted(!isMuted)}
            whileTap={{ scale: 0.9 }}
            className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${
              isMuted
                ? "bg-white/10 border border-red-400/30 text-red-400"
                : "glass-card-strong text-white border border-white/10"
            }`}
          >
            {isMuted ? <MicOff size={22} /> : <Mic size={22} />}
          </motion.button>

          {/* Camera toggle */}
          <motion.button
            onClick={() => setIsCameraOff(!isCameraOff)}
            whileTap={{ scale: 0.9 }}
            className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${
              isCameraOff
                ? "bg-white/10 border border-red-400/30 text-red-400"
                : "glass-card-strong text-white border border-white/10"
            }`}
          >
            {isCameraOff ? <CameraOff size={22} /> : <Camera size={22} />}
          </motion.button>

          {/* Speaker */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            className="w-14 h-14 rounded-full glass-card-strong flex items-center justify-center text-white border border-white/10"
          >
            <Volume2 size={22} />
          </motion.button>

          {/* End call */}
          <motion.button
            onClick={onEnd}
            whileTap={{ scale: 0.9 }}
            whileHover={{ scale: 1.05 }}
            className="w-14 h-14 rounded-full bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center text-white shadow-[0_4px_20px_rgba(239,68,68,0.4)]"
          >
            <Phone size={22} className="rotate-[135deg]" />
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}
