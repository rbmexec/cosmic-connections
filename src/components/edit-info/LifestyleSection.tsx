"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { useTranslations } from "next-intl";
import {
  petOptions,
  drinkingOptions,
  smokingOptions,
  cannabisOptions,
  workoutOptions,
  socialMediaOptions,
} from "@/data/edit-info-options";
import type { LifestylePrefs } from "@/types/profile";

interface LifestyleSectionProps {
  lifestyle: LifestylePrefs;
  onChange: (lifestyle: LifestylePrefs) => void;
}

const lifestyleFields: {
  key: keyof LifestylePrefs;
  labelKey: string;
  options: readonly string[];
  i18nPrefix: string;
}[] = [
  { key: "pets", labelKey: "pets", options: petOptions, i18nPrefix: "pet_" },
  { key: "drinking", labelKey: "drinking", options: drinkingOptions, i18nPrefix: "drink_" },
  { key: "smoking", labelKey: "smoking", options: smokingOptions, i18nPrefix: "smoke_" },
  { key: "cannabis", labelKey: "cannabis", options: cannabisOptions, i18nPrefix: "cannabis_" },
  { key: "workout", labelKey: "workout", options: workoutOptions, i18nPrefix: "workout_" },
  { key: "socialMedia", labelKey: "socialMedia", options: socialMediaOptions, i18nPrefix: "social_" },
];

const i18nValueMap: Record<string, string> = {
  // pets
  dog: "pet_dog", cat: "pet_cat", bird: "pet_bird", fish: "pet_fish",
  reptile: "pet_reptile", "dont-have": "pet_dontHave", allergic: "pet_allergic",
  // drinking
  never: "drink_never", "on-special-occasions": "drink_specialOccasions",
  socially: "drink_socially", regularly: "drink_regularly",
  // smoking
  "trying-to-quit": "smoke_tryingToQuit",
  // cannabis
  sometimes: "cannabis_sometimes",
  // workout
  often: "workout_often", daily: "workout_daily",
  // social
  rarely: "social_rarely", actively: "social_actively",
};

function getI18nKey(prefix: string, value: string): string {
  // First check if there's a specific mapping
  const specific = i18nValueMap[value];
  if (specific) return specific;
  // Fall back to prefix + camelCase
  const camel = value.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
  return `${prefix}${camel}`;
}

function LifestyleField({
  label,
  value,
  options,
  i18nPrefix,
  onChange,
  t,
}: {
  label: string;
  value?: string;
  options: readonly string[];
  i18nPrefix: string;
  onChange: (v: string | undefined) => void;
  t: ReturnType<typeof useTranslations>;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-white/5 last:border-b-0">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full py-3 px-4"
      >
        <span className="text-sm text-slate-400">{label}</span>
        <div className="flex items-center gap-1">
          <span className="text-sm text-white">
            {value ? t(getI18nKey(i18nPrefix, value)) : "—"}
          </span>
          <ChevronDown
            size={14}
            className={`text-slate-500 transition-transform ${open ? "rotate-180" : ""}`}
          />
        </div>
      </button>
      {open && (
        <div className="px-4 pb-3 flex flex-wrap gap-2">
          {options.map((opt) => (
            <button
              key={opt}
              onClick={() => {
                onChange(value === opt ? undefined : opt);
                setOpen(false);
              }}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                value === opt
                  ? "bg-violet-500/20 text-violet-400 border border-violet-500/30"
                  : "bg-white/5 text-slate-400 border border-white/[0.06]"
              }`}
            >
              {t(getI18nKey(i18nPrefix, opt))}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function LifestyleSection({ lifestyle, onChange }: LifestyleSectionProps) {
  const t = useTranslations("editInfo");

  const update = (key: keyof LifestylePrefs, value: string | undefined) => {
    onChange({ ...lifestyle, [key]: value });
  };

  return (
    <div>
      <p className="text-xs uppercase tracking-widest font-bold text-white mb-2">{t("lifestyleSection")}</p>
      <div className="rounded-2xl bg-white/5 border border-white/[0.06] overflow-hidden">
        {lifestyleFields.map((field) => (
          <LifestyleField
            key={field.key}
            label={t(field.labelKey)}
            value={lifestyle[field.key]}
            options={field.options}
            i18nPrefix={field.i18nPrefix}
            onChange={(v) => update(field.key, v)}
            t={t}
          />
        ))}
      </div>
    </div>
  );
}
