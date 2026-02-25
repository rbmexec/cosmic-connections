"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  ChevronDown,
  Lock,
  Sparkles,
  AlertTriangle,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { getUpcomingEvents } from "@/lib/retrograde-alerts";
import { transitEvents, type TransitEvent } from "@/data/cosmic-events";

interface CosmicCalendarProps {
  userZodiac: string;
  onUpgradeRequired?: (trigger: string) => void;
}

function formatDateRange(start: string, end: string): string {
  const s = new Date(start);
  const e = new Date(end);
  const sMonth = s.toLocaleDateString(undefined, { month: "short" });
  const eMonth = e.toLocaleDateString(undefined, { month: "short" });
  const sDay = s.getDate();
  const eDay = e.getDate();

  if (sMonth === eMonth && sDay === eDay) {
    return `${sMonth} ${sDay}`;
  }
  if (sMonth === eMonth) {
    return `${sMonth} ${sDay}\u2013${eDay}`;
  }
  return `${sMonth} ${sDay} \u2013 ${eMonth} ${eDay}`;
}

function getMonthYear(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString(undefined, { month: "long", year: "numeric" });
}

const typeColors: Record<TransitEvent["type"], string> = {
  mercury_retrograde: "text-red-400 bg-red-400/10 border-red-400/20",
  full_moon: "text-amber-300 bg-amber-300/10 border-amber-300/20",
  new_moon: "text-indigo-400 bg-indigo-400/10 border-indigo-400/20",
  eclipse: "text-purple-400 bg-purple-400/10 border-purple-400/20",
  equinox: "text-green-400 bg-green-400/10 border-green-400/20",
  solstice: "text-orange-400 bg-orange-400/10 border-orange-400/20",
  venus_retrograde: "text-pink-400 bg-pink-400/10 border-pink-400/20",
  jupiter_transit: "text-teal-400 bg-teal-400/10 border-teal-400/20",
};

const severityBadge: Record<TransitEvent["severity"], string> = {
  high: "bg-red-500/20 text-red-400 border-red-500/30",
  medium: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  low: "bg-slate-500/15 text-slate-400 border-slate-500/20",
};

