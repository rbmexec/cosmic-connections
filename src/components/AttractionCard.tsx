"use client";

import { motion } from "framer-motion";
import { MapPin } from "lucide-react";
import type { UserProfile } from "@/types/profile";

export default function AttractionCard({ profile }: { profile: UserProfile }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="relative rounded-3xl overflow-hidden max-w-sm mx-auto aspect-[3/4]"
    >
      <img
        src={profile.photo}
        alt={profile.name}
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-6">
        <h2 className="text-3xl font-bold font-serif">
          {profile.name}, {profile.age}
        </h2>
        <p className="text-sm text-slate-200 mt-1">{profile.occupation}</p>
        <div className="flex items-center gap-1 text-slate-300 text-xs mt-1">
          <MapPin size={12} />
          <span>{profile.location}</span>
        </div>
      </div>
    </motion.div>
  );
}
