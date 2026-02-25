"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Video, Square, Play, Trash2, Check, AlertCircle, VideoOff } from "lucide-react";
import { useTranslations } from "next-intl";

interface VideoIntroRecorderProps {
  onSave: (dataUri: string) => void;
  onClose: () => void;
}

type RecorderState = "preview" | "recording" | "recorded";

const MAX_DURATION = 15;

export default function VideoIntroRecorder({ onSave, onClose }: VideoIntroRecorderProps) {
  const t = useTranslations("media");

  const [state, setState] = useState<RecorderState>("preview");
  const [timeLeft, setTimeLeft] = useState(MAX_DURATION);
  const [videoDataUri, setVideoDataUri] = useState<string | null>(null);
  const [cameraAvailable, setCameraAvailable] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const videoPreviewRef = useRef<HTMLVideoElement>(null);
  const videoPlaybackRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(undefined);
  const streamRef = useRef<MediaStream | null>(undefined);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval>>(undefined);

  const stopStream = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  }, []);

  const initCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: { ideal: 720 }, height: { ideal: 1280 } },
        audio: true,
      });
      streamRef.current = stream;
      if (videoPreviewRef.current) {
        videoPreviewRef.current.srcObject = stream;
      }
      setCameraAvailable(true);
    } catch {
      setCameraAvailable(false);
      setError(t("cameraNotAvailable"));
    }
  }, [t]);

  useEffect(() => {
    initCamera();
    return () => {
      stopStream();
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [initCamera, stopStream]);

  const startRecording = () => {
    if (!streamRef.current) return;
    setError(null);
    chunksRef.current = [];

    try {
      const mediaRecorder = new MediaRecorder(streamRef.current);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "video/webm" });
        const reader = new FileReader();
        reader.onloadend = () => {
          setVideoDataUri(reader.result as string);
          setState("recorded");
        };
        reader.readAsDataURL(blob);
        stopStream();
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
      setError(t("recordingFailed"));
    }
  };

  const stopRecording = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
      mediaRecorderRef.current.stop();
    }
  };

  const handleDiscard = async () => {
    setVideoDataUri(null);
    setState("preview");
    setTimeLeft(MAX_DURATION);
    await initCamera();
  };

  const handleSave = () => {
    if (videoDataUri) {
      onSave(videoDataUri);
      onClose();
    }
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black flex flex-col"
    >
      {/* Header */}
      <div className="relative z-10 flex items-center justify-between px-4 py-3 bg-gradient-to-b from-black/80 to-transparent">
        <div className="flex items-center gap-2">
          <Video size={18} className="text-purple-400" />
          <span className="text-sm font-semibold text-white">{t("videoIntro")}</span>
        </div>
        <button
          onClick={onClose}
          className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-all"
        >
          <X size={18} />
        </button>
      </div>

      {/* Camera / Video area */}
      <div className="flex-1 relative overflow-hidden">
        <AnimatePresence mode="wait">
          {/* Camera preview */}
          {(state === "preview" || state === "recording") && cameraAvailable && (
            <motion.div
              key="camera"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0"
            >
              <video
                ref={videoPreviewRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover mirror"
                style={{ transform: "scaleX(-1)" }}
              />
            </motion.div>
          )}

          {/* No camera placeholder */}
          {!cameraAvailable && state !== "recorded" && (
            <motion.div
              key="no-camera"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900 gap-4"
            >
              <VideoOff size={48} className="text-slate-600" />
              <p className="text-sm text-slate-400">{t("cameraNotAvailable")}</p>
            </motion.div>
          )}

          {/* Recorded playback */}
          {state === "recorded" && videoDataUri && (
            <motion.div
              key="playback"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0"
            >
              <video
                ref={videoPlaybackRef}
                src={videoDataUri}
                autoPlay
                loop
                playsInline
                className="w-full h-full object-cover"
                style={{ transform: "scaleX(-1)" }}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Recording overlay */}
        {state === "recording" && (
          <div className="absolute inset-0 pointer-events-none">
            {/* Recording indicator */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 flex items-center gap-2 glass-card-strong rounded-full px-4 py-2">
              <motion.div
                className="w-3 h-3 rounded-full bg-red-500"
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              />
              <span className="text-white font-bold text-lg tabular-nums">
                {formatTime(timeLeft)}
              </span>
            </div>

            {/* Circular countdown ring */}
            <div className="absolute top-4 right-4">
              <svg width="44" height="44" className="rotate-[-90deg]">
                <circle
                  cx="22"
                  cy="22"
                  r="18"
                  fill="none"
                  stroke="rgba(255,255,255,0.1)"
                  strokeWidth="3"
                />
                <motion.circle
                  cx="22"
                  cy="22"
                  r="18"
                  fill="none"
                  stroke="#ef4444"
                  strokeWidth="3"
                  strokeDasharray={2 * Math.PI * 18}
                  strokeDashoffset={2 * Math.PI * 18 * (timeLeft / MAX_DURATION)}
                  strokeLinecap="round"
                />
              </svg>
            </div>

            {/* Corner brackets to frame the recording */}
            <div className="absolute top-16 left-6 w-8 h-8 border-t-2 border-l-2 border-white/30 rounded-tl-lg" />
            <div className="absolute top-16 right-6 w-8 h-8 border-t-2 border-r-2 border-white/30 rounded-tr-lg" />
            <div className="absolute bottom-24 left-6 w-8 h-8 border-b-2 border-l-2 border-white/30 rounded-bl-lg" />
            <div className="absolute bottom-24 right-6 w-8 h-8 border-b-2 border-r-2 border-white/30 rounded-br-lg" />
          </div>
        )}

        {/* Error overlay */}
        {error && (
          <div className="absolute bottom-20 left-1/2 -translate-x-1/2">
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card-strong rounded-xl px-4 py-2 flex items-center gap-2"
            >
              <AlertCircle size={14} className="text-red-400" />
              <span className="text-xs text-red-400">{error}</span>
            </motion.div>
          </div>
        )}
      </div>

      {/* Bottom controls */}
      <div className="relative z-10 bg-gradient-to-t from-black/90 to-transparent px-6 py-6">
        <AnimatePresence mode="wait">
          {/* Preview state: Record button */}
          {state === "preview" && (
            <motion.div
              key="preview-controls"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex flex-col items-center gap-3"
            >
              <motion.button
                onClick={startRecording}
                disabled={!cameraAvailable}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-18 h-18 rounded-full border-4 border-white/50 flex items-center justify-center disabled:opacity-30"
              >
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center shadow-[0_4px_20px_rgba(239,68,68,0.5)]">
                  <Video size={22} className="text-white" />
                </div>
              </motion.button>
              <p className="text-xs text-slate-400">
                {t("tapToRecordVideo", { seconds: MAX_DURATION })}
              </p>
            </motion.div>
          )}

          {/* Recording state: Stop button */}
          {state === "recording" && (
            <motion.div
              key="recording-controls"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex flex-col items-center gap-3"
            >
              <motion.button
                onClick={stopRecording}
                whileTap={{ scale: 0.9 }}
                className="w-18 h-18 rounded-full border-4 border-red-400/50 flex items-center justify-center"
              >
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center shadow-[0_4px_20px_rgba(239,68,68,0.5)]">
                  <Square size={20} fill="white" className="text-white" />
                </div>
              </motion.button>
              <p className="text-xs text-slate-300">{t("tapToStop")}</p>
            </motion.div>
          )}

          {/* Recorded state: Save / Discard */}
          {state === "recorded" && (
            <motion.div
              key="recorded-controls"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex items-center gap-4 justify-center"
            >
              <motion.button
                onClick={handleDiscard}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex flex-col items-center gap-1.5"
              >
                <div className="w-14 h-14 rounded-full border border-slate-600/50 flex items-center justify-center text-slate-400 hover:text-red-400 hover:border-red-500/30 transition-all">
                  <Trash2 size={22} />
                </div>
                <span className="text-[10px] text-slate-500">{t("retake")}</span>
              </motion.button>

              <motion.button
                onClick={handleSave}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex flex-col items-center gap-1.5"
              >
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center text-white shadow-[0_4px_20px_rgba(20,184,166,0.4)]">
                  <Check size={24} />
                </div>
                <span className="text-[10px] text-teal-400 font-semibold">{t("saveVideo")}</span>
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