export default function CosmicCalendar({
  userZodiac,
  onUpgradeRequired,
}: CosmicCalendarProps) {
  const t = useTranslations("cosmos");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [showAll, setShowAll] = useState(false);

  // Upcoming events within the next 90 days
  const upcomingEvents = useMemo(() => getUpcomingEvents(90), []);

  // All events for the full calendar view
  const allEvents = useMemo(
    () =>
      [...transitEvents].sort(
        (a, b) =>
          new Date(a.startDate).getTime() - new Date(b.startDate).getTime(),
      ),
    [],
  );

  const events = showAll ? allEvents : upcomingEvents;

  // Group events by month
  const groupedEvents = useMemo(() => {
    const groups: { month: string; events: TransitEvent[] }[] = [];
    let currentMonth = "";

    for (const event of events) {
      const month = getMonthYear(event.startDate);
      if (month !== currentMonth) {
        currentMonth = month;
        groups.push({ month, events: [] });
      }
      groups[groups.length - 1].events.push(event);
    }
    return groups;
  }, [events]);

  function isUserAffected(event: TransitEvent): boolean {
    return event.affectedSigns.includes(userZodiac);
  }

  function isActive(event: TransitEvent): boolean {
    const now = Date.now();
    const start = new Date(event.startDate).getTime();
    const end = new Date(event.endDate).getTime() + 86_400_000 - 1;
    return now >= start && now <= end;
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Calendar size={16} className="text-amber-400" />
          <h3 className="text-sm font-bold text-white">
            {t("calendarTitle")}
          </h3>
        </div>
        <button
          onClick={() => setShowAll((v) => !v)}
          className="text-[10px] font-semibold text-teal-400 hover:text-teal-300 transition-colors"
        >
          {showAll ? t("showUpcoming") : t("showAll")}
        </button>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-1.5">
        <span className="text-[9px] text-slate-500 uppercase tracking-wider font-semibold mr-1 self-center">
          {t("legend")}:
        </span>
        <span className="flex items-center gap-1 text-[9px] px-2 py-0.5 rounded-full bg-white/5 text-slate-400">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
          {t("affectsYou")}
        </span>
        <span className="flex items-center gap-1 text-[9px] px-2 py-0.5 rounded-full bg-white/5 text-slate-400">
          <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" />
          {t("activeNow")}
        </span>
      </div>

      {/* Empty state */}
      {events.length === 0 && (
        <div className="glass-card rounded-2xl p-8 text-center">
          <Sparkles size={32} className="text-slate-600 mx-auto mb-3" />
          <p className="text-sm text-slate-500">{t("noUpcoming")}</p>
        </div>
      )}

      {/* Timeline */}
      <div className="space-y-5">
        {groupedEvents.map((group) => (
          <div key={group.month}>
            {/* Month header */}
            <div className="flex items-center gap-3 mb-3">
              <span className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">
                {group.month}
              </span>
              <div className="flex-1 h-px bg-white/5" />
            </div>

            {/* Events in this month */}
            <div className="space-y-2 ml-3 border-l border-white/5 pl-4">
              {group.events.map((event, idx) => {
                const affected = isUserAffected(event);
                const active = isActive(event);
                const isExpanded = expandedId === event.id;

                return (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.04 }}
                    className={`relative glass-card rounded-2xl overflow-hidden transition-colors ${
                      affected
                        ? "border-amber-400/15 hover:border-amber-400/25"
                        : "hover:border-white/10"
                    } ${active ? "ring-1 ring-teal-400/30" : ""}`}
                  >
                    {/* Timeline dot */}
                    <div
                      className={`absolute -left-[21px] top-4 w-2.5 h-2.5 rounded-full border-2 border-cosmic-bg ${
                        active
                          ? "bg-teal-400 shadow-[0_0_8px_rgba(20,184,166,0.6)]"
                          : affected
                            ? "bg-amber-400"
                            : "bg-slate-600"
                      }`}
                    />

                    {/* Event header */}
                    <button
                      onClick={() =>
                        setExpandedId(isExpanded ? null : event.id)
                      }
                      className="w-full flex items-center gap-3 px-4 py-3 text-left"
                    >
                      <span
                        className="text-base shrink-0"
                        role="img"
                        aria-label={event.name}
                      >
                        {event.icon}
                      </span>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-xs font-bold text-white truncate">
                            {event.name}
                          </p>
                          {active && (
                            <span className="text-[8px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-teal-500/20 text-teal-400 border border-teal-500/30 shrink-0">
                              {t("live")}
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] text-slate-500">
                          {formatDateRange(event.startDate, event.endDate)}
                        </p>
                      </div>

                      {affected && (
                        <AlertTriangle
                          size={12}
                          className="text-amber-400 shrink-0"
                        />
                      )}

                      <span
                        className={`text-[8px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full border shrink-0 ${severityBadge[event.severity]}`}
                      >
                        {t(`severity.${event.severity}`)}
                      </span>

                      <motion.div
                        animate={{ rotate: isExpanded ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                        className="text-slate-500 shrink-0"
                      >
                        <ChevronDown size={12} />
                      </motion.div>
                    </button>

                    {/* Expanded details */}
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden"
                        >
                          <div className="px-4 pb-4 pt-0 space-y-3">
                            <p className="text-xs text-slate-300 leading-relaxed">
                              {event.description}
                            </p>

                            {/* Type badge */}
                            <span
                              className={`inline-flex items-center text-[9px] font-semibold px-2 py-0.5 rounded-full border ${typeColors[event.type]}`}
                            >
                              {event.type.replace(/_/g, " ")}
                            </span>

                            {/* Advice */}
                            <div className="glass-card rounded-xl px-3 py-2.5">
                              <p className="text-[9px] text-slate-500 uppercase tracking-wider font-semibold mb-1">
                                {t("advice")}
                              </p>
                              <p className="text-[11px] text-slate-300 italic leading-relaxed">
                                {event.advice}
                              </p>
                            </div>

                            {/* Affected signs */}
                            <div>
                              <p className="text-[9px] text-slate-500 uppercase tracking-wider font-semibold mb-1.5">
                                {t("affectedSigns")}
                              </p>
                              <div className="flex flex-wrap gap-1.5">
                                {event.affectedSigns.map((sign) => (
                                  <span
                                    key={sign}
                                    className={`text-[10px] font-semibold px-2 py-1 rounded-full border ${
                                      sign === userZodiac
                                        ? "bg-amber-400/20 text-amber-300 border-amber-400/30 ring-1 ring-amber-400/20"
                                        : "bg-white/5 text-slate-400 border-white/10"
                                    }`}
                                  >
                                    {sign}
                                    {sign === userZodiac && " (you)"}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Upgrade prompt for extended features */}
      {onUpgradeRequired && (
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => onUpgradeRequired("cosmicCalendar")}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl glass-card border border-amber-400/20 hover:border-amber-400/40 transition-colors mt-2"
        >
          <Lock size={12} className="text-amber-400" />
          <span className="text-xs text-amber-400 font-semibold">
            {t("unlockPersonalized")}
          </span>
        </motion.button>
      )}
    </div>
  );
}
