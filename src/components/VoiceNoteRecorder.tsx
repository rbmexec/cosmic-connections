"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, Square, Play, Pause, Trash2, Send, AlertCircle } from "lucide-react";
import { useTranslations } from "next-intl";

interface VoiceNoteRecorderProps {
  onSave: (dataUri: string) => void;
  existingUrl?: string;
}

type RecorderState = "idle" | "recording" | "recorded";

const MAX_DURATION = 30;

export default function VoiceNoteRecorder({ onSave, existingUrl }: VoiceNoteRecorderProps) {
  const t = useTranslations("media");

  const [state, setState] = useState<RecorderState>(existingUrl ? "recorded" : "idle");
  const [timeLeft, setTimeLeft] = useState(MAX_DURATION);
  const [duration, setDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackProgress, setPlaybackProgress] = useState(0);
  const [audioUrl, setAudioUrl] = useState<string | null>(existingUrl || null);
  const [error, setError] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(undefined);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval>>(undefined);
  const audioRef = useRef<HTMLAudioElement>(undefined);
  const animFrameRef = useRef<number>(undefined);

  // Generate fake waveform bars for visual display
  const waveformBars = useRef<number[]>(
    Array.from({ length: 32 }, () => Math.random() * 0.7 + 0.3)
  ).current;

  const cleanup = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = undefined;
    }
  }, []);

  useEffect(() => {
    return cleanup;
  }, [cleanup]);

  const startRecording = async () => {
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        const reader = new FileReader();
        reader.onloadend = () => {
          const dataUri = reader.result as string;
          setAudioUrl(dataUri);
          setDuration(MAX_DURATION - timeLeft);
          setState("recorded");
        };
        reader.readAsDataURL(blob);
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setState("recording");
      setTimeLeft(MAX_DURATION);

      let elapsed = 0;
      timerRef.current = setInterval(() => {
        elapsed++;
        const remaining = MAX_DURATION - elapsed;
        setTimeLeft(remaining);
        if (remaining <= 0) {
          clearInterval(timerRef.current!);
          mediaRecorder.stop();
        }
      }, 1000);
    } catch {
      setError(t("micNotAvailable"));
    }
  };

  const stopRecording = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
      const elapsed = MAX_DURATION - timeLeft;
      setDuration(elapsed);
      mediaRecorderRef.current.stop();
    }
  };

  const togglePlayback = () => {
    if (!audioUrl) return;

    if (isPlaying && audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      return;
    }

    const audio = new Audio(audioUrl);
    audioRef.current = audio;

    audio.onended = () => {
      setIsPlaying(false);
      setPlaybackProgress(0);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };

    audio.play();
    setIsPlaying(true);

    const updateProgress = () => {
      if (audio.duration && !isNaN(audio.duration)) {
        setPlaybackProgress(audio.currentTime / audio.duration);
      }
      animFrameRef.current = requestAnimationFrame(updateProgress);
    };
    updateProgress();
  };

  const handleDiscard = () => {
    cleanup();
    setAudioUrl(null);
    setDuration(0);
    setPlaybackProgress(0);
    setIsPlaying(false);
    setState("idle");
  };

  const handleSave = () => {
    if (audioUrl) {
      onSave(audioUrl);
    }
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <div className="glass-card rounded-2xl p-4">
      <AnimatePresence mode="wait">
        {/* Error state */}
        {error && (
          <motion.div
            key="error"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="flex items-center gap-2 text-red-400"
          >
            <AlertCircle size={16} />
            <span className="text-xs">{error}</span>
          </motion.div>
        )}

        {/* Idle state */}
        {state === "idle" && !error && (
          <motion.div
            key="idle"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center gap-3"
          >
            <p className="text-xs text-slate-400">{t("tapToRecord")}</p>
            <motion.button
              onClick={startRecording}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-16 h-16 rounded-full bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center text-white shadow-[0_4px_20px_rgba(239,68,68,0.4)] hover:shadow-[0_4px_28px_rgba(239,68,68,0.5)] transition-shadow"
            >
              <Mic size={24} />
            </motion.button>
            <p className="text-[10px] text-slate-500">
              {t("maxDuration", { seconds: MAX_DURATION })}
            </p>
          </motion.div>
        )}

        {/* Recording state */}
        {state === "recording" && (
          <motion.div
            key="recording"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center gap-3"
          >
            <div className="flex items-center gap-2">
              <motion.div
                className="w-2.5 h-2.5 rounded-full bg-red-500"
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
              />
              <span className="text-sm font-semibold text-white">{t("recording")}</span>
            </div>

            {/* Pulse record button */}
            <div className="relative">
              <motion.div
                className="absolute inset-0 rounded-full bg-red-500/20"
                animate={{ scale: [1, 1.6, 1], opacity: [0.5, 0, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeOut" }}
              />
              <motion.div
                className="absolute inset-0 rounded-full bg-red-500/10"
                animate={{ scale: [1, 2, 1], opacity: [0.3, 0, 0.3] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeOut", delay: 0.3 }}
              />
              <motion.button
                onClick={stopRecording}
                whileTap={{ scale: 0.9 }}
                className="relative w-16 h-16 rounded-full bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center text-white shadow-[0_4px_20px_rgba(239,68,68,0.5)]"
              >
                <Square size={20} fill="white" />
              </motion.button>
            </div>

            {/* Countdown */}
            <span className="text-lg font-bold text-red-400 tabular-nums">
              {formatTime(timeLeft)}
            </span>

            {/* Animated bars */}
            <div className="flex items-center gap-0.5 h-6">
              {Array.from({ length: 20 }).map((_, i) => (
                <motion.div
                  key={i}
                  className="w-1 rounded-full bg-red-400/80"
                  animate={{
                    height: [4, 12 + Math.random() * 12, 4],
                  }}
                  transition={{
                    duration: 0.4 + Math.random() * 0.3,
                    repeat: Infinity,
                    delay: i * 0.05,
                    ease: "easeInOut",
                  }}
                />
              ))}
            </div>
          </motion.div>
        )}

        {/* Recorded state */}
        {state === "recorded" && (
          <motion.div
            key="recorded"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="flex flex-col gap-3"
          >
            {/* Waveform playback */}
            <div className="flex items-center gap-3">
              <motion.button
                onClick={togglePlayback}
                whileTap={{ scale: 0.9 }}
                className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center text-white shrink-0 shadow-[0_2px_12px_rgba(20,184,166,0.3)]"
              >
                {isPlaying ? <Pause size={16} /> : <Play size={16} className="ml-0.5" />}
              </motion.button>

              {/* Waveform bars */}
              <div className="flex-1 flex items-center gap-[2px] h-8">
                {waveformBars.map((height, i) => {
                  const barProgress = i / waveformBars.length;
                  const isActive = barProgress <= playbackProgress;
                  return (
                    <motion.div
                      key={i}
                      className={`w-1 rounded-full transition-colors duration-150 ${
                        isActive ? "bg-teal-400" : "bg-slate-600"
                      }`}
                      style={{ height: `${height * 100}%` }}
                      initial={{ scaleY: 0 }}
                      animate={{ scaleY: 1 }}
                      transition={{ delay: i * 0.015, type: "spring", stiffness: 300, damping: 20 }}
                    />
                  );
                })}
              </div>

              <span className="text-xs text-slate-400 tabular-nums shrink-0">
                {formatTime(duration)}
              </span>
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-2">
              <motion.button
                onClick={handleDiscard}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                className="flex-1 py-2.5 rounded-xl border border-slate-600/50 text-sm font-semibold text-slate-400 hover:text-red-400 hover:border-red-500/30 transition-all flex items-center justify-center gap-1.5"
              >
                <Trash2 size={14} />
                {t("discard")}
              </motion.button>
              <motion.button
                onClick={handleSave}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-teal-500 to-teal-600 text-white text-sm font-bold hover:opacity-90 transition-all flex items-center justify-center gap-1.5 shadow-[0_2px_12px_rgba(20,184,166,0.3)]"
              >
                <Send size={14} />
                {t("saveVoiceNote")}
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
