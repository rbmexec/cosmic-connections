"use client";

import { motion } from "framer-motion";

interface CompatibilityBarProps {
  label: string;
  score: number;
  color: string;
  delay?: number;
}

export default function CompatibilityBar({ label, score, color, delay = 0 }: CompatibilityBarProps) {
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between items-center">
        <span className="text-[11px] text-slate-400 font-medium">{label}</span>
        <span className="text-[11px] font-bold tabular-nums" style={{ color }}>{score}%</span>
      </div>
      <div className="h-[6px] rounded-full bg-white/5 overflow-hidden">
        <motion.div
          className="h-full rounded-full relative overflow-hidden"
          style={{ background: `linear-gradient(90deg, ${color}, ${color}cc)` }}
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{ duration: 1.2, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <div className="absolute inset-0 shimmer" />
        </motion.div>
      </div>
    </div>
  );
}
