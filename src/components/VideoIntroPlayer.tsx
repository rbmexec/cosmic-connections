"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, X, Video } from "lucide-react";
import { useTranslations } from "next-intl";

interface VideoIntroPlayerProps {
  url?: string;
  hasVideoIntro?: boolean;
  profilePhoto?: string;
  profileName?: string;
}

export default function VideoIntroPlayer({
  url,
  hasVideoIntro,
  profilePhoto,
  profileName,
}: VideoIntroPlayerProps) {
  const t = useTranslations("media");
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Nothing to show
  if (!hasVideoIntro && !url) return null;

  const isDemo = hasVideoIntro && !url;

  const handleOpen = () => {
    if (url) {
      setIsFullscreen(true);
    }
  };

  return (
    <>
      {/* Card thumbnail */}
      <motion.button
        onClick={handleOpen}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="relative glass-card rounded-2xl overflow-hidden w-full aspect-[4/5] max-w-[160px] group"
      >
        {/* Background image or gradient */}
        {profilePhoto ? (
          <img
            src={profilePhoto}
            alt={profileName || ""}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-purple-900/60 to-slate-900 flex items-center justify-center">
            <Video size={32} className="text-slate-600" />
          </div>
        )}

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

        {/* Play button overlay */}
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30 group-hover:bg-white/30 transition-colors"
            whileHover={{ scale: 1.1 }}
          >
            <Play size={20} className="text-white ml-0.5" fill="white" />
          </motion.div>
        </div>

        {/* Demo badge */}
        {isDemo && (
          <div className="absolute top-2 right-2">
            <span className="glass-card-strong rounded-full px-2 py-0.5 text-[9px] font-bold text-purple-300 border border-purple-400/20">
              {t("demo")}
            </span>
          </div>
        )}

        {/* Video intro label */}
        <div className="absolute bottom-2 left-2 right-2">
          <div className="flex items-center gap-1.5">
            <Video size={11} className="text-purple-300 shrink-0" />
            <span className="text-[10px] text-white/80 font-semibold truncate">
              {t("videoIntro")}
            </span>
          </div>
          {profileName && (
            <p className="text-[9px] text-slate-400 mt-0.5 truncate">{profileName}</p>
          )}
        </div>
      </motion.button>

      {/* Fullscreen player */}
      <AnimatePresence>
        {isFullscreen && url && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black flex items-center justify-center"
            onClick={() => setIsFullscreen(false)}
          >
            {/* Close button */}
            <button
              onClick={() => setIsFullscreen(false)}
              className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full glass-card-strong flex items-center justify-center text-slate-400 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>

            {/* Profile name header */}
            {profileName && (
              <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
                <Video size={14} className="text-purple-400" />
                <span className="text-sm font-semibold text-white">{profileName}</span>
              </div>
            )}

            {/* Video */}
            <motion.video
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              src={url}
              autoPlay
              controls
              playsInline
              onClick={(e) => e.stopPropagation()}
              className="max-w-full max-h-full rounded-2xl"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
