"use client";

import { motion } from "framer-motion";
import { Globe, Home, Plane } from "lucide-react";
import { useTranslations } from "next-intl";
import type { LocationFilter as LocationFilterType } from "@/lib/country-utils";

const filters: { key: LocationFilterType; labelKey: string; icon: typeof Globe }[] = [
  { key: "all", labelKey: "all", icon: Globe },
  { key: "domestic", labelKey: "domestic", icon: Home },
  { key: "international", labelKey: "international", icon: Plane },
];

interface LocationFilterProps {
  active: LocationFilterType;
  onChange: (filter: LocationFilterType) => void;
}

export default function LocationFilter({ active, onChange }: LocationFilterProps) {
  const t = useTranslations("locationFilter");

  return (
    <div className="flex gap-1 p-1 rounded-xl glass-card w-fit mx-auto">
      {filters.map(({ key, labelKey, icon: Icon }) => {
        const isActive = active === key;
        return (
          <button
            key={key}
            onClick={() => onChange(key)}
            className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-colors ${
              isActive ? "text-amber-300" : "text-slate-500 hover:text-slate-300"
            }`}
          >
            {isActive && (
              <motion.div
                layoutId="location-filter-indicator"
                className="absolute inset-0 rounded-lg bg-amber-400/10 border border-amber-400/20"
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
            <Icon size={14} className="relative z-10" />
            <span className="relative z-10">{t(labelKey)}</span>
          </button>
        );
      })}
    </div>
  );
}
