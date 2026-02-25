"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, ChevronDown, Sparkles, X } from "lucide-react";
import { generateDailyForecast, type DailyForecast as DailyForecastType } from "@/lib/daily-forecast";
import { getDailyForecast, saveDailyForecast } from "@/lib/forecast-storage";
import { useTranslations } from "next-intl";
import type { UserProfile } from "@/types/profile";

interface DailyForecastProps {
  user: UserProfile;
}

export default function DailyForecast({ user }: DailyForecastProps) {
  const t = useTranslations("forecast");
  const [forecast, setForecast] = useState<DailyForecastType | null>(null);
  const [expanded, setExpanded] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    let f = getDailyForecast();
    if (!f) {
      f = generateDailyForecast(user);
      saveDailyForecast(f);
    }
    setForecast(f);
  }, [user]);

  const energyStars = useMemo(() => {
    if (!forecast) return [];
    return Array.from({ length: 5 }).map((_, i) => i < forecast.energyLevel);
  }, [forecast]);

  if (!forecast || dismissed) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="glass-card-subtle rounded-2xl overflow-hidden border border-amber-400/10"
    >
      {/* Collapsed banner */}
      <button
        onClick={() => setExpanded((v) => !v)}
        className="w-full flex items-center gap-3 px-4 py-3 text-left"
      >
        <Sparkles size={16} className="text-amber-400 flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold text-white truncate">
            {t("todaysEnergy")}
          </p>
          <p className="text-[10px] text-amber-400/80 truncate">
            {forecast.focusArea}
          </p>
        </div>
        <div className="flex items-center gap-1 flex-shrink-0">
          {energyStars.map((filled, i) => (
            <Star
              key={i}
              size={10}
              className={filled ? "text-amber-400" : "text-slate-600"}
              fill={filled ? "currentColor" : "none"}
            />
          ))}
        </div>
        <motion.div
          animate={{ rotate: expanded ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="text-slate-400 flex-shrink-0"
        >
          <ChevronDown size={14} />
        </motion.div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            setDismissed(true);
          }}
          className="text-slate-600 hover:text-slate-400 transition-colors flex-shrink-0 ml-1"
        >
          <X size={12} />
        </button>
      </button>

      {/* Expanded content */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 pt-1 space-y-3">
              <p className="text-xs text-slate-300 italic leading-relaxed">
                {forecast.message}
              </p>

              <div className="flex gap-3">
                <div className="glass-card rounded-xl px-3 py-2 text-center flex-1">
                  <p className="text-[9px] text-slate-500 uppercase">{t("luckyNumber")}</p>
                  <p className="text-sm font-bold text-amber-400">{forecast.luckyNumber}</p>
                </div>
                <div className="glass-card rounded-xl px-3 py-2 text-center flex-1">
                  <p className="text-[9px] text-slate-500 uppercase">{t("energyLevel")}</p>
                  <p className="text-sm font-bold text-amber-400">{forecast.energyLevel}/5</p>
                </div>
              </div>

              {forecast.compatibleSigns.length > 0 && (
                <div>
                  <p className="text-[9px] text-slate-500 uppercase mb-1.5">{t("compatibleToday")}</p>
                  <div className="flex gap-1.5">
                    {forecast.compatibleSigns.map((sign) => (
                      <span
                        key={sign}
                        className="text-[10px] font-semibold px-2 py-1 rounded-full bg-amber-400/10 text-amber-400 border border-amber-400/20"
                      >
                        {sign}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
