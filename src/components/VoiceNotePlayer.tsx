"use client";

import { useState, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { Play, Pause, Mic } from "lucide-react";
import { useTranslations } from "next-intl";

interface VoiceNotePlayerProps {
  url?: string;
  hasVoiceNote?: boolean;
}

export default function VoiceNotePlayer({ url, hasVoiceNote }: VoiceNotePlayerProps) {
  const t = useTranslations("media");

  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);

  const audioRef = useRef<HTMLAudioElement>(undefined);
  const animFrameRef = useRef<number>(undefined);

  const formatTime = (seconds: number) => {
    if (!seconds || isNaN(seconds)) return "0:00";
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const stopTracking = useCallback(() => {
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = undefined;
    }
  }, []);

  const startTracking = useCallback(() => {
    const track = () => {
      const audio = audioRef.current;
      if (audio && audio.duration && !isNaN(audio.duration)) {
        setProgress(audio.currentTime / audio.duration);
        setDuration(audio.duration);
      }
      animFrameRef.current = requestAnimationFrame(track);
    };
    track();
  }, []);

  const togglePlayback = () => {
    if (!url) return;

    if (isPlaying && audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
      stopTracking();
      return;
    }

    // Create a fresh audio element or reuse
    if (!audioRef.current || audioRef.current.src !== url) {
      if (audioRef.current) {
        audioRef.current.pause();
        stopTracking();
      }
      const audio = new Audio(url);
      audioRef.current = audio;

      audio.onloadedmetadata = () => {
        if (audio.duration && !isNaN(audio.duration)) {
          setDuration(audio.duration);
        }
      };

      audio.onended = () => {
        setIsPlaying(false);
        setProgress(0);
        stopTracking();
      };
    }

    audioRef.current.play();
    setIsPlaying(true);
    startTracking();
  };

  // No voice note and no URL: show nothing or placeholder
  if (!hasVoiceNote && !url) return null;

  // Demo placeholder when hasVoiceNote is true but no real URL
  const isDemo = hasVoiceNote && !url;

  return (
    <div className="glass-card rounded-xl px-3 py-2 flex items-center gap-2.5 max-w-[220px]">
      {/* Play/Pause button */}
      <motion.button
        onClick={isDemo ? undefined : togglePlayback}
        whileTap={isDemo ? undefined : { scale: 0.9 }}
        className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
          isDemo
            ? "bg-slate-600/50 text-slate-400 cursor-default"
            : "bg-gradient-to-br from-teal-500 to-teal-600 text-white shadow-[0_2px_8px_rgba(20,184,166,0.3)]"
        }`}
      >
        {isDemo ? (
          <Mic size={13} />
        ) : isPlaying ? (
          <Pause size={13} />
        ) : (
          <Play size={13} className="ml-0.5" />
        )}
      </motion.button>

      {/* Progress bar / demo placeholder */}
      <div className="flex-1 min-w-0">
        {isDemo ? (
          <p className="text-[10px] text-slate-400 truncate">{t("demoVoiceNote")}</p>
        ) : (
          <div className="flex flex-col gap-1">
            {/* Progress track */}
            <div className="h-1 rounded-full bg-slate-700/80 overflow-hidden">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-teal-400 to-teal-500"
                style={{ width: `${progress * 100}%` }}
                transition={{ duration: 0.1 }}
              />
            </div>
            <span className="text-[9px] text-slate-500 tabular-nums">
              {isPlaying
                ? `${formatTime(progress * duration)} / ${formatTime(duration)}`
                : formatTime(duration)}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
