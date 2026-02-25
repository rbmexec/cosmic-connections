"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { Filter, Lock } from "lucide-react";
import { useTranslations } from "next-intl";
import type { DiscoveryFilterState } from "@/types/discovery";

const ELEMENTS = ["Fire", "Earth", "Air", "Water"] as const;

const ZODIAC_SIGNS = [
  { sign: "Aries", symbol: "\u2648" },
  { sign: "Taurus", symbol: "\u2649" },
  { sign: "Gemini", symbol: "\u264A" },
  { sign: "Cancer", symbol: "\u264B" },
  { sign: "Leo", symbol: "\u264C" },
  { sign: "Virgo", symbol: "\u264D" },
  { sign: "Libra", symbol: "\u264E" },
  { sign: "Scorpio", symbol: "\u264F" },
  { sign: "Sagittarius", symbol: "\u2650" },
  { sign: "Capricorn", symbol: "\u2651" },
  { sign: "Aquarius", symbol: "\u2652" },
  { sign: "Pisces", symbol: "\u2653" },
] as const;

const LIFE_PATHS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 11, 22, 33] as const;

const CHINESE_ANIMALS = [
  "Rat", "Ox", "Tiger", "Rabbit", "Dragon", "Snake",
  "Horse", "Goat", "Monkey", "Rooster", "Dog", "Pig",
] as const;

const SORT_OPTIONS = ["compatibility", "name", "age"] as const;

interface DiscoveryFiltersProps {
  filters: DiscoveryFilterState;
  onChange: (filters: DiscoveryFilterState) => void;
  advancedEnabled: boolean;
}

function FilterPill({
  label,
  selected,
  onClick,
  locked,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
  locked?: boolean;
}) {
  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`
        shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-all whitespace-nowrap
        ${selected
          ? "bg-amber-400/20 text-amber-400 border border-amber-400/40 shadow-[0_0_12px_rgba(245,158,11,0.15)]"
          : "glass-card text-slate-400 border border-white/10 hover:border-white/20 hover:text-slate-300"
        }
        ${locked ? "opacity-50" : ""}
      `}
    >
      {locked && <Lock size={10} className="inline mr-1" />}
      {label}
    </motion.button>
  );
}

export default function DiscoveryFilters({ filters, onChange, advancedEnabled }: DiscoveryFiltersProps) {
  const t = useTranslations("discovery");
  const scrollRef = useRef<HTMLDivElement>(null);

  const toggleElement = (el: string) => {
    onChange({ ...filters, element: filters.element === el ? null : el });
  };

  const toggleZodiac = (sign: string) => {
    onChange({ ...filters, zodiacSign: filters.zodiacSign === sign ? null : sign });
  };

  const toggleLifePath = (lp: number) => {
    if (!advancedEnabled) return;
    onChange({ ...filters, lifePath: filters.lifePath === lp ? null : lp });
  };

  const toggleAnimal = (animal: string) => {
    if (!advancedEnabled) return;
    onChange({ ...filters, chineseAnimal: filters.chineseAnimal === animal ? null : animal });
  };

  const setSortBy = (sort: "compatibility" | "name" | "age") => {
    onChange({ ...filters, sortBy: sort });
  };

  return (
    <div className="space-y-3">
      {/* Filter header */}
      <div className="flex items-center gap-2 px-1">
        <Filter size={14} className="text-amber-400" />
        <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
          {t("filters")}
        </span>
      </div>

      {/* Element filter row */}
      <div className="overflow-x-auto scrollbar-hide" ref={scrollRef}>
        <div className="flex gap-2 pb-1">
          <span className="shrink-0 text-[10px] text-slate-500 uppercase self-center mr-1">
            {t("element")}
          </span>
          {ELEMENTS.map((el) => (
            <FilterPill
              key={el}
              label={el}
              selected={filters.element === el}
              onClick={() => toggleElement(el)}
            />
          ))}
        </div>
      </div>

      {/* Zodiac sign filter row */}
      <div className="overflow-x-auto scrollbar-hide">
        <div className="flex gap-2 pb-1">
          <span className="shrink-0 text-[10px] text-slate-500 uppercase self-center mr-1">
            {t("zodiac")}
          </span>
          {ZODIAC_SIGNS.map(({ sign, symbol }) => (
            <FilterPill
              key={sign}
              label={`${symbol} ${sign}`}
              selected={filters.zodiacSign === sign}
              onClick={() => toggleZodiac(sign)}
            />
          ))}
        </div>
      </div>

      {/* Life Path filter row (gated) */}
      <div className="overflow-x-auto scrollbar-hide">
        <div className="flex gap-2 pb-1">
          <span className="shrink-0 text-[10px] text-slate-500 uppercase self-center mr-1">
            {t("lifePath")}
          </span>
          {LIFE_PATHS.map((lp) => (
            <FilterPill
              key={lp}
              label={`${lp}`}
              selected={filters.lifePath === lp}
              onClick={() => toggleLifePath(lp)}
              locked={!advancedEnabled}
            />
          ))}
        </div>
      </div>

      {/* Chinese animal filter row (gated) */}
      <div className="overflow-x-auto scrollbar-hide">
        <div className="flex gap-2 pb-1">
          <span className="shrink-0 text-[10px] text-slate-500 uppercase self-center mr-1">
            {t("chineseAnimal")}
          </span>
          {CHINESE_ANIMALS.map((animal) => (
            <FilterPill
              key={animal}
              label={animal}
              selected={filters.chineseAnimal === animal}
              onClick={() => toggleAnimal(animal)}
              locked={!advancedEnabled}
            />
          ))}
        </div>
      </div>

      {/* Sort row */}
      <div className="overflow-x-auto scrollbar-hide">
        <div className="flex gap-2 pb-1">
          <span className="shrink-0 text-[10px] text-slate-500 uppercase self-center mr-1">
            {t("sortBy")}
          </span>
          {SORT_OPTIONS.map((opt) => (
            <FilterPill
              key={opt}
              label={t(`sort_${opt}`)}
              selected={filters.sortBy === opt}
              onClick={() => setSortBy(opt)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
