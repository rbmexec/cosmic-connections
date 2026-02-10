"use client";

import { motion } from "framer-motion";
import { MapPin, Briefcase } from "lucide-react";
import type { UserProfile } from "@/types/profile";

export default function AttractionCard({ profile }: { profile: UserProfile }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="relative rounded-[28px] overflow-hidden max-w-sm mx-auto aspect-[3/4.2] card-stack-shadow"
    >
      <img
        src={profile.photo}
        alt={profile.name}
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 photo-gradient" />

      {/* Cosmic Badge */}
      <div className="absolute top-4 left-4 flex items-center gap-2">
        <div className="glass-card-strong px-3 py-1.5 rounded-full flex items-center gap-1.5">
          <span className="text-sm">{profile.westernZodiac.symbol}</span>
          <span className="text-xs font-semibold text-slate-200">{profile.westernZodiac.sign}</span>
        </div>
      </div>

      {/* Profile Info */}
      <div className="absolute bottom-0 left-0 right-0 p-6 pb-7">
        <div className="flex items-end justify-between">
          <div className="flex-1">
            <h2 className="text-[28px] font-bold tracking-tight">
              {profile.name}<span className="text-slate-300 font-light ml-2">{profile.age}</span>
            </h2>
            <div className="flex items-center gap-1.5 text-slate-200 text-sm mt-1">
              <Briefcase size={13} className="text-slate-400" />
              <span>{profile.occupation}</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-400 text-xs mt-1">
              <MapPin size={12} />
              <span>{profile.location}</span>
            </div>
          </div>

          {/* Life Path Badge */}
          <div className="flex flex-col items-center glass-card-strong rounded-2xl px-3 py-2">
            <span className="text-lg font-bold text-gradient-gold">{profile.lifePath}</span>
            <span className="text-[9px] text-slate-400 uppercase tracking-wide">Life Path</span>
          </div>
        </div>

        {/* Prompt Preview */}
        {profile.prompts.length > 0 && (
          <div className="mt-4 p-3.5 rounded-2xl glass-card-strong">
            <p className="text-[10px] text-mode-attraction font-semibold uppercase tracking-wider mb-1">{profile.prompts[0].question}</p>
            <p className="text-[13px] text-slate-200 leading-relaxed line-clamp-2">{profile.prompts[0].answer}</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}
