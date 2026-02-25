"use client";

import { motion } from "framer-motion";
import { Calendar, MapPin, Users, Globe } from "lucide-react";
import type { CosmicEvent } from "@/data/events";

const THEME_COLORS: Record<string, { bg: string; text: string }> = {
  full_moon: { bg: "bg-amber-400/20", text: "text-amber-400" },
  new_moon: { bg: "bg-purple-400/20", text: "text-purple-400" },
  retrograde: { bg: "bg-red-400/20", text: "text-red-400" },
  eclipse: { bg: "bg-teal-400/20", text: "text-teal-400" },
  equinox: { bg: "bg-green-400/20", text: "text-green-400" },
  mixer: { bg: "bg-pink-400/20", text: "text-pink-400" },
  workshop: { bg: "bg-blue-400/20", text: "text-blue-400" },
};

const THEME_LABELS: Record<string, string> = {
  full_moon: "Full Moon",
  new_moon: "New Moon",
  retrograde: "Retrograde",
  eclipse: "Eclipse",
  equinox: "Equinox",
  mixer: "Mixer",
  workshop: "Workshop",
};

function formatDate(dateStr: string): string {
  const date = new Date(dateStr + "T00:00:00");
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

interface EventCardProps {
  event: CosmicEvent;
  onClick: () => void;
}

export default function EventCard({ event, onClick }: EventCardProps) {
  const themeStyle = THEME_COLORS[event.theme] || THEME_COLORS.mixer;

  return (
    <motion.button
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      onClick={onClick}
      className="w-full glass-card rounded-2xl overflow-hidden text-left transition-all hover:border-white/20"
    >
      {/* Image with overlay */}
      <div className="relative h-40 overflow-hidden">
        <img
          src={event.imageUrl}
          alt={event.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

        {/* Theme badge */}
        <div className={`absolute top-3 left-3 ${themeStyle.bg} rounded-full px-3 py-1`}>
          <span className={`text-[10px] font-semibold uppercase tracking-wider ${themeStyle.text}`}>
            {THEME_LABELS[event.theme]}
          </span>
        </div>

        {/* Type indicator */}
        <div className="absolute top-3 right-3 glass-card-strong rounded-full px-2.5 py-1 flex items-center gap-1">
          {event.type === "virtual" ? (
            <Globe size={10} className="text-teal-400" />
          ) : (
            <MapPin size={10} className="text-amber-400" />
          )}
          <span className="text-[10px] font-medium text-slate-300">
            {event.type === "virtual" ? "Virtual" : "In Person"}
          </span>
        </div>

        {/* Title overlay */}
        <div className="absolute bottom-3 left-3 right-3">
          <h3 className="text-base font-bold text-white leading-tight">
            {event.title}
          </h3>
        </div>
      </div>

      {/* Info */}
      <div className="px-4 py-3 flex items-center gap-4">
        <div className="flex items-center gap-1.5 text-slate-400">
          <Calendar size={13} />
          <span className="text-xs">{formatDate(event.date)}</span>
        </div>
        <div className="flex items-center gap-1.5 text-slate-400">
          <Users size={13} />
          <span className="text-xs">{event.attendeeCount} attending</span>
        </div>
        {event.location && (
          <div className="flex items-center gap-1.5 text-slate-400 ml-auto">
            <MapPin size={13} />
            <span className="text-xs truncate max-w-[120px]">{event.location.split(",")[0]}</span>
          </div>
        )}
      </div>
    </motion.button>
  );
}
