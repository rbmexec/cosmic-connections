"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, AlertTriangle, ChevronDown } from "lucide-react";
import { useTranslations } from "next-intl";
import type { TransitEvent } from "@/data/cosmic-events";

interface RetrogradeAlertProps {
  alert: TransitEvent;
  onDismiss: () => void;
}

export default function RetrogradeAlert({
  alert,
  onDismiss,
}: RetrogradeAlertProps) {
  const t = useTranslations("cosmos");
  const [expanded, setExpanded] = useState(false);

  const severityColors: Record<string, string> = {
    high: "from-red-600/30 to-amber-600/30 border-red-500/30",
    medium: "from-amber-600/25 to-orange-600/25 border-amber-500/25",
    low: "from-teal-600/20 to-cyan-600/20 border-teal-500/20",
  };

  const severityGlow: Record<string, string> = {
    high: "shadow-[0_0_20px_rgba(239,68,68,0.15)]",
    medium: "shadow-[0_0_16px_rgba(245,158,11,0.12)]",
    low: "shadow-[0_0_12px_rgba(20,184,166,0.1)]",
  };

  const severityText: Record<string, string> = {
    high: "text-red-400",
    medium: "text-amber-400",
    low: "text-teal-400",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12, height: 0, marginBottom: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      className={`rounded-2xl bg-gradient-to-r ${severityColors[alert.severity]} ${severityGlow[alert.severity]} border overflow-hidden`}
    >
      {/* Banner row */}
      <button
        onClick={() => setExpanded((v) => !v)}
        className="w-full flex items-center gap-3 px-4 py-3 text-left"
      >
        <span className="text-lg shrink-0" role="img" aria-label={alert.name}>
          {alert.icon}
        </span>
        <AlertTriangle
          size={14}
          className={`${severityText[alert.severity]} shrink-0`}
        />

        <div className="flex-1 min-w-0">
          <p className="text-xs font-bold text-white truncate">{alert.name}</p>
          <p className="text-[10px] text-slate-300/70 truncate">
            {t("activeUntil", {
              date: new Date(alert.endDate).toLocaleDateString(undefined, {
                month: "short",
                day: "numeric",
              }),
            })}
          </p>
        </div>

        <span
          className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
            alert.severity === "high"
              ? "bg-red-500/20 text-red-400 border-red-500/30"
              : alert.severity === "medium"
                ? "bg-amber-500/20 text-amber-400 border-amber-500/30"
                : "bg-teal-500/20 text-teal-400 border-teal-500/30"
          }`}
        >
          {t(`severity.${alert.severity}`)}
        </span>

        <motion.div
          animate={{ rotate: expanded ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="text-slate-400 shrink-0"
        >
          <ChevronDown size={14} />
        </motion.div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onDismiss();
          }}
          className="text-slate-500 hover:text-slate-300 transition-colors shrink-0 ml-0.5"
        >
          <X size={14} />
        </button>
      </button>

      {/* Expanded details */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 pt-0 space-y-3">
              <p className="text-xs text-slate-300 leading-relaxed">
                {alert.description}
              </p>

              {/* Advice */}
              <div className="glass-card rounded-xl px-3 py-2.5">
                <p className="text-[9px] text-slate-500 uppercase tracking-wider font-semibold mb-1">
                  {t("advice")}
                </p>
                <p className="text-[11px] text-slate-300 italic leading-relaxed">
                  {alert.advice}
                </p>
              </div>

              {/* Affected signs */}
              <div>
                <p className="text-[9px] text-slate-500 uppercase tracking-wider font-semibold mb-1.5">
                  {t("affectedSigns")}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {alert.affectedSigns.map((sign) => (
                    <span
                      key={sign}
                      className={`text-[10px] font-semibold px-2 py-1 rounded-full border ${
                        alert.severity === "high"
                          ? "bg-red-400/10 text-red-300 border-red-400/20"
                          : "bg-amber-400/10 text-amber-400 border-amber-400/20"
                      }`}
                    >
                      {sign}
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
}
