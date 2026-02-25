"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { CalendarDays } from "lucide-react";
import { useTranslations } from "next-intl";
import { useSubscription } from "@/lib/subscription-context";
import { sampleEvents } from "@/data/events";
import EventCard from "@/components/EventCard";
import EventDetailSheet from "@/components/EventDetailSheet";
import type { CosmicEvent } from "@/data/events";

type EventFilter = "all" | "virtual" | "in_person";

interface EventsViewProps {
  onUpgradeRequired: (trigger: string) => void;
}

export default function EventsView({ onUpgradeRequired }: EventsViewProps) {
  const t = useTranslations("events");
  const { features } = useSubscription();

  const [filter, setFilter] = useState<EventFilter>("all");
  const [selectedEvent, setSelectedEvent] = useState<CosmicEvent | null>(null);

  const filteredEvents = useMemo(() => {
    if (filter === "all") return sampleEvents;
    return sampleEvents.filter((e) => e.type === filter);
  }, [filter]);

  const handleRsvp = () => {
    if (!features.eventsRsvp) {
      onUpgradeRequired("eventsRsvp");
      return;
    }
    // RSVP logic would go here
    setSelectedEvent(null);
  };

  const filters: { key: EventFilter; label: string }[] = [
    { key: "all", label: t("filterAll") },
    { key: "virtual", label: t("filterVirtual") },
    { key: "in_person", label: t("filterInPerson") },
  ];

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center">
          <CalendarDays size={20} className="text-purple-400" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-white">{t("title")}</h2>
          <p className="text-xs text-slate-400">{t("subtitle")}</p>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2">
        {filters.map(({ key, label }) => (
          <motion.button
            key={key}
            whileTap={{ scale: 0.95 }}
            onClick={() => setFilter(key)}
            className={`
              px-4 py-2 rounded-full text-xs font-semibold transition-all
              ${filter === key
                ? "bg-purple-400/20 text-purple-400 border border-purple-400/30"
                : "glass-card text-slate-400 border border-white/10 hover:border-white/20"
              }
            `}
          >
            {label}
          </motion.button>
        ))}
      </div>

      {/* Event list */}
      <div className="space-y-4">
        {filteredEvents.map((event, index) => (
          <motion.div
            key={event.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <EventCard
              event={event}
              onClick={() => setSelectedEvent(event)}
            />
          </motion.div>
        ))}
      </div>

      {/* Empty state */}
      {filteredEvents.length === 0 && (
        <div className="text-center py-12">
          <CalendarDays size={40} className="text-slate-600 mx-auto mb-3" />
          <p className="text-sm text-slate-400">{t("noEvents")}</p>
        </div>
      )}

      {/* Event detail sheet */}
      <EventDetailSheet
        event={selectedEvent}
        onClose={() => setSelectedEvent(null)}
        onRsvp={handleRsvp}
        canRsvp={features.eventsRsvp}
      />
    </div>
  );
}
