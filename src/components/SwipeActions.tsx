"use client";

import { motion } from "framer-motion";
import { X, Star, Heart } from "lucide-react";

interface SwipeActionsProps {
  onPass: () => void;
  onSuperLike: () => void;
  onLike: () => void;
}

export default function SwipeActions({ onPass, onSuperLike, onLike }: SwipeActionsProps) {
  return (
    <div className="flex items-center justify-center gap-5 py-4">
      <motion.button
        whileTap={{ scale: 0.85 }}
        onClick={onPass}
        className="w-14 h-14 rounded-full flex items-center justify-center border-2 border-red-400/50 text-red-400 hover:bg-red-400/10 transition-colors"
      >
        <X size={24} />
      </motion.button>
      <motion.button
        whileTap={{ scale: 0.85 }}
        onClick={onSuperLike}
        className="w-11 h-11 rounded-full flex items-center justify-center border-2 border-blue-400/50 text-blue-400 hover:bg-blue-400/10 transition-colors"
      >
        <Star size={18} />
      </motion.button>
      <motion.button
        whileTap={{ scale: 0.85 }}
        onClick={onLike}
        className="w-14 h-14 rounded-full flex items-center justify-center border-2 border-green-400/50 text-green-400 hover:bg-green-400/10 transition-colors"
      >
        <Heart size={24} />
      </motion.button>
    </div>
  );
}
