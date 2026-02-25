"use client";

import { motion } from "framer-motion";
import { X, Star, Heart, RotateCcw } from "lucide-react";

interface SwipeActionsProps {
  onPass: () => void;
  onSuperLike: () => void;
  onLike: () => void;
  onUndo?: () => void;
}

export default function SwipeActions({ onPass, onSuperLike, onLike, onUndo }: SwipeActionsProps) {
  return (
    <div className="flex items-center justify-center gap-4 py-2">
      {onUndo && (
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.92 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
          onClick={onUndo}
          className="w-11 h-11 rounded-full flex items-center justify-center glass-card text-amber-accent hover:bg-amber-accent/10 transition-colors"
        >
          <RotateCcw size={16} />
        </motion.button>
      )}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.92 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
        onClick={onPass}
        className="w-[60px] h-[60px] rounded-full flex items-center justify-center bg-gradient-to-br from-red-500/20 to-red-500/5 border-2 border-red-400/30 text-red-400 hover:border-red-400/60 hover:shadow-[0_0_20px_rgba(239,68,68,0.2)] transition-all"
      >
        <X size={26} strokeWidth={3} />
      </motion.button>
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.92 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
        onClick={onSuperLike}
        className="w-12 h-12 rounded-full flex items-center justify-center bg-gradient-to-br from-blue-500/20 to-blue-500/5 border-2 border-blue-400/30 text-blue-400 hover:border-blue-400/60 hover:shadow-[0_0_20px_rgba(59,130,246,0.2)] transition-all"
      >
        <Star size={20} />
      </motion.button>
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.92 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
        onClick={onLike}
        className="w-[60px] h-[60px] rounded-full flex items-center justify-center bg-gradient-to-br from-green-500/20 to-green-500/5 border-2 border-green-400/30 text-green-400 hover:border-green-400/60 hover:shadow-[0_0_20px_rgba(34,197,94,0.2)] transition-all"
      >
        <Heart size={26} strokeWidth={2.5} />
      </motion.button>
    </div>
  );
}
