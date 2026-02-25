"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Calendar, Clock, MapPin, Users, Globe, Lock } from "lucide-react";
import { useTranslations } from "next-intl";
import { sampleProfiles } from "@/data/profiles";
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

function formatEventDate(dateStr: string): string {
  const date = new Date(dateStr + "T00:00:00");
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

interface EventDetailSheetProps {
  event: CosmicEvent | null;
  onClose: () => void;
  onRsvp: () => void;
  canRsvp: boolean;
}

export default function EventDetailSheet({
  event,
  onClose,
  onRsvp,
  canRsvp,
}: EventDetailSheetProps) {
  const t = useTranslations("events");

  if (!event) return null;

  const themeStyle = THEME_COLORS[event.theme] || THEME_COLORS.mixer;

  // Get attendee profiles
  const attendeeProfiles = event.attendeeProfileIds
    .map((id) => sampleProfiles.find((p) => p.id === id))
    .filter(Boolean);

  return (
    <AnimatePresence>
      {event && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-end justify-center"
          onClick={onClose}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

          {/* Sheet */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            onClick={(e) => e.stopPropagation()}
            className="relative glass-card-strong rounded-t-[28px] w-full max-w-lg max-h-[90vh] overflow-y-auto pb-safe"
          >
            {/* Handle bar */}
            <div className="flex justify-center pt-3 pb-2">
              <div className="w-10 h-1 rounded-full bg-white/20" />
            </div>

            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors z-10"
            >
              <X size={20} />
            </button>

            {/* Event image */}
            <div className="px-6">
              <div className="relative rounded-2xl overflow-hidden">
                <img
                  src={event.imageUrl}
                  alt={event.title}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

                {/* Theme badge */}
                <div className={`absolute top-3 left-3 ${themeStyle.bg} rounded-full px-3 py-1`}>
                  <span className={`text-[10px] font-semibold uppercase tracking-wider ${themeStyle.text}`}>
                    {THEME_LABELS[event.theme]}
                  </span>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="px-6 pt-5 pb-4 space-y-5">
              {/* Title */}
              <h2 className="text-xl font-bold text-white leading-tight">
                {event.title}
              </h2>

              {/* Details */}
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-slate-300">
                  <Calendar size={16} className="text-amber-400 shrink-0" />
                  <span className="text-sm">{formatEventDate(event.date)}</span>
                </div>

                <div className="flex items-center gap-3 text-slate-300">
                  <Clock size={16} className="text-amber-400 shrink-0" />
                  <span className="text-sm">{event.time}</span>
                </div>

                <div className="flex items-center gap-3 text-slate-300">
                  {event.type === "virtual" ? (
                    <Globe size={16} className="text-teal-400 shrink-0" />
                  ) : (
                    <MapPin size={16} className="text-teal-400 shrink-0" />
                  )}
                  <span className="text-sm">
                    {event.location || t("virtualEvent")}
                  </span>
                </div>

                <div className="flex items-center gap-3 text-slate-300">
                  <Users size={16} className="text-purple-400 shrink-0" />
                  <span className="text-sm">
                    {t("attendeeCount", { count: event.attendeeCount })}
                  </span>
                </div>
              </div>

              {/* Description */}
              <div className="glass-card rounded-xl p-4">
                <p className="text-sm text-slate-300 leading-relaxed">
                  {event.description}
                </p>
              </div>

              {/* Attendees */}
              {attendeeProfiles.length > 0 && (
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-3">
                    {t("attendees")}
                  </p>
                  <div className="flex items-center">
                    <div className="flex -space-x-2">
                      {attendeeProfiles.map((profile) =>
                        profile ? (
                          <img
                            key={profile.id}
                            src={profile.photo}
                            alt={profile.name}
                            className="w-10 h-10 rounded-full object-cover ring-2 ring-slate-900"
                            title={profile.name}
                          />
                        ) : null
                      )}
                    </div>
                    {event.attendeeCount > attendeeProfiles.length && (
                      <span className="ml-3 text-xs text-slate-400">
                        +{event.attendeeCount - attendeeProfiles.length} {t("more")}
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* RSVP button */}
            <div className="sticky bottom-0 px-6 py-4 glass-card-strong border-t border-white/5">
              {canRsvp ? (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={onRsvp}
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm font-bold hover:opacity-90 transition-all shadow-[0_4px_20px_rgba(168,85,247,0.3)]"
                >
                  {t("rsvp")}
                </motion.button>
              ) : (
                <button
                  onClick={onClose}
                  className="w-full py-3.5 rounded-2xl glass-card border border-amber-400/20 flex items-center justify-center gap-2"
                >
                  <Lock size={14} className="text-amber-400" />
                  <span className="text-sm text-amber-400 font-semibold">
                    {t("upgradeToRsvp")}
                  </span>
                </button>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
