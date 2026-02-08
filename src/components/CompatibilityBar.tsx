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
    <div className="space-y-1">
      <div className="flex justify-between text-xs">
        <span className="text-slate-400">{label}</span>
        <span className="font-medium" style={{ color }}>{score}%</span>
      </div>
      <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{ background: color }}
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{ duration: 1, delay, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}
