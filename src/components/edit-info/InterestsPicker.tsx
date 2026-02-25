"use client";

import { useTranslations } from "next-intl";
import { interestOptions } from "@/data/edit-info-options";

interface InterestsPickerProps {
  selected: string[];
  onChange: (interests: string[]) => void;
  max?: number;
}

export default function InterestsPicker({ selected, onChange, max = 5 }: InterestsPickerProps) {
  const t = useTranslations("editInfo");

  const toggle = (interest: string) => {
    if (selected.includes(interest)) {
      onChange(selected.filter((s) => s !== interest));
    } else if (selected.length < max) {
      onChange([...selected, interest]);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <p className="text-xs uppercase tracking-widest font-bold text-white">{t("interests")}</p>
        <span className="text-[10px] text-slate-500">{t("pickUpTo", { max })}</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {interestOptions.map((interest) => {
          const isSelected = selected.includes(interest);
          return (
            <button
              key={interest}
              onClick={() => toggle(interest)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                isSelected
                  ? "bg-violet-500/20 text-violet-400 border border-violet-500/30"
                  : "bg-white/5 text-slate-400 border border-white/[0.06] hover:border-white/10"
              }`}
            >
              {interest}
            </button>
          );
        })}
      </div>
    </div>
  );
}
