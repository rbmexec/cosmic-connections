"use client";

import { motion } from "framer-motion";
import { Video, Lock } from "lucide-react";

interface VideoCallButtonProps {
  onClick: () => void;
  locked?: boolean;
}

export default function VideoCallButton({ onClick, locked }: VideoCallButtonProps) {
  return (
    <motion.button
      onClick={onClick}
      whileTap={{ scale: 0.9 }}
      className="relative w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-all"
    >
      <Video size={18} />
      {locked && (
        <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-amber-500/90 flex items-center justify-center shadow-[0_0_6px_rgba(245,158,11,0.4)]">
          <Lock size={7} className="text-white" />
        </div>
      )}
    </motion.button>
  );
}
